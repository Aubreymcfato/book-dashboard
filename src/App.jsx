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

export default function App() {
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

  const topAuthors = Object.entries(
    filtered.reduce((acc, book) => {
      const author = book["Autore"] || "Sconosciuto";
      acc[author] = (acc[author] || 0) + parseInt(book["Vendite"] || 0);
      return acc;
    }, {})
  )
    .map(([name, sales]) => ({ name, sales }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 10);

  return (
    <div style={{ padding: "1rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
        Dashboard Vendite Libri
      </h1>

      <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
        <input
          type="text"
          placeholder="Filtra per titolo, autore, editore..."
          value={filter}
          onChange={handleFilterChange}
          style={{ marginLeft: "1rem", padding: "0.3rem" }}
        />
        <select
          value={selectedWeek}
          onChange={(e) => setSe
