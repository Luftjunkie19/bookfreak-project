import "./Members.css";

import { Link } from "react-router-dom";

function Members({ members }) {
  return (
    <div className="members">
      <h3>Users on board:</h3>

      <p>{members.length} users</p>

      {members &&
        members.map((user, i) => (
          <>
            <Link to={`/user/profile/${user.value.id}`}>
              <div className="user">
                <div className="small-avatar" key={i}>
                  <img src={user.value.photoURL} alt="" />
                </div>
                <p>{user.value.nickname}</p>
              </div>
            </Link>
          </>
        ))}
    </div>
  );
}

export default Members;
