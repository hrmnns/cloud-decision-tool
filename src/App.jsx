import { useState, useRef } from "react";
import jsPDF from "jspdf";

const questions = [
  {
    text: "Haben Sie eine klare Exit-Strategie für Ihre Cloud-Nutzung?",
    key: "exit"
  },
  {
    text: "Können Sie alle regulatorischen Anforderungen nachweislich erfüllen?",
    key: "compliance"
  },
  {
    text: "Wie sensibel sind die Daten, die in die Cloud sollen? (1 = sehr sensibel, 5 = unkritisch)",
    key: "dataSensitivity"
  },
  {
    text: "Wie hoch schätzen Sie Ihre interne Cloud-Kompetenz ein?",
    key: "competence"
  },
  {
    text: "Wie stabil ist die geopolitische Beziehung zum Anbieterland Ihrer Wahl?",
    key: "geopolitics"
  },
  {
    text: "Wie gut ist Ihre Cloud-Kostenkontrolle und -transparenz?",
    key: "costControl"
  },
  {
    text: "Wie stark ist Ihre Abhängigkeit von einem spezifischen Anbieter? (1 = sehr stark, 5 = keine)",
    key: "lockin"
  },
  {
    text: "Wie gut sind Ihre Daten klassifiziert und zugeordnet?",
    key: "classification"
  }
];

export default function CloudDecisionTool() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const formRef = useRef();

  const handleChange = (key, value) => {
    setAnswers({ ...answers, [key]: parseInt(value) });
  };

  const handleSubmit = () => {
    const total = Object.values(answers).reduce((acc, val) => acc + val, 0);
    if (total >= 35) {
      setResult({ type: "GO", text: "Ihre Cloud-Strategie ist tragfähig. Nutzen Sie die Chancen mit Augenmaß." });
    } else if (total >= 20) {
      setResult({ type: "SLOW", text: "Vorsichtiger Cloud-Einsatz empfohlen. Selektive Nutzung und Kompetenzausbau." });
    } else {
      setResult({ type: "NO", text: "Aktuell ist ein Cloud-Einsatz nicht ratsam. Prüfen Sie souveräne Alternativen." });
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Cloud-Entscheidungshelfer", 10, 10);

    questions.forEach((q, index) => {
      const value = answers[q.key] ?? '-';
      doc.text(`${index + 1}. ${q.text} Antwort: ${value}`, 10, 20 + index * 10);
    });

    if (result) {
      doc.setFontSize(12);
      doc.text(`\nErgebnis: ${result.type}`, 10, 110);
      doc.text(`${result.text}`, 10, 120);
    }

    doc.save("cloud-entscheidung.pdf");
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6" ref={formRef}>
      <h1 className="text-2xl font-bold">Cloud-Entscheidungshelfer</h1>
      <p className="text-sm text-gray-600">Bewerten Sie Ihre Cloud-Situation auf einer Skala von 1 (kritisch) bis 5 (unkritisch).</p>
      {questions.map((q) => (
        <div key={q.key} className="space-y-2">
          <label className="block font-medium">{q.text}</label>
          <input
            type="range"
            min="1"
            max="5"
            value={answers[q.key] || 3}
            onChange={(e) => handleChange(q.key, e.target.value)}
            className="w-full"
          />
        </div>
      ))}
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        Auswerten
      </button>
      {result && (
        <div className="mt-6 p-4 border rounded shadow">
          <h2 className="text-xl font-bold">Typ: {result.type}</h2>
          <p>{result.text}</p>
          <button onClick={exportPDF} className="mt-4 bg-gray-700 text-white px-4 py-2 rounded">
            Exportieren als PDF
          </button>
        </div>
      )}
    </div>
  );
}
