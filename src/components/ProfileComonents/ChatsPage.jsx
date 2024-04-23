import React from 'react';

import { ChartBar } from './charts/BarChart';
import ChartPie from './charts/ChartPie';

function ChatsPage({ readerObjects, bookObjects }) {
  return (
    <div className="w-full flex flex-wrap gap-4 items-center">
      {readerObjects.filter((reader) => reader.hasFinished).length > 0 && (
        <ChartPie
          yourReadersBooks={readerObjects.filter(
            (reader) => reader.hasFinished
          )}
        />
      )}

        <ChartBar readerObjects={readerObjects}
          bookObjects={bookObjects} />
   
  
    </div>
  );
}

export default ChatsPage;
