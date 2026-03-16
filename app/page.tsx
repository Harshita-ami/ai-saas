"use client"
import { useState } from "react"

export default function Home() {

  const [tool, setTool] = useState("")
  const [text, setText] = useState("")
  const [result, setResult] = useState("")
  const [riskLevel, setRiskLevel] = useState("")
  const [history, setHistory] = useState<any[]>([])
  const [scanCount, setScanCount] = useState(0)

  const detectRisk = () => {

    const email = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/i
    const creditCard = /\b(?:\d[ -]*?){13,16}\b/
    const phone = /\b\d{10}\b/
    const bankAccount = /\b\d{9,18}\b/
    const apiKey = /(sk-[a-zA-Z0-9]{20,})/
    const password = /(password\s*[:=]\s*\S+)/i

    const sensitiveKeywords = [
      "confidential",
      "financial report",
      "bank account",
      "customer data",
      "employee id",
      "ssn",
      "private key"
    ]

    let detectedItems: string[] = []
    let level = "low"

    if (password.test(text) || apiKey.test(text)) {
      detectedItems.push("Sensitive credential")
      level = "critical"
    }

    if (creditCard.test(text)) {
      detectedItems.push("Credit Card Number")
      level = "high"
    }

    if (bankAccount.test(text)) {
      detectedItems.push("Possible Bank/Account Number")
      if(level !== "critical") level = "high"
    }

    if (email.test(text)) {
      detectedItems.push("Email Address")
      if(level === "low") level = "medium"
    }

    if (phone.test(text)) {
      detectedItems.push("Phone Number")
      if(level === "low") level = "medium"
    }

    sensitiveKeywords.forEach(word => {
      if(text.toLowerCase().includes(word)){
        detectedItems.push(word)
        if(level === "low") level = "medium"
      }
    })

    let risk = ""

    if(detectedItems.length === 0){
      risk = "LOW RISK ✅ No sensitive pattern detected"
      level = "low"
    }
    else{
      risk = `${level.toUpperCase()} RISK ⚠️ Detected: ${detectedItems.join(", ")}`
    }

    setResult(risk)
    setRiskLevel(level)

    const newEntry = {
      tool: tool || "Unknown",
      risk: risk,
      time: new Date().toLocaleTimeString()
    }

    setHistory([newEntry, ...history])
    setScanCount(scanCount + 1)
  }

  const clearFields = () => {
    setText("")
    setResult("")
    setRiskLevel("")
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

      <h1>AI Security Monitor</h1>

      <p style={{color:"#aaa"}}>Total Scans: {scanCount}</p>

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
          <button onClick={detectRisk}>
            🔍 Analyze Risk
          </button>

          <button 
            onClick={clearFields}
            style={{marginLeft:"10px"}}
          >
            🧹 Clear
          </button>
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

          </div>
        )}

      </div>

      <div className="card" style={{marginTop:"30px"}}>

        <h2>Recent Scans</h2>

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