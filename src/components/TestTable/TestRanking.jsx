import '../stylings/mui-stylings.css';

import * as React from 'react';

import { Link } from 'react-router-dom';

import {
  Avatar,
  Box,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

function TestRanking({ rowData }) {
  const columns = [
    {
      field: "id",
      headerName: "Attempt Id",
      headerAlign: "center",
width: 100, minWidth: 150, maxWidth: 200,
      headerClassName: "bg-accColor w-full",
      cellClassName: "bg-white text-accColor border-accColor border-2",
    },
    {
      field: "player.photoURL",
      headerName: "Image",
  width: 100, minWidth: 150, maxWidth: 200,
      headerClassName: "bg-accColor",
      headerAlign: "center",
      cellClassName:
        "bg-white text-accColor border-accColor border-b-2 border-r-2",
      renderCell: (params) => {
        return (
          <>
            <Link to={`/profile/${params.row.player.uid}`}>
              <Avatar src={params.row.player.photoURL} />
            </Link>
          </>
        );
      },
    },
    {
      field: "player.nickname",
      headerClassName: "bg-accColor",
   width: 100, minWidth: 75, maxWidth: 200,
      headerAlign: "center",
      cellAlign: "center",
      cellClassName:
        "bg-white text-accColor text-xs font-semibold italic border-accColor border-b-2 border-r-2",
      headerName: "Nickname",
      renderCell: (params) => {
        return params.row.player.nickname;
      },
    },

    {
      field: "finalResult",
      headerClassName: "bg-accColor",
     width: 100, minWidth: 150, maxWidth: 200,
      cellClassName:
        "bg-white text-accColor font-bold border-b-2 border-accColor",
      type: "number",
      headerName: "Final Result",
      headerAlign: "center",
      renderCell: (params) => {
        return Math.floor(params.row.finalResult) + "%";
      },
    },

    {
      field: "timeOfGame",
      headerClassName: "bg-accColor",
      width: 100, minWidth: 150, maxWidth: 200,
      cellClassName:
        "bg-white text-accColor border-accColor border-l-2 border-r-2",
      headerName: "Solved in",
      headerAlign: "center",
      type: "number",
      renderCell: (params) => {
        return `${Math.floor(params.row.timeOfGame / 1000 / 60)}:${
          Math.floor(params.row.timeOfGame / 1000) % 60 < 10
            ? `0${Math.floor(params.row.timeOfGame / 1000) % 60}`
            : `${Math.floor((params.row.timeOfGame / 1000) % 60)}`
        }`;
      },
    },
  ];

  return (
    <Box sx={{maxWidth:576, width:"100%", }}>
      <DataGrid
        sx={{ fontFamily: "Montserrat",}}
        className="text-white bg-primeColor m-4"

        rows={rowData}
        columns={columns}
      />
    </Box>
  );
}

export default TestRanking;
