import axios from "axios";

const API_URL = "https://api.example.com";

export const getShows = async () => {
  try {
    const response = await axios.get(`${API_URL}/shows`);
    return response.data;
  } catch (error) {
    console.error("Error fetching shows:", error);
    return [];
  }
};
