import './AddLink.css';

import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';

import Loader from '../components/Loader';
import { useAuthContext } from '../hooks/useAuthContext';
import { useFirestore } from '../hooks/useFirestore';

function AddLink() {
  const [option, setOption] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const { addDocument } = useFirestore("links");

  const { user } = useAuthContext();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      if (option === "discord") {
        if (!link.includes("#")) {
          setError("Your dicord nickname is wrong, please check it ones again");
          setIsPending(false);
          return;
        }

        await addDocument({
          mediaType: option,
          nickname: link,
          addedBy: user.uid,
        });
      } else {
        await addDocument({
          mediaType: option,
          linkTo: link,
          addedBy: user.uid,
        });
      }

      setError(null);
      setIsPending(false);
      navigate(`/profile/${user.uid}`);
      toast.info("Link successfully added");

      console.log(option, link);
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
    <>
      <form onSubmit={handleSubmit}>
        <h2>Add Link, so people can contact you 😄</h2>

        <label>
          <span>What account would you like link to:</span>
          <Select
            options={availableMedia}
            onChange={(e) => setOption(e.value)}
          />
        </label>
        {option === "discord" && (
          <label>
            <span>Nickname:</span>
            <input
              type="text"
              required
              placeholder="Paste the your nickname"
              onChange={(e) => setLink(e.target.value)}
            />
          </label>
        )}

        {option === "spotify" && (
          <>
            <label>
              <span>Link:</span>
              <input
                type="text"
                placeholder="Paste the link here"
                required
                onChange={(e) => setLink(e.target.value)}
              />
            </label>
          </>
        )}

        {option === "youtube" && (
          <>
            <label>
              <span>Link:</span>
              <input
                type="text"
                required
                placeholder="Paste the link here"
                onChange={(e) => setLink(e.target.value)}
              />
            </label>
          </>
        )}

        {option === "github" && (
          <>
            <label>
              <span>Link:</span>
              <input
                type="text"
                required
                placeholder="Paste the link here"
                onChange={(e) => setLink(e.target.value)}
              />
            </label>
          </>
        )}

        {option === "" && <p>Select type</p>}

        {error && <p className="error">{error}</p>}

        <button className="btn">Add Link</button>
      </form>

      {isPending && <Loader />}
    </>
  );
}

export default AddLink;
