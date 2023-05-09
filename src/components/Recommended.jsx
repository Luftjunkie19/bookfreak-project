import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { useAuthContext } from "../hooks/useAuthContext";
import { useCollection } from "../hooks/useCollection";
import { useOrderedCollection } from "../hooks/useOrderedCollection";

function Recommended({ currentId }) {
  const { user } = useAuthContext();
  const { documents } = useCollection(
    "books",
    ["favouritedCount", ">", 0],
    ["favouritedCount", "desc"]
  );

  const { orderedDocuments } = useOrderedCollection(
    "books",
    ["createdBy.createdAt", "desc"],
    ["isRecommendable", "==", true]
  );

  const fullRecomendedArray = Array.from(
    new Set([...orderedDocuments, ...documents].map((obj) => obj.id))
  ).map((id) => {
    return [...orderedDocuments, ...documents].find((obj) => obj.id === id);
  });

  const notYours = fullRecomendedArray.filter((doc) => {
    return doc.createdBy.id !== user.uid && doc.id !== currentId;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h3 className="recomended-header">Also recommended by other users:</h3>
      {
        <div className="recomended-holder">
          {notYours.splice(0, 4).map((doc, i) => (
            <Link key={i} className="recomended-book" to={`/book/${doc.id}`}>
              <div className="prev-cover recomended">
                <img src={doc.photoURL && doc.photoURL} alt="cover" />
              </div>

              <h4> {doc.title}</h4>
              <small>
                Added by: {doc.createdBy.displayName}, at:
                <br />
                {doc.createdBy.createdAt.toDate().toDateString()}
              </small>
            </Link>
          ))}
        </div>
      }
    </motion.div>
  );
}

export default Recommended;
