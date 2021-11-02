import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Link, useHistory, useLocation } from "react-router-dom";

const Navbar = () => {
  const { stakeToken, setStakeToken } = useContext(UserContext);
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

  return (
    <nav>
      <header className="flex justify-between border-b border-gray-300 shadow-sm">
        <div className="flex flex-grow  items-center justify-center ml-10"></div>

        <div className="flex items-center justify-end h-10">
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
            to="/settings"
            className={`flex items-center h-full font-medium px-4 py-3 cursor-pointer border-b-4 ${
              pathname === "/settings" ? " border-green-500" : "border-white"
            }`}
          >
            Settings
          </Link>
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
