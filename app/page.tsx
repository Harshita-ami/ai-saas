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
  const [tool, setTool] = useState("");
  const [data, setData] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const [result, setResult] = useState("");

  const handleCheck = () => {
    if (!tool) {
      alert("Please select an AI tool first!");
      return;
    }

    setLog((prev) => [...prev, tool]);

    const lowerData = data.toLowerCase();
    const match = knowledgeBase.find((item) =>
      lowerData.includes(item.keyword)
    );

    if (match) {
      setResult(
        `⚠ Sensitive data detected!\nReason: ${match.reason}\nRecommendation: Do NOT share with AI tool.`
      );
    } else {
      setResult("✅ No sensitive data detected. Safe to continue sharing.");
    }

    setData("");
  };

  return (
    <div
      style={{
        backgroundColor: "#0B0B0B",
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Arial",
        color: "#F5F5F5",
      }}
    >
      <h1 style={{ color: "#B11226", marginBottom: "30px" }}>
        AI Security Monitor
      </h1>

      {/* Main Card */}
      <div
        style={{
          backgroundColor: "#1A1A1A",
          padding: "30px",
          borderRadius: "10px",
          maxWidth: "700px",
          border: "1px solid #7A0F1E",
        }}
      >
        <h3>Select AI Tool</h3>

        <select
          value={tool}
          onChange={(e) => setTool(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            marginBottom: "20px",
            backgroundColor: "#0B0B0B",
            color: "white",
            border: "1px solid #7A0F1E",
          }}
        >
          <option value="">Select Tool</option>
          <option>ChatGPT</option>
          <option>Gemini</option>
          <option>Claude</option>
        </select>

        <h3>Paste the data you plan to share</h3>

        <textarea
          rows={6}
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder="Paste company data here..."
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#0B0B0B",
            color: "white",
            border: "1px solid #7A0F1E",
            borderRadius: "5px",
          }}
        />

        <button
          onClick={handleCheck}
          style={{
            marginTop: "20px",
            padding: "12px 25px",
            backgroundColor: "#7A0F1E",
            border: "none",
            color: "white",
            cursor: "pointer",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
        >
          Analyze Risk
        </button>

        {result && (
          <div
            style={{
              marginTop: "25px",
              padding: "15px",
              backgroundColor: "#0B0B0B",
              border: "1px solid #B11226",
              borderRadius: "6px",
              whiteSpace: "pre-wrap",
            }}
          >
            {result}
          </div>
        )}
      </div>

      {/* Tool Log */}
      <div
        style={{
          marginTop: "40px",
          backgroundColor: "#1A1A1A",
          padding: "20px",
          borderRadius: "10px",
          maxWidth: "700px",
          border: "1px solid #7A0F1E",
        }}
      >
        <h3 style={{ color: "#B11226" }}>AI Tools Used</h3>

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
    </div>
  );
}