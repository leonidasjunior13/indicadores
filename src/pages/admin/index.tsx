import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import "./Dashboard.scss";
import { getAllHistory, getAreas, getIndicators } from "../../utils/axios";
import { toast } from "react-toastify";
import type {
  AreaProps,
  HistoryProps,
  IndicatorsProps,
} from "../../types/types";
import Loading from "../../components/loading";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("estrategicos");
  const [timeFilter, setTimeFilter] = useState("mensal");
  const [area, setArea] = useState("");
  const [areas, setAreas] = useState<AreaProps[]>([]);
  const [indicadores, setIndicadores] = useState<IndicatorsProps[]>([]);
  const [allHistory, setAllHistory] = useState<any[]>([]);
  const [cardsData, setCardsData] = useState<
    { id: string; value: number; month: string; year: number }[]
  >([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleGetAllHistory();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user.role !== "admin") {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (area !== "") {
      getValuesForCards();
    }
  }, [area]);

  const handleGetAllHistory = async () => {
    getAllHistory(localStorage.getItem("token") || "")
      .then((response) => {
        setAllHistory(response);
        handleGetAreas();
      })
      .catch((error) => {
        console.error("Error fetching all history:", error);
        toast.error("Erro ao buscar histórico. Tente novamente.");
      });
  };

  const handleGetAreas = async () => {
    getAreas(localStorage.getItem("token") || "")
      .then((response) => {
        setAreas(response);
        handleGetIndicators();
      })
      .catch((error) => {
        console.error("Error fetching areas:", error);
        toast.error("Erro ao buscar áreas. Tente novamente.");
      });
  };

  const handleGetIndicators = async () => {
    getIndicators(localStorage.getItem("token") || "")
      .then((data) => {
        setIndicadores(data);
        setLoading(false);
        console.log(
          data.filter(
            (item: any) =>
              item.Areas.name === "TECNOLOGIA DA INFORMAÇÃO(TI)" &&
              item.level === "tático"
          )
        );
      })
      .catch((error) => {
        toast.error("Erro ao buscar indicadores:", error);
        console.log("Error fetching indicators:", error);
        setLoading(false);
      });
  };

  const getValuesForCards = () => {
    let indicators: {
      id: string;
      value: number;
      month: string;
      year: number;
    }[] = [];

    //Cria um array de objetos  indicador com valores de hystory
    if (allHistory.length > 0) {
      allHistory.forEach((history: HistoryProps) => {
        if (history.area === area) {
          const arrayOfRecords = Object.entries(history.values).map(
            ([id, data]) => ({
              id,
              value: Number(data.value), // Garante que value seja sempre number
              month: String(history.month), // Garante que month seja sempre string
              year: history.year,
            })
          );

          indicators = [...indicators, ...arrayOfRecords];
        }
      });
    }

    setCardsData(indicators);
    console.log(indicators);
  };

  const indicatorsCardData = (id: string, meta: number) => {
    const filtered = cardsData.filter((item) => item.id === id);

    // Mapeamento dos nomes dos meses para números
    const meses: { [key: string]: number } = {
      Janeiro: 0,
      Fevereiro: 1,
      Março: 2,
      Abril: 3,
      Maio: 4,
      Junho: 5,
      Julho: 6,
      Agosto: 7,
      Setembro: 8,
      Outubro: 9,
      Novembro: 10,
      Dezembro: 11,
    };

    // Converte os registros em datas
    const registrosComData = filtered.map((item) => ({
      ...item,
      date: new Date(item.year, meses[item.month], 1),
    }));

    // Ordena do mais recente para o mais antigo
    const ordenados = [...registrosComData].sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );

    // Primeiro item é o mais recente
    const valorMaisRecente = ordenados[0];

    // Data do mês anterior
    const dataAnterior = new Date(valorMaisRecente?.date);
    dataAnterior?.setMonth(dataAnterior.getMonth() - 1);

    // Procura o valor do mês anterior no array original
    const valorMesAnterior = registrosComData.find(
      (item) =>
        item.date.getMonth() === dataAnterior.getMonth() &&
        item.date.getFullYear() === dataAnterior.getFullYear()
    );

    // Constantes finais
    const valorAtual = valorMaisRecente?.value;
    const valorAnterior = valorMesAnterior ? valorMesAnterior.value : 0;

    const card = {
      value:
        filtered.reduce((acc, curr) => acc + curr.value, 0) / filtered.length ||
        0,
      status:
        filtered.reduce((acc, curr) => acc + curr.value, 0) / filtered.length >
        meta
          ? "success"
          : "warning",
      variacao:
        valorAnterior !== 0
          ? ((valorAtual - valorAnterior) / valorAnterior) * 100
          : 0,
    };
    return card;
  };

  // Dados simulados para os indicadores
  const indicadoresEstrategicos = {
    kpis: indicadores
      .filter(
        (item) => item.Areas.name === area && item.level === "estratégico"
      )
      .map((item) => ({
        id: item.id,
        nome: item.name,
        valor:
          indicatorsCardData(item.id, item.value).value?.toFixed(2) +
          " " +
          (item.metaFormula === "numero" ? "" : item.metaFormula),
        variacao: indicatorsCardData(item.id, item.value).variacao, //Get Variation in Func
        meta:
          item.value +
          " " +
          (item.metaFormula === "numero" ? "" : item.metaFormula),
        status: indicatorsCardData(item.id, item.value).status, //Get Status in Func
      })),
  };

  const indicadoresTaticos = {
    kpis: indicadores
      .filter((item) => item.Areas.name === area && item.level === "tático")
      .map((item) => ({
        id: item.id,
        nome: item.name,
        valor:
          indicatorsCardData(item.id, item.value).value?.toFixed(2) +
          " " +
          (item.metaFormula === "numero" ? "" : item.metaFormula),
        variacao: indicatorsCardData(item.id, item.value).variacao,
        meta:
          item.value +
          " " +
          (item.metaFormula === "numero" ? "" : item.metaFormula),
        status: indicatorsCardData(item.id, item.value).status,
      })),
  };

  const indicadoresOperacionais = {
    kpis: indicadores
      .filter(
        (item) => item.Areas.name === area && item.level === "operacional"
      )
      .map((item) => ({
        id: item.id,
        nome: item.name,
        valor:
          indicatorsCardData(item.id, item.value).value?.toFixed(2) +
          " " +
          (item.metaFormula === "numero" ? "" : item.metaFormula),
        variacao: indicatorsCardData(item.id, item.value).variacao,
        meta:
          item.value +
          " " +
          (item.metaFormula === "numero" ? "" : item.metaFormula),
        status: indicatorsCardData(item.id, item.value).status,
      })),
    graficos: {
      producao: [
        { dia: "Seg", producao: 850, meta: 800 },
        { dia: "Ter", producao: 920, meta: 800 },
        { dia: "Qua", producao: 780, meta: 800 },
        { dia: "Qui", producao: 890, meta: 800 },
        { dia: "Sex", producao: 950, meta: 800 },
        { dia: "Sab", producao: 420, meta: 400 },
      ],
      qualidade: [
        { mes: "Jan", defeitos: 12, reclamacoes: 8 },
        { mes: "Fev", defeitos: 8, reclamacoes: 5 },
        { mes: "Mar", defeitos: 15, reclamacoes: 12 },
        { mes: "Abr", defeitos: 6, reclamacoes: 4 },
        { mes: "Mai", defeitos: 9, reclamacoes: 6 },
        { mes: "Jun", defeitos: 5, reclamacoes: 3 },
      ],
    },
  };

  const renderKPICard = (kpi: any) => (
    <div
      key={kpi.id}
      className='kpi-card'>
      <div className='kpi-header'>
        <h4>{kpi.nome}</h4>
        <div className={`status-indicator ${kpi.status}`}>
          {kpi.status === "success" ? (
            <CheckCircle size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
        </div>
      </div>
      <div className='kpi-value'>{kpi.valor}</div>
      <div className='kpi-details'>
        {kpi.meta < 1 ? (
          <span className='meta'></span>
        ) : (
          <span className='meta'>Meta: {kpi.meta}</span>
        )}
        <span
          className={`variacao ${kpi.variacao > 0 ? "positive" : "negative"}`}>
          {kpi.variacao > 0 ? (
            <TrendingUp size={14} />
          ) : (
            <TrendingDown size={14} />
          )}
          {Math.abs(kpi.variacao).toFixed(2)}%
        </span>
      </div>
    </div>
  );

  const COLORS = ["#2c5530", "#4a7c59", "#6b8e23", "#28a745", "#ffc107"];

  //RENDERIZANDO AS SEÇÕES DE INDICADORES
  // ESTRATÉGICOS, TÁTICOS E OPERACIONAIS
  const renderEstrategicos = () => (
    <div className='indicadores-section estrategicos'>
      <div className='section-header'>
        <h2>Indicadores Estratégicos</h2>
        <p>Visão executiva dos principais KPIs</p>
      </div>

      <div className='kpis-grid estrategicos-grid'>
        {indicadoresEstrategicos.kpis.map(renderKPICard)}
      </div>

      {area === "TECNOLOGIA DA INFORMAÇÃO(TI)" && (
        <div className='charts-grid estrategicos-charts'>
          <div className='chart-card'>
            <h3>
              Nível de satisfação(
              <i style={{ fontSize: ".8rem", opacity: 0.5 }}>Mensal</i>)
            </h3>
            <ResponsiveContainer
              width='100%'
              height={300}>
              <AreaChart
                data={indicatorsChatsData("cmd8um7ho0004a2hc634xgp2s")}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis tickFormatter={(value) => value} />
                <Tooltip formatter={(value) => [value + "⭐", ""]} />
                <Area
                  type='monotone'
                  dataKey='value'
                  stroke='#2c5530'
                  fill='#2c5530'
                  fillOpacity={0.3}
                />
                <Line
                  type='monotone'
                  dataKey='meta'
                  stroke='#dc3545'
                  strokeDasharray='5 5'
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className='chart-card'>
            <h3>
              Tempo médio de resolução de chamados(
              <i style={{ fontSize: ".8rem", opacity: 0.5 }}>Mensal</i>)
            </h3>
            <ResponsiveContainer
              width='100%'
              height={300}>
              <PieChart>
                <Pie
                  data={indicatorsChatsData("cmd8um7ho0000a2hc6o5mll67")}
                  cx='50%'
                  cy='50%'
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                  label={({ month, value, id }) =>
                    `${month}: ${value}${
                      indicadores.find((ind) => ind.id === id)?.metaFormula ||
                      ""
                    }`
                  }>
                  {indicatorsChatsData("cmd8um7ho0000a2hc6o5mll67").map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    )
                  )}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
  const renderTaticos = () => (
    <div className='indicadores-section taticos'>
      <div className='section-header'>
        <h2>Indicadores Táticos</h2>
        <p>
          Indicadores Táticos medem o desempenho de processos para apoiar
          decisões de médio prazo.
        </p>
      </div>

      <div className='kpis-grid'>
        {indicadoresTaticos.kpis.map(renderKPICard)}
      </div>

      {area === "TECNOLOGIA DA INFORMAÇÃO(TI)" && (
        <div className='charts-grid ti-taticos-charts'>
          <div className='chart-card'>
            <h3>Taxa por negócio</h3>
            <ResponsiveContainer
              width='100%'
              height={300}>
              <PieChart>
                <Pie
                  data={taxaChamadosPorNegocio()}
                  cx='50%'
                  cy='50%'
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                  label={({ name, value, id }) =>
                    `${name.replace(
                      "Taxa de chamados por Negocio - ",
                      ""
                    )}: ${value?.toFixed(2)}`
                  }>
                  {taxaChamadosPorNegocio().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className='chart-card'>
            <h3>
              Abertos <i style={{ fontSize: ".8rem", opacity: 0.5 }}>VS</i>{" "}
              Atendidos
            </h3>
            <ResponsiveContainer
              width='100%'
              height={300}>
              <BarChart data={chamadosChart()}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='mes' />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey='Chamados Abertos'
                  fill='#b4a90fff'
                />
                <Bar
                  dataKey='Chamados Atendidos'
                  fill='#238e3eff'
                />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
  const renderOperacionais = () => (
    <div className='indicadores-section operacionais'>
      <div className='section-header'>
        <h2>Indicadores Operacionais</h2>
        <p>
          Indicadores Operacionais avaliam o desempenho das atividades do dia a
          dia.
        </p>
      </div>

      <div className='kpis-grid'>
        {indicadoresOperacionais.kpis.map(renderKPICard)}
      </div>

      {area === "TECNOLOGIA DA INFORMAÇÃO(TI)" && (
        <div className='charts-grid'>
          <div className='chart-card'>
            <h3>Chamados Pendentes Por Mês</h3>
            <ResponsiveContainer
              width='100%'
              height={300}>
              <LineChart data={chamadosChart()}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='mes' />
                <YAxis />
                <Tooltip />
                <Line
                  type='monotone'
                  dataKey='Chamados Pendentes'
                  stroke='#2c5530'
                  strokeWidth={3}
                />
                <Line
                  type='monotone'
                  dataKey='meta'
                  stroke='#dc3545'
                  strokeDasharray='5 5'
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );

  // FUNÇÕES PARA GRÁFICOS E CÁLCULOS PARA O TI
  const taxaChamadosPorNegocio = () => {
    const indicadoresTI = [
      {
        id: "cmd8um7ho0001a2hcu2d1qmv4",
        name: "Taxa de chamados por Negocio - Agrícola",
        value:
          cardsData
            .filter((item) => item.id === "cmd8um7ho0001a2hcu2d1qmv4")
            .reduce((acc, curr) => acc + curr.value, 0) /
            cardsData.filter((item) => item.id === "cmd8um7ho0001a2hcu2d1qmv4")
              .length || 0,
      },
      {
        id: "cmd8um7ho0002a2hcff90lhwq",
        name: "Taxa de chamados por Negocio - Sementes",
        value:
          cardsData
            .filter((item) => item.id === "cmd8um7ho0002a2hcff90lhwq")
            .reduce((acc, curr) => acc + curr.value, 0) /
            cardsData.filter((item) => item.id === "cmd8um7ho0001a2hcu2d1qmv4")
              .length || 0,
      },
      {
        id: "cmd8um7ho0003a2hcwistzarx",
        name: "Taxa de chamados por Negocio - Corporativo",
        value:
          cardsData
            .filter((item) => item.id === "cmd8um7ho0003a2hcwistzarx")
            .reduce((acc, curr) => acc + curr.value, 0) /
            cardsData.filter((item) => item.id === "cmd8um7ho0001a2hcu2d1qmv4")
              .length || 0,
      },
    ];

    return indicadoresTI;
  };
  const chamadosChart = () => {
    interface ChamadosDataItem {
      mes: string;
      ano: number;
      ["Chamados Abertos"]: number;
      ["Chamados Atendidos"]: number;
      ["Chamados Pendentes"]?: number; // Opcional, se necessário
    }

    const chamadosData: ChamadosDataItem[] = [];

    // cria um array de objetos com os seis ultimos meses, seguindo o modelo a seguir:
    // { mes: "Junho", ano: 2025, ["Chamados Abertos"]: `Qtd somada`, ["Chamados Atendidos"]: `Qtd somada` }
    // Onde a `Qtd somada` é a soma dos valores de todos cardsData, em que:
    // ["Chamados Abertos"] são todos os itens de CardsData com id "cmd8um7ho0005a2hci2xf5vs4" referente ao mês e ano do objeto
    // ["Chamados Atendidos"] são todos os itens de CardsData com id "cmd8um7ho0006a2hcmlyoulds" referente ao mês e ano do objeto
    const meses = [
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

    const agora = new Date();
    const inicioMesAtual = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const seisMesesAtras = new Date(inicioMesAtual);
    seisMesesAtras.setMonth(inicioMesAtual.getMonth() - 6);
    const mesesPassados = [];
    for (let i = 0; i < 6; i++) {
      const mesAtual = new Date(seisMesesAtras);
      mesAtual.setMonth(mesAtual.getMonth() + i);
      mesesPassados.push({
        mes: meses[mesAtual.getMonth()],
        ano: mesAtual.getFullYear(),
      });
    }
    mesesPassados.forEach((item) => {
      const chamadosAbertos = cardsData
        .filter(
          (card) =>
            card.id === "cmd8um7ho0005a2hci2xf5vs4" &&
            card.month.toLowerCase() === item.mes.toLowerCase() &&
            card.year === item.ano
        )
        .reduce((acc, curr) => acc + curr.value, 0);

      const chamadosAtendidos = cardsData
        .filter(
          (card) =>
            card.id === "cmd8um7ho0006a2hcmlyoulds" &&
            card.month === item.mes &&
            card.year === item.ano
        )
        .reduce((acc, curr) => acc + curr.value, 0);

      const chamadosPendentes = cardsData
        .filter(
          (card) =>
            card.id === "cmd8um7ho0007a2hcce98dq6z" &&
            card.month === item.mes &&
            card.year === item.ano
        )
        .reduce((acc, curr) => acc + curr.value, 0);

      chamadosData.push({
        mes: item.mes,
        ano: item.ano,
        ["Chamados Abertos"]: chamadosAbertos,
        ["Chamados Atendidos"]: chamadosAtendidos,
        ["Chamados Pendentes"]: chamadosPendentes,
      });
    });

    console.log("Meses passados:", chamadosData);
    console.log("Cards Data:", cardsData);

    return chamadosData;
  };
  const indicatorsChatsData = (id: string) => {
    const filtered = cardsData.filter((item) => item.id === id);

    // Mapeamento dos nomes dos meses para números
    const meses: { [key: string]: number } = {
      Janeiro: 0,
      Fevereiro: 1,
      Março: 2,
      Abril: 3,
      Maio: 4,
      Junho: 5,
      Julho: 6,
      Agosto: 7,
      Setembro: 8,
      Outubro: 9,
      Novembro: 10,
      Dezembro: 11,
    };

    // Converte os registros em datas
    const registrosComData = filtered.map((item) => ({
      ...item,
      date: new Date(item.year, meses[item.month], 1),
    }));

    // Data atual (primeiro dia do mês atual)
    const agora = new Date();
    const inicioMesAtual = new Date(agora.getFullYear(), agora.getMonth(), 1);

    // Data de corte: 6 meses atrás
    const seisMesesAtras = new Date(inicioMesAtual);
    seisMesesAtras.setMonth(inicioMesAtual.getMonth() - 6);

    // Filtra apenas os registros dentro do intervalo desejado
    const filtrados = registrosComData.filter(
      (item) => item.date >= seisMesesAtras && item.date < inicioMesAtual
    );

    // Ordena do mais recente para o mais antigo
    const ordenados = [...filtrados].sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );

    return ordenados;
  };

  return (
    <>
      {loading && <Loading />}
      <div className='dashboard'>
        <header className='dashboard-header'>
          <h1>Dashboard de Indicadores</h1>
          <div className='header-controls'>
            {/* FILTROS */}
            {/* <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className='time-filter'>
              <option value='semanal'>Semanal</option>
              <option value='mensal'>Mensal</option>
              <option value='trimestral'>Trimestral</option>
              <option value='anual'>Anual</option>
            </select> */}
          </div>
        </header>

        {area === "" ? (
          <nav className='dashboard-nav'>
            {areas?.map((area) => (
              <button
                key={area.id}
                className={`nav-button ${
                  activeTab === area.name ? "active" : ""
                }`}
                onClick={() => setArea(area.name)}>
                {area.icone}
                {area.name}
              </button>
            ))}
          </nav>
        ) : (
          <nav className='dashboard-nav'>
            <button
              className={`nav-button ${
                activeTab === "estrategicos" ? "active" : ""
              }`}
              onClick={() => setActiveTab("estrategicos")}>
              <Target size={20} />
              Estratégicos
              <span className='priority-badge'>ALTA PRIORIDADE</span>
            </button>
            <button
              className={`nav-button ${
                activeTab === "taticos" ? "active" : ""
              }`}
              onClick={() => setActiveTab("taticos")}>
              <Activity size={20} />
              Táticos
            </button>
            <button
              className={`nav-button ${
                activeTab === "operacionais" ? "active" : ""
              }`}
              onClick={() => setActiveTab("operacionais")}>
              <Users size={20} />
              Operacionais
            </button>

            <button className={`nav-button area-button`}>
              <Users size={20} />
              ÁREA: {area}
            </button>
            <button
              className={`nav-button close-button`}
              onClick={() => setArea("")}>
              <AlertCircle size={20} />
              Fechar Área
            </button>
          </nav>
        )}

        {area === "" ? (
          <h1 className='empty'>
            Selecione uma área para visualizar os indicadores
          </h1>
        ) : (
          <main className='dashboard-content'>
            {activeTab === "estrategicos" && renderEstrategicos()}
            {activeTab === "taticos" && renderTaticos()}
            {activeTab === "operacionais" && renderOperacionais()}
          </main>
        )}
      </div>
    </>
  );
};

export default Dashboard;
