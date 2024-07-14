import React, { createContext, useState, useEffect } from "react";
import { getShows } from "../services/api";

export const ShowContext = createContext();

export const ShowProvider = ({ children }) => {
  const [shows, setShows] = useState([]);

  const fetchShows = async () => {
    const data = await getShows();
    setShows(data);
  };

  useEffect(() => {
    fetchShows();
  }, []);

  return (
    <ShowContext.Provider value={{ shows, fetchShows }}>
      {children}
    </ShowContext.Provider>
  );
};
