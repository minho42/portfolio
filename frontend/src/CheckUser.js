export const CheckUser = async (setToken, setIsAuthLoading) => {
  console.log("CheckUser");
  try {
    const res = await fetch("http://localhost:4000/stake/check", {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("token in cookie invaid");
    }
    const { token } = await res.json();
    if (!token) {
      throw new Error("Token not valid");
    }
    // console.log("CheckUser: token: ");
    // console.log(token);
    setToken(token);
    setIsAuthLoading(false);
    return true;
  } catch (error) {
    console.log(error);
    setToken(null);
    setIsAuthLoading(false);
    return false;
  }
};
