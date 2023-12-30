import React, { useState } from 'react';

import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';

function TestsManagmentBar({applyFilters, applySort}) {

const sortOptions=[{label:"Test's name (Z-A)", sort:()=>{}}, {label:"Test's name (A-Z)", sort:()=>{}}];
const filterOptions=[{label:"Queries <= 10", filter:(array)=>{
  return array.filter(test => Object.values(test.queries).length <=10);
}}, {label:"Queries >= 10", filter:(array)=>{
  return array.filter(test => Object.values(test.queries).length >= 10);
}}];

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
          Filters
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
          Sort by
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

export default TestsManagmentBar