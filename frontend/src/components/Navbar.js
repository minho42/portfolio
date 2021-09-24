import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, useHistory, useLocation } from "react-router-dom";

const Navbar = () => {
  const { token } = useContext(UserContext);
  const history = useHistory();
  const { pathname } = useLocation();

  return (
    <nav>
      <header className="flex justify-center border-b border-gray-300 shadow-sm">
        <div className="flex items-center justify-evenly h-16 w-full">
          <Link
            to="/"
            className={`flex items-center h-full font-medium px-4 py-3 cursor-pointer border-b-4 ${
              pathname === "/" ? " border-blue-500" : "border-white"
            }`}
          >
            Portfolio
          </Link>
          {!token && (
            <Link
              to="/login"
              className={`flex items-center h-full font-medium px-4 py-3 cursor-pointer border-b-4 ${
                pathname === "/login" ? " border-blue-500" : "border-white"
              }`}
            >
              Login
            </Link>
          )}
          <Link
            to="/about"
            className={`flex items-center h-full font-medium px-4 py-3 cursor-pointer border-b-4 ${
              pathname === "/about" ? " border-blue-500" : "border-white"
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
