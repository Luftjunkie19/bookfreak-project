import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { List, ListItem, ListItemText, Menu, MenuItem } from "@mui/material";

import translations from "../../assets/translations/navbarTranslations.json";
import { languageActions } from "../../context/LanguageContext";

function LanguageSelect() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const selectedLangugage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );
  const dispatch = useDispatch();

  const handleMenuItemClick = (event, unicode) => {
    console.log(unicode);
    dispatch(languageActions.selectLanguage(unicode));

    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const options = [
    { unicode: "eng", flagUrl: "https://flagcdn.com/w40/gb.png" },
    { unicode: "ger", flagUrl: "https://flagcdn.com/w40/de.png" },
    { unicode: "pl", flagUrl: "https://flagcdn.com/w40/pl.png" },
  ];

  return (
    <div>
      <List component="nav" aria-label="Device settings">
        <ListItem
          button
          id="lock-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-label={translations.languageSelection[selectedLangugage]}
          aria-expanded={open ? "true" : undefined}
          onClick={handleClickListItem}
          className="flex gap-3"
        >
          <img
            src={`${
              options.find((item) => item.unicode === selectedLangugage).flagUrl
            }`}
            alt=""
          />
          <ListItemText
            primary={`${translations.languageSelection[selectedLangugage]}`}
          />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        className="z-[999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999]"
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "lock-button",
          role: "listbox",
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            className="flex gap-4 items-center "
            key={option.flagUrl}
            onClick={(event) => handleMenuItemClick(event, option.unicode)}
          >
            <img src={`${option.flagUrl}`} alt="" />
            {translations.languageSelection[option.unicode]}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default LanguageSelect;
