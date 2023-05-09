import "./Book.css";

import { formatDistanceToNow } from "date-fns";
import { increment } from "firebase/firestore";
import { motion } from "framer-motion";
import { FaPencilAlt, FaSignOutAlt, FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import Recommended from "../components/Recommended";
import { modalActions } from "../context/ModalContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useDocument } from "../hooks/useDocument";
import { useFavourite } from "../hooks/useFavourite";
import { useFirestore } from "../hooks/useFirestore";
import Avatar from "./Avatar";
import EditBook from "./EditBook";

function Book() {
  const { id } = useParams();

  const { user } = useAuthContext();

  const { document, error } = useDocument("books", id);

  const { deleteDocument, updateDocument } = useFirestore("books");
  const { addToFavourite, removeFromFavourite, checkCondition } =
    useFavourite("favourite");

  const clickDelete = async () => {
    await deleteDocument(id);
    toast.success("Book removed successfully");
  };

  const isOpened = useSelector((state) => state.modal.isOpened);
  const dispatch = useDispatch();

  return (
    <div className="side">
      <motion.div
        className="book-element"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {document && (
          <motion.div
            className="book-details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
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

                <small>{document.favouritedCount}</small>
              </button>
            )}

            {user.uid === document.createdBy.id && (
              <>
                <button className="btn delete" onClick={clickDelete}>
                  Delete <FaSignOutAlt />
                </button>
                <button
                  className="btn edit-book"
                  onClick={() => {
                    dispatch(modalActions.openModal());
                  }}
                >
                  Edit <FaPencilAlt />
                </button>
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
              <Link to={`/profile/${document.createdBy.id}`}>
                <Avatar
                  img={document.createdBy.photoURL}
                  creator={document.createdBy.displayName}
                  creationDate={document.createdBy.createdAt
                    .toDate()
                    .toDateString()}
                />
              </Link>
            </div>
          </motion.div>
        )}

        {document && document.recension.content.trim() !== "" && (
          <motion.div
            className="recension-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2>Recension:</h2>
            {document.recension.content}

            <p>
              Added: {``}
              {formatDistanceToNow(
                document.recension.timeOfRecension.toDate()
              )}{" "}
              ago
            </p>
          </motion.div>
        )}

        {isOpened && <EditBook id={id} />}
      </motion.div>
      {document && document.isRecommendable && <Recommended currentId={id} />}
    </div>
  );
}

export default Book;
