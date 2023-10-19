import React from "react";

import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

import { Pagination } from "@mui/material";

import { useCollection } from "../../hooks/useCollection";

function Competitions() {
  const { documents } = useCollection("competitions");

  return (
    <div className="min-h-screen h-full">
      <p className="text-2xl text-white"></p>
      <div className="flex justify-center w-full flex-wrap gap-4 m-2">
        {documents && documents.length > 0 ? (
          documents.map((doc) => (
            <Link
              to={`/competition/${doc.id}`}
              key={doc.id}
              className="flex 2xl:w-[15%] sm:w-full md:w-[30%] lg:w-1/6 flex-col py-4 rounded-lg text-white bg-accColor hover:bg-lightModeCol hover:text-primeColor shadow-md hover:shadow-lg  hover:shadow-black transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col justify-around px-2">
                <h3 className=" font-semibold">{doc.competitionTitle}</h3>
                <p>{doc.competitionsName}</p>
                <p>
                  Est. {formatDistanceToNow(doc.createdBy.createdAt.toDate())}{" "}
                  ago
                </p>
              </div>
              <div className="avatar-group mt-2 w-full justify-center">
                {doc.users &&
                  doc.users.slice(0, 3).map((user, index) => (
                    <div key={index} className="avatar">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src={user.value.photoURL}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </Link>
          ))
        ) : (
          <p>No competitions added yet</p>
        )}
      </div>
      <div className="flex justify-center items-center p-2">
        <Pagination
          variant="outlined"
          color="primary"
          showLastButton
          showFirstButton
          count={2}
        />
      </div>
    </div>
  );
}

export default Competitions;
