import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getIndicators = async (accessToken: string) => {
  try {
    const response = await api.get(
      `/get-indicators?accessToken=${accessToken}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching indicators:", error);
    throw error;
  }
};

export const createMonthHistory = async (
  data: { year: number; month: string; values: Record<string, number> },
  accessToken: string
) => {
  try {
    const response = await api.post(
      `/create-month-history?accessToken=${accessToken}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error creating month history:", error);
    throw error;
  }
};

export const getAllHistory = async (accessToken: string) => {
  try {
    const response = await api.get(
      `/get-all-history?accessToken=${accessToken}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching all history:", error);
    throw error;
  }
};

export const getAreas = async (accessToken: string) => {
  try {
    const response = await api.get(`/get-areas?accessToken=${accessToken}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching areas:", error);
    throw error;
  }
};
