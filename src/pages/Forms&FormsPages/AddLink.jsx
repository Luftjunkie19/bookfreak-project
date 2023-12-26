/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import generateUniqueId from "react-id-generator";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";

import { Alert } from "@mui/material";

import alertMessages from "../../assets/translations/AlertMessages.json";
import formTranslations from "../../assets/translations/FormsTranslations.json";
import profileTranslations from "../../assets/translations/ProfileTranslations.json";
import Loader from "../../components/Loader";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useRealDatabase } from "../../hooks/useRealDatabase";
import useRealtimeDocument from "../../hooks/useRealtimeDocument";
import useRealtimeDocuments from "../../hooks/useRealtimeDocuments";

function AddLink() {
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const [option, setOption] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { getDocument } = useRealtimeDocument();
  const { getDocuments } = useRealtimeDocuments();
  const { addToDataBase } = useRealDatabase();
  const { user } = useAuthContext();
  const [document, setDocument] = useState(null);
  const [links, setLinks] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const documentObject = async () => {
    const doc = await getDocument("users", user.uid);

    if (doc) {
      setDocument(doc);
    }
  };

  const loadLinksObjects = async () => {
    const readerObjects = await getDocuments("links");

    const realObjects = readerObjects
      .map((bookReader) => {
        return bookReader;
      })
      .filter((reader) => reader.belongsTo === user.uid);

    setLinks(realObjects);
  };

  useEffect(() => {
    documentObject();
    loadLinksObjects();
  }, [documentObject, loadLinksObjects]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const uniqueId = generateUniqueId(
        `${option}${new Date().getTime()}${user.uid}`
      );

      if (option === "discord") {
        if (!link.match("^.{3,32}#[0-9]{4}$")) {
          setError(
            alertMessages.notifications.wrong.discordName[selectedLanguage]
          );
          setIsPending(false);
          return;
        }

        if (links.find((exLink) => exLink.mediaType === option)) {
          setError(alertMessages.notifications.wrong[selectedLanguage]);
          setIsPending(false);
          return;
        }

        addToDataBase("links", uniqueId, {
          mediaType: option,
          nickname: link,
          belongsTo: user.uid,
          id: uniqueId,
        });
      } else {
        if (
          !link.match(
            "/(https?://)?(www.)?[a-zA-Z0-9]+.[a-zA-Z]{2,}([/w .-]*)*/?/"
          )
        ) {
          setError(
            alertMessages.notifications.wrong.urlError[selectedLanguage]
          );
          setIsPending(false);
          return;
        }

        if (links.find((exLink) => exLink.mediaType === option)) {
          setError(alertMessages.notifications.wrong[selectedLanguage]);
          setIsPending(false);
          return;
        }

        addToDataBase("links", uniqueId, {
          mediaType: option,
          linkTo: link,
          belongsTo: user.uid,
          id: uniqueId,
        });
      }

      setError(null);
      setIsPending(false);
      navigate(`/profile/${user.uid}`);
      toast.info(
        `${alertMessages.notifications.successfull.create[selectedLanguage]}`
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const availableMedia = [
    { value: "discord", label: "discord" },
    { value: "spotify", label: "spotify" },
    { value: "youtube", label: "youtube" },
    { value: "github", label: "github" },
  ];

  return (
    <div className="min-h-full h-screen flex flex-col justify-center items-center">
      <form
        className="h-1/2 justify-around flex flex-col py-6 px-12"
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <h2 className="text-5xl font-bold text-white">
          {profileTranslations.addLinkForm.topText[selectedLanguage]}
        </h2>

        <label className="sm:w-full md:max-w-3xl">
          <span className="text-white">
            {profileTranslations.addLinkForm.query[selectedLanguage]}
          </span>
          <Select
            className="w-full"
            options={availableMedia}
            onChange={(e) => setOption(e.value)}
          />
        </label>
        {option === "discord" && (
          <label className="flex flex-col sm:w-full md:max-w-xl">
            <span className="text-white">
              {formTranslations.userFields.nickname[selectedLanguage]}:
            </span>
            <input
              className="input input-info w-full py-1"
              type="text"
              required
              placeholder={
                formTranslations.userFields.nickname[selectedLanguage]
              }
              onChange={(e) => setLink(e.target.value)}
            />
          </label>
        )}

        {option === "spotify" && (
          <>
            <label className="flex flex-col  sm:w-full md:max-w-xl">
              <span className="text-white">Link:</span>
              <input
                className="input input-info w-full py-1"
                type="text"
                placeholder={`${profileTranslations.addLinkForm.placeHolder[selectedLanguage]}`}
                required
                onChange={(e) => setLink(e.target.value)}
              />
            </label>
          </>
        )}

        {option === "youtube" && (
          <>
            <label className="flex flex-col  sm:w-full md:max-w-xl">
              <span className="text-white">Link:</span>
              <input
                className="input input-info w-full py-1"
                type="text"
                required
                placeholder={`${profileTranslations.addLinkForm.placeHolder[selectedLanguage]}`}
                onChange={(e) => setLink(e.target.value)}
              />
            </label>
          </>
        )}

        {option === "github" && (
          <>
            <label className="flex flex-col  sm:w-full md:max-w-xl">
              <span className="text-white">Link:</span>
              <input
                className="input input-info w-full py-1"
                type="text"
                required
                placeholder={`${profileTranslations.addLinkForm.placeHolder[selectedLanguage]}`}
                onChange={(e) => setLink(e.target.value)}
              />
            </label>
          </>
        )}

        {option === "" && (
          <p className="text-white">
            {profileTranslations.addLinkForm.selectType[selectedLanguage]}
          </p>
        )}

        {error && (
          <Alert className="bg-transparent" severity="error">
            {error}
          </Alert>
        )}
        <div className="w-full justify-center flex items-center">
          <button className="btn sm:w-full md:max-w-xl bg-accColor text-white">
            {profileTranslations.addLinkForm.btnText[selectedLanguage]}
          </button>
        </div>
      </form>

      {isPending && <Loader />}
    </div>
  );
}

export default AddLink;
