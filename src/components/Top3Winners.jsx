import React from 'react';

import { FaCrown } from 'react-icons/fa6';

function Top3Winners({ topWinners }) {
  return (
    <div className="sm:w-full xl:w-1/2 ">
      <p className="text-center text-xl text-orange-400 font-semibold">
        {topWinners[0]?.nickname} wins the competition
      </p>
      <div className="flex gap-8 justify-center items-center w-full min-h-[24rem]">
        {topWinners.map((winner, i) => (
          <div
            className={`${
              i === 0
                ? `self-start order-2
                 justify-self-start`
                : ` self-center justify-self-center`
            }  gap-2 flex flex-col ${i === 1 ? "order-1" : "order-3"}`}
          >
            <div className="">
              {i === 0 && (
                <FaCrown className="mx-auto text-yellow-400 text-2xl" />
              )}
              <img
                src={winner?.photoURL}
                alt=""
                className={`sm:w-16 sm:h-16 lg:h-20 lg:w-20 ${
                  i === 0 && "sm:h-24 sm:w-24"
                } rounded-full object-cover mx-auto`}
              />
            </div>
            <p
              className={`text-center text-white text-lg ${
                i === 0 && "text-yellow-500 font-semibold"
              }`}
            >
              {winner?.nickname}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Top3Winners;
