import '../../stylings/mui-stylings.css';

import React from 'react';

import {
  ArcElement,
  Chart as ChartJS,
  defaults,
  Legend,
  Tooltip,
} from 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

import useGetDocuments from '../../../hooks/useGetDocuments';

ChartJS.register(ArcElement, Tooltip, Legend);

defaults.animation = true;
defaults.responsive = true;
defaults.maintainAspectRatio = false;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;



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
    <div className="max-w-xs w-full p-2 rounded-lg bg-black/40 flex items-center justify-center h-64">
      <Doughnut  
  
        data={{
          labels: transformedBooksArray.map((book) => book.category),
          datasets: [
            {
              label:"Count of Books",
              data: transformedBooksArray.map((item) => item.count),
              backgroundColor:[
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
              ],
              
            },
      
          ],
        }}
       
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
        
      
      />
    </div>
  );
}

export default ChartPie;
