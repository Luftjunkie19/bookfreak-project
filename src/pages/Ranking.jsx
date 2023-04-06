import "./Ranking.css";

import { Link } from "react-router-dom";

import { useCollection } from "../hooks/useCollection";

function Ranking({ users }) {
  const { documents } = useCollection("books");

  const readBooks = documents.filter((book) => {
    return book.readPages === book.pagesNumber;
  });

  const usersWithBooksRead = users.map((user) => {
    const booksRead = readBooks.reduce((count, book) => {
      if (book.createdBy.id === user.value.id) {
        return count + 1;
      }
      return count;
    }, 0);
    return { ...user, booksRead };
  });

  const sortedReaders = usersWithBooksRead.sort((a, b) => {
    return b.booksRead - a.booksRead;
  });

  console.log(users, readBooks, usersWithBooksRead);

  return (
    <div className="ranking">
      <h2>{sortedReaders[0].value.nickname} is currently leading</h2>
      <p>
        {sortedReaders[0].booksRead}{" "}
        {sortedReaders[0].booksRead > 1 ? "books" : "book"} has been read by{" "}
        {sortedReaders[0].value.nickname}
      </p>

      {sortedReaders.map((user, i) => (
        <Link to={`/user/profile/${user.value.id}`} key={i}>
          <div
            className={`user ${
              i === 0
                ? "gold"
                : "" || i === 1
                ? "silver"
                : "" || i === 2
                ? "bronze"
                : ""
            } ranking-member`}
          >
            <p className="ranking-status">{i + 1}</p>

            <div className="small-avatar">
              <img src={user.value.photoURL} alt="" />
            </div>
            <p>{user.value.nickname}</p>

            <p className="books-qnty">
              {user.booksRead} {user.booksRead > 1 ? "books" : "book"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Ranking;
