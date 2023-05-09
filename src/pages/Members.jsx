import "./Members.css";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Members({ members }) {
  return (
    <>
      <motion.div
        className="members"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {members &&
          members.map((user, i) => (
            <>
              <Link to={`/profile/${user.value.id}`}>
                <div className="user">
                  <div className="small-avatar" key={i}>
                    <img src={user.value.photoURL} alt="" />
                  </div>
                  <p>{user.value.nickname}</p>
                </div>
              </Link>
            </>
          ))}
      </motion.div>
    </>
  );
}

export default Members;
