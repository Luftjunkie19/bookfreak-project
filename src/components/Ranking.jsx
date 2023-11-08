import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import reuseableTranslations from "../assets/translations/ReusableTranslations.json";
import useRealtimeDocuments from "../hooks/useRealtimeDocuments";

function Ranking({ communityId, communityMembers }) {
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const { getDocuments } = useRealtimeDocuments();

  const [books, setBooks] = useState([]);
  const [readerObjects, setReaderObjects] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadReaderObjects = async () => {
    const readerObjects = await getDocuments("bookReaders");

    const realObjects = readerObjects.map((bookReader) => {
      return bookReader.readers;
    });

    const newArray = realObjects.map((obj) => {
      const nestedObject = Object.values(obj);
      return nestedObject;
    });

    setReaderObjects(newArray.flat());
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadBooks = async () => {
    const booksEl = await getDocuments("books");
    setBooks(booksEl);
  };

  useEffect(() => {
    loadBooks();
    loadReaderObjects();
  }, [loadBooks, loadReaderObjects]);

  const getReadBooks = (id) => {
    return readerObjects.filter((reader, i) => reader.id === id).length;
  };

  const getlastBookRead = (id) => {
    const BookTitles = readerObjects.filter((reader, i) => reader.id === id);

    const lastBookTitle = books.filter(
      (book, index) => book.id === BookTitles[index]?.bookReadingId
    )[
      books.filter(
        (book, index) => book.id === BookTitles[index]?.bookReadingId
      ).length - 1
    ]?.title;

    return lastBookTitle;
  };

  return (
    <TableContainer
      component={Paper}
      className="sm:w-full xl:w-1/2 bg-accColor"
    >
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell
              className="bg-primeColor border-r-white border-r-2 font-bold text-lg text-center"
              sx={{ color: "#fff" }}
            >
              {
                reuseableTranslations.RankingTranslations.heads.userHead[
                  selectedLanguage
                ]
              }
            </TableCell>

            <TableCell
              className="bg-primeColor text-center border-r-white border-r-2 font-bold text-lg"
              sx={{ color: "#fff" }}
            >
              {
                reuseableTranslations.RankingTranslations.heads.booksReadHead[
                  selectedLanguage
                ]
              }
            </TableCell>
            <TableCell
              className="bg-primeColor font-bold text-lg text-center"
              sx={{ color: "#fff" }}
            >
              {
                reuseableTranslations.RankingTranslations.heads.currentBookHead[
                  selectedLanguage
                ]
              }
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {communityMembers.length > 0 &&
            communityMembers.map((user) => (
              <TableRow
                key={user.label}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  className="border-r-white border-r-2"
                  sx={{ color: "#fff" }}
                >
                  <Link
                    to={`/user/profile/${user.value.id}`}
                    className="flex gap-3 items-center"
                  >
                    <div className="sm:w-10 sm:h-10 md:w-16 md:h-16">
                      <img
                        className="w-full h-full rounded-full object-cover"
                        src={user.value.photoURL}
                        alt=""
                      />
                    </div>
                    <p>{user.value.nickname}</p>
                  </Link>
                </TableCell>

                <TableCell
                  sx={{ color: "#fff" }}
                  component="th"
                  scope="row"
                  className="border-r-white border-r-2"
                >
                  <p className="text-center">
                    {getReadBooks(user.value.id)}{" "}
                    {getReadBooks(user.value.id) > 1
                      ? `${reuseableTranslations.booksObjects.books[selectedLanguage]}`
                      : `${reuseableTranslations.booksObjects.book[selectedLanguage]}`}
                  </p>
                </TableCell>
                <TableCell sx={{ color: "#fff" }} component="th" scope="row">
                  <p className="text-center">
                    {getlastBookRead(user.value.id)}
                  </p>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Ranking;
