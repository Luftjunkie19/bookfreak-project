import "./SearchFor.css";
import "./Home.css";

import { useRef, useState } from "react";

import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useCollection } from "../hooks/useCollection";

function SearchFor() {
  const { id } = useParams();
  const [searchedResults, setSearchedResults] = useState([]);
  const [searchedPhrase, setSearchedPhrase] = useState("");

  const { documents } = useCollection(id);
  const searchedParam = useRef();

  const handleSearch = () => {
    const searchedFor = searchedParam.current.value.toLowerCase();

    if (searchedFor.trim() === "") {
      toast.error("You have to type anything.");
      return;
    }

    const searchedArray = documents.filter((doc) => {
      return id === "books"
        ? doc.title.toLowerCase().includes(searchedFor)
        : doc.nickname.toLowerCase().includes(searchedFor);
    });

    setSearchedResults(searchedArray);
    setSearchedPhrase(searchedFor);
  };

  document.addEventListener("keyup", (e) => {
    if (e.target.keyCode === "enter") {
      handleSearch();
    }
  });

  return (
    <div className="side">
      <motion.div
        className="search-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="control-search">
          <label className="search-input-holder">
            <span>Search for {id}:</span>
            <input
              className="search-input"
              type="text"
              ref={searchedParam}
              placeholder={
                id === "users" ? `Enter user's nickname` : "Enter book's title"
              }
            />
          </label>

          <button className="btn" onClick={handleSearch}>
            <FaSearch /> Search
          </button>
        </div>
        <p className="searched-phrase">Searched param is: {searchedPhrase} </p>

        <div className={searchedResults.length > 0 ? "results-container" : ""}>
          {id === "users" && (
            <>
              {searchedResults.length > 0 ? (
                searchedResults.map((res) => (
                  <>
                    <Link to={`/user/profile/${res.id}`}>
                      <div className="result">
                        <div className="result-img">
                          <img src={res.photoURL} alt="" />
                        </div>
                        <h5>{res.nickname}</h5>
                      </div>
                    </Link>
                  </>
                ))
              ) : (
                <>
                  <h2 className="info-empty">
                    {searchedPhrase.trim() === ""
                      ? "Type anything to find who you want."
                      : `No results for: ${searchedPhrase}`}
                  </h2>
                </>
              )}
            </>
          )}

          {id === "books" && (
            <>
              {searchedResults.length > 0 ? (
                searchedResults.map((res) => (
                  <>
                    <Link to={`/book/${res.id}`}>
                      <div className="result">
                        <div className="result-img">
                          <img src={res.photoURL} alt="" />
                        </div>
                        <h5>{res.title}</h5>
                      </div>
                    </Link>
                  </>
                ))
              ) : (
                <>
                  <h2 className="info-empty">
                    {id === "books" && searchedPhrase.trim() === ""
                      ? "Type anything to find who you want."
                      : `No results for: ${searchedPhrase}`}
                  </h2>
                </>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default SearchFor;
