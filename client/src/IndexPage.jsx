import React from "react";
import Navbar from "./Navbar";

export const IndexPage = () => {
  const user = JSON.parse(localStorage.getItem("token"));
  if (!user) {
    window.location.href = "/login";
  }
  return (
    <>
      {" "}
      <Navbar />
      <div>hello {user.id} </div>;
    </>
  );
};

export default IndexPage;
