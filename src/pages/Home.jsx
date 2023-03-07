import './Home.css';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  FaArrowLeft,
  FaArrowRight,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

import Loader from '../components/Loader';
import { useLogin } from '../hooks/useLogin';
import { useOrderedCollection } from '../hooks/useOrderedCollection';

function Home() {
  // eslint-disable-next-line no-undef
  const { orderedDocuments } = useOrderedCollection("books", [
    "createdBy.createdAt",
    "asc",
  ]);

  const { isPending } = useLogin();

  const [currentPage, setCurrentPage] = useState(1);
  const objectsOnPage = 10;

  const pagesAmount = Math.ceil(orderedDocuments.length / objectsOnPage);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchObjects = useCallback(
    (page) => {
      const start = (page - 1) * objectsOnPage;
      const end = start + objectsOnPage;
      const pageObjects = orderedDocuments.slice(start, end);
      return pageObjects;
    },
    [orderedDocuments, objectsOnPage]
  );

  const nextPage = () => {
    if (currentPage < pagesAmount) {
      setCurrentPage(currentPage + 1);
      const pageObjects = fetchObjects(currentPage + 1);
      setBooks(pageObjects);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      const pageObjects = fetchObjects(currentPage - 1);
      setBooks(pageObjects);
    }
  };

  const [books, setBooks] = useState(fetchObjects(1));

  useEffect(() => {
    setBooks(fetchObjects(1));
  }, [setBooks, fetchObjects]);

  return (
    <>
      <div className="home-container">
        <h2>
          {orderedDocuments && orderedDocuments.length > 0
            ? `There we read all now: ${orderedDocuments.length}`
            : "Empty YET!"}
        </h2>
        <div className="books-holder">
          {books &&
            books.map((doc, i) => (
              <Link to={`/book/${doc.id}`} key={i}>
                <div key={i} className="book">
                  <div className="prev-cover">
                    <img src={doc.photoURL && doc.photoURL} alt="cover" />
                  </div>

                  <h4> {doc.title}</h4>
                  <p>Author: {doc.author}</p>
                  <small>
                    Added by: {doc.createdBy.displayName}, at:
                    <br />
                    {doc.createdBy.createdAt.toDate().toDateString()}
                  </small>
                </div>
              </Link>
            ))}
        </div>

        <p>
          {currentPage}/{pagesAmount}
        </p>

        <div className="pages-buttons">
          {currentPage > 1 && (
            <button className="btn" onClick={previousPage}>
              <FaArrowLeft /> Previous
            </button>
          )}

          {currentPage < pagesAmount && (
            <button className="btn" onClick={nextPage}>
              Next <FaArrowRight />
            </button>
          )}
        </div>
      </div>
      {isPending && <Loader />}
    </>
  );
}

export default Home;
