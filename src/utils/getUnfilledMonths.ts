export const getLast6Months = (): string[] => {
  const months = [];
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(date.toISOString().slice(0, 7)); // YYYY-MM
  }
  return months;
};

export const getUnfilledMonths = (): string[] => {
  const filled = JSON.parse(localStorage.getItem("indicadoresTI") || "[]");
  const filledMonths = filled.map((d: any) => d.mes);
  return getLast6Months().filter((m) => !filledMonths.includes(m));
};
