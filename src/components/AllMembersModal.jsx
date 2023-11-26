import React, { useState } from "react";

import { Button } from "flowbite-react";

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

function AllMembersModal({ users }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Show all members
      </Button>
      <Dialog onClick={handleClose} open={open}>
        <DialogTitle>{users.length} Members</DialogTitle>
        <List sx={{ pt: 0 }}>
          {users.length > 0 &&
            users.map((user) => (
              <ListItem disableGutters key={user.value.id}>
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
    </>
  );
}

export default AllMembersModal;
