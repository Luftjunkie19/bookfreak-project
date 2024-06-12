import '../../pages/stylings/backgrounds.css';

import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import useGetDocuments from '../../hooks/useGetDocuments';

function HomeCompetitions() {

const {documents}=useGetDocuments('competitions');

  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const getNumber = () => {
    if (document.body.clientWidth > 0 && document.body.clientWidth < 768) {
      return 7;
    }
    if (document.body.clientWidth >= 768 && document.body.clientWidth <= 1024) {
      return 3;
    }
    if (document.body.clientWidth > 1024 && document.body.clientWidth <= 1440) {
      return 4;
    } else {
      return 6;
    }
  };

  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  const slicedDocuments = documents.slice(0, getNumber());

  return (
    <div className="sm:grid sm:grid-flow-col snap-always snap-inline sm:auto-cols-[83%] md:auto-cols-[67%] sm:overflow-x-auto lg:flex lg:items-center w-full py-8 px-4 gap-5">
      {slicedDocuments && slicedDocuments.length ? (
        slicedDocuments.map((doc) => (
          <Link
            to={`/competition/${doc.id}`}
            key={doc.id} 
          >

          </Link>
        ))
      ) : (
        <p>No competitions added yet</p>
      )}
    </div>
  );
}

export default HomeCompetitions;
