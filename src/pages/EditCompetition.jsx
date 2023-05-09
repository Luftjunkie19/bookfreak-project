import React, { useEffect, useState } from "react";

import { Timestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router";
import CreatableSelect from "react-select";
import { toast } from "react-toastify";

import Loader from "../components/Loader";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCollection } from "../hooks/useCollection";
import { useFirestore } from "../hooks/useFirestore";
import { useFormData } from "../hooks/useFormData";
import { usePushNotifications } from "../hooks/usePushNotifications";

function EditCompetition() {
  const { id } = useParams();
  const { pushNotification } = usePushNotifications();
  const { document } = useFormData("competitions", id);
  const { user } = useAuthContext();
  const [title, setTitle] = useState("");
  const [competitionsName, setCompetitionsName] = useState("");
  const [error, setError] = useState("");
  const [expirationDate, setExpirationDate] = useState(null);
  const [attachedUsers, setAttachedUsers] = useState([]);
  const [description, setDescription] = useState("");
  const { documents } = useCollection("users");
  const [isPending, setIsPending] = useState(false);
  const { updateDocument } = useFirestore("competitions");
  const navigate = useNavigate();

  useEffect(() => {
    if (document) {
      setTitle(document.competitionTitle);
      setCompetitionsName(document.competitionsName);
      setAttachedUsers(document.users.slice(1, document.users.length));
      setDescription(document.description);
      setExpirationDate(document.expiresAt.toDate());
    }
  }, [document]);

  const notCurrentUsers = documents.filter((doc) => {
    return doc.id !== user.uid;
  });

  let usersAvailable = notCurrentUsers.map((user) => {
    return {
      label: user.nickname,
      value: {
        nickname: user.nickname,
        id: user.id,
        photoURL: user.photoURL,
      },
    };
  });

  const competitionTypes = [
    { value: "First read, first served", label: "First read, first served" },
    {
      value: "Lift others, rise",
      label: "Lift others, rise",
    },
    { value: "Teach to fish", label: "Teach to fish" },
  ];

  const editCompetition = async (e) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    await updateDocument(id, {
      competitionTitle: title,
      competitionsName,
      messages: document.messages,
      expiresAt: Timestamp.fromDate(expirationDate),
      users: [
        {
          label: user.displayName,
          value: {
            nickname: user.displayName,
            id: user.uid,
            photoURL: user.photoURL,
          },
        },
        ...attachedUsers,
      ],
      description,
      createdBy: {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: Timestamp.fromDate(new Date()),
        id: user.uid,
      },
    });

    setError(null);
    setIsPending(false);
    navigate(`/competition/${id}`);
    toast.success("Competition updated successfully");

    attachedUsers.map(async (member) => {
      await pushNotification({
        notificationContent: `${user.displayName} has comitted some changes in ${title} competition`,
        directedTo: member.value.id,
        linkTo: `competition/${id}`,
        isRead: false,
        notificationTime: Timestamp.fromDate(new Date()),
        changeConcering: user.photoURL,
      });
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <form onSubmit={editCompetition}>
          <h2>Wanna make some changes?</h2>
          <p>Here you are 😄 !</p>

          <label>
            <span>Title:</span>
            <input
              type="text"
              required
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </label>

          <label>
            <span>Competition's type:</span>
            <CreatableSelect
              required
              className="select-input"
              isClearable
              isSearchable
              options={competitionTypes}
              onChange={(e) => setCompetitionsName(e.value)}
            />
            <small>Current competition's type: {competitionsName}</small>
          </label>

          <label>
            <span>Expiration date:</span>
            <input
              className="input-date"
              type="date"
              value={expirationDate}
              onChange={(e) => {
                setExpirationDate(new Date(e.target.value));
              }}
            />
          </label>

          <label>
            <span>Users:</span>
            <CreatableSelect
              required
              className="select-input"
              isClearable
              isSearchable
              isMulti
              options={usersAvailable}
              value={attachedUsers}
              onChange={(e) => {
                setAttachedUsers(e);
              }}
            />
          </label>

          <label>
            <span>Description:</span>
            <textarea
              required
              placeholder="What's this competition about, what's to win?"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            ></textarea>
          </label>

          {error && <p className="wrong">{error}</p>}

          <button className="btn">Update Competition</button>
        </form>
      </motion.div>
      {isPending && <Loader />}
    </>
  );
}

export default EditCompetition;
