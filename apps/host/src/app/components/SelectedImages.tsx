import { CircleX } from "lucide-react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import React from "react";
import { Doc, DocumentAlt } from "./icons";

type Props = {
  files:
    | { file: File | null; image?: string; type: string; size: number }[]
    | null;
  selectedImages: {
    imageUrl: string;
    progress: number;
  }[];
  handleRemoveImages: (imageUrl: string) => void;
};
export function bytesToMegabytes(bytes: number | undefined) {
  if (!bytes) return;
  const bytesInMegabyte = 1024 * 1024;
  return (bytes / bytesInMegabyte).toFixed(2);
}

export const SelectedImages = ({
  selectedImages,
  handleRemoveImages,
  files,
}: Props) => {
  if (!files) return null;

  return (
    <div className="flex items-center gap-2">
      {files.map((file, idx) => {
        const image = selectedImages.find((img) => img.imageUrl === file.image);
        if (file.type.startsWith("image/")) {
          return (
            <div
              key={file.image || idx}
              className="w-[73px] h-[73px] rounded relative overflow-hidden flex items-center justify-center bg-[#232728]"
            >
              <img
                src={image ? image.imageUrl : file.image || ""}
                alt="selected-image"
                className="w-full h-full object-cover"
              />
              {image && image.progress ? (
                <div className="absolute top-5 left-6 size-8 flex items-center justify-center">
                  <CircularProgressbar
                    value={image.progress}
                    text={`${image.progress}%`}
                    styles={buildStyles({
                      textSize: "24px",
                      pathTransitionDuration: 0.5,
                      pathColor: `rgb(0, 255, 127)`,
                      textColor: "#00FF7F",
                      trailColor: "#ffffff",
                      backgroundColor: "#ffffff",
                    })}
                  />
                </div>
              ) : null}
              <CircleX
                color="#FFFFFF"
                size={12}
                onClick={() =>
                  handleRemoveImages(image ? image.imageUrl : file.image || "")
                }
                className="absolute top-1 cursor-pointer right-1"
              />
            </div>
          );
        } else {
          return (
            <div
              key={file.image || idx}
              className="rounded relative min-w-[127px] h-[73px] overflow-hidden flex items-center justify-center p-2 bg-[#232728]"
            >
              <div className="flex  items-center w-full h-full">
                <DocumentAlt />

                <div className="flex flex-col gap-1">
                  <p className="text-xs text-[#D0D3D4] mt-2 max-w-[60px] truncate text-center">
                    {file.file?.name || "Document"}
                  </p>

                  <div className="text-[#A3A3A3] text-[10px]">
                    {bytesToMegabytes(file.size)} mb
                  </div>
                </div>
              </div>
              <CircleX
                color="#FFFFFF"
                size={12}
                onClick={() =>
                  handleRemoveImages(image ? image.imageUrl : file.image || "")
                }
                className="absolute top-1 cursor-pointer right-1"
              />
            </div>
          );
        }
      })}
    </div>
  );
};
