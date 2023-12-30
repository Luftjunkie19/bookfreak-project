import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';

import typesTranslation from '../../assets/translations/TypesTranslations.json';

function BooksManagmentBar({applyFilters, applySort, sortText, filterText}) {
  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  const filterOptions=[
    {
      filter:(array)=>{
        return array.filter((book) => book.category ===  "Fiction");
      },
      label: typesTranslation.bookFilter.fiction[selectedLanguage],
    },
    {
      filter: (array)=>{
        return array.filter((book) => book.category === "Non-fiction");
      },
      label: typesTranslation.bookFilter["non-fiction"][selectedLanguage],
    },
    {
      filter:  (array)=>{
        return array.filter((book) => book.category === "Crime");
      },
      label: typesTranslation.bookFilter.crime[selectedLanguage],
    },
    {
      filter:  (array)=>{
        return array.filter((book) => book.category === "Science fiction and fantasy");
      },
      label: typesTranslation.bookFilter.scienceFF[selectedLanguage],
    },
    {
      filter: (array)=>{
        return array.filter((book) => book.category === "Children's and young adult literature");
      },
      label: typesTranslation.bookFilter.cayal[selectedLanguage],
    },
    {
      filter: (array)=>{
        return array.filter((book) => book.category === "Travel and adventure literature");
      },
      label: typesTranslation.bookFilter.travelaal[selectedLanguage],
    },
    {
      filter: (array)=>{
        return array.filter((book) => book.category === "Popular science and popular history");
      },
      label: typesTranslation.bookFilter.popularScience[selectedLanguage],
    },
    {
      filter: (array)=>{
        return array.filter((book) => book.category === "Self-help and personal development");
      },
      label: typesTranslation.bookFilter.selfHelp[selectedLanguage],
    },
    {
      filter:  (array)=>{
        return array.filter((book) => book.category === "History and culture");
      },
      label: typesTranslation.bookFilter.history[selectedLanguage],
    },
    {
      filter:  (array)=>{
        return array.filter((book) => book.category === "Art and design");
      },
      label: typesTranslation.bookFilter.artDesign[selectedLanguage],
    },
    {
      filter:  (array)=>{
        return array.filter((book) => book.category === "Business and economics");
      },
      label: typesTranslation.bookFilter.Business[selectedLanguage],
    },
    {
      filter: (array)=>{
        return array.filter((book) => book.category === "Psychology and philosophy");
      },
      label: typesTranslation.bookFilter.Psychology[selectedLanguage],
    },
    {
      filter:  (array)=>{
        return array.filter((book) => book.category === "Health and medicine");
      },
      label: typesTranslation.bookFilter.Health[selectedLanguage],
    },
    {
      filter:   (array)=>{
        return array.filter((book) => book.category === "Erotic literature");
      },
      label: typesTranslation.bookFilter.Erotic[selectedLanguage],
    },
  ];

  const sortOptions=[
     {
    label: typesTranslation.bookSort.Default[selectedLanguage],
    sort: (array) => array.slice().sort((a, b) => a.title - b.title),
  },
  {
    label: typesTranslation.bookSort.pagesDescending[selectedLanguage],
    sort: (array) => array.slice().sort((a, b) => b.pagesNumber - a.pagesNumber),
  },
  {
    label: typesTranslation.bookSort.pagesAscending[selectedLanguage],
    sort: (array) => array.slice().sort((a, b) => a.pagesNumber - b.pagesNumber),
  },
  ];

  const [sortSelected, setSort] = useState("");

  const [filtersSelected, setFilters] = useState([]);

  const handleChange = (event) => {
      const {
        target: { value },
      } = event;
      setFilters(value);
      applyFilters(value); // Apply selected filters to recensions
    };
  
    const handleSortChange = (event) => {
      const {
        target: { value },
      } = event;
      setSort(value);
      applySort(value); // Apply selected sort to recensions
    };



  return (
    <div>
    <FormControl sx={{ m: 1, width: 300 }} className="text-white">
<InputLabel
  className="text-white"
  id="demo-multiple-name-label"
  sx={{ ":placeholder-shown": { color: "white" } }}
>
  {filterText}
</InputLabel>
<Select
  labelId="demo-multiple-chip-label"
  id="demo-multiple-chip"
  sx={{
    backgroundColor: "rgba(66, 102, 181, 0.7)",
    ":active": { borderColor: "white" },
  }}
  multiple
  defaultValue=""
  value={filtersSelected}
  onChange={handleChange}
  input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
  renderValue={(selected) => (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
      {selected.map((value) => (
        <Chip key={value} label={value} className=" text-white" />
      ))}
    </Box>
  )}
>
  {filterOptions.map((option) => (
    <MenuItem
      value={option.label}
      key={option.label}
      className="flex w-full items-center gap-3 "
      
      sx={{
        backgroundColor: "#4267B5",
        gap: 3,
        color: "white",
        ":hover": {
          backgroundColor: "#4253B5",
        },
      }}
    >
  {option.label}
    </MenuItem>
  ))}
</Select>
</FormControl>

<FormControl sx={{ m: 1, width: 300 }}>
<InputLabel className="text-white" id="demo-simple-select-label">
  {sortText}
</InputLabel>
<Select
  sx={{
    backgroundColor: "rgba(66, 102, 181, 0.7)",
    color: "white",
    ":active": { borderColor: "white" },
  }}
  labelId="demo-simple-select-label"
  id="demo-simple-select"
  value={sortSelected}
  label="Sort by"
  onChange={handleSortChange}
>
  {sortOptions.map((option) => (
    <MenuItem value={option.label} key={option.label}>
      {option.label}
    </MenuItem>
  ))}
</Select>
</FormControl>
</div>
  )
}

export default BooksManagmentBar