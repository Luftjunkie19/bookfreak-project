import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { increment } from 'firebase/database';
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

import { CompetitionRules } from '../assets/CompetitionsRules/CompetitionRules';
import reuseableTranslations
  from '../assets/translations/ReusableTranslations.json';
import { useAuthContext } from '../hooks/useAuthContext';
import { useRealDatabase } from '../hooks/useRealDatabase';
import useRealtimeDocument from '../hooks/useRealtimeDocument';
import useRealtimeDocuments from '../hooks/useRealtimeDocuments';
import Top3Winners from './Top3Winners';

function Ranking({
  communityObject,
  communityMembers,
  expirationTime,
  expirationTimeNumber,
}) {
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const { getDocuments } = useRealtimeDocuments();
  const {getDocument}= useRealtimeDocument();
  const {updateDatabase}= useRealDatabase();
  const { teachToFishRule, liftOthersRiseJointlyRule, firstComeServedRule } =
    CompetitionRules();
  const { user } = useAuthContext();
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getReadBooks = (id) => {
    return !communityObject?.expiresAt
      ? readerObjects.filter(
          (reader, i) => reader.id === id && reader.hasFinished
        ).length
      : readerObjects.filter(
          (reader, i) =>
            reader.id === id &&
            reader.hasFinished &&
            reader.dateOfFinish >= communityObject.createdBy.createdAt &&
            reader.dateOfFinish <= communityObject.expiresAt
        ).length;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getlastBookRead = (id) => {
    const BookTitles = !communityObject?.expiresAt
      ? readerObjects.filter(
          (reader, i) => reader.id === id && reader.hasFinished
        )
      : readerObjects.filter(
          (reader, i) =>
            reader.id === id &&
            reader.hasFinished &&
            reader.dateOfFinish >= communityObject.createdBy.createdAt &&
            reader.dateOfFinish <= communityObject.expiresAt
        );

    const lastBookTitle = books.filter(
      (book, index) => book.id === BookTitles[index]?.bookReadingId
    )[
      books.filter(
        (book, index) => book.id === BookTitles[index]?.bookReadingId
      ).length - 1
    ]?.title;

    return lastBookTitle ? lastBookTitle : "No book yet";
  };

  const [suitableMembers, setSuitMembers] = useState([]);



    const accurateMembers = useCallback(async () => {
    if (
      readerObjects.length > 0 &&
      communityMembers &&
      communityObject &&
      communityObject.competitionsName
    ) {
      if (communityObject.competitionsName === "Lift others, rise") {
        const arr = await liftOthersRiseJointlyRule(
          communityMembers,
          getReadBooks,
          expirationTimeNumber,
          communityObject.createdBy.createdAt,
          getlastBookRead
        );
        setSuitMembers(arr);
      }
      if (communityObject.competitionsName === "First read, first served") {
        const arr = firstComeServedRule(
          communityMembers,
          getReadBooks,
          getlastBookRead
        );
        setSuitMembers(arr);
      }

      if (communityObject.competitionsName === "Teach to fish") {
        const arr = await teachToFishRule(
          readerObjects,
          communityMembers,
          getReadBooks,
          getlastBookRead
        );
        setSuitMembers(arr);
      }
    } else {
      const arr = firstComeServedRule(
        communityMembers,
        getReadBooks,
        getlastBookRead
      );
      setSuitMembers(arr);
    }
  }, [readerObjects, communityMembers, communityObject, liftOthersRiseJointlyRule, getReadBooks, expirationTimeNumber, getlastBookRead, firstComeServedRule, teachToFishRule]);

  useEffect(() => {
    accurateMembers();
  }, [accurateMembers]);

    const payoutTheWinningUser = async () => {
      const winnerDoc = await getDocument('users', suitableMembers[0].id);
      const hostId = await getDocument('users', communityObject.createdBy.id);

      if (winnerDoc && hostId && communityObject.prize.moneyPrize) {
        updateDatabase({ creditsAvailable: increment(communityObject.prize.moneyPrize.amount) }, "users", winnerDoc.id);

      const payoutObject =  await fetch('http://127.0.0.1:5001/bookfreak-8d935/us-central1/stripeFunctions/createTransferToWinner', {
           method: "POST",
        headers: {
      "Content-Type": "application/json",
        'Connection': 'keep-alive',
            'Accept': '*',
          },
          body: JSON.stringify({
            destinationId: winnerDoc.stripeAccountData.id,
            organizatorId: hostId.stripeAccountData.id,
            amount: communityObject.prize.moneyPrize.amount,
            currency: winnerDoc.stripeAccountData.default_currency,
        })
        })
        const payoutFullfilled = await payoutObject.json();
        console.log(payoutFullfilled);
      }

}

  return (
    <>
      {(expirationTime > 0 || !expirationTime) && (
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
                    reuseableTranslations.RankingTranslations.heads
                      .booksReadHead[selectedLanguage]
                  }
                </TableCell>
                <TableCell
                  className="bg-primeColor font-bold text-lg text-center"
                  sx={{ color: "#fff" }}
                >
                  {
                    reuseableTranslations.RankingTranslations.heads
                      .currentBookHead[selectedLanguage]
                  }
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {suitableMembers.length > 0 &&
                suitableMembers.map((user) => (
                  <TableRow
                    key={user.id}
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
                        to={`/user/profile/${user.id}`}
                        className="flex gap-3 items-center"
                      >
                        <div className="sm:w-10 sm:h-10 md:w-16 md:h-16">
                          <img
                            className="w-full h-full rounded-full object-cover"
                            src={user.photoURL}
                            alt=""
                          />
                        </div>
                        <p className="sm:hidden lg:block">{user.nickname}</p>
                      </Link>
                    </TableCell>

                    <TableCell
                      sx={{ color: "#fff" }}
                      component="th"
                      scope="row"
                      className="border-r-white border-r-2"
                    >
                      <p className="text-center">
                        {user.readBooks}{" "}
                        {user.readBooks > 1
                          ? `${reuseableTranslations.booksObjects.books[selectedLanguage]}`
                          : `${reuseableTranslations.booksObjects.book[selectedLanguage]}`}
                      </p>
                    </TableCell>
                    <TableCell
                      sx={{ color: "#fff" }}
                      component="th"
                      scope="row"
                    >
                      <p className="text-center">{user.lastReadBook}</p>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {expirationTime <= 0 && <><Top3Winners topWinners={suitableMembers} />
</>}
      {communityObject.createdBy.id === user.uid && expirationTime <= 0 && <button onClick={payoutTheWinningUser}>Send user money</button>}
    </>
  );
}

export default Ranking;