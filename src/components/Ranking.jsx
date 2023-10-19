import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import reuseableTranslations
  from '../assets/translations/ReusableTranslations.json';
import { useCollection } from '../hooks/useCollection';

function Ranking({ users, rankingOf, timeDifference }) {
  const { documents } = useCollection("books");
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const getReadBooks = (id) => {
    return documents.filter((book) =>
      book.readers.find(
        (reader) => reader.id === id && reader.pagesRead === book.pagesNumber
      )
    ).length;
  };

  const getlastBookRead = (id) => {
    const lastBookTitle = documents.filter((book) =>
      book.readers.find(
        (reader) => reader.id === id && reader.pagesRead === book.pagesNumber
      )
    )[0]?.title;

    if (lastBookTitle) {
      return lastBookTitle;
    } else {
      return "No data yet.";
    }
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
          {document &&
            users.slice(0, 3).map((user) => (
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
