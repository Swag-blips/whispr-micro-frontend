type Props = {
  color?: string;
};

const DoubleTick = ({ color }: Props) => {
  return (
    <svg
      className="shrink-0"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.75 9.75L4.25 12.25M7.75 8.25L10.25 5.75M5.75 9.75L8.25 12.25L14.25 5.75"
        stroke={color || "#A0A4A6"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DoubleTick;
