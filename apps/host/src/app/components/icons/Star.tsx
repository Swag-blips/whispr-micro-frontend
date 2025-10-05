import React from "react";

const Star = () => {
  return (
    <svg
      className="shrink-0 "
      width="16"
      height="16"
      viewBox="0 0 22 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_818_3989)">
        <path
          d="M9.27371 3.60501C10.1184 2.09034 10.5404 1.33301 11.1717 1.33301C11.803 1.33301 12.225 2.09034 13.0697 3.60501L13.2884 3.99701C13.5284 4.42767 13.6484 4.64301 13.835 4.78501C14.0217 4.92701 14.255 4.97967 14.7217 5.08501L15.1457 5.18101C16.7857 5.55234 17.605 5.73767 17.8004 6.36501C17.995 6.99167 17.4364 7.64567 16.3184 8.95301L16.029 9.29101C15.7117 9.66234 15.5524 9.84834 15.481 10.0777C15.4097 10.3077 15.4337 10.5557 15.4817 11.051L15.5257 11.5023C15.6944 13.247 15.779 14.119 15.2684 14.5063C14.7577 14.8937 13.9897 14.5403 12.455 13.8337L12.057 13.651C11.621 13.4497 11.403 13.3497 11.1717 13.3497C10.9404 13.3497 10.7224 13.4497 10.2864 13.651L9.88904 13.8337C8.35371 14.5403 7.58571 14.8937 7.07571 14.507C6.56437 14.119 6.64904 13.247 6.81771 11.5023L6.86171 11.0517C6.90971 10.5557 6.93371 10.3077 6.86171 10.0783C6.79104 9.84834 6.63171 9.66234 6.31437 9.29167L6.02504 8.95301C4.90704 7.64634 4.34837 6.99234 4.54304 6.36501C4.73771 5.73767 5.55837 5.55167 7.19837 5.18101L7.62237 5.08501C8.08837 4.97967 8.32104 4.92701 8.50837 4.78501C8.69571 4.64301 8.81504 4.42767 9.05504 3.99701L9.27371 3.60501Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_818_3989"
          x="-0.828125"
          y="0"
          width="24"
          height="24"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_818_3989"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_818_3989"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default Star;
