import { useContext, useState, useRef } from "react";
import { UserContext } from "../UserContext";
import { Link, useHistory, useLocation } from "react-router-dom";

export const requestStakeLogin = async (stakeToken, setStakeToken) => {
  try {
    if (!stakeToken) {
      throw new Error("requestStakeLogin: !stakeToken");
    }
    const res = await fetch("http://localhost:4000/stake/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ stakeToken }),
    });
    if (!res.ok) {
      throw new Error("requestStakeLogin failed");
    }
    const { stakeToken: validToken } = await res.json();
    console.log(validToken);
    setStakeToken(validToken);
    return validToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const Login = () => {
  const [inputToken, setInputToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { stakeToken, setStakeToken } = useContext(UserContext);
  const history = useHistory();
  const { state } = useLocation();
  const inputTokenRef = useRef();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!inputToken) {
      inputTokenRef.current.focus();
      return setErrorMessage("Please enter your token");
    }
    const validToken = await requestStakeLogin(inputToken, setStakeToken);
    if (validToken) {
      return history.push(state?.from || "/");
    }
    inputTokenRef.current.focus();
    setErrorMessage("Invalid stakeToken");
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-md w-full px-4 rounded-lg p-4">
        {!stakeToken ? (
          <div className="space-y-4 m-3">
            <span className="text-2xl font-medium">Log in to Stake</span>
            <form className="space-y-4">
              <div>
                <label htmlFor="inputToken" className="font-medium text-gray-600 text-sm">
                  Token
                </label>
                <input
                  ref={inputTokenRef}
                  onChange={(e) => setInputToken(e.target.value.trim())}
                  type="password"
                  id="inputToken"
                  placeholder="stake-session-token"
                  className="input w-full"
                />

                {errorMessage && (
                  <div className="flex items-center text-red-500 mt-3 space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              <div>
                <button onClick={handleLogin} className="btn w-full">
                  Log in
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center">hi [{stakeToken}]</div>
        )}
      </div>
    </div>
  );
};

export default Login;
