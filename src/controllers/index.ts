import { Response, Request } from "express";
import Prisma from "../models/PrismaConnect";
import jwt from "jsonwebtoken";

function getToken(user: string, password: string, id: string) {
  const dataUser = { user, password, id };
  const accessToken = jwt.sign(dataUser, process.env.ACCESS_TOKEN_SECRET!);
  return accessToken;
}

export default {
  async login(req: Request, res: Response) {
    try {
      await Prisma.$connect();
      const { email, password } = req.body;
      const user = await Prisma.user.findUnique({
        where: { email, password },
      });

      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      const accessToken = getToken(user.email, user.password, user.id);

      return res.status(200).json({ user, accessToken });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  async test(req: Request, res: Response) {
    const dataTableCompras = [
      {
        name: "Total de compras realizadas",
        description: "Indicador de planejamento",
        Periodicidade: "Mensal",
        responsibles: "Loyane",
        metaReference: "SOMA de todas as ordens de compra - todos os status",
        metaFormula: "soma",
      },
      {
        name: "Compras Normais",
        description: "Indicador de planejamento",
        Periodicidade: "Mensal",
        responsibles: "Loyane",
        metaReference: "SOMA de todas as ordens de compra - status Normal",
        metaFormula: "soma",
      },
      {
        name: "Compras Urgente",
        description: "Indicador de planejamento",
        Periodicidade: "Mensal",
        responsibles: "Loyane",
        metaReference: "SOMAde todas as ordens de compra - status Urgente",
        metaFormula: "soma",
      },
      {
        name: "Compras Planejadas",
        description: "Indicador de planejamento",
        Periodicidade: "Mensal",
        responsibles: "Loyane",
        metaReference: "SOMAde todas as ordens de compra - status Planejado",
        metaFormula: "soma",
      },
      {
        name: "Compras Contrato",
        description: "Indicador de planejamento",
        Periodicidade: "Mensal",
        responsibles: "Loyane",
        metaReference: "SOMAde todas as ordens de compra - status Contrato",
        metaFormula: "soma",
      },
      {
        name: "Compras Regularização",
        description: "Indicador de planejamento",
        Periodicidade: "Mensal",
        responsibles: "Loyane",
        metaReference:
          "SOMAde todas as ordens de compra - status Regularização",
        metaFormula: "soma",
      },
      {
        name: "Eficiência no atendimento de pedidos (%): Compras Normais",
        description: "Pedidos atendidos no prazo / Total de pedidos",
        Periodicidade: "Mensal",
        responsibles: "Loyane",
        metaReference: "Compras Normais (novo)",
        metaFormula: "numero",
      },
      {
        name: "Eficiência no atendimento de pedidos (%): Compras Urgente",
        description: "Pedidos atendidos no prazo / Total de pedidos",
        Periodicidade: "Mensal",
        responsibles: "Loyane",
        metaReference: "Compras Urgente (novo)",
        metaFormula: "numero",
      },
      {
        name: "Eficiência no atendimento de pedidos (%): Compras Planejadas",
        description: "Pedidos atendidos no prazo / Total de pedidos",
        Periodicidade: "Mensal",
        responsibles: "Loyane",
        metaReference: "Compras Planejadas (novo)",
        metaFormula: "numero",
      },
      {
        name: "Custo médio por pedido (R$):",
        description: "Valor médio pago por cada pedido realizado",
        Periodicidade: "Mensal",
        responsibles: "Loyane",
        metaReference: "=SOMA(Valor Total das Ordens) / Nº de Ordens",
        metaFormula: "soma",
      },
      {
        name: "Tempo médio de aquisição (dias):",
        description: "Mede o tempo total médio para concluir uma compra",
        Periodicidade: "Mensal",
        responsibles: "Loyane",
        metaReference:
          "=SOMA(Dias entre solicitação e entrega) / Nº de pedidos (não considerar contrato e regularização)",
        metaFormula: "soma",
      },
      {
        name: "Dias OC x Entrega",
        description: "Prazo médio entre ordem emitida e entrega realizada",
        Periodicidade: "Mensal",
        responsibles: "Loyane",
        metaReference:
          "=SOMA(Dias entre emissão da OC e entrega) / Nº de entregas (não considerar contrato e regularização)",
        metaFormula: "soma",
      },
      {
        name: "Prazo Médio de Negociação",
        description: "Tempo médio de negociação até o fechamento da OC",
        Periodicidade: "Mensal",
        responsibles: "Loyane",
        metaReference:
          "=SOMA(Dias entre cotação e fechamento) / Nº de negociações (não considerar contrato e regularização)",
        metaFormula: "soma",
      },
      {
        name: "Dias Aprovação de Solicitação de Compra",
        description: "Tempo médio que leva para aprovar uma solicitação",
        Periodicidade: "Mensal",
        responsibles: "Loyane",
        metaReference: "=SOMA(Dias entre envio e aprovação SC) / Nº de SCs",
        metaFormula: "soma",
      },
      {
        name: "Dias para pagamento",
        description: "Tempo médio negociado para pagamento",
        Periodicidade: "Mensal",
        responsibles: "Loyane",
        metaReference: "SOMA de todos os prazos de pagamentos das OC's",
        metaFormula: "soma",
      },
      {
        name: "% de Desconto",
        description: "Economia percentual sobre o valor da compra",
        Periodicidade: "Mensal",
        responsibles: "Loyane",
        metaReference: "% de Desconto apontado na nota fiscal",
        metaFormula: "soma",
      },
      {
        name: "% de redução de custo de grandes contas por comprador, apontado na nota fiscal",
        description:
          "Avalia a economia obtida na negociação (por comprador ou grupo)",
        Periodicidade: "Mensal",
        responsibles: "Carlos Guedes/Loyane",
        metaReference:
          "Média % de redução de custo por comprador, apontado na nota fiscal",
        metaFormula: "media",
      },
      {
        name: "% de redução de custo de grandes contas por comprador, apontado na nota fiscal",
        description:
          "Avalia a economia obtida na negociação (por comprador ou grupo)",
        Periodicidade: "Mensal",
        responsibles: "Carolyne Poto/Loyane",
        metaReference:
          "Média % de redução de custo por comprador, apontado na nota fiscal",
        metaFormula: "media",
      },
      {
        name: "% de redução de custo de grandes contas por comprador, apontado na nota fiscal",
        description:
          "Avalia a economia obtida na negociação (por comprador ou grupo)",
        Periodicidade: "Mensal",
        responsibles: "Lorrane Araujo/Loyane",
        metaReference:
          "Média % de redução de custo por comprador, apontado na nota fiscal",
        metaFormula: "media",
      },
      {
        name: "% de redução de custo de grandes contas por comprador, apontado na nota fiscal",
        description:
          "Avalia a economia obtida na negociação (por comprador ou grupo)",
        Periodicidade: "Mensal",
        responsibles: "Vitoria Faria/Loyane",
        metaReference:
          "Média % de redução de custo por comprador, apontado na nota fiscal",
        metaFormula: "media",
      },
      {
        name: "% de redução de custo de grandes contas por comprador, apontado na nota fiscal",
        description:
          "Avalia a economia obtida na negociação (por comprador ou grupo)",
        Periodicidade: "Mensal",
        responsibles: "Flavio Souza/Loyane",
        metaReference:
          "Média % de redução de custo por comprador, apontado na nota fiscal",
        metaFormula: "media",
      },
      {
        name: "% de redução de custo de grandes contas por comprador, apontado na nota fiscal",
        description:
          "Avalia a economia obtida na negociação (por comprador ou grupo)",
        Periodicidade: "Mensal",
        responsibles: "Melissa Silva/Loyane",
        metaReference:
          "Média % de redução de custo por comprador, apontado na nota fiscal",
        metaFormula: "media",
      },
      {
        name: "Linhas de SC",
        description: "Total de linhas solicitadas em todas as SCs",
        Periodicidade: "Mensal",
        responsibles: "Loyane",
        metaReference: "=CONT.VALORES(Linhas na Solicitação de Compras)",
        metaFormula: "numero",
      },
      {
        name: "Linhas Atendidas de Solicitação de Compras",
        description: "Quantidade de linhas da SC que foram atendidas",
        Periodicidade: "Mensal",
        responsibles: "Loyane",
        metaReference: '=CONT.VALORES(Linhas com status "Atendida")',
        metaFormula: "numero",
      },
      {
        name: "Linhas Pendentes de Solicitação de Compras",
        description: "Linhas da SC ainda não atendidas",
        Periodicidade: "Mensal",
        responsibles: "Loyane",
        metaReference: '=CONT.VALORES(Linhas com status "Pendente")',
        metaFormula: "numero",
      },
      {
        name: "Quantidade de Ordens de Compra",
        description: "Total de OCs geradas no período",
        Periodicidade: "Mensal",
        responsibles: "Loyane",
        metaReference: "=CONT.VALORES(Numero das Ocs)",
        metaFormula: "numero",
      },
      {
        name: "Qtde Média de Cotação",
        description: "Avalia a média de cotações por item/processo",
        Periodicidade: "Mensal",
        responsibles: "Loyane",
        metaReference:
          "=SOMA(Total de Cotações Recebidas) / Nº de Itens Cotados",
        metaFormula: "soma",
      },
      {
        name: "SLA = Nota de percepção de qualidade de serviço interno",
        description: "Resultado de avaliações feitas pelos usuários internos",
        Periodicidade: "Mensal",
        responsibles: "Loyane",
        metaReference:
          "Avaliação de satisfação (de 0 a 05) - média das respostas",
        metaFormula: "media",
      },
    ];

    const dataTableTI = [
      {
        name: "Tempo Médio de Resolução de Chamados (TI)",
        description: "Média de tempo para resolução",
        responsibles: "Leonidas",
        metaReference: "< SLA",
        metaFormula: "numero",
      },
      {
        name: "Taxa de chamados por Negocio - Agrícola",
        description: "% da taxa de chamados do Agrícola - Resolvidos",
        responsibles: "Leonidas",
        metaReference: "Total %",
        metaFormula: "numero",
      },
      {
        name: "Taxa de chamados por Negocio - Sementes",
        description: "% da taxa de chamados do Sementes - Resolvidos",
        responsibles: "Leonidas",
        metaReference: "Total %",
        metaFormula: "numero",
      },
      {
        name: "Taxa de chamados por Negocio - Corporativo",
        description: "% da taxa de chamados do Corporativo - Resolvidos",
        responsibles: "Leonidas",
        metaReference: "Total %",
        metaFormula: "numero",
      },
      {
        name: "Nível de Satisfação de Atendimento",
        description: "Nível de Atendimento 0 a 5",
        responsibles: "Leonidas",
        metaReference: "Nível",
        metaFormula: "numero",
      },
      {
        name: "Total de Chamados Abertos",
        description: "Total chamados abertos, mensalmente",
        responsibles: "Leonidas",
        metaReference: "Total",
        metaFormula: "numero",
      },
      {
        name: "Total de Chamados Atendidos",
        description: "Total de chamado resolvidos mensalmente",
        responsibles: "Leonidas",
        metaReference: "Total",
        metaFormula: "numero",
      },
      {
        name: "Chamados Pendentes",
        description: "Chamados que não foram resolvido no mês corrente",
        responsibles: "Leonidas",
        metaReference: "Total",
        metaFormula: "numero",
      },
    ];

    try {
      // await Prisma.indicator.createMany({
      //   data: dataTableTI.map((item) => ({
      //     name: item.name,
      //     description: item.description,
      //     responsibles: item.responsibles,
      //     metaReference: item.metaReference,
      //     metaFormula: item.metaFormula,
      //     level: "operacional",
      //     areasId: "",
      //     value: 0,
      //   })),
      //   skipDuplicates: true, // Ignora duplicatas
      // });

      return res.status(200).json({ message: "Test successful" });
    } catch (error) {
      console.error("Error during test:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};
