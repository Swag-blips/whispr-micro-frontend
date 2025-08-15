import { CircleX } from "lucide-react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import React from "react";

type Props = {
  selectedImages: {
    imageUrl: string;
    progress: number;
  }[];
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
          key={image.imageUrl}
          className="w-[73px] h-[73px] rounded relative overflow-hidden"
        >
          <img
            src={image.imageUrl}
            alt="selected-image"
            className="w-full h-full object-cover"
          />

          {image.progress ? (
            <div className="absolute top-5  left-6 size-8 flex items-center justify-center">
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
          ) : ( 
            ""
          )}

          <CircleX
            color="#FFFFFF"
            size={12}
            onClick={() => handleRemoveImages(image.imageUrl)}
            className="absolute top-1 cursor-pointer right-1"
          />
        </div>
      ))}
    </div>
  );
};
