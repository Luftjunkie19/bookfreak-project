import { Link } from "react-router-dom";

function OwnedBooks({ ownedBooks, ownerId }) {
  return (
    <>
      <h2>Added Books:</h2>

      <div
        className={
          ownedBooks &&
          ownedBooks.filter((doc) => {
            return doc.createdBy.id === ownerId;
          }).length > 0
            ? "books"
            : "links"
        }
      >
        {ownedBooks &&
        ownedBooks.filter((doc) => {
          return doc.createdBy.id === ownerId;
        }).length > 0 ? (
          ownedBooks
            .filter((doc) => {
              return doc.createdBy.id === ownerId;
            })
            .map((book, i) => (
              <Link to={`/book/${book.id}`}>
                <div className="owned-book" key={i}>
                  <div className="owned-cover">
                    <img src={book.photoURL} alt="" />
                  </div>
                </div>
              </Link>
            ))
        ) : (
          <p>No books yet</p>
        )}
      </div>
    </>
  );
}

export default OwnedBooks;
