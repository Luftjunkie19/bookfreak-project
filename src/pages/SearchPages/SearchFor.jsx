import {
  useEffect,
  useState,
} from 'react';

import Lottie from 'lottie-react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import {
  Link,
  useSearchParams,
} from 'react-router-dom';

import lottieAnimation
  from '../../assets/lottieAnimations/Animation - 1699294838586.json';
import translations from '../../assets/translations/SearchTranslations.json';
import useRealtimeDocuments from '../../hooks/useRealtimeDocuments';

function SearchFor() {
  const { id } = useParams();
  const [queries, setQueries] = useSearchParams({ q: "" });
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const query = queries.get("q");
  const { getDocuments } = useRealtimeDocuments();
  const [elements, setElements] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadElements = async () => {
    const booksEl = await getDocuments(id);
    setElements(booksEl);
  };

  useEffect(() => {
    loadElements();
  }, [loadElements]);

  const searchedArray = elements.filter((doc) => {
    return id === "books"
      ? doc.title.toLowerCase().includes(query.toLocaleLowerCase())
      : doc.nickname.toLowerCase().includes(query.toLocaleLowerCase());
  });

  return (
    <div className="min-h-screen h-full">
      <label className="flex flex-col py-4 text-white w-full p-2">
        <span>
          {id === "users"
            ? `${translations.searchInput.label[selectedLanguage]}`
            : `${translations.searchInput.labelBooks[selectedLanguage]}`}
          {query}:
        </span>
        <input
          className="outline-none border-none py-3 px-4 rounded md:w-1/2 sm:w-full"
          type="text"
          id="q"
          value={query}
          onInput={(e) => {
            setQueries(
              (prev) => {
                prev.set("q", e.target.value);
                return prev;
              },
              { replace: true }
            );
          }}
          placeholder={
            id === "users"
              ? `${translations.searchInput.placeholderUsers[selectedLanguage]}`
              : `${translations.searchInput.placeholderBooks[selectedLanguage]}`
          }
        />
      </label>

      <p className="text-center">
        {translations.searchedParam[selectedLanguage]} {query}
      </p>

      <div
        className={
          searchedArray.length > 0
            ? "flex flex-wrap justify-center items-center gap-5 p-4 w-full"
            : "flex justify-center items-center"
        }
      >
        {id === "users" && (
          <>
            {searchedArray.length > 0 ? (
              searchedArray.map((res) => (
                <>
                  <Link to={`/user/profile/${res.id}`}>
                    <div className="relative top-0 left-0 sm:w-32 sm:h-32 lg:w-48 lg:h-48 overflow-hidden group cursor-pointer transition-all duration-500">
                      <img
                        className="w-full h-full object-cover rounded-md"
                        src={res.photoURL}
                        alt=""
                      />

                      <div className="transition-all duration-500 absolute top-0 left-0 translate-y-full rounded-md w-full h-full bg-imgCover group-hover:translate-y-0 flex justify-center items-center">
                        <h1 className="transition-all duration-500 scale-0 opacity-0 translate-y-full delay-500 group-hover:opacity-100 group-hover:mt-0 group-hover:scale-100 group-hover:translate-y-0 text-white sm:text-sm lg:text-lg text-center font-semibold">
                          {res.nickname}
                        </h1>
                      </div>
                    </div>
                  </Link>
                </>
              ))
            ) : (
              <div className="flex flex-col justify-center items-center">
                <h2 className="text-3xl py-2 font-extralight">
                  {query.trim() === ""
                    ? "Type anything to find who you want."
                    : `${translations.noResults[selectedLanguage]} ${query}`}
                </h2>

                <Lottie animationData={lottieAnimation} />
              </div>
            )}
          </>
        )}

        {id === "books" && (
          <>
            {searchedArray.length > 0 ? (
              searchedArray.map((res) => (
                <>
                  <Link
                    to={`/book/${res.id}`}
                    className="flex flex-col sm:w-48 h-80 gap-2 bg-accColor"
                  >
                    <div className="w-full">
                      <img
                        className="w-full h-full object-cover"
                        src={res.photoURL}
                        alt=""
                      />
                    </div>

                    <div className="px-1 justify-self-center self-center">
                      <h5 className="lg:text-base sm:text-sm text-white font-semibold">
                        {res.title.trim("").length > 15
                          ? `${res.title.slice(0, 15)}...`
                          : res.title}
                      </h5>
                      <p className=" font-medium">
                        {res.author.trim("").length > 10
                          ? `${res.author.slice(0, 10)}...`
                          : res.author}
                      </p>
                      <p>{res.pagesNumber} Pages</p>
                      <p className="text-xs">
                        {res.category && res.category.split(" ").length > 3
                          ? `${res.category.slice(0, 24)}...`
                          : res.category}
                      </p>
                    </div>
                  </Link>
                </>
              ))
            ) : (
              <>
                <h2 className="text-3xl py-2 font-extralight">
                  {id === "books" && query.trim() === ""
                    ? "Type anything to find who you want."
                    : `${translations.noResults[selectedLanguage]}: ${query}`}
                </h2>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SearchFor;
