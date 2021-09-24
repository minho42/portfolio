import { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";

const PortfolioList = () => {
  const { token } = useContext(UserContext);
  const [stakePositions, setStakePositions] = useState([]);
  const [stakeValue, setStakevalue] = useState(0);

  const fetchStakeData = async () => {
    if (!token) {
      setStakePositions([]);
      setStakevalue(0);
      return;
    }
    try {
      const res = await fetch("http://localhost:4000/stake/api/stake", {
        credentials: "include",
      });
      console.log(res);
      // const {
      //   data: { equityPositions, equityValue },
      // } = await res.json();
      // console.log(equityPositions);
      // console.log(equityValue);

      // setStakePositions(equityPositions);
      // setStakevalue(equityValue);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStakeData();
  }, [token]);

  return (
    <div>
      portfolio | {token ? "OK" : "NO"} | {stakePositions?.length}
    </div>
  );
};

export default PortfolioList;
