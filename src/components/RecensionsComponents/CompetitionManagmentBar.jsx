import '../../components/stylings/mui-stylings.css';

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

function CompetitionManagmentBar({applyFilters, applySort}) {
    const filterOptions = [{
        label:"prize (Money)", filter:(array)=>{
            return array.filter((doc)=>doc.prize.moneyPrize.amount > 0);
        }
    }, 
    {
        label:"prize (Item)", filter:(array)=>{
            return array.filter((doc)=>doc.prize.itemPrize.typeOfPrize !== undefined || doc.prize.itemPrize.typeOfPrize !== null);
        }
    }, 
    {
        label:"Type (Teach to fish)", filter:(array)=>{
            return array.filter((doc)=>doc.competitionsName === "Teach to fish");
        }
    }, 
    {
        label:"Type (Lift others, rise)", filter:(array)=>{
            return array.filter((doc)=>doc.competitionsName ==="Lift others, rise");
        }
    }, 
    {
        label:"Type (First Come, First Booked)",
        filter: (array) =>{
            return array.filter((doc)=>doc.competitionsName ==="First read, first served");
        },
    },
    {label:"Expired",filter:(array)=>{
      return array.filter((doc)=>doc.expiresAt < new Date().getTime());
    }},{
      label:"Not Expired",filter:(array)=>{
        return array.filter((doc)=> doc.expiresAt >= new Date().getTime())
      }
    }
      ];
    
      const sortOptions = [
        {
            label:"Time (Ascending)", 
            sort:(array)=>{
                return array.sort((a,b)=>b.createdBy.createdAt - a.createdBy.createdAt);
            }
        },
        {
            label:"Time (Descending)", 
            sort:(array)=>{
                return array.sort((a,b)=>a.createdBy.createdAt - b.createdBy.createdAt);
            }
        }
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
    <div className="flex flex-wrap justify-center items-center">
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

export default CompetitionManagmentBar