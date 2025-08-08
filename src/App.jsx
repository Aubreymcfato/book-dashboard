// React-based dashboard to manage multiple weeks of book sales data

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Papa from "papaparse";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function BookSalesDashboard() {
  const [weeklyData, setWeeklyData] = useState({});
  const [selectedWeek, setSelectedWeek] = useState("");
  const [filter, setFilter] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const filename = file.name;
    const weekMatch = filename.match(/week\s*(\d+)/i);
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
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Vendite Libri</h1>

      <div className="flex flex-wrap gap-4 items-center">
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
        <Input
          placeholder="Filtra per titolo, autore, editore..."
          value={filter}
          onChange={handleFilterChange}
        />
        <Select value={selectedWeek} onValueChange={setSelectedWeek}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Seleziona settimana" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(weeklyData).map((week) => (
              <SelectItem key={week} value={week}>
                {week}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedWeek && (
        <>
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">Top Autori - {selectedWeek}</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topAuthors} layout="vertical">
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={150} />
                  <Tooltip />
                  <Bar dataKey="sales" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  {books[0] &&
                    Object.keys(books[0]).map((key) => (
                      <th key={key} className="px-2 py-1 text-left border-b">
                        {key}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((book, i) => (
                  <tr key={i} className="odd:bg-gray-50">
                    {Object.values(book).map((val, j) => (
                      <td key={j} className="px-2 py-1 border-b">
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
