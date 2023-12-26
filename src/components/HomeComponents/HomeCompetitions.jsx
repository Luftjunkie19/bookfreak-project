import '../../pages/stylings/backgrounds.css';

import {
  useEffect,
  useState,
} from 'react';

import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

import itemReward from '../../assets/ItemReward.webp';
import moneyPrize from '../../assets/MoneyPrize.webp';
import useRealtimeDocuments from '../../hooks/useRealtimeDocuments';

function HomeCompetitions() {
  const { getDocuments } = useRealtimeDocuments();
  const [documents, setElements] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadElements = async () => {
    const booksEl = await getDocuments("competitions");
    setElements(booksEl);
  };

  useEffect(() => {
    loadElements();
  }, []);

  const getNumber = () => {
    if (document.body.clientWidth > 0 && document.body.clientWidth < 768) {
      return 7;
    }
    if (document.body.clientWidth >= 768 && document.body.clientWidth <= 1024) {
      return 3;
    }
    if (document.body.clientWidth > 1024 && document.body.clientWidth <= 1440) {
      return 4;
    } else {
      return 5;
    }
  };

  const slicedDocuments = documents.slice(0, getNumber());

  return (
    <div className="sm:grid sm:grid-flow-col snap-always snap-inline sm:auto-cols-[83%] md:auto-cols-[67%] sm:overflow-x-auto lg:flex lg:items-center w-full py-8 px-4 gap-5">
      {slicedDocuments && slicedDocuments.length ? (
        slicedDocuments.map((doc) => (
          <Link
            to={`/competition/${doc.id}`}
            key={doc.id}
            className={`flex ${
              (doc.expiresAt - new Date().getTime()) / 86400000 <= 0 &&
              "bg-gray-500 text-black"
            } lg:w-2/5 2xl:w-1/6 xl:w-3/10 border-2 border-white justify-between items-center snap-start flex-row py-4 rounded-lg text-white bg-accColor shadow-md hover:shadow-lg hover:bg-lightModeCol hover:text-accColor hover:shadow-black transition-all duration-300 hover:-translate-y-1`}
          >
            <div className="flex flex-col justify-around px-2">
              <h3 className=" font-semibold">{doc.competitionTitle}</h3>
              <p>{doc.competitionsName}</p>
              <p>
                Prize:{" "}
                <span className=" font-bold text-lg">
                  {doc.prize.moneyPrize.amount > 0
                    ? `${(doc.prize.moneyPrize.amount / 100).toFixed(
                        2
                      )} ${doc.prize.moneyPrize.currency.toUpperCase()}`
                    : doc.prize.itemPrize.typeOfPrize}
                </span>
              </p>
              <p>Est. {formatDistanceToNow(doc.createdBy.createdAt)} ago</p>
            </div>
            <div>
              {doc.prize.moneyPrize.amount > 0 ? (
                <img src={moneyPrize} className="w-12 h-12" alt="" />
              ) : (
                <img src={itemReward} className="w-12 h-12" alt="" />
              )}
            </div>
          </Link>
        ))
      ) : (
        <p>No competitions added yet</p>
      )}
    </div>
  );
}

export default HomeCompetitions;
