import {
  useEffect,
  useState,
} from 'react';

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
import { useAuthContext } from '../hooks/useAuthContext';
import { useRanking } from '../hooks/useRanking';
import { useRealDatabase } from '../hooks/useRealDatabase';
import useRealtimeDocument from '../hooks/useRealtimeDocument';
import useRealtimeDocuments from '../hooks/useRealtimeDocuments';
import Loader from './Loader';
import {
  BookCategoryChart,
  UserComparisonChart,
} from './ProfileComonents/charts/LineChart';
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
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  const { getDocuments } = useRealtimeDocuments();
  const { getDocument } = useRealtimeDocument();
  const { updateDatabase } = useRealDatabase();
  const { user } = useAuthContext();
  const [isPending, setIsPending] = useState(false);

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

  const { orderedMembers } = useRanking({
    readerObjects,
    communityMembers,
    communityObject,
    getReadBooks,
    getlastBookRead,
    expirationTimeNumber,
  });

  const payoutTheWinningUser = async () => {
    setIsPending(true);
    try {
      const winnerDoc = await getDocument("users", orderedMembers[0].id);
      const hostId = await getDocument("users", communityObject.createdBy.id);

      if (
        winnerDoc &&
        hostId &&
        communityObject.prize.moneyPrize &&
        !communityObject.prize.itemPrize
      ) {
        const payoutObject = await fetch(
          "http://127.0.0.1:5001/bookfreak-954da/us-central1/stripeFunctions/createTransferToWinner",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Connection: "keep-alive",
              Accept: "*",
            },
            body: JSON.stringify({
              winnerObject: winnerDoc,
              destinationId: winnerDoc.stripeAccountData.id,
              chargeId: communityObject.chargeId,
              amount: communityObject.prize.moneyPrize.amount,
              currency: hostId.stripeAccountData.default_currency.toUpperCase(),
              winnerCurrency:
                winnerDoc.stripeAccountData.default_currency.toUpperCase(),
              communityObject: communityObject,
            }),
          }
        );
        const payoutFullfilled = await payoutObject.json();
        console.log(payoutFullfilled);
        setIsPending(false);
      }
    } catch (err) {
      setIsPending(false);
      console.log(err);
    }
  };

  const confirmClaimingPrize = () => {
    setIsPending(true);
    if (communityObject.prize.itemPrize) {
      updateDatabase(
        { ...communityObject, prizeHandedIn: true },
        "competitions",
        communityObject.id
      );
    }
    setIsPending(false);
  };

  const filteredReaders=()=>{
let array=[];
    readerObjects.map((reader)=>{
      const isMember= communityMembers.find((member)=>member.value.id === reader.id);
  
      if(isMember){
        array.push(readerObjects.find((reader)=>reader.id === isMember.value.id));
      }else{
        return;
      }
      
    });
    return array;
  }
  
  const filteredBooks = () => {
    const filteredReadersArray = filteredReaders(); // Get the filtered readers first
    let array = [];
  
    books.forEach((book) => {
      const isBook = filteredReadersArray.find((reader) => reader.bookReadingId === book.id);
  
      if (isBook) {
        array.push(book);
      }
    });
  
    return array;
  };
  


  return (
    <div className="w-full flex-col flex">
      {isPending && <Loader />}

      {(expirationTime > 0 || !expirationTime) && (
        <TableContainer
          component={Paper}
          className="sm:w-full lg:max-w-lg xl:max-w-2xl 2xl:max-w-4xl bg-accColor  self-center"
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
              {orderedMembers.length > 0 &&
                orderedMembers.map((user) => (
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

      {!communityObject?.id.includes("readersClub") && expirationTime <= 0 && (
        <div className="flex flex-col w-full justify-center items-center">
          <Top3Winners topWinners={orderedMembers} />
          {user.uid === orderedMembers[0]?.id &&
            expirationTime <= 0 &&
            !communityObject?.prizeHandedIn &&
            communityObject?.prize?.moneyPrize?.amount > 0 && (
              <button
                className="btn text-yellow-400 bg-accColor hover:bg-yellow-400 hover:text-accColor max-w-xs"
                onClick={payoutTheWinningUser}
              >
                {reuseableTranslations.claimPrize[selectedLanguage]}
              </button>
            )}
          {!communityObject?.id?.includes("readersClub") &&
            !communityObject?.prizeHandedIn &&
            communityObject?.prize?.itemPrize &&
            user.uid === orderedMembers[0]?.id &&
            expirationTime <= 0 && (
              <button
                className="btn text-yellow-400 bg-accColor hover:bg-yellow-400 hover:text-accColor max-w-xs"
                onClick={confirmClaimingPrize}
              >
           {reuseableTranslations.claimPrize[selectedLanguage]}
              </button>
            )}
        </div>
      )}



      {filteredReaders().length > 0 && (
        <div className="flex flex-wrap gap-1">
          <UserComparisonChart
            readerObjects={filteredReaders()}
            bookObjects={filteredBooks()}
          />
          <BookCategoryChart
            readerObjects={filteredReaders()}
            bookObjects={filteredBooks()}
          />
        </div>
      )}
    </div>
  );
}

export default Ranking;
