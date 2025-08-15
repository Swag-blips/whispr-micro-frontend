import { CircleX } from "lucide-react";

import React from "react";

type Props = {
  selectedImages: string[];
  handleRemoveImages: (imageUrl: string) => void;
};

export const SelectedImages = ({
  selectedImages,
  handleRemoveImages,
}: Props) => {
  return (
    <div className="flex items-center gap-2">
      {selectedImages.map((image) => (
        <div
          key={image}
          className="w-[73px] h-[73px] rounded relative overflow-hidden"
        >
          <img
            src={image}
            alt="selected-image"
            className="w-full h-full object-cover"
          />

          <CircleX
            color="#FFFFFF"
            size={12}
            onClick={() => handleRemoveImages(image)}
            className="absolute top-1 cursor-pointer right-1"
          />
        </div>
      ))}
    </div>
  );
};
