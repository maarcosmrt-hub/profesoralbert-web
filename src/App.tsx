// src/App.tsx
import React, { useState } from "react";

export default function App() {
  const [step, setStep] = useState(1);
  const [inputMode, setInputMode] = useState<"paste" | "file">("paste");
  const [rawNotes, setRawNotes] = useState("");
  const [script, setScript] = useState("");
  const [tone, setTone] = useState("claro y motivador");
  const [subject, setSubject] = useState("Matemáticas");
  const [level, setLevel] = useState("Bachillerato");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const demoExplain = (text: string) => {
    if (!text.trim()) return "";
    const base = text.replace(/\s+/g, " ").slice(0, 300).trim();
    return `Objetivo: entender el tema de forma simple.

Idea principal → ${base}...

Explicación paso a paso:
1) Definición sencilla del concepto.
2) Ejemplo cotidiano para visualizarlo.
3) Mini-ejercicio guiado en la pizarra.
4) Resumen en una frase.`;
  };

  const handleGenerateScript = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const s = `Hola, soy el Profesor Albert. Hoy trabajaremos ${subject.toLowerCase()} a nivel ${level}.

${demoExplain(rawNotes)}

En la pizarra verás un ejemplo y luego un mini-reto. ¡Vamos paso a paso!`;
    setScript(s);
    setLoading(false);
    setStep(2);
  };

  const handleGenerateVideo = async () => {
    setLoading(true);
    setVideoUrl("");
    await new Promise((r) => setTimeout(r, 1200));
    setVideoUrl("mock://albert-video-demo");
    setLoading(false);
    setStep(3);
  };

  return (
    <>
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/albert.png?v=3"
              alt="Profesor Albert"
              className="w-10 h-10 rounded-2xl object-cover shadow-sm"
            />
            <div>
              <div className="font-semibold">Profesor Albert</div>
              <div className="text-xs text-slate-500">
                Tu profe IA que explica con pizarra
              </div>
            </div>
          </div>

         <nav className="hidden md:flex items-center gap-6 text-sm">
  <a className="hover:text-blue-600 transition-colors" href="#como-funciona">Cómo funciona</a>
  <a className="hover:text-blue-600 transition-colors" href="#ejemplo">Ejemplo</a>
  <a className="hover:text-blue-600 transition-colors" href="#precios">Precios</a>
  <a className="hover:text-blue-600 transition-colors" href="#preguntas">Preguntas frecuentes</a>
</nav>

          <div className="flex items-center gap-2">
            <a className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-sm" href="#">
              Entrar
            </a>
            <a className="px-3 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm" href="#demo">
              Probar gratis
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-8 md:pt-12 pb-4 md:pb-6">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Convierte tus apuntes en{" "}
              <span className="text-blue-600">vídeos explicativos</span> con un profesor IA
            </h2>
            <p className="mt-4 text-slate-600">
              Sube tu texto y obtén una explicación clara, con guion pedagógico y pizarra
              dinámica. Ideal para repasar, entender rápido y compartir con tu clase.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              <li>• Avatar consistente: Profesor Albert (bata blanca y fondo aula).</li>
              <li>• Pizarra digital: definición, ejemplo, ejercicio guiado y resumen.</li>
              <li>• Tono: claro y motivador.</li>
            </ul>

            {/* CTA */}
            <div className="mt-4 flex gap-3">
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

          {/* Tarjeta Albert */}
          <div className="p-5 rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src="/albert.png?v=3"
                alt="Profesor Albert"
                className="w-16 h-16 rounded-2xl object-cover shadow"
              />
              <div>
                <div className="text-slate-500 text-sm">Profesor virtual</div>
                <div className="font-semibold text-lg">Albert</div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 border p-4 text-slate-600">
              “Explicaciones claras con pizarra digital.”
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border">Definición</div>
              <div className="p-3 rounded-xl bg-slate-50 border">Ejemplo</div>
              <div className="p-3 rounded-xl bg-slate-50 border">Ejercicio</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="max-w-6xl mx-auto px-4 pt-6 pb-12">
        <h3 className="text-2xl font-semibold">Cómo funciona</h3>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div className="p-5 rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="font-semibold">1 · Pega tus apuntes</div>
            <p className="text-sm text-slate-600 mt-1">Pega o sube tu texto. Albert crea el guion.</p>
          </div>
          <div className="p-5 rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="font-semibold">2 · Genera el guion</div>
            <p className="text-sm text-slate-600 mt-1">Definición, ejemplo, ejercicio guiado y resumen.</p>
          </div>
          <div className="p-5 rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="font-semibold">3 · Exporta el vídeo</div>
            <p className="text-sm text-slate-600 mt-1">Descarga/Comparte cuando esté renderizado.</p>
          </div>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-semibold">Demo</h3>

        {/* Paso 1 */}
        <div className="mt-4 p-5 rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold">1) Apuntes</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setInputMode("paste")}
                className={`px-3 py-1.5 rounded-xl border ${inputMode === "paste" ? "bg-slate-100" : ""}`}
              >
                Pegar texto
              </button>
              <button
                onClick={() => setInputMode("file")}
                className={`px-3 py-1.5 rounded-xl border ${inputMode === "file" ? "bg-slate-100" : ""}`}
              >
                Subir archivo
              </button>
            </div>
          </div>

          {inputMode === "paste" ? (
            <textarea
              className="mt-3 w-full min-h-[120px] rounded-xl border p-3 outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Pega aquí tus apuntes o el tema que quieres explicar…"
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
            />
          ) : (
            <div className="mt-3">
              <input type="file" className="block" />
              <p className="text-xs text-slate-500 mt-1">* Demo: no se procesa, es solo UI.</p>
            </div>
          )}

          <div className="mt-3 grid sm:grid-cols-3 gap-3">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="rounded-xl border p-2"
            >
              <option>Matemáticas</option>
              <option>Física</option>
              <option>Química</option>
              <option>Historia</option>
              <option>Lengua</option>
            </select>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="rounded-xl border p-2"
            >
              <option>Bachillerato</option>
              <option>ESO</option>
              <option>Primaria</option>
              <option>Universidad</option>
            </select>

            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="rounded-xl border p-2"
            >
              <option>claro y motivador</option>
              <option>formal y académico</option>
              <option>divertido y cercano</option>
            </select>
          </div>

          <div className="mt-4">
            <button
              onClick={handleGenerateScript}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Generando guion…" : "Generar guion"}
            </button>
          </div>
        </div>

        {/* Paso 2 */}
        {step >= 2 && (
          <div className="mt-4 p-5 rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="font-semibold">2) Guion</div>
            <pre className="mt-2 whitespace-pre-wrap text-sm bg-slate-50 p-3 rounded-xl border">
              {script || "Aquí aparecerá el guion generado."}
            </pre>
            <div className="mt-3 flex gap-3">
              <button
                onClick={handleGenerateVideo}
                disabled={loading}
                className="px-4 py-2 rounded-xl border hover:bg-slate-100"
              >
                Generar vídeo (demo)
              </button>
              <button className="px-4 py-2 rounded-xl border hover:bg-slate-100" title="Demo">
                Descargar MP4
              </button>
            </div>
          </div>
        )}

        {/* Paso 3 */}
        {step >= 3 && (
          <div className="mt-4 p-5 rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="font-semibold">3) Resultado</div>
            {videoUrl ? (
              <div className="mt-2 text-sm text-slate-600">
                Vídeo listo (demo): <code>{videoUrl}</code>
              </div>
            ) : (
              <div className="mt-2 text-sm text-slate-600">Renderizando…</div>
            )}
          </div>
        )}
      </section>

      {/* Precios */}
      <section id="precios" className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-semibold">Precios (propuesta)</h3>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          {[
            {
              title: "Gratis",
              price: "0 €/mes",
              bullets: ["1 vídeo corto/semana", "Marca de agua", "Resolución 720p"],
            },
            {
              title: "Estudiante",
              price: "7,99 €/mes",
              bullets: ["Hasta 20 vídeos/mes", "1080p sin marca de agua", "Plantillas pizarra + subtítulos"],
            },
            {
              title: "Pro (docente)",
              price: "19,99 €/mes",
              bullets: ["Hasta 100 vídeos/mes", "Packs por grupos", "Exportación avanzada"],
            },
          ].map((p) => (
            <div key={p.title} className="p-5 rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm">
              <div className="font-semibold">{p.title}</div>
              <div className="text-2xl mt-2">{p.price}</div>
              <ul className="mt-3 text-sm space-y-1">
                {p.bullets.map((b) => (
                  <li key={b}>• {b}</li>
                ))}
              </ul>
              <button className="mt-4 w-full px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                Elegir plan
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-semibold">FAQ</h3>
        <div className="mt-4 space-y-3">
          <details className="p-4 rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm">
            <summary className="cursor-pointer font-medium">¿Los vídeos son automáticos?</summary>
            <p className="mt-2 text-sm text-slate-600">
              En esta demo solo mostramos la interfaz y el guion. El render de vídeo se añadirá más adelante.
            </p>
          </details>
          <details className="p-4 rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm">
            <summary className="cursor-pointer font-medium">¿Puedo usar mis propios apuntes?</summary>
            <p className="mt-2 text-sm text-slate-600">Sí, pega tu texto o súbelo como archivo.</p>
          </details>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-10 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-sm text-slate-500 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p>© {new Date().getFullYear()} Profesor Albert · Prototipo UI</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-600">Inicio</a>
            <a href="#demo" className="hover:text-blue-600">Demo</a>
            <a href="mailto:contacto@tudominio.com" className="hover:text-blue-600">Contacto</a>
          </div>
        </div>
      </footer>
    </>
  );
}

