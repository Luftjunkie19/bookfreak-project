import './Book.css';

import { formatDistanceToNow } from 'date-fns';
import { increment } from 'firebase/firestore';
import {
  FaPencilAlt,
  FaSignOutAlt,
  FaStar,
} from 'react-icons/fa';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import Recommended from '../components/Recommended';
import { useAuthContext } from '../hooks/useAuthContext';
import { useDocument } from '../hooks/useDocument';
import { useFavourite } from '../hooks/useFavourite';
import { useFirestore } from '../hooks/useFirestore';
import Avatar from './Avatar';

function Book() {
  const { id } = useParams();

  console.log(id);

  const { user } = useAuthContext();

  const { document, error } = useDocument("books", id);

  const { deleteDocument, updateDocument } = useFirestore("books");

  const { addToFavourite, removeFromFavourite, checkCondition } =
    useFavourite("favourite");

  console.log(error);

  const clickDelete = async () => {
    await deleteDocument(id);
    toast.success("Book removed successfully");
  };

  return (
    <div className="book-element">
      {document && (
        <div className="book-details">
          {user.uid !== document.createdBy.id && (
            <button
              className={`to-favourite ${
                checkCondition(document.id) ? "added" : ""
              }`}
              onClick={() => {
                if (!checkCondition(document.id)) {
                  addToFavourite(document);
                  updateDocument(id, {
                    favouritedCount: increment(1),
                  });
                } else {
                  removeFromFavourite(document.id);
                  updateDocument(id, {
                    favouritedCount: increment(-1),
                  });
                }
              }}
            >
              <FaStar
                title={
                  !checkCondition(document.id)
                    ? "add to favourites"
                    : "remove from favourites"
                }
              />
            </button>
          )}

          {user.uid === document.createdBy.id && (
            <>
              <button className="btn delete" onClick={clickDelete}>
                Delete <FaSignOutAlt />
              </button>
              <Link className="btn edit-book" to={`/edit-book/${id}`}>
                Edit <FaPencilAlt />
              </Link>
            </>
          )}

          <div className="book-cover">
            <img src={document.photoURL} alt="" />
          </div>
          <h2>Title: {document.title}</h2>
          <h4>Author: {document.author}</h4>
          <p>Pages Number: {document.pagesNumber}</p>
          <p>Read pages: {document.readPages}</p>

          <div className="added-by">
            Added by:
            <Link to={`/user/profile/${document.createdBy.id}`}>
              <Avatar
                img={document.createdBy.photoURL}
                creator={document.createdBy.displayName}
                creationDate={document.createdBy.createdAt
                  .toDate()
                  .toDateString()}
              />
            </Link>
          </div>
        </div>
      )}

      {document && document.recension.content.trim() !== "" && (
        <div className="recension-container">
          <h2>Recension:</h2>
          {document.recension.content}

          <p>
            Added: {``}
            {formatDistanceToNow(
              document.recension.timeOfRecension.toDate()
            )}{" "}
            ago
          </p>
        </div>
      )}

      {document && document.readPages === document.pagesNumber && (
        <Recommended />
      )}
    </div>
  );
}

export default Book;
