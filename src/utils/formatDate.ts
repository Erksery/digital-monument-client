export const parseDateData = (isoString: string) => {
  if (!isoString) return { dayMonth: "", year: "" };

  const date = new Date(isoString);

  const dayMonth = date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });

  const year = date.toLocaleDateString("ru-RU", { year: "numeric" });

  return { dayMonth, year };
};
