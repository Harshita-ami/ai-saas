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
      "confidential","financial report","bank account",
      "customer data","employee id","ssn","private key"
    ]

    let detectedItems = new Set<string>()
    let level = "low"
    let highlighted = text

    // 🔒 MASKING FUNCTIONS
    const maskEmail = (email:any) => email.replace(/(.{1}).+(@.+)/, "$1****$2")
    const maskCard = (card:any) => card.replace(/\d(?=\d{4})/g, "*")
    const maskPhone = (num:any) => num.replace(/\d(?=\d{4})/g, "*")
    const maskKey = (key:any) => key.slice(0,3) + "****" + key.slice(-3)
    const maskPassword = () => "password: ******"

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
      detectedItems.add("Bank/Account Number")
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
      if (text.toLowerCase().includes(word)) {
        detectedItems.add(word)
        if (level === "low") level = "medium"
      }
    })

    // 🔥 HIGHLIGHT + MASK
    highlighted = highlighted.replace(email, m => `<mark>${maskEmail(m)}</mark>`)
    highlighted = highlighted.replace(creditCard, m => `<mark>${maskCard(m)}</mark>`)
    highlighted = highlighted.replace(phone, m => `<mark>${maskPhone(m)}</mark>`)
    highlighted = highlighted.replace(bankAccount, m => `<mark>${maskCard(m)}</mark>`)
    highlighted = highlighted.replace(apiKey, m => `<mark>${maskKey(m)}</mark>`)
    highlighted = highlighted.replace(password, () => `<mark>${maskPassword()}</mark>`)

    sensitiveKeywords.forEach(word => {
      const regex = new RegExp(word, "gi")
      highlighted = highlighted.replace(regex, m => `<mark>${m}</mark>`)
    })

    let risk = detectedItems.size === 0
      ? "LOW RISK ✅ No sensitive pattern detected"
      : `${level.toUpperCase()} RISK ⚠️ Detected: ${[...detectedItems].join(", ")}`

    let score = {low:25, medium:50, high:75, critical:100}[level]

    setResult(risk + ` | Risk Score: ${score}/100`)
    setRiskLevel(level)
    setHighlightedText(highlighted)

    setHistory([{
      tool: tool || "Unknown",
      risk: level.toUpperCase(),
      time: new Date().toLocaleTimeString()
    }, ...history])

    setScanCount(scanCount + 1)
  }

  const exportReport = () => {
    const report = `
AI SECURITY REPORT
------------------------
Tool: ${tool || "Unknown"}
Result: ${result}
Time: ${new Date().toLocaleString()}

Original Data:
${text}
`
    const blob = new Blob([report], { type: "text/plain" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "AI_Security_Report.txt"
    link.click()
  }

  const clearFields = () => {
    setText("")
    setResult("")
    setRiskLevel("")
    setHighlightedText("")
  }

  const getMeterStyle = () => ({
    width:
      riskLevel==="low"?"25%":
      riskLevel==="medium"?"50%":
      riskLevel==="high"?"75%":
      riskLevel==="critical"?"100%":"0%",
    backgroundColor:
      riskLevel==="low"?"green":
      riskLevel==="medium"?"orange":
      riskLevel==="high"?"red":
      riskLevel==="critical"?"purple":"gray"
  })

  return (
    <main className="container">

      <h1>🛡️ AI Security Monitor</h1>

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

        <textarea value={text} onChange={(e)=>setText(e.target.value)} />

        <div style={{marginTop:"10px"}}>
          <button onClick={detectRisk}>🔍 Analyze Risk</button>
          <button onClick={clearFields} style={{marginLeft:"10px"}}>🧹 Clear</button>
          <button onClick={exportReport} style={{marginLeft:"10px"}}>📄 Export</button>
        </div>

        {result && (
          <div style={{marginTop:"20px", padding:"15px"}}>

            <strong>{result}</strong>

            <div style={{marginTop:"15px", height:"10px", background:"#333"}}>
              <div style={{height:"100%", ...getMeterStyle()}}></div>
            </div>

            <div style={{marginTop:"20px", background:"#111", padding:"10px"}}>
              <h3>🔎 Masked & Highlighted Data</h3>
              <div dangerouslySetInnerHTML={{ __html: highlightedText }} />
            </div>

          </div>
        )}

      </div>

    </main>
  )
}