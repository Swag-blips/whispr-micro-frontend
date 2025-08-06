import toast from "react-hot-toast";

export const toastComponent = {
  loading: (message: string) => {
    const toastId = toast(`${message}`, {
      icon: `    <svg
      className="animate-spin"
      width={width || "25"}
      height={height || "24"}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg
    >
      <path
        d="M12.5 3C17.47 3 21.5 7.03 21.5 12"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>`,
      style: {
        borderRadius: "12px",
        background: "#1E1E1E",
        color: "#EDEDED",
        padding: "16px",
        boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.3)",
      },
    });

    return toastId;
  },

  success: (message: string, duration?: number) => {
    const toastId = toast(`${message}`, {
      icon: `<svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.5 18.5C10.6819 18.5 11.8522 18.2672 12.9442 17.8149C14.0361 17.3626 15.0282 16.6997 15.864 15.864C16.6997 15.0282 17.3626 14.0361 17.8149 12.9442C18.2672 11.8522 18.5 10.6819 18.5 9.5C18.5 8.3181 18.2672 7.14778 17.8149 6.05585C17.3626 4.96392 16.6997 3.97177 15.864 3.13604C15.0282 2.30031 14.0361 1.63738 12.9442 1.18508C11.8522 0.732792 10.6819 0.5 9.5 0.5C7.11305 0.5 4.82387 1.44821 3.13604 3.13604C1.44821 4.82387 0.5 7.11305 0.5 9.5C0.5 11.8869 1.44821 14.1761 3.13604 15.864C4.82387 17.5518 7.11305 18.5 9.5 18.5ZM9.268 13.14L14.268 7.14L12.732 5.86L8.432 11.019L6.207 8.793L4.793 10.207L7.793 13.207L8.567 13.981L9.268 13.14Z"
        fill="#34C759"
      />
    </svg>`,
      style: {
        borderRadius: "12px",
        background: "#1E1E1E",
        color: "#EDEDED",
        padding: "16px",
        boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.3)",
      },
      duration,
    });

    return toastId;
  },

  error: (message: string, duration?: number) => {
    const toastId = toast(`${message}`, {
      icon: ` <svg
      width="25"
      height= "24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.9 17L12.5 13.4L16.1 17L17.5 15.6L13.9 12L17.5 8.4L16.1 7L12.5 10.6L8.9 7L7.5 8.4L11.1 12L7.5 15.6L8.9 17ZM12.5 22C11.1167 22 9.81667 21.7373 8.6 21.212C7.38334 20.6867 6.325 19.9743 5.425 19.075C4.525 18.1757 3.81267 17.1173 3.288 15.9C2.76333 14.6827 2.50067 13.3827 2.5 12C2.49933 10.6173 2.762 9.31733 3.288 8.1C3.814 6.88267 4.52633 5.82433 5.425 4.925C6.32367 4.02567 7.382 3.31333 8.6 2.788C9.818 2.26267 11.118 2 12.5 2C13.882 2 15.182 2.26267 16.4 2.788C17.618 3.31333 18.6763 4.02567 19.575 4.925C20.4737 5.82433 21.1863 6.88267 21.713 8.1C22.2397 9.31733 22.502 10.6173 22.5 12C22.498 13.3827 22.2353 14.6827 21.712 15.9C21.1887 17.1173 20.4763 18.1757 19.575 19.075C18.6737 19.9743 17.6153 20.687 16.4 21.213C15.1847 21.739 13.8847 22.0013 12.5 22Z"
        fill="#EF4444"
      />
    </svg>`,
      style: {
        borderRadius: "12px",
        background: "#1E1E1E",
        color: "#EDEDED",
        padding: "16px",
        boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.3)",
      },
      duration,
    });

    return toastId;
  },
};
