import React from 'react';

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  defaults,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

defaults.animation = true;
defaults.responsive = true;
defaults.maintainAspectRatio = false;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;


export function ChartBar({ readerObjects,
  bookObjects }) {
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
         <div className="max-w-xs w-full h-64 p-2 rounded-lg bg-black/40">
      
           <Bar data={{
                 labels: xLabels,
                 datasets: [{
                   label: 'Pages Read',
                   data: userReadingProgress,
                   borderRadius: 5,
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
                 }]
               }}
       
              />
         </div>
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
             <div className="max-w-xs w-full h-64 p-2 rounded-lg bg-black/40">
               <Bar data={{
          labels: xLabels,
          datasets: [{
            label: 'users comparison',
            data: userComparison,
          }]
        }}
   
         />
             </div>
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
     <div className="max-w-xs w-full h-64 p-2 rounded-lg bg-black/40">

       <Bar data={{
         labels: xLabels, 
         datasets: [{ label: 'Total Pages Read', data: totalPagesReadByCategory }]
        }}/>
     </div>
      )
}