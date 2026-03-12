"use client";
import { useState } from "react";

// Mini knowledge base to simulate RAG
const knowledgeBase = [
  { keyword: "password", reason: "Passwords should never be shared." },
  { keyword: "api key", reason: "API keys are sensitive." },
  { keyword: "salary", reason: "Employee salary info is confidential." },
  { keyword: "database", reason: "Company databases may contain private info." },
  { keyword: "internal", reason: "Internal company info should not be shared externally." },
  { keyword: "secret", reason: "This is confidential information." },
];

export default function Home() {
  const [tool, setTool] = useState(""); // Selected AI tool
  const [data, setData] = useState(""); // User input data
  const [log, setLog] = useState<string[]>([]); // Tracks tools used
  const [result, setResult] = useState(""); // Result of safety check

  // Function to handle checking and logging
  const handleCheck = () => {
    if (!tool) {
      alert("Please select an AI tool first!");
      return;
    }

    // Log the tool used
    setLog((prev) => [...prev, tool]);

    // Check the data against knowledge base
    const lowerData = data.toLowerCase();
    const match = knowledgeBase.find((item) => lowerData.includes(item.keyword));

    if (match) {
      setResult(
        `⚠ Sensitive data detected!\nReason: ${match.reason}\nRecommendation: Do NOT share with AI tool.`
      );
    } else {
      setResult("✅ No sensitive data detected. Safe to continue sharing.");
    }

    // Clear the input box after check (optional)
    setData("");
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>AI Tool Usage & Data Safety Monitor</h1>

      {/* AI tool selector */}
      <h3>Select AI Tool</h3>
      <select value={tool} onChange={(e) => setTool(e.target.value)}>
        <option value="">Select Tool</option>
        <option>ChatGPT</option>
        <option>Gemini</option>
        <option>Claude</option>
      </select>

      {/* Data input */}
      <h3 style={{ marginTop: "20px" }}>Paste the data you plan to share</h3>
      <textarea
        rows={6}
        cols={60}
        value={data}
        onChange={(e) => setData(e.target.value)}
        placeholder="Paste company data here..."
      />

      {/* Check button */}
      <br />
      <button
        onClick={handleCheck}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Check & Record
      </button>

      {/* Result */}
      <h2 style={{ marginTop: "30px", whiteSpace: "pre-wrap" }}>{result}</h2>

      {/* Tools used log */}
      <h3 style={{ marginTop: "30px" }}>Tools Used So Far:</h3>
      {log.length === 0 ? (
        <p>No tools recorded yet.</p>
      ) : (
        <ul>
          {log.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
