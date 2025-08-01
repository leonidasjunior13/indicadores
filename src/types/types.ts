export interface IndicadoresTI {
  mes: string; // Ex: '2025-06'
  tempoMedioResolucao: number;
  taxaAgricola: number;
  taxaSementes: number;
  taxaCorporativo: number;
  nivelSatisfacao: number; // de 0 a 5
  totalAbertos: number;
  totalAtendidos: number;
  chamadosPendentes: number;
}

export interface IndicatorsProps {
  id: string;
  name: string;
  description: string;
  metaReference: string;
  level: "estratégico" | "tático" | "operacional";
  value: number;
  metaFormula: string;
  Areas: AreaProps;
}

export interface AreaProps {
  id: string;
  name: string;
  Indicadores: IndicatorsProps[];
  icone: string;
}

export interface IndicatorValue {
  id: string;
  name: string;
  value: number;
}

export interface HistoryProps {
  id: string;
  area: string;
  year: number;
  month: number;
  values: {
    [key: string]: IndicatorValue;
  };
}
