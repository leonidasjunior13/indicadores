import { useEffect, useRef, useState } from "react";
import styles from "../styles/styles.module.scss";
import {
  createMonthHistory,
  getAllHistory,
  getIndicators,
} from "../utils/axios";
import { toast } from "react-toastify";
import type { IndicatorsProps } from "../types/types";
import { MessageSquareWarning } from "lucide-react";
import Loading from "../components/loading";

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  // Estado para controlar os valores de todos os inputs do formulário
  const [formData, setFormData] = useState<
    Record<string, { value: number; name: string }>
  >({});
  const [indicadores, setIndicadores] = useState<IndicatorsProps[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const tooltipRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getIndicators(localStorage.getItem("token") || "")
      .then((data) => {
        const indicadoresData = data.filter(
          (item: any) => item.Areas.name == localStorage.getItem("area")
        );
        setIndicadores(indicadoresData);
      })
      .catch((error) => {
        toast.error("Erro ao buscar indicadores:", error);
      });

    getHistory();

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition(e);
    };
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const getHistory = async () => {
    getAllHistory(localStorage.getItem("token") || "")
      .then((data) => {
        setHistory(
          data.filter((item: any) => item.area == localStorage.getItem("area"))
        );
        console.log(
          data.filter((item: any) => item.area == localStorage.getItem("area"))
        );
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Erro ao buscar histórico de indicadores:", error);
        setLoading(false);
      });
  };

  const mousePosition = (e: MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;

    //Converte as coordenadas do mouse a div.information seguir o mouse
    const informationDiv = document.querySelector(
      `.${styles.information}`
    ) as HTMLElement;
    if (informationDiv) {
      informationDiv.style.left = `${x + 10}px`;
      informationDiv.style.top = `${y + 10}px`;
    }
  };

  const handleMouseMove = (e: React.MouseEvent, id: string) => {
    const tooltip = tooltipRefs.current[id];
    if (tooltip) {
      tooltip.style.left = `${e.clientX - 290}px`;
      tooltip.style.top = `${e.clientY + 10}px`;
    }
  };

  const handleMouseEnter = (id: string) => {
    const tooltip = tooltipRefs.current[id];
    if (tooltip) {
      tooltip.classList.add(styles.visible);
    }
  };

  const handleMouseLeave = (id: string) => {
    const tooltip = tooltipRefs.current[id];
    if (tooltip) {
      tooltip.classList.remove(styles.visible);
    }
  };

  // Função única para lidar com a mudança em qualquer input
  const handleChange = (id: string, name: string, value: string) => {
    // const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: {
        value: parseFloat(value),
        name,
      },
    }));
  };

  const handleSubmitYear = (e: any) => {
    e.preventDefault();
    setLoading(true);
    // Chama a função onSave passada pelo componente pai (App.js)
    console.log("Dados do formulário:", formData);
    console.log("Dados do formulário:", selectedMonth);

    const data: any = {
      area: localStorage.getItem("area"),
      year: selectedMonth.year,
      month: selectedMonth.month,
      values: formData,
    };

    createMonthHistory(data, localStorage.getItem("token") || "")
      .then(() => {
        toast.success("Indicadores registrados com sucesso!");
        setShowForm(false);
        setSelectedMonth(null);
        setFormData({});
        getHistory(); // Atualiza o histórico após o registro
        handleBackToSelection(); //Fecha novamente a janela
      })
      .catch((error) => {
        toast.error("Erro ao registrar indicadores:", error);
      });
  };

  // Função para gerar os últimos 6 meses (excluindo o mês atual)
  const generatePastMonths = () => {
    const months = [];
    const monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    const currentDate = new Date();

    for (let i = 1; i <= 6; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      months.push({
        id: i,
        month: monthNames[date.getMonth()],
        year: date.getFullYear(),
        fullDate: date,
      });
    }

    return months;
  };

  const pastMonths = generatePastMonths();

  const handleMonthClick = (month: any) => {
    //Verifica se o mês já está registrado no histórico
    const isRegistered = history.some(
      (item) =>
        Number(item.year) === Number(month.year) && item.month === month.month
    );

    //Se o mês já está registrado, define os valores do formulário com os dados do histórico
    if (isRegistered) {
      const registeredData = history.find(
        (item) =>
          Number(item.year) === Number(month.year) && item.month === month.month
      );
      setFormData(registeredData.values);
    } else {
      // Se não está registrado, limpa os dados do formulário
      setFormData({});
    }
    setSelectedMonth(month);
    setShowForm(true);
  };

  const handleBackToSelection = () => {
    setSelectedMonth(null);
    setShowForm(false);
  };

  return (
    <>
      {loading && <Loading />}
      <div className={styles.formGrid}>
        <div className={styles.div1}>{localStorage.getItem("area")}</div>

        <div className={styles.div2}>
          <h4>Meses com indicadores em aberto</h4>
          <div className={styles["months-grid"]}>
            {pastMonths.map((month) => (
              <div
                key={month.id}
                className={styles["month-card"]}
                onClick={() => handleMonthClick(month)}>
                <div className={styles["month-name"]}>{month.month}</div>
                <div className={styles["month-year"]}>{month.year}</div>
                <div className={styles["status-indicator"]}>
                  <span
                    className={`${styles["status-dot"]} ${
                      history.some(
                        (item) =>
                          Number(item.year) === Number(month.year) &&
                          item.month === month.month
                      )
                        ? styles["registered"]
                        : styles["not-registered"]
                    }`}></span>
                  {history.some(
                    (item) =>
                      Number(item.year) === Number(month.year) &&
                      item.month === month.month
                  )
                    ? "Registrado"
                    : "Não registrado"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.div3}>
          <div className={styles["selection-message"]}>
            <div className={styles["message-icon"]}>👆</div>
            <h3>Selecione um mês para registrar indicadores</h3>
            <p>
              Escolha um dos meses disponíveis acima para começar o registro dos
              indicadores
            </p>
          </div>
        </div>

        <div className={styles.div4}>
          {!showForm ? (
            <div className={styles["charts-area"]}>
              <div className={styles["charts-placeholder"]}>
                <div className={styles["placeholder-icon"]}>📊</div>
                <h3>Área reservada para gráficos</h3>
                <p>Os gráficos serão implementados posteriormente</p>
              </div>
            </div>
          ) : (
            <div className={styles["form-area"]}>
              <div className={styles["form-header"]}>
                <button
                  className={styles["back-button"]}
                  onClick={handleBackToSelection}>
                  ← Voltar
                </button>
                <h3>
                  Registrar Indicadores - {selectedMonth?.month}{" "}
                  {selectedMonth?.year}
                </h3>
              </div>
              <div className={styles["form-placeholder"]}>
                <form onSubmit={handleSubmitYear}>
                  <fieldset>
                    <legend>🔹 1. Indicadores Estratégicos</legend>
                    {indicadores.map(
                      (indicator) =>
                        indicator.level === "estratégico" && (
                          <div className={styles["form-group"]}>
                            <label
                              htmlFor='satisfacao'
                              onMouseMove={(e) =>
                                handleMouseMove(e, indicator.id)
                              }
                              onMouseEnter={() =>
                                handleMouseEnter(indicator.id)
                              }
                              onMouseLeave={() =>
                                handleMouseLeave(indicator.id)
                              }>
                              <p className={styles["indicator-name"]}>
                                {indicator.name}
                              </p>
                              <span>
                                <MessageSquareWarning
                                  size={14}
                                  style={{
                                    transform: "rotate(-45deg)",
                                  }}
                                />
                              </span>
                              <div
                                className={styles.information}
                                ref={(el) => {
                                  tooltipRefs.current[indicator.id] = el;
                                }}>
                                <p>
                                  <b>Descrição: </b> {indicator.description}
                                </p>

                                <p>
                                  <b>Fórmula: </b> {indicator.metaReference}
                                </p>
                              </div>
                            </label>
                            <input
                              type='number'
                              id={indicator.id}
                              name={indicator.id}
                              //Define o valor do input com base no formData, se tiver historico
                              value={
                                formData[indicator.id]
                                  ? formData[indicator.id].value
                                  : ""
                              }
                              onChange={(e) =>
                                handleChange(
                                  indicator.id,
                                  indicator.name,
                                  e.target.value
                                )
                              }
                              step='0.1'
                              required
                            />
                          </div>
                        )
                    )}
                  </fieldset>

                  <fieldset>
                    <legend>🔸 2. Indicadores Táticos</legend>
                    {indicadores.map(
                      (indicator) =>
                        indicator.level === "tático" && (
                          <div className={styles["form-group"]}>
                            <label
                              htmlFor='satisfacao'
                              onMouseMove={(e) =>
                                handleMouseMove(e, indicator.id)
                              }
                              onMouseEnter={() =>
                                handleMouseEnter(indicator.id)
                              }
                              onMouseLeave={() =>
                                handleMouseLeave(indicator.id)
                              }>
                              <p className={styles["indicator-name"]}>
                                {indicator.name}
                              </p>
                              <span>
                                <MessageSquareWarning
                                  size={14}
                                  style={{
                                    transform: "rotate(-45deg)",
                                  }}
                                />
                              </span>
                              <div
                                className={styles.information}
                                ref={(el) => {
                                  tooltipRefs.current[indicator.id] = el;
                                }}>
                                <p>
                                  <b>Descrição: </b> {indicator.description}
                                </p>

                                <p>
                                  <b>Fórmula: </b> {indicator.metaReference}
                                </p>
                              </div>
                            </label>
                            <input
                              type='number'
                              id={indicator.id}
                              name={indicator.id}
                              value={
                                formData[indicator.id]
                                  ? formData[indicator.id].value
                                  : ""
                              }
                              onChange={(e) =>
                                handleChange(
                                  indicator.id,
                                  indicator.name,
                                  e.target.value
                                )
                              }
                              step='0.1'
                              required
                            />
                          </div>
                        )
                    )}
                  </fieldset>

                  <fieldset>
                    <legend>🔻 3. Indicadores Operacionais</legend>
                    {indicadores.map(
                      (indicator) =>
                        indicator.level === "operacional" && (
                          <div className={styles["form-group"]}>
                            <label
                              htmlFor='satisfacao'
                              onMouseMove={(e) =>
                                handleMouseMove(e, indicator.id)
                              }
                              onMouseEnter={() =>
                                handleMouseEnter(indicator.id)
                              }
                              onMouseLeave={() =>
                                handleMouseLeave(indicator.id)
                              }>
                              <p className={styles["indicator-name"]}>
                                {indicator.name}
                              </p>
                              <span>
                                <MessageSquareWarning
                                  size={14}
                                  style={{
                                    transform: "rotate(-45deg)",
                                  }}
                                />
                              </span>
                              <div
                                className={styles.information}
                                ref={(el) => {
                                  tooltipRefs.current[indicator.id] = el;
                                }}>
                                <p>
                                  <b>Descrição: </b> {indicator.description}
                                </p>

                                <p>
                                  <b>Fórmula: </b> {indicator.metaReference}
                                </p>
                              </div>
                            </label>
                            <input
                              type='number'
                              id={indicator.id}
                              name={indicator.id}
                              value={
                                formData[indicator.id]
                                  ? formData[indicator.id].value
                                  : ""
                              }
                              onChange={(e) =>
                                handleChange(
                                  indicator.id,
                                  indicator.name,
                                  e.target.value
                                )
                              }
                              step='0.1'
                              required
                            />
                          </div>
                        )
                    )}
                  </fieldset>

                  <button type='submit'>Salvar Indicadores</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
