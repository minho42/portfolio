import { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import StakeList from "./StakeList";

const PortfolioList = () => {
  return (
    <div className="">
      <StakeList />
    </div>
  );
};

export default PortfolioList;
