export const CheckUser = async (setStakeToken, setIsStakeAuthLoading) => {
  console.log("CheckUser");
  try {
    const res = await fetch("http://localhost:4000/stake/check", {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("stakeToken in cookie invaid");
    }
    const { stakeToken } = await res.json();
    if (!stakeToken) {
      throw new Error("stakeToken not valid");
    }
    // console.log("CheckUser: stakeToken: ");
    // console.log(stakeToken);
    setStakeToken(stakeToken);
    setIsStakeAuthLoading(false);
    return true;
  } catch (error) {
    console.log(error);
    setStakeToken(null);
    setIsStakeAuthLoading(false);
    return false;
  }
};
