import '../../stylings/mui-stylings.css';

import React from 'react';

import { useSelector } from 'react-redux';

import { PieChart } from '@mui/x-charts';

import useGetDocuments from '../../../hooks/useGetDocuments';

function ChartPie({ yourReadersBooks }) {
const {documents:booksObjects} = useGetDocuments("books");

const books = booksObjects.filter((book, i) => book.id === yourReadersBooks[i]?.bookReadingId);
   



  const transformBooks = (books) => {
    const transformedBooks = {};

    books.forEach((book) => {
      const { category } = book;

      if (!transformedBooks[category]) {
        transformedBooks[category] = 1; // Initialize with 1 book
      } else {
        transformedBooks[category] += 1; // Increment the number of books in the category
      }
    });

    // Convert the transformedBooks object into an array of objects
    const result = Object.entries(transformedBooks).map(
      ([category, count]) => ({
        category,
        count,
      })
    );

    return result;
  };

  // Usage
  const transformedBooksArray = transformBooks(books);
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  return (
    <>
      <PieChart 
        colors={[
          "#4267B5",
          "#800000",
          "#424549",
          "#1DB954",
          "#333",
          "#F5F5F5",
          "#46DF35",
          "#1a2339",
          "#FF5733",
          "#8A2BE2",
          "#FFD700",
          "#2E8B57",
          "#9932CC",
          "#FF4500",
          "#008080",
          "#FF6347",
          "#20B2AA",
          "#DC143C",
          "#00CED1",
          "#8B4513",
          "#008000",
          "#FF69B4",
          "#191970",
          "#8B008B",
          "#228B22",
          "#4B0082",
          "#00FF7F",
          "#800080",
          "#4682B4",
          "#00FA9A",
        ]}
        series={[
          {
            startAngle: -180,
            highlightScope: { faded: "global", highlighted: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            data: transformedBooksArray.map((book, i) => {
              return { id: book.id, label: book.category, value: book.count };
            }),
          },
        ]}
        slotProps={{
          legend: {
            direction: "row",
            position: { vertical: "bottom", horizontal: "middle" },
            labelStyle: {
              color:`${isDarkModed ? "white" : "black"}`,
              fill:`${isDarkModed ? "white" : "black"}`,
            },
            padding: 0,
          },
        }}
        width={300}
        height={400}
      />
    </>
  );
}

export default ChartPie;
