import {
  useEffect,
  useState,
} from 'react';

import { Timestamp } from 'firebase/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { FaUsers } from 'react-icons/fa';
import {
  useNavigate,
  useParams,
} from 'react-router';
import CreatableSelect from 'react-select';
import { toast } from 'react-toastify';

import { useAuthContext } from '../hooks/useAuthContext';
import { useCollection } from '../hooks/useCollection';
import { useDocument } from '../hooks/useDocument';
import { useFirestore } from '../hooks/useFirestore';
import { usePushNotifications } from '../hooks/usePushNotifications';

function EditClub() {
  const { id } = useParams();
  const { document } = useDocument("clubs", id);
  const { user } = useAuthContext();
  const [clubsName, setClubsName] = useState("");
  const [error, setError] = useState("");
  const [attachedUsers, setAttachedUsers] = useState([]);
  const [description, setDescription] = useState("");
  const [clubLogo, setClubLogo] = useState(null);
  const { documents } = useCollection("users");
  const { updateDocument } = useFirestore("clubs");
  const navigate = useNavigate();
  const { pushNotification } = usePushNotifications();

  console.log(document);

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

  useEffect(() => {
    if (document) {
      setClubsName(document.clubsName);
      setClubLogo(document.clubLogo);
      setDescription(document.description);
      setAttachedUsers(document.users.slice(1, document.users.length));
    }
  }, [document]);

  const handleSelect = (e) => {
    setError(null);
    setClubLogo(null);
    let selected = e.target.files[0];

    if (selected.size > 200000) {
      setError("Too big file's been uploaded.");
      return;
    }

    if (!selected.type.includes("image")) {
      setError("Inappropriate type of file.");
      return;
    }

    if (!selected) {
      setError("Select any image, you have.");
      return;
    }

    setError(null);
    setClubLogo(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (clubLogo.name) {
        const uploadPath = `clubLogo/uid${user.uid}/${clubLogo.name}`;

        const storage = getStorage();

        const image = ref(storage, uploadPath);

        const snapshot = await uploadBytes(image, clubLogo);
        const photoURL = await getDownloadURL(image);

        await updateDocument(id, {
          clubsName: clubsName,
          clubLogo: photoURL,
          messages: document.messages,
          description,
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
        });

        attachedUsers.map(async (member) => {
          await pushNotification({
            notificationContent: `${user.displayName} has comitted some changes in ${clubsName} club`,
            directedTo: member.value.id,
            linkTo: `readers-clubs/${id}`,
            isRead: false,
            notificationTime: Timestamp.fromDate(new Date()),
            changeConcering: user.photoURL,
          });
        });

        navigate(`/readers-clubs/${id}`);
        toast.success("Club successfully updated");
      } else {
        await updateDocument(id, {
          clubsName: clubsName,
          clubLogo: clubLogo,
          messages: document.messages,
          description,
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
        });

        console.log(attachedUsers);

        attachedUsers.map(async (member) => {
          await pushNotification({
            notificationContent: `${user.displayName} has comitted some changes in ${clubsName} club`,
            directedTo: member.value.id,
            linkTo: `readers-clubs/${id}`,
            isRead: false,
            notificationTime: Timestamp.fromDate(new Date()),
            changeConcering: user.photoURL,
          });
        });

        navigate(`/readers-clubs/${id}`);
        toast.success("Club successfully updated");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>
        Wanna update the Club? <FaUsers />
      </h2>
      <p>Here you are 🤓!</p>

      <label>
        <span>Club's name:</span>
        <input
          type="text"
          required
          value={clubsName}
          onChange={(e) => setClubsName(e.target.value)}
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
            console.log(e);
          }}
        />
      </label>

      <label>
        <span>Club's logo: </span>
        <input type="file" onChange={handleSelect} />
      </label>

      <label>
        <span>Description:</span>
        <textarea
          required
          placeholder="Tell the users, what are you in this club doing."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </label>

      {error && <p className="wrong">{error}</p>}

      <button className="btn">Update Club</button>
    </form>
  );
}

export default EditClub;
