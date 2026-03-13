"use client";
import { useState } from "react";

const knowledgeBase = [
  { keyword: "password", reason: "Passwords should never be shared." },
  { keyword: "api key", reason: "API keys are sensitive." },
  { keyword: "salary", reason: "Employee salary info is confidential." },
  { keyword: "database", reason: "Company databases may contain private info." },
];

export default function Home() {
  const [tool, setTool] = useState("");
  const [data, setData] = useState("");
  const [result, setResult] = useState("");
  const [log, setLog] = useState<string[]>([]);

  const handleCheck = () => {
    if (!tool) {
      alert("Select an AI tool first");
      return;
    }

    setLog((prev) => [...prev, tool]);

    const lower = data.toLowerCase();
    const match = knowledgeBase.find((k) => lower.includes(k.keyword));

    if (match) {
      setResult(`⚠ Sensitive data detected\nReason: ${match.reason}`);
    } else {
      setResult("✅ No sensitive data detected");
    }

    setData("");
  };

  return (
    <div style={{padding:"40px"}}>
      <h1 style={{color:"#7A0F1E"}}>AI Security Monitor</h1>

      <div style={{
        background:"#1a1a1a",
        padding:"25px",
        borderRadius:"10px",
        marginTop:"20px",
        maxWidth:"600px"
      }}>

        <h3>Select AI Tool</h3>

        <select
          value={tool}
          onChange={(e)=>setTool(e.target.value)}
          style={{width:"100%",padding:"10px"}}
        >
          <option value="">Select Tool</option>
          <option>ChatGPT</option>
          <option>Gemini</option>
          <option>Claude</option>
        </select>

        <h3 style={{marginTop:"20px"}}>Paste Data</h3>

        <textarea
          rows={5}
          value={data}
          onChange={(e)=>setData(e.target.value)}
          style={{width:"100%",padding:"10px"}}
        />

        <button
          onClick={handleCheck}
          style={{
            marginTop:"20px",
            padding:"10px 20px",
            background:"#7A0F1E",
            color:"white",
            border:"none"
          }}
        >
          Analyze Risk
        </button>

        {result && (
          <div style={{marginTop:"20px"}}>
            <strong>{result}</strong>
          </div>
        )}

      </div>

      <h3 style={{marginTop:"40px"}}>AI Tools Used</h3>

      <ul>
        {log.map((t,i)=>(
          <li key={i}>{t}</li>
        ))}
      </ul>

    </div>
  );
}