"use client"
import { useState } from "react"

export default function Home() {

  const [tool, setTool] = useState("")
  const [text, setText] = useState("")
  const [result, setResult] = useState("")
  const [riskLevel, setRiskLevel] = useState("")
  const [history, setHistory] = useState<any[]>([])
  const [scanCount, setScanCount] = useState(0)
  const [highlightedText, setHighlightedText] = useState("")

  const detectRisk = () => {

    const email = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/gi
    const creditCard = /\b(?:\d[ -]*?){13,16}\b/g
    const phone = /(\+?\d{1,3}[- ]?)?\d{10}/g
    const bankAccount = /\b\d{9,18}\b/g
    const apiKey = /(sk-[a-zA-Z0-9]{10,})/g
    const password = /(password\s*[:=]\s*\S+)/gi

    const sensitiveKeywords = [
      "confidential",
      "financial report",
      "bank account",
      "customer data",
      "employee id",
      "ssn",
      "private key"
    ]

    let detectedItems = new Set<string>()
    let level = "low"
    let highlighted = text

    // 🔴 CRITICAL
    if (password.test(text) || apiKey.test(text)) {
      detectedItems.add("Sensitive credential")
      level = "critical"
    }

    // 🔴 HIGH
    if (creditCard.test(text)) {
      detectedItems.add("Credit Card Number")
      if (level !== "critical") level = "high"
    }

    if (bankAccount.test(text) && !creditCard.test(text)) {
      detectedItems.add("Possible Bank/Account Number")
      if (level !== "critical") level = "high"
    }

    // 🟠 MEDIUM
    if (email.test(text)) {
      detectedItems.add("Email Address")
      if (level === "low") level = "medium"
    }

    if (phone.test(text)) {
      detectedItems.add("Phone Number")
      if (level === "low") level = "medium"
    }

    sensitiveKeywords.forEach(word => {
      const regex = new RegExp(word, "gi")
      if (regex.test(text)) {
        detectedItems.add(word)
        if (level === "low") level = "medium"
      }
    })

    // 🔥 HIGHLIGHTING
    const highlight = (regex: RegExp) => {
      highlighted = highlighted.replace(regex, match => `<mark>${match}</mark>`)
    }

    highlight(email)
    highlight(creditCard)
    highlight(phone)
    highlight(bankAccount)
    highlight(apiKey)
    highlight(password)

    sensitiveKeywords.forEach(word => {
      const regex = new RegExp(word, "gi")
      highlight(regex)
    })

    let risk = ""

    if (detectedItems.size === 0) {
      risk = "LOW RISK ✅ No sensitive pattern detected"
      level = "low"
    } else {
      risk = `${level.toUpperCase()} RISK ⚠️ Detected: ${[...detectedItems].join(", ")}`
    }

    // Risk Score
    let score = 0
    if (level === "low") score = 25
    if (level === "medium") score = 50
    if (level === "high") score = 75
    if (level === "critical") score = 100

    setResult(risk + ` | Risk Score: ${score}/100`)
    setRiskLevel(level)
    setHighlightedText(highlighted)

    const newEntry = {
      tool: tool || "Unknown",
      risk: level.toUpperCase(),
      time: new Date().toLocaleTimeString()
    }

    setHistory([newEntry, ...history])
    setScanCount(scanCount + 1)
  }

  const clearFields = () => {
    setText("")
    setResult("")
    setRiskLevel("")
    setHighlightedText("")
  }

  const getMeterStyle = () => {

    if (riskLevel === "low") return { width: "25%", backgroundColor: "green" }
    if (riskLevel === "medium") return { width: "50%", backgroundColor: "orange" }
    if (riskLevel === "high") return { width: "75%", backgroundColor: "red" }
    if (riskLevel === "critical") return { width: "100%", backgroundColor: "purple" }

    return { width: "0%" }
  }

  return (
    <main className="container">

      <h1>🛡️ AI Security Monitor</h1>

      {/* DASHBOARD CARDS */}
      <div style={{display:"flex", gap:"15px", marginBottom:"20px"}}>
        <div className="card">📊 Total Scans: {scanCount}</div>
        <div className="card">🧠 Last Tool: {tool || "None"}</div>
        <div className="card">⚠️ Risk Level: {riskLevel || "N/A"}</div>
      </div>

      <div className="card">

        <label>Select AI Tool</label>
        <select value={tool} onChange={(e)=>setTool(e.target.value)}>
          <option value="">Select</option>
          <option>ChatGPT</option>
          <option>Gemini</option>
          <option>Claude</option>
          <option>Copilot</option>
        </select>

        <label>Paste Data Shared with AI</label>

        <textarea
          value={text}
          placeholder="Paste the data you shared with AI..."
          onChange={(e)=>setText(e.target.value)}
        />

        <div style={{marginTop:"10px"}}>
          <button onClick={detectRisk}>🔍 Analyze Risk</button>
          <button onClick={clearFields} style={{marginLeft:"10px"}}>🧹 Clear</button>
        </div>

        {result && (
          <div style={{
            marginTop: "20px",
            padding: "15px",
            borderLeft: "5px solid #888"
          }}>

            <strong>{result}</strong>

            <p style={{marginTop:"8px"}}>
              Tool: {tool || "Not selected"}
            </p>

            {(riskLevel === "high" || riskLevel === "critical") && (
              <p style={{color:"red", marginTop:"8px"}}>
                ⚠️ Warning: Avoid sharing financial or credential data with AI tools.
              </p>
            )}

            <div style={{
              marginTop: "15px",
              height: "12px",
              width: "100%",
              background: "#333",
              borderRadius: "8px"
            }}>
              <div style={{
                height: "100%",
                borderRadius: "8px",
                transition: "0.4s",
                ...getMeterStyle()
              }}></div>
            </div>

            {/* 🔥 HIGHLIGHTED OUTPUT */}
            <div style={{
              marginTop:"20px",
              padding:"10px",
              background:"#111",
              borderRadius:"8px",
              border:"1px solid #333"
            }}>
              <h3 style={{marginBottom:"10px"}}>🔎 Detected Sensitive Data</h3>
              <div
                dangerouslySetInnerHTML={{ __html: highlightedText }}
              />
            </div>

          </div>
        )}

      </div>

      <div className="card" style={{marginTop:"30px"}}>

        <h2>📜 Recent Scans</h2>

        {history.length === 0 && <p>No scans yet</p>}

        {history.map((item, index) => (
          <div key={index} style={{
            padding:"10px",
            borderBottom:"1px solid #333"
          }}>
            <strong>{item.tool}</strong> — {item.risk} — {item.time}
          </div>
        ))}

      </div>

    </main>
  )
}