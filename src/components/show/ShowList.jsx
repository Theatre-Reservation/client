import React, { useContext, useEffect } from "react";
import { ShowContext } from "../../context/ShowContext";
// import ShowItem from "./ShowItem";

const ShowList = () => {
  const { shows, fetchShows } = useContext(ShowContext);

  useEffect(() => {
    fetchShows();
  }, [fetchShows]);

  return (
    <div>
      <h2>Available Shows</h2>
      <div>
        {/* {shows.map((show) => (
          // <ShowItem key={show.id} show={show} />
        )
        )} */}
      </div>
    </div>
  );
};

export default ShowList;
