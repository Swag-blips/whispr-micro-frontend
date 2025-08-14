export const convertDate = (date: Date) => {
  const dateObject = new Date(date);

  const dayOfWeek = dateObject.toLocaleString("en-US", { weekday: "long" });

  const formattedTime = dateObject.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${dayOfWeek} ${formattedTime}`;
};

export const convertTime = (date: Date | string | number) => {
  const dateObject = new Date(date);

  const formattedTime = dateObject.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return ` ${formattedTime}`;
};
