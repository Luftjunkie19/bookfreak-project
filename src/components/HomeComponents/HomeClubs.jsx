import "../../pages/stylings/backgrounds.css";

import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import useRealtimeDocuments from "../../hooks/useRealtimeDocuments";

function HomeClubs() {
  const { getDocuments } = useRealtimeDocuments();
  const [documents, setElements] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadElements = async () => {
    const booksEl = await getDocuments("readersClubs");
    setElements(booksEl);
  };

  useEffect(() => {
    loadElements();
  }, [loadElements]);
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const getSliceNumber = () => {
    if (document.body.clientWidth > 0 && document.body.clientWidth < 1024) {
      return 8;
    } else {
      return 4;
    }
  };

  return (
    <div className="sm:grid sm:grid-flow-col snap-always snap-inline sm:auto-cols-[83%] md:auto-cols-[67%] lg:auto-cols-[41%] sm:overflow-x-auto xl:flex xl:items-center w-full py-8 px-4 gap-5">
      {documents ? (
        documents.slice(0, getSliceNumber()).map((doc) => (
          <Link
            to={`/readers-clubs/${doc.id}`}
            key={doc.id}
            className="snap-start flex xl:w-1/5 flex-col group p-2 bg-accColor rounded-lg overflow-hidden hover:shadow-md hover:shadow-black hover:bg-lightModeCol hover:scale-95 duration-200 transition-all"
          >
            <img
              src={doc.clubLogo}
              alt=""
              referrerPolicy="no-referrer"
              className="w-16 h-16 object-cover rounded-full group-hover:scale-95 duration-200 transition-all"
            />

            <div className="flex justify-between items-center sm:flex-col xl:flex-row text-white group-hover:text-accColor p-4">
              <p className="text-lg font-semibold">{doc.clubsName}</p>
              {/* <p>
                {doc.users.length}{" "}
                {translations.clubObject.members[selectedLanguage]}
        </p>*/}
            </div>
          </Link>
        ))
      ) : (
        <p>No clubs added yet</p>
      )}
    </div>
  );
}

export default HomeClubs;
