import "../../pages/stylings/backgrounds.css";

import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { Link } from "react-router-dom";

import { useCollection } from "../../hooks/useCollection";

function HomeCompetitions() {
  const { documents } = useCollection("competitions");

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
    <div className="sm:grid sm:grid-flow-col snap-always snap-inline sm:overflow-x-auto lg:overflow-visible sm:auto-cols-[71%] md:auto-cols-[59%] snap-inline lg:flex lg:flex-row w-full 2xl:justify-around items-center gap-4 p-4">
      {slicedDocuments && slicedDocuments.length ? (
        slicedDocuments.map((doc) => (
          <Link
            to={`/competition/${doc.id}`}
            key={doc.id}
            className="flex lg:w-2/5 2xl:w-1/6 xl:w-3/10 snap-start flex-col py-4 rounded-lg text-white bg-accColor shadow-md hover:shadow-lg hover:bg-lightModeCol hover:text-accColor hover:shadow-black transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex flex-col justify-around px-2">
              <h3 className="text-lg font-semibold">{doc.competitionTitle}</h3>
              <p>{doc.competitionsName}</p>
              <p>
                Est. {formatDistanceToNow(doc.createdBy.createdAt.toDate())} ago
              </p>
            </div>
            <div className="avatar-group mt-2 w-full justify-center">
              {doc.users &&
                doc.users.slice(0, 3).map((user, index) => (
                  <div key={index} className="avatar">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={user.value.photoURL}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                ))}
              {doc.users.length - 3 > 0 && (
                <div className="avatar">
                  <div className="w-12 h-12 bg-neutral-focus text-neutral-content rounded-full text-center flex items-center justify-center">
                    <span className="mt-4">+{doc.users.length - 3}</span>
                  </div>
                </div>
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
