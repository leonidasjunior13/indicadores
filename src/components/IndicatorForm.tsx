import React, { useState } from "react";
import styles from "../styles/styles.module.scss";

interface IndicatorFormProps {
  month: string;
  onSubmit: (data: any) => void;
}

export const IndicatorForm: React.FC<IndicatorFormProps> = ({
  month,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    tempoMedioResolucao: "",
    taxaAgricola: "",
    taxaSementes: "",
    taxaCorporativo: "",
    nivelSatisfacao: "",
    totalAbertos: "",
    totalAtendidos: "",
    chamadosPendentes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit({ mes: month, ...form });
  };

  return (
    <div className={styles.formContainer}>
      <h3>Indicadores para {month}</h3>
      {Object.keys(form).map((field) => (
        <div
          key={field}
          className={styles.field}>
          <label>{field}</label>
          <input
            type='number'
            name={field}
            value={form[field as keyof typeof form]}
            onChange={handleChange}
            step='0.01'
          />
        </div>
      ))}
      <button onClick={handleSubmit}>Salvar</button>
    </div>
  );
};
