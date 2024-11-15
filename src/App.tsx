import { Fragment, useEffect, useState } from "react";
import "./App.css";

type Data = (
  | {
      name: string;
      old: string;
      new: string;
    }
  | {
      name: null;
      old: string;
      new: string;
    }
)[];

type MergedData = {
  datetime: string;
  nexttime: string;
  datepart: string;
  timepart: string;
  data: [{ set: Data }, { set: Data }];
};

const locationAPI = {
  ba: "https://pokerlist.eu/cms/export.php",
  za: "https://pokerlist.eu/cmszilina/export.php",
  cc: "https://pokerlist.eu/cms-dealeri/cardcasino/export.php"
}

function App() {
  const [data, setData] = useState<MergedData>({} as MergedData);
  const [isLoading, setIsLoading] = useState(true);


  const fetchTableData = async () => {
    try {
      const response = await fetch(locationAPI.ba);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchTableData();
      const [datepart, timepart] = fetchedData.datetime.split(' ');

      if (fetchedData) {
        const arraySetOne = fetchedData.data.slice(0, 20);
        const arraySetTwo = fetchedData.data.slice(20, 40);

        const mergedData: MergedData = {
          datetime: fetchedData.datetime,
          nexttime: fetchedData.nexttime,
          datepart: datepart,
          timepart: timepart,
          data: [{ set: arraySetOne }, { set: arraySetTwo }],
        };

        setData(mergedData);
        setIsLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading)
    return (
      <div className="py-[28px] px-[48px] ">
        <div className="w-screen h-screen relative overflow-hidden flex justify-center items-center">
          <div className="lds-ripple">
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div>
        <h1 className="text-3xl text-center font-bold">{data.datepart}</h1>
        <p className="text-2xl mb-8 text-center">{data.timepart}</p>
        <div
          className={`flex items-start justify-center ${
            data.data[1].set.length !== 0 ? "gap-10" : ""
          }`}
        >
          {data.data.map((set, setIndex) => (
            <table
              key={setIndex}
              className="table-auto border-collapse border-t-2 border-spacing-2"
            >
              <tbody>
                <>
                  <tr>
                    <td className="py-1"></td>
                    <td className="py-1"></td>
                    <td className="py-1"></td>
                  </tr>
                  {set.set.map((row, rowIndex) => (
                    <Fragment key={rowIndex}>
                      <tr key={`a-${rowIndex}`}>
                        <td className="px-4 py-2 font-bold bg-gray-400 text-black">{row.name}</td>
                        <td className="px-4 py-2 font-bold">{row.old}</td>
                        <td className="px-4 py-2 bg-white font-bold text-[#310238]">{row.new}</td>
                      </tr>
                      <tr key={`b-${rowIndex}`} className="border-b-2">
                        <td className="py-1"></td>
                        <td className="py-1"></td>
                        <td className="py-1"></td>
                      </tr>
                      <tr key={`c-${rowIndex}`}>
                        <td className="py-1"></td>
                        <td className="py-1"></td>
                        <td className="py-1"></td>
                      </tr>
                    </Fragment>
                  ))}
                </>
              </tbody>
            </table>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;