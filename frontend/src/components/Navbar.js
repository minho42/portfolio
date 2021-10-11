import { useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
import { PortfolioContext } from "../PortfolioContext";
import { Link, useHistory, useLocation } from "react-router-dom";
import { showValueWithComma } from "../utils";

const Navbar = () => {
  const { stakeToken, setStakeToken } = useContext(UserContext);
  const { portfolioInfo, totalValue, setTotalValue } = useContext(PortfolioContext);
  const history = useHistory();
  const { pathname } = useLocation();

  const requestLogout = async (stakeToken, setStakeToken, history) => {
    try {
      const res = await fetch("http://localhost:4000/stake/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("requestLogout failed");
      }
      setStakeToken(null);
      localStorage.clear();
      history.push("/");
    } catch (error) {
      console.log(error);
      setStakeToken(null);
      localStorage.clear();
      history.push("/");
    }
  };

  useEffect(() => {
    let total = 0;
    portfolioInfo.forEach((p) => {
      total += p.value;
    });
    setTotalValue(total);
  }, [JSON.stringify(portfolioInfo)]);

  return (
    <nav>
      <header className="flex justify-between border-b border-gray-300 shadow-sm">
        <div className="flex items-center ml-10">
          <div className="text-2xl font-medium px-4">${showValueWithComma(totalValue, true)}</div>
        </div>

        <div className="flex items-center justify-end h-14 w-full">
          <Link
            to="/"
            className={`flex items-center h-full font-medium px-4 py-3 cursor-pointer border-b-4 ${
              pathname === "/" ? " border-green-500" : "border-white"
            }`}
          >
            Portfolio
          </Link>
          {!stakeToken && (
            <Link
              to="/login"
              className={`flex items-center h-full font-medium px-4 py-3 cursor-pointer border-b-4 ${
                pathname === "/login" ? " border-green-500" : "border-white"
              }`}
            >
              Login
            </Link>
          )}
          {stakeToken && (
            <button
              onClick={() => requestLogout(stakeToken, setStakeToken, history)}
              className="flex items-center h-full font-medium px-4 py-3 cursor-pointer border-b-4 border-white"
            >
              Logout
            </button>
          )}
          <Link
            to="/about"
            className={`flex items-center h-full font-medium px-4 py-3 cursor-pointer border-b-4 ${
              pathname === "/about" ? " border-green-500" : "border-white"
            }`}
          >
            About
          </Link>
        </div>
      </header>
    </nav>
  );
};

export default Navbar;
