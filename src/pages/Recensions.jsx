import './Recensions.css';

import { Link } from 'react-router-dom';

import { useCollection } from '../hooks/useCollection';

function Recensions() {
  const { documents } = useCollection("books");

  let recensionedBooks = documents.filter((doc) => {
    return doc.recension.content.trim() !== "";
  });

  return (
    <div>
      <h2 className="recomended-header">
        {recensionedBooks.length}{" "}
        {recensionedBooks.length > 1 ? "recensions" : "recension"} has been
        added until now.
      </h2>

      <div className="recensions-container">
        {recensionedBooks &&
          recensionedBooks.map((book) => (
            <div className="recension" key={book.id}>
              <p>{book.recension.content}</p>
              <small>
                <Link to={`/user/profile/${book.createdBy.id}`}>
                  {book.createdBy.displayName}
                </Link>{" "}
                about <Link to={`/book/${book.id}`}>{book.title}</Link>
              </small>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Recensions;
