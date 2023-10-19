import "../../pages/stylings/backgrounds.css";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import translations from "../../assets/translations/ClubsTranslations.json";
import { useCollection } from "../../hooks/useCollection";

function HomeClubs() {
  const { documents } = useCollection("clubs");
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
    <div className="sm:grid sm:grid-flow-col sm:auto-cols-[89%] md:auto-cols-[47%] lg:auto-cols-[31%] sm:snap-mandatory snap-inline xl:flex xl:flex-wrap gap-4 p-4">
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
              <p>
                {doc.users.length}{" "}
                {translations.clubObject.members[selectedLanguage]}
              </p>
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
