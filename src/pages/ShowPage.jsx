import React from "react";
import { useParams } from "react-router-dom";
// import ShowDetails from "../components/show/ShowDetails";

const ShowPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Show Details</h1>
      <ShowDetails showId={id} />
    </div>
  );
};

export default ShowPage;
