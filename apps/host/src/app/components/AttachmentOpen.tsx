import { Doc, Picture } from "./icons";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

type Props = {
  handleImagePicker: () => void;
};

export const AttachmentOpen = ({ handleImagePicker }: Props) => {
  useGSAP(() => {
    gsap.fromTo(
      "#attachment",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, delay: 0.2, duration: 0.2, ease: "power2.out" }
    );
  }, []);
  return (
    <div
      id="attachment"
      className="absolute -top-24 z-50 w-[145px]  bg-[#1A1F21] border border-[#232728] rounded-t-lg rounded-br-lg"
    >
      <div
        onClick={handleImagePicker}
        className="flex items-center rounded-t-lg transition-all duration-300 hover:bg-[#2E3235] cursor-pointer border-b pb-3.5 pt-4 border-[#232728] pl-3  gap-2"
      >
        <Picture color="#D0D3D4" width={16} height={16} />
        <p className="text-[#D0D3D4] text-xs">Picture or video</p>
      </div>
      <div onClick={handleImagePicker} className="flex items-center transition-all duration-300 hover:bg-[#2E3235] rounded-br-lg  cursor-pointer pl-3 pt-2   pb-3 gap-2">
        <Doc color="#D0D3D4" width={16} height={16} />
        <p className="text-[#D0D3D4] text-xs">Document</p>
      </div>
    </div>
  );
};
