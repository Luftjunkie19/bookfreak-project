import { useNavigate } from 'react-router-dom';

import { useAuthContext } from '../hooks/useAuthContext';
import { useCollection } from '../hooks/useCollection';
import { useOrderedCollection } from '../hooks/useOrderedCollection';

function Recommended() {
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

  console.log("ARRAY", fullRecomendedArray);

  console.log(documents);

  const navigate = useNavigate();

  const notYours = fullRecomendedArray.filter((doc) => {
    return doc.createdBy.id !== user.uid;
  });

  let startingNumber =
    Math.round(Math.random() * notYours.length - 1) >= notYours.length - 1 - 4
      ? notYours.length - 1 - 4
      : Math.round(Math.random() * notYours.length - 1);

  let result = notYours.slice(startingNumber, startingNumber + 4);

  return (
    <>
      <h3 className="recomended-header">Also recommended by other users:</h3>
      {
        <div className="recomended-holder">
          {result.map((doc, i) => (
            <div
              key={i}
              className="recomended-book"
              onClick={() => {
                navigate("/");
                setTimeout(() => {
                  navigate(`/book/${doc.id}`);
                });
              }}
            >
              <div className="prev-cover recomended">
                <img src={doc.photoURL && doc.photoURL} alt="cover" />
              </div>

              <h4> {doc.title}</h4>
              <small>
                Added by: {doc.createdBy.displayName}, at:
                <br />
                {doc.createdBy.createdAt.toDate().toDateString()}
              </small>
            </div>
          ))}
        </div>
      }
    </>
  );
}

export default Recommended;
