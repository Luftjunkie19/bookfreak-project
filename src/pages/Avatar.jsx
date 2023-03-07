import "./Avatar.css";

function Avatar({ img, creator, creationDate }) {
  return (
    <div className="avatar">
      <div className="avatar-img">
        <img src={img} alt="" />
      </div>

      <div className="avatar-info">
        <p>Nickname: {creator}</p>

        <p>Created at: {creationDate}</p>
      </div>
    </div>
  );
}

export default Avatar;
