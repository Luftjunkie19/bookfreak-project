import '../../pages/stylings/backgrounds.css';

import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import useGetDocuments from '../../hooks/useGetDocuments';

function HomeClubs() {
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  const {documents}=useGetDocuments("readersClubs");

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
            className={`snap-start flex xl:w-[20rem] 2xl:w-[24rem] flex-col group p-2 ${isDarkModed ? "bg-accColor" : "bg-primeColor"} rounded-lg overflow-hidden hover:shadow-md hover:shadow-black ${isDarkModed ? "hover:bg-lightModeCol" : "hover:bg-accColor"} hover:scale-95 duration-200 transition-all`}
          >
            <img
              src={doc.clubLogo}
              alt=""
              referrerPolicy="no-referrer"
              className="w-16 h-16 object-cover rounded-full group-hover:scale-95 duration-200 transition-all"
            />

            <div className={`flex justify-between items-center sm:flex-col xl:flex-row text-white ${isDarkModed && "group-hover:text-accColor"} p-4`}>
              <p className="text-lg font-semibold">{doc.clubsName}</p>
            
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
