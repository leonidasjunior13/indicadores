import React from "react";
import styles from "../styles/styles.module.scss";

interface MonthCardProps {
  month: string;
  onSelect: (month: string) => void;
}

export const MonthCard: React.FC<MonthCardProps> = ({ month, onSelect }) => {
  const label = new Date(`${month}-01`).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className={styles.monthCard}
      onClick={() => onSelect(month)}>
      {label}
    </div>
  );
};
