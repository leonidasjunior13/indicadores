import { Response, Request } from "express";
import Prisma from "../models/PrismaConnect";
import jwt from "jsonwebtoken";

function getToken(user: string, password: string, id: string) {
  const dataUser = { user, password, id };
  const accessToken = jwt.sign(dataUser, process.env.ACCESS_TOKEN_SECRET!);
  return accessToken;
}

function verifyToken(token: string) {
  try {
    token = token.trim().replace(/^"|"$/g, "");
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export default {
  async getIndicators(req: Request, res: Response) {
    const accessToken = req.query.accessToken;

    if (!accessToken) {
      return res.status(401).json({ error: "Access token is required" });
    }

    const decoded = verifyToken(accessToken as string);
    if (!decoded) {
      return res.status(402).json({ error: "Invalid access token" });
    }

    try {
      const Indicadors = await Prisma.indicator.findMany({
        include: {
          Areas: true,
        },
      });
      return res.status(200).json(Indicadors);
    } catch (error) {
      // console.error("Error during login:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  async createMonthHistory(req: Request, res: Response) {
    const { area, year, month, values } = req.body;
    const accessToken = req.query.accessToken;

    if (!accessToken) {
      return res.status(401).json({ error: "Access token is required" });
    }

    const decoded = verifyToken(accessToken as string);
    if (!decoded) {
      return res.status(402).json({ error: "Invalid access token" });
    }

    if (!area || !year || !month || !values) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      //Busca se já existe um histórico para o ano e mês especificados
      const existingHistory = await Prisma.indicatorHistory.findFirst({
        where: {
          area,
          year,
          month,
        },
      });
      if (existingHistory) {
        const updatedHistory = await Prisma.indicatorHistory.update({
          where: {
            id: existingHistory.id,
          },
          data: {
            values,
          },
        });

        return res.status(200).json(updatedHistory);
      } else {
        const newHistory = await Prisma.indicatorHistory.create({
          data: {
            area,
            year,
            month,
            values,
          },
        });

        return res.status(201).json(newHistory);
      }
    } catch (error) {
      console.error("Error creating month history:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  async getAllHistory(req: Request, res: Response) {
    const accessToken = req.query.accessToken;

    if (!accessToken) {
      return res.status(401).json({ error: "Access token is required" });
    }

    const decoded = verifyToken(accessToken as string);
    if (!decoded) {
      return res.status(402).json({ error: "Invalid access token" });
    }

    try {
      const history = await Prisma.indicatorHistory.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
      return res.status(200).json(history);
    } catch (error) {
      console.error("Error fetching history:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  async getAreas(req: Request, res: Response) {
    const accessToken = req.query.accessToken;

    if (!accessToken) {
      return res.status(401).json({ error: "Access token is required" });
    }
    const decoded = verifyToken(accessToken as string);
    if (!decoded) {
      return res.status(402).json({ error: "Invalid access token" });
    }
    try {
      const areas = await Prisma.areas.findMany({
        include: {
          Indicators: true,
        },
      });
      console.log("Areas fetched:", areas);
      return res.status(200).json(areas);
    } catch (error) {
      console.error("Error fetching areas:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};
