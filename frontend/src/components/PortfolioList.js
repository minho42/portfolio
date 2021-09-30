import { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import StakeList from "./StakeList";
import CoinbaseList from "./CoinbaseList";
import IngList from "./IngList";

const PortfolioList = () => {
  return (
    <div className="">
      <CoinbaseList />
      <StakeList />
      <IngList />
    </div>
  );
};

export default PortfolioList;
