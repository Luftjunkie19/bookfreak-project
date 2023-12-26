import React from "react";

import ChartPie from "./charts/ChartPie";
import SimpleLineChart from "./charts/LineChart";

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
      {readerObjects.length > 0 && bookObjects.length > 0 && (
        <SimpleLineChart
          readerObjects={readerObjects}
          bookObjects={bookObjects}
        />
      )}
    </div>
  );
}

export default ChatsPage;
