type Props = {
  width?: string;
  height?: string;
};

const Loading = ({ width, height }: Props) => {
  return (
    <svg
      className="animate-spin"
      width={width || "25"}
      height={height || "24"}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.5 3C17.47 3 21.5 7.03 21.5 12"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};


export default Loading
