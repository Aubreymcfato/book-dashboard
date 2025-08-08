import React, { useState } from "react";
import Papa from "papaparse";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BookSalesDashboard() {
  const [weeklyData, setWeeklyData] = useState({});
  const [selectedWeek, setSelectedWeek] = useState("");
  const [filter, setFilter] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const filename = file.name;
    const weekMatch = filename.match(/week\\s*(\\d+)/i);
    const week = weekMatch ? `Settimana ${weekMatch[1]}` : filename;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data.filter(
          (row) => row["Posizione"] && row["Titolo"] && row["Autore"]
        );
        setWeeklyData((prev) => ({ ...prev, [week]: parsed }));
        setSelectedWeek(week);
      },
    });
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value.toLowerCase());
  };

  const books = weeklyData[selectedWeek] || [];
  const filtered = books.filter((book) =>
    Object.values(book).some((field) =>
      field?.toLowerCase().includes(filter)
    )
  );

  co
