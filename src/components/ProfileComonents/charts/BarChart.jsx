import React from 'react';

import { BarChart } from '@mui/x-charts/BarChart';

export function ChartBar({readerObjects,
bookObjects}) {
      const userReadingProgressData = readerObjects
    .map((reader) => {
      const book = bookObjects.find((b) => b.id === reader.bookReadingId);
      if (!book) {
        return null;
      }
      // Assuming proportion is calculated as pagesRead / totalPages
      const proportion = Math.round(
        (reader.pagesRead / book.pagesNumber) * 100
      );
      return {
        x: book.title,
        y: proportion,
      };
    })
        .filter((data) => data !== null);
    
    const xLabels = userReadingProgressData.map((data) => data.x);
  const userReadingProgress = userReadingProgressData.map((data) => data.y)
    
  return (
      <BarChart
          sx={{ color: "whitesmoke" }}
             yAxis={[{ scaleType: "linear", position: "left", label: "%" }]}
         xAxis={[{ scaleType: 'band', data: xLabels }]}
          series={[{ data: userReadingProgress }]}
          width={500}
      height={300}/>
      )
}

export function UserComparisonBarChart({ readerObjects, bookObjects }) {
    
  const userComparisonData = readerObjects
    .map((reader) => {
      const book = bookObjects.find((b) => b.id === reader.bookReadingId);
      if (!book) {
        console.log(`No book found for reader: ${reader.displayName}`);
        return null;
      }
      return {
        x: reader.displayName,
        y: reader.pagesRead,
      };
    })
    .filter((data) => data !== null);

  const xLabels = userComparisonData.map((data) => data.x);
  const userComparison = userComparisonData.map((data) => data.y);

      return (
      <BarChart
          sx={{ color: "whitesmoke" }}
             yAxis={[{ scaleType: "linear", position: "left", label: "%" }]}
         xAxis={[{ scaleType: 'band', data: xLabels }]}
          series={[{ data: userComparison }]}
          width={500}
      height={300}/>
      )
    
}

export function BookCategoryChart({ readerObjects, bookObjects }) {
      const bookCategoryData = bookObjects.map((book) => {
    const totalPagesReadInCategory = readerObjects
      .filter((reader) => reader.bookReadingId === book.id)
      .reduce((total, reader) => total + reader.pagesRead, 0);

    return {
      x: book.category,
      y: totalPagesReadInCategory,
    };
  });

  const xLabels = bookCategoryData.map((data) => data.x);
  const totalPagesReadByCategory = bookCategoryData.map((data) => data.y);
   return (
      <BarChart
          sx={{ color: "whitesmoke" }}
             yAxis={[{ scaleType: "linear", position: "left", label: "%" }]}
         xAxis={[{ scaleType: 'band', data: xLabels }]}
          series={[{ data: totalPagesReadByCategory }]}
          width={500}
      height={300}/>
      )
}