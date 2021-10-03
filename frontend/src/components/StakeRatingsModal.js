import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { formatDistance } from "date-fns";

export const StakeRatingsModal = ({ symbol, name, ratings, isOpen, onClose, isRatingBuy, isRatingSell }) => {
  const escClose = (e) => {
    if (e.keyCode === 27) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", escClose);
    return () => {
      document.removeEventListener("keydown", escClose);
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0">
      <div
        id="overlay"
        className="min-h-screen min-w-screen bg-black opacity-40"
        onClick={() => onClose()}
      ></div>
      <div className="fixed w-96 top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col space-y-2 bg-gray-200 rounded-lg shadow-2xl p-4">
        <div className="text-xl text-center">{name}</div>
        <div className="border border-gray-200 p-2 bg-white" colSpan="100%">
          {ratings &&
            ratings.map((r) => {
              return (
                <div className="text-sm border-b border-gray-300 py-0.5">
                  <span
                    className={`rounded px-1  mx-1 
                    ${
                      isRatingBuy(r.rating_current)
                        ? "bg-green-200 text-green-900"
                        : isRatingSell(r.rating_current)
                        ? "bg-red-500 text-white"
                        : "bg-gray-200"
                    } `}
                  >
                    {r.rating_current}
                  </span>
                  {r.analyst}
                  <span className="ml-2">
                    ({formatDistance(new Date(r.date), new Date(), { includeSeconds: false })} ago)
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>,

    document.getElementById("modal-root")
  );
};
