import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { formatDistanceToNow } from 'date-fns';
import Lottie from 'lottie-react';
import { Link } from 'react-router-dom';

import { Pagination } from '@mui/material';

import lottieAnimation
  from '../../assets/lottieAnimations/Animation - 1700320134586.json';
import useRealtimeDocuments from '../../hooks/useRealtimeDocuments';

function Competitions() {
  const { getDocuments } = useRealtimeDocuments();
  const [documents, setElements] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadElements = async () => {
    const booksEl = await getDocuments("competitions");
    setElements(booksEl);
  };

  useEffect(() => {
    loadElements();
  }, [loadElements]);

  const objectsOnPage = () => {
    if (document.body.clientWidth > 0 && document.body.clientWidth < 1024) {
      return 10;
    } else {
      return 45;
    }
  };
  const fetchObjects = useCallback(
    (page) => {
      const start = (page - 1) * objectsOnPage();
      const end = start + objectsOnPage();
      const pageObjects = documents.slice(start, end);
      return pageObjects;
    },
    [documents]
  );

  const handlePagesChange = (e, value) => {
    if (currentPage < pagesAmount) {
      setCurrentPage(currentPage + 1);
      const pageObjects = fetchObjects(currentPage + 1);
      setElements(pageObjects);
      return;
    }

    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      const pageObjects = fetchObjects(currentPage - 1);
      setElements(pageObjects);
      return;
    }
    setCurrentPage(value);
  };

  const pagesAmount = Math.ceil(documents.length / objectsOnPage());

  useEffect(() => {
    if (documents.length > 0) {
      const fetchedObjects = fetchObjects(currentPage);
      setElements(fetchedObjects);
    }
  }, [currentPage, documents, fetchObjects]);

  return (
    <div className="min-h-screen h-full">
      <p className="text-2xl text-white"></p>
      <div className="flex justify-center w-full flex-wrap gap-4 m-2">
        {documents && documents.length > 0 ? (
          documents.map((doc) => (
            <Link
              to={`/competition/${doc.id}`}
              key={doc.id}
              className={`flex ${
                (doc.expiresAt - new Date().getTime()) / 86400000 <= 0 &&
                "bg-gray-500 text-black"
              } 2xl:w-[15%] sm:w-full md:w-[45%] lg:w-1/6 flex-col py-4 rounded-lg text-white bg-accColor hover:bg-lightModeCol hover:text-primeColor shadow-md hover:shadow-lg  hover:shadow-black transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex flex-col justify-around px-2">
                <h3 className=" font-semibold">{doc.competitionTitle}</h3>
                <p>{doc.competitionsName}</p>
                <p>Est. {formatDistanceToNow(doc.createdBy.createdAt)} ago</p>
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
          <div>
            <Lottie animationData={lottieAnimation} />
            <p className="text-2xl font-bold text-white text-center">
              No competitions added yet
            </p>
          </div>
        )}
      </div>
      <div className="flex justify-center items-center p-2">
        <Pagination
          variant="outlined"
          color="primary"
          showLastButton
          showFirstButton
          count={pagesAmount}
          onChange={handlePagesChange}
        />
      </div>
    </div>
  );
}

export default Competitions;
