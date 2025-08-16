import { useState, useRef } from "react";
import axios, { AxiosProgressEvent } from "axios";
import { toastComponent } from "@repo/ui/toast";
import { Error } from "@repo/ui/icons/Error";

export function useImageUpload() {
  const [images, setImages] = useState<
    { imageUrl: string; progress: number }[]
  >([]);
  const [files, setFiles] = useState<
    { file: File | null; image?: string; type: string; size: number }[] | null
  >(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleImagePicker = () => {
    if (files && files?.length >= 3) {
      toastComponent.error("You can only send 3 files at a time", <Error />);
      return;
    }
    fileRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = event.target.files?.[0];
    if (!fileObj) return;

    const imageUrl = URL.createObjectURL(fileObj);
    setFiles((prev) => [
      ...(prev ?? []),
      {
        file: fileObj,
        image: imageUrl,
        type: fileObj.type,
        size: fileObj.size,
      },
    ]);
    setImages((prev) => [...prev, { imageUrl, progress: 0 }]);
  };

  const handleRemoveImage = (imageUrl: string) => {
    if (!files) return;
    setFiles(files.filter((f) => f.image !== imageUrl));
    setImages(images.filter((img) => img.imageUrl !== imageUrl));
  };

  const handleImageUpload = async () => {
    if (!files?.length) return [];

    const uploaded: {
      file: string;
      fileType: string;
      fileName: string;
      fileSize: number;
    }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i].file;
      if (!file) continue;

      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_UPLOAD_PRESET as string
      );

      const config = {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total!) * 100
          );
          setImages((prev) =>
            prev.map((img, idx) => (idx === i ? { ...img, progress } : img))
          );
        },
      };

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/upload`,
        formData,
        config
      );

      uploaded.push({
        file: res.data.secure_url,
        fileType: file.type,
        fileName: file.name,
        fileSize: file.size,
      });
    }

    setFiles(null);
    setImages([]);
    return uploaded;
  };

  return {
    fileRef,
    images,
    files,
    handleImagePicker,
    handleImageChange,
    handleRemoveImage,
    handleImageUpload,
  };
}
