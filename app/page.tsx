"use client"
import { useState } from "react"

export default function Home() {

  const [tool, setTool] = useState("")
  const [text, setText] = useState("")
  const [result, setResult] = useState("")

  const detectRisk = () => {

    const email = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/i
    const creditCard = /\b(?:\d[ -]*?){13,16}\b/
    const apiKey = /(sk-[a-zA-Z0-9]{20,})/
    const password = /(password\s*[:=]\s*\S+)/i

    if (password.test(text) || apiKey.test(text)) {
      setResult("CRITICAL RISK ⚠️ Sensitive credential detected")
    }
    else if (creditCard.test(text)) {
      setResult("HIGH RISK ⚠️ Credit card detected")
    }
    else if (email.test(text)) {
      setResult("MEDIUM RISK ⚠️ Email detected")
    }
    else {
      setResult("LOW RISK ✅ No sensitive pattern detected")
    }
  }

  const getBorderColor = () => {
    if (result.includes("LOW")) return "5px solid green"
    if (result.includes("MEDIUM")) return "5px solid orange"
    if (result.includes("HIGH")) return "5px solid red"
    if (result.includes("CRITICAL")) return "5px solid purple"
    return "5px solid gray"
  }

  return (
    <main className="container">

      <h1>AI Security Monitor</h1>

      <div className="card">

        <label>Select AI Tool</label>
        <select onChange={(e)=>setTool(e.target.value)}>
          <option>Select</option>
          <option>ChatGPT</option>
          <option>Gemini</option>
          <option>Claude</option>
          <option>Copilot</option>
        </select>

        <label>Paste Data Shared with AI</label>

        <textarea
          placeholder="Paste the data you shared with AI..."
          onChange={(e)=>setText(e.target.value)}
        />

        <button onClick={detectRisk}>
          🔍 Analyze Risk
        </button>

        {result && (
          <div
            className="result"
            style={{ borderLeft: getBorderColor() }}
          >
            <strong>{result}</strong>

            {tool && (
              <p style={{ marginTop: "10px", color: "#aaa" }}>
                AI Tool Checked: {tool}
              </p>
            )}
          </div>
        )}

      </div>

    </main>
  )
}