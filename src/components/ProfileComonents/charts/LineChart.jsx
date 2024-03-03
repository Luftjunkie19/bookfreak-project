import '../../stylings/mui-stylings.css';

import React from 'react';

import { useSelector } from 'react-redux';

import { Tooltip } from '@mui/material';
import { LineChart } from '@mui/x-charts';

export default function UserReadingProgressChart({
  readerObjects,
  bookObjects,
}) {
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
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);
  const userReadingProgress = userReadingProgressData.map((data) => data.y);

  return (
    <LineChart
      width={500}
      height={300}
      sx={{ color: "whitesmoke" }}
      series={[
        {
          data: userReadingProgress,
          color: "#4267b5",
          label: "Reading Progress",
        },
      ]}
      xAxis={[{ scaleType: "point", data: xLabels }]}
      yAxis={[{ scaleType: "linear", position: "left", label: "%" }]}
      tooltip={
        <Tooltip
          content={({ label, data }) =>
            `${label}: ${Math.round(data[0]?.payload?.y * 100)}% completed`
          }
        />
      }
      slotProps={{
        legend: {
          position: { vertical: "bottom", horizontal: "left" },
          padding: 0,
          labelStyle: {
            color:`${isDarkModed ? "white" : "black"}`,
            fill:`${isDarkModed ? "white" : "black"}`,
          },
        },
      }}
    />
  );
}

export function UserComparisonChart({ readerObjects, bookObjects }) {
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);

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
    <LineChart
      width={500}
      height={300}
      sx={{ color: "whitesmoke" }}
      series={[
        {
          data: userComparison,
          color: "#4267b5",
          label: "Pages Read",
        },
      ]}
      xAxis={[{ scaleType: "point", data: xLabels }]}
      yAxis={[{ scaleType: "linear", position: "left", label: "Pages Read" }]}
      tooltip={
        <Tooltip
          content={({ label, data }) =>
            `${label}: ${data[0]?.payload?.y} pages read`
          }
        />
      }
      slotProps={{
        legend: {
          position: { vertical: "bottom", horizontal: "left" },
          padding: 0,
          labelStyle: {
            color: isDarkModed ? "white" : "black",
            fill: isDarkModed ? "white" : "black",
          },
        },
      }}
    />
  );
}


export function BookCategoryChart({ readerObjects, bookObjects }) {
  const isDarkModed = useSelector((state) => state.mode.isDarkMode);

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
    <LineChart
      width={500}
      height={300}
      sx={{ color: "whitesmoke" }}
      series={[
        {
          data: totalPagesReadByCategory,
          color: "#4267b5",
          label: "Total Pages Read",
        },
      ]}
      xAxis={[{ scaleType: "point", data: xLabels }]}
      yAxis={[
        { scaleType: "linear", position: "left", label: "Total Pages Read" },
      ]}
      tooltip={
        <Tooltip
          content={({ label, data }) =>
            `${label}: ${data[0]?.payload?.y} pages read`
          }
        />
      }
      slotProps={{
        legend: {
          position: { vertical: "bottom", horizontal: "left" },
          padding: 0,
          labelStyle: {
            color: isDarkModed ? "white" : "black",
            fill: isDarkModed ? "white" : "black",
          },
        },
      }}
    />
  );
}
