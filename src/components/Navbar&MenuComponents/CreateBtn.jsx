import { useState } from "react";

import { FaBook, FaPlusCircle, FaUserFriends } from "react-icons/fa";
import { GiPodiumWinner } from "react-icons/gi";
import { PiExamFill } from "react-icons/pi";
import { Link } from "react-router-dom";

import { Button, Divider, Menu, MenuItem } from "@mui/material";

function CreateBtn() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        className="bg-transparent sm:text-xl xl:text-2xl gap-4"
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
      >
        <FaPlusCircle />
      </Button>
      <Menu
        className="z-[9999999999999999999999999999999999999999999999999999999999999999999]"
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Link to="/create/competition">
          <MenuItem
            onClick={handleClose}
            className="flex w-full justify-between"
          >
            Competition <GiPodiumWinner />
          </MenuItem>
        </Link>
        <Link to="/create/club">
          <MenuItem
            onClick={handleClose}
            className="flex w-full justify-between"
          >
            Club <FaUserFriends />
          </MenuItem>
        </Link>
        <Divider sx={{ my: 0.5 }} />
        <Link to="/create/book">
          <MenuItem
            onClick={handleClose}
            className="flex w-full justify-between"
          >
            Book <FaBook />
          </MenuItem>
        </Link>
        <Link to="/create/test">
          <MenuItem
            onClick={handleClose}
            className="flex w-full justify-between"
          >
            Test <PiExamFill />
          </MenuItem>
        </Link>
      </Menu>
    </div>
  );
}

export default CreateBtn;
