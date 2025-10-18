import React, { useState } from "react";

// Prototipo UI – Profesor Albert
// Nota: es un mock funcional en el navegador (sin backend). Simula el flujo
// "Subir/pegar texto → Generar guion → (opcional) Ajustar → Generar vídeo".
// Estilos: TailwindCSS. Puedes previsualizar en ChatGPT.

export default function App() {
  const [step, setStep] = useState(1);
  const [inputMode, setInputMode] = useState("paste"); // paste | file
  const [rawNotes, setRawNotes] = useState("");
  const [script, setScript] = useState("");
  const [tone, setTone] = useState("claro y motivador");
  const [subject, setSubject] = useState("Matemáticas");
  const [level, setLevel] = useState("Bachillerato");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const demoExplain = (text: string) => {
    // Simula un pequeño "resumen pedagógico" a partir de las notas
    if (!text.trim()) return "";
    const base = text.replace(/\s+/g, " ").slice(0, 300).trim();
    return `Objetivo: entender el tema de forma simple.\n\nIdea principal → ${base}...\n\nExplicación paso a paso:\n1) Definición sencilla del concepto.\n2) Ejemplo cotidiano para visualizarlo.\n3) Mini-ejercicio guiado en la pizarra.\n4) Resumen en una frase para recordarlo.`;
  };

  const handleGenerateScript = async () => {
    setLoading(true);
    // Mock de latencia y creación del guion a partir de las notas
    await new Promise((r) => setTimeout(r, 700));
    const s = `Hola, soy el Profesor Albert. Hoy trabajaremos ${subject.toLowerCase()} a nivel ${level}.\n\n${demoExplain(
      rawNotes
    )}\n\nEn la pizarra verás cómo resolvemos un ejemplo real y luego te propondré un mini-reto. ¡Vamos paso a paso!`;
    setScript(s);
    setLoading(false);
    setStep(2);
  };

  const handleGenerateVideo = async () => {
    setLoading(true);
    setVideoUrl("");
    // Mock de renderizado de vídeo
    await new Promise((r) => setTimeout(r, 1200));
    // En un futuro, aquí se colocaría la URL devuelta por el renderizador (HeyGen/Synthesia/etc.)
    setVideoUrl("mock://albert-video-demo");
    setLoading(false);
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
           <img src="/albert.png" alt="Profesor Albert" className="w-10 h-10 rounded-2xl object-cover shadow-sm" />
            <div>
              <h1 className="text-lg font-semibold">Profesor Albert</h1>
              <p className="text-xs text-slate-500 -mt-0.5">
                Tu profe IA que explica con pizarra
              </p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a className="hover:text-blue-600" href="#como-funciona">
              Cómo funciona
            </a>
            <a className="hover:text-blue-600" href="#demo">
              Demo
            </a>
            <a className="hover:text-blue-600" href="#precios">
              Precios
            </a>
            <a className="hover:text-blue-600" href="#faq">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm rounded-xl border border-slate-300 hover:bg-slate-100">
              Entrar
            </button>
            <button className="px-3 py-1.5 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm">
              Probar gratis
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Convierte tus apuntes en{" "}
              <span className="text-blue-600">vídeos explicativos</span> con un
              profesor IA
            </h2>
            <p className="mt-4 text-slate-600">
              Sube tu texto y obtén una explicación clara, con guion pedagógico
              y pizarra dinámica. Ideal para repasar, entender rápido y
              compartir con tu clase.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              <li>
                • Avatar consistente: Profesor Albert (bata blanca y fondo
                aula).
              </li>
              <li>
                • Pizarra digital: definición, ejemplo, ejercicio guiado y
                resumen.
              </li>
              <li>• Tono: {tone}.</li>
            </ul>
           <div className="mt-6 flex gap-3">
  <a
    href="#demo"
    className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow"
  >
    Probar la demo
  </a>
  <a
    href="#como-funciona"
    className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100"
  >
    Ver cómo funciona
  </a>
</div>
          </div>
          <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
               <img src="/albert.png" alt="Profesor Albert" className="w-16 h-16 rounded-2xl object-cover shadow" />
                <div>
                  <p className="text-sm text-slate-500">Profesor virtual</p>
                  <h3 className="text-lg font-semibold">Albert</h3>
                </div>
              </div>
              <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-sm text-slate-600">
                  “Explicaciones claras con pizarra digital.”
                </p>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border">
                  Definición
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border">Ejemplo</div>
                <div className="p-3 rounded-xl bg-slate-50 border">
                  Ejercicio
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-semibold">Cómo funciona</h3>
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {[
            {
              title: "Pega tus apuntes",
              desc: "Escribe o pega el texto que quieras convertir en clase en vídeo.",
            },
            {
              title: "Genera el guion",
              desc: "La IA crea una explicación clara con estructura pedagógica.",
            },
            {
              title: "Renderiza el vídeo",
              desc: "El avatar de Albert explica y la pizarra ilustra los pasos.",
            },
          ].map((it, i) => (
            <div key={i} className="p-5 rounded-2xl border bg-white shadow-sm">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white grid place-items-center text-sm font-bold">
                {i + 1}
              </div>
              <h4 className="mt-4 font-semibold">{it.title}</h4>
              <p className="text-sm text-slate-600 mt-1">{it.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DEMO interactiva */}
      <section id="demo" className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Demo interactiva</h3>
          <div className="flex gap-2 text-sm">
            <select
              className="border rounded-xl px-3 py-1.5"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option>Matemáticas</option>
              <option>Física</option>
              <option>Economía</option>
              <option>Historia</option>
              <option>Lengua</option>
            </select>
            <select
              className="border rounded-xl px-3 py-1.5"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option>Bachillerato</option>
              <option>ESO</option>
              <option>Universidad</option>
            </select>
            <select
              className="border rounded-xl px-3 py-1.5"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option>claro y motivador</option>
              <option>muy sencillo</option>
              <option>técnico pero accesible</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-6">
          <div className="p-5 rounded-2xl border bg-white shadow-sm">
            <div className="flex gap-3 mb-3">
              <button
                onClick={() => setInputMode("paste")}
                className={`px-3 py-1.5 rounded-xl text-sm border ${
                  inputMode === "paste"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "border-slate-300 hover:bg-slate-100"
                }`}
              >
                Pegar texto
              </button>
              <button
                onClick={() => setInputMode("file")}
                className={`px-3 py-1.5 rounded-xl text-sm border ${
                  inputMode === "file"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "border-slate-300 hover:bg-slate-100"
                }`}
              >
                Subir archivo
              </button>
            </div>

            {inputMode === "paste" ? (
              <textarea
                value={rawNotes}
                onChange={(e) => setRawNotes(e.target.value)}
                className="w-full h-44 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Pega aquí tus apuntes (ej.: Teorema de Pitágoras: en un triángulo rectángulo, el cuadrado de la hipotenusa…)"
              ></textarea>
            ) : (
              <div className="h-44 grid place-items-center rounded-xl border border-dashed text-slate-500">
                <p>Drag & drop PDF/Docx (simulado)</p>
              </div>
            )}

            <div className="mt-4 flex gap-3">
              <button
                onClick={handleGenerateScript}
                disabled={loading || (!rawNotes && inputMode !== "file")}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Creando guion…" : "Generar guion"}
              </button>
              <button
                onClick={() => {
                  setRawNotes(
                    "Teorema de Pitágoras: en un triángulo rectángulo, a^2 + b^2 = c^2. Ejemplo: catetos 3 y 4 resultan en hipotenusa 5."
                  );
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100"
              >
                Usar ejemplo
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl border bg-white shadow-sm">
            <h4 className="font-semibold">Guion generado</h4>
            {!script && (
              <p className="text-sm text-slate-500 mt-2">
                Tu guion aparecerá aquí cuando lo generes. Podrás editarlo antes
                de renderizar el vídeo.
              </p>
            )}
            {script && (
              <>
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  className="w-full h-44 p-3 rounded-xl border mt-2"
                ></textarea>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleGenerateVideo}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Renderizando vídeo…" : "Generar vídeo"}
                  </button>
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100"
                  >
                    Volver
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Resultado */}
        <div className="mt-8 p-5 rounded-2xl border bg-white shadow-sm">
          <h4 className="font-semibold">Resultado</h4>
          {step !== 3 && (
            <p className="text-sm text-slate-500 mt-2">
              Cuando el vídeo esté listo lo verás aquí con un reproductor y
              opción de descarga.
            </p>
          )}
          {step === 3 && (
            <div className="mt-3">
              <div className="aspect-video w-full rounded-2xl border grid place-items-center bg-slate-100">
                <span className="text-slate-500">
                  [Vista previa de vídeo – mock]
                </span>
              </div>
              <div className="mt-3 flex gap-3">
                <button className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100">
                  Descargar MP4
                </button>
                <button className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100">
                  Compartir enlace
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Precios */}
      <section id="precios" className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-semibold">Precios (propuesta)</h3>
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {[
            {
              name: "Gratis",
              price: "0 €/mes",
              features: [
                "1 vídeo corto/semana",
                "Marca de agua",
                "Resolución 720p",
              ],
            },
            {
              name: "Estudiante",
              price: "7,99 €/mes",
              features: [
                "Hasta 20 vídeos/mes",
                "1080p sin marca de agua",
                "Plantillas pizarra + subtítulos",
              ],
            },
            {
              name: "Pro (docente)",
              price: "19,99 €/mes",
              features: [
                "Hasta 100 vídeos/mes",
                "Packs por grupos",
                "Branding del centro",
              ],
            },
          ].map((p, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border bg-white shadow-sm flex flex-col"
            >
              <h4 className="font-semibold">{p.name}</h4>
              <div className="text-3xl font-bold mt-1">{p.price}</div>
              <ul className="mt-4 space-y-2 text-sm flex-1">
                {p.features.map((f, j) => (
                  <li key={j}>• {f}</li>
                ))}
              </ul>
              <button className="mt-6 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                Elegir plan
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-semibold">Preguntas frecuentes</h3>
        <div className="mt-6 space-y-4">
          <details className="p-4 rounded-2xl border bg-white shadow-sm">
            <summary className="cursor-pointer font-medium">
              ¿Genera vídeos reales?
            </summary>
            <p className="mt-2 text-sm text-slate-600">
              Este prototipo es una demo visual. Para producción se integrarían
              servicios de avatar/voz (p. ej., HeyGen, Synthesia, ElevenLabs)
              mediante API.
            </p>
          </details>
          <details className="p-4 rounded-2xl border bg-white shadow-sm">
            <summary className="cursor-pointer font-medium">
              ¿Se pueden subir PDFs o fotos?
            </summary>
            <p className="mt-2 text-sm text-slate-600">
              Sí, la versión completa extraería texto de PDF/Docx/imagen (OCR) y
              generaría el guion automáticamente.
            </p>
          </details>
          <details className="p-4 rounded-2xl border bg-white shadow-sm">
            <summary className="cursor-pointer font-medium">
              ¿Puedo personalizar el estilo del profesor?
            </summary>
            <p className="mt-2 text-sm text-slate-600">
              Al inicio el personaje es único (Profesor Albert). En planes
              premium se podrían habilitar variaciones de voz, saludo o color de
              pizarra.
            </p>
          </details>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-10 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Profesor Albert · Prototipo UI</p>
        </div>
      </footer>
    </div>
  );
}
