import toast, { Renderable } from "react-hot-toast";

export const toastComponent = {
  loading: (message: string, successIcon: Renderable) => {
    const toastId = toast(`${message}`, {
      icon: successIcon,
      style: {
        borderRadius: "12px",
        background: "#1E1E1E",
        color: "#EDEDED",
        padding: "16px",
        boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.3)",
      },
      duration: Infinity,
    });

    return toastId;
  }, 

  success: (message: string, successIcon: Renderable, duration?: number) => {
    const toastId = toast(`${message}`, {
      icon: successIcon,
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

  error: (message: string, errorIcon: Renderable, duration?: number) => {
    const toastId = toast(`${message}`, {
      icon: errorIcon,
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
