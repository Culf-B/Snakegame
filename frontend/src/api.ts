// src/api.ts
import axios, { type AxiosResponse } from "axios";

const API_URL = "http://localhost:3000";

export const fetchData = async <T>(endpoint: string): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios.get(
      `${API_URL}/${endpoint}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const postData = async <T, R>(endpoint: string, data: T): Promise<R> => {
  try {
    const response: AxiosResponse<R> = await axios.post(
      `${API_URL}/${endpoint}`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};
