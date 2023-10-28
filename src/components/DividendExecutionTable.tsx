"use client";
import format from "date-fns/format";
import add from "date-fns/add";
import sub from "date-fns/sub";
export default function DividendExecutionTable() {
  return (
    <div className="bg-black rounded-xl overflow-x-auto max-w-full">
      <div className="">
        <table className="table">
          <thead>
            <tr>
              <th />
              <th>Rewards</th>
              <th>Trading Dates</th>
              <th>Qualify Date</th>
              <th>Verify Date</th>
              <th>T1</th>
              <th>T2</th>
              <th>Hodlers</th>
              <th>Liquidity</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => {
              const qualifyDate = add(new Date(row.qualifyDate), { hours: 6 });
              const verifyDate = add(new Date(row.qualifyDate), { days: 7 });
              const tradeDateStart = sub(qualifyDate, { days: 7 });
              const tradeDateEnd = sub(qualifyDate, { days: 1 });
              return (
                <tr key={`calendar-${index}`}>
                  <td>Round {index + 1}</td>
                  <td>{row.reward || ""}</td>
                  <td>
                    {format(tradeDateStart, "MMM dd")} -{" "}
                    {format(tradeDateEnd, "MMM dd")}
                  </td>
                  <td>{format(qualifyDate, "MMM-dd-yy")}</td>
                  <td>{format(verifyDate, "MMM-dd-yy")}</td>
                  <td>{row.reward * 0.15 || "-"}</td>
                  <td>{row.reward * 0.1 || "-"}</td>
                  <td>{row.reward * 0.24 || "-"}</td>
                  <td>{row.reward * 0.06 || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const tableData = [
  {
    reward: 14.69,
    qualifyDate: "2023-10-21",
  },
  {
    reward: 0,
    qualifyDate: "2023-10-28",
  },
  {
    reward: 0,
    qualifyDate: "2023-11-04",
  },
  {
    reward: 0,
    qualifyDate: "2023-11-11",
  },
  {
    reward: 0,
    qualifyDate: "2023-11-18",
  },
  {
    reward: 0,
    qualifyDate: "2023-11-25",
  },
  {
    reward: 0,
    qualifyDate: "2023-12-02",
  },
  {
    reward: 0,
    qualifyDate: "2023-12-09",
  },
  {
    reward: 0,
    qualifyDate: "2023-12-16",
  },
  {
    reward: 0,
    qualifyDate: "2023-12-23",
  },
  {
    reward: 0,
    qualifyDate: "2023-12-30",
  },
];
