import { useState, useEffect } from "react";

const IngList = () => {
  const [interestRate, setInterestRate] = useState(null);

  const fetchInterestRate = async () => {
    try {
      const res = await fetch("http://localhost:4000/ing/interestRate");
      const { interestRate } = await res.json();
      setInterestRate(interestRate);
    } catch (error) {}
  };

  useEffect(() => {
    fetchInterestRate();
  }, []);

  return (
    <div className="flex flex-col px-3 py-3 space-y-3 bg-white">
      <div className="flex justify-center text-2xl">ING</div>
      <div className="flex justify-center space-y-2 w-full"></div>
      <div className="">
        <div className="text-center">Savings Maximiser: </div>
        <div className="text-center text-sm text-gray-500">Interest rate: {interestRate}%</div>
      </div>
    </div>
  );
};

export default IngList;
