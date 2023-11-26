import {
  Avatar,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";

function CompetitionMembers({
  open,
  handleClose,
  users,
  handleCreateRecommendation,
}) {
  return (
    <Dialog onClick={handleClose} open={open} className="z-[99999999]">
      <DialogTitle>
        {users.length > 0
          ? `${users.length} Members`
          : "No members besides you sadly."}
      </DialogTitle>
      <List sx={{ pt: 0 }}>
        {users.length > 0 &&
          users.map((user) => (
            <ListItem
              disableGutters
              key={user.value.id}
              onClick={() => {
                handleCreateRecommendation(user.value.id);
              }}
            >
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar src={user.value.photoURL} />
                </ListItemAvatar>
                <ListItemText primary={user.value.nickname} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Dialog>
  );
}

export default CompetitionMembers;
