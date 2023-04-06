import './CreatedBy.css';

import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

function CreatedBy({ creatorName, creatorImg, createdDate, creatorProfileId }) {
  return (
    <div className="created-by">
      <h3>Created by:</h3>
      <div className="creator-info">
        <Link to={`/user/profile/${creatorProfileId}`}>
          <div className="creator-img">
            <img src={creatorImg} alt="" />
          </div>
        </Link>
        <p className="creator-name">{creatorName}</p>
        <p className="created-date">
          Created: {formatDistanceToNow(createdDate.toDate())} ago
        </p>
      </div>
    </div>
  );
}

export default CreatedBy;
