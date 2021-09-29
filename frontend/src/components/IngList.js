import { useState, useEffect } from "react";

const IngList = () => {
  const [interestRate, setInterestRate] = useState(null);

  const fetchInterestRate = async () => {
    const res = await fetch("http://localhost:4000/ing/interestRate");
    const { interestRate } = await res.json();
    setInterestRate(interestRate);
  };

  useEffect(() => {
    fetchInterestRate();
  }, []);

  return (
    <div className="flex flex-col px-3 py-3 space-y-3">
      <div className="flex justify-center space-y-2 w-full">
        <div className="flex text-2xl">ING</div>
      </div>
      <div className="">
        <div className="text-center">Savings Maximiser: </div>
        <div className="text-center">Interest rate: {interestRate}%</div>
      </div>
    </div>
  );
};

export default IngList;
