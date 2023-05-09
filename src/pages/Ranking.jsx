import "./Ranking.css";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { useCollection } from "../hooks/useCollection";

function Ranking({ users, rankingOf, timeDifference }) {
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

  return (
    <motion.div
      className={`ranking ${
        rankingOf === "competition" && timeDifference <= 0
          ? "expired-ranking"
          : ""
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2>
        {sortedReaders[0].value.nickname}{" "}
        {rankingOf === "competition" && timeDifference <= 0
          ? "has won the competition"
          : "Is currently leading"}
      </h2>
      <p>
        {sortedReaders[0].booksRead}{" "}
        {sortedReaders[0].booksRead > 1 ? "books" : "book"} has been read by{" "}
        {sortedReaders[0].value.nickname}
      </p>

      {sortedReaders.map((user, i) => (
        <Link to={`/profile/${user.value.id}`} key={i}>
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
    </motion.div>
  );
}

export default Ranking;
