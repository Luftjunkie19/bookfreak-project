import "./Book.css";

import { formatDistanceToNow } from "date-fns";
import { FaPencilAlt, FaSignOutAlt } from "react-icons/fa";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuthContext } from "../hooks/useAuthContext";
import { useDocument } from "../hooks/useDocument";
import { useFirestore } from "../hooks/useFirestore";
import Avatar from "./Avatar";

function Book() {
  const { id } = useParams();

  console.log(id);

  const { user } = useAuthContext();

  const { document, error } = useDocument("books", id);

  const { deleteDocument } = useFirestore("books");

  console.log(error);

  const clickDelete = async () => {
    await deleteDocument(id);
    toast.success("Book removed successfully");
  };

  return (
    <>
      {document && (
        <div className="book-details">
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
          <h3>Recension:</h3>
          {document.recension.content}

          <h4>
            Added: {``}
            {formatDistanceToNow(
              document.recension.timeOfRecension.toDate()
            )}{" "}
            ago
          </h4>
        </div>
      )}
    </>
  );
}

export default Book;
