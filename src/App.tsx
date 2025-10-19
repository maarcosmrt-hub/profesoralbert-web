// src/App.tsx
import React, { useState } from "react";

export default function App() {
  const [step, setStep] = useState(1);
  const [inputMode, setInputMode] = useState<"paste" | "file">("paste");
  const [rawNotes, setRawNotes] = useState("");
  const [script, setScript] = useState("");
  // Placeholders vacíos para selects
  const [tone, setTone] = useState("");
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [autoVideo, setAutoVideo] = useState(true);

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
// -------- helpers de mensaje dinámico --------
function pick<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }

function normalize(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Saca 2–3 “temas” simples de los apuntes (muy básico).
function extractTopics(text: string, max = 3) {
  const stop = new Set([
    "el","la","los","las","un","una","unas","unos","de","del","y","o","u","en","para","por","con","sin",
    "que","como","es","son","se","al","lo","su","sus","más","menos","muy","tambien","también","pero",
    "si","no","a","entre","sobre","hasta","desde","cuando","donde","dónde","qué","cuál","cual","porque","porqué",
  ]);
  const words = normalize(text)
    .replace(/[^a-záéíóúüñ0-9\s-]/gi, " ")
    .split(/\s+/)
    .filter(w => w.length > 3 && !stop.has(w));
  const freq: Record<string, number> = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;
  const top = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0, max).map(([w])=>w);
  // “Bonito”
  return top.map(t => t[0].toUpperCase() + t.slice(1));
}

function openings(tone: string, subject: string, level: string) {
  const subj = subject || "la asignatura que elijas";
  const lev  = level   || "el nivel que elijas";
  const base = `Hola, soy el Profesor Albert. Hoy trabajaremos ${subj.toLowerCase()} a nivel ${lev}.`;
  const map: Record<string,string[]> = {
    "formal y académico": [
      `${base} Comenzaremos con un marco conceptual claro para que la explicación sea rigurosa.`,
      `${base} Presentaré los puntos clave de forma ordenada para facilitar la comprensión.`,
    ],
    "divertido y cercano": [
      `${base} Tranquilo, esto va a ser más fácil de lo que parece 😉`,
      `${base} Vamos paso a paso y con ejemplos sencillos, ya verás.`,
    ],
    "claro y motivador": [
      `${base} Lo haremos simple y directo, sin enredos.`,
      `${base} Te acompaño con una explicación clara, con pizarra y ejemplo.`,
    ],
  };
  return pick(map[tone] || map["claro y motivador"]);
}

function planLine(topics: string[]) {
  if (topics.length >= 2) {
    return pick([
      `Para empezar, veremos ${topics[0]}, y después aplicaremos ${topics[1]} con un ejemplo.`,
      `Primero entenderemos ${topics[0]}; luego conectaremos con **${topics[1]}** paso a paso.`,
      `Iniciaremos con ${topics[0]} y continuaremos con ${topics[1]} para fijar ideas.`,
    ]);
  }
  if (topics.length === 1) {
    return pick([
      `Para empezar, vamos a ver ${topics[0]} y practicarlo con un ejercicio breve.`,
      `Arrancamos por ${topics[0]} y lo afianzamos con un ejemplo guiado.`,
    ]);
  }
  return pick([
    "Para empezar, veremos la idea principal y la llevaremos a un ejemplo claro.",
    "Comenzaremos con una definición sencilla y la fijaremos con un ejemplo guiado.",
  ]);
}

function reassurance(tone: string) {
  const map: Record<string,string[]> = {
    "formal y académico": [
      "Al finalizar, dispondrás de una síntesis ordenada para repasar.",
      "Cerraremos con un breve resumen para consolidar el aprendizaje.",
    ],
    "divertido y cercano": [
      "Ya verás que sale solo, ¡lo hacemos juntos!",
      "Verás que no era tan complicado 😉",
    ],
    "claro y motivador": [
      "Vas a ver que es más fácil de lo que parece.",
      "En pocos minutos, lo tendrás claro.",
    ],
  };
  return pick(map[tone] || map["claro y motivador"]);
}

function ctaLine() {
  return pick([
    "Cuando quieras, pulsa abajo para **generar el vídeo**.",
    "Listo: ahora puedes crear el vídeo con un clic.",
    "¿Lo vemos en pizarra? Pulsa para **generar el vídeo**.",
  ]);
}

function buildProfessorMessage(subject: string, level: string, tone: string, raw: string) {
  const intro = openings(tone, subject, level);
  const topics = extractTopics(raw, 3);
  const plan = planLine(topics);
  const extra = reassurance(tone);
  const cta = ctaLine();

  // Bonus: si hay texto pegado, añadimos una “idea principal” breve.
  const idea = raw.trim()
    ? `\n\nIdea principal: ${raw.replace(/\s+/g, " ").slice(0, 160).trim()}…`
    : "";

  return `${intro}

${plan}${idea}

${extra} ${cta}`;
}
// -------- fin helpers --------

 const handleGenerateScript = async () => {
  setLoading(true);
  await new Promise((r) => setTimeout(r, 700));

  const s = buildProfessorMessage(
    subject,
    level,
    (tone || "claro y motivador"),
    rawNotes
  );

  setScript(s);
  setLoading(false);
  setStep(2);

  if (autoVideo) {
    setTimeout(() => {
      handleGenerateVideo();
    }, 300);
  }
};
  
  const handleGenerateVideo = async () => {
    setLoading(true);
    setVideoUrl("");
    await new Promise((r) => setTimeout(r, 1200));
    setVideoUrl("mock://albert-video-ejemplo");
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
            <a className="px-3 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm" href="#ejemplo">
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
              <a href="#ejemplo" className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow">
                Ver ejemplo
              </a>
              <a href="#como-funciona" className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100">
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
            <p className="text-sm text-slate-600 mt-1">Pega o sube tu texto.</p>
          </div>
          <div className="p-5 rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="font-semibold">2 · Preparamos el mensaje</div>
            <p className="text-sm text-slate-600 mt-1">Generamos el mensaje del profesor a partir de tus notas.</p>
          </div>
          <div className="p-5 rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="font-semibold">3 · Exporta el vídeo</div>
            <p className="text-sm text-slate-600 mt-1">Descarga/Comparte cuando esté renderizado.</p>
          </div>
        </div>
      </section>

      {/* Ejemplo */}
      <section id="ejemplo" className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-semibold">Ejemplo</h3>

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
              <p className="text-xs text-slate-500 mt-1">* Ejemplo: no se procesa, es solo UI.</p>
            </div>
          )}

          {/* Selects con placeholder gris */}
          <div className="mt-3 grid sm:grid-cols-3 gap-3">
           {/* ASIGNATURA */}
<select
  value={subject}
  onChange={(e) => setSubject(e.target.value)}
  className={`rounded-xl border p-2 ${subject ? "text-slate-900" : "text-slate-400"}`}
>
  <option value="" disabled className="text-slate-400">Asignatura</option>
  <option className="!text-slate-900">Matemáticas</option>
  <option className="!text-slate-900">Física</option>
  <option className="!text-slate-900">Química</option>
  <option className="!text-slate-900">Historia</option>
  <option className="!text-slate-900">Lengua</option>
</select>

{/* DIFICULTAD */}
<select
  value={level}
  onChange={(e) => setLevel(e.target.value)}
  className={`rounded-xl border p-2 ${level ? "text-slate-900" : "text-slate-400"}`}
>
  <option value="" disabled className="text-slate-400">Dificultad</option>
  <option className="!text-slate-900">Primaria</option>
  <option className="!text-slate-900">ESO</option>
  <option className="!text-slate-900">Bachillerato</option>
  <option className="!text-slate-900">Universidad</option>
</select>

{/* TONO */}
<select
  value={tone}
  onChange={(e) => setTone(e.target.value)}
  className={`rounded-xl border p-2 ${tone ? "text-slate-900" : "text-slate-400"}`}
>
  <option value="" disabled className="text-slate-400">Tono</option>
  <option className="!text-slate-900">claro y motivador</option>
  <option className="!text-slate-900">formal y académico</option>
  <option className="!text-slate-900">divertido y cercano</option>
</select>
          </div>

          <label className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={autoVideo}
              onChange={(e) => setAutoVideo(e.target.checked)}
            />
            Generar vídeo automáticamente tras el mensaje
          </label>

          <div className="mt-4">
            <button
              onClick={handleGenerateScript}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              title={loading ? "Preparando…" : undefined}
            >
              {loading ? "Preparando…" : "Mostrar mensaje del profesor"}
            </button>
          </div>
        </div>

        {/* Mensaje del profesor (antes “2) Guion”) */}
        {step >= 2 && (
          <div className="mt-4 p-5 rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="font-semibold">Mensaje del profesor</div>
            <pre className="mt-2 whitespace-pre-wrap text-sm bg-slate-50 p-3 rounded-xl border">
              {script || "Aquí aparecerá el mensaje del profesor basado en tus apuntes."}
            </pre>
            <div className="mt-3">
              <button
                onClick={handleGenerateVideo}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Preparando vídeo…" : "Generar vídeo"}
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
                Vídeo listo (ejemplo): <code>{videoUrl}</code>
              </div>
            ) : (
              <div className="mt-2 text-sm text-slate-600">Renderizando…</div>
            )}
          </div>
        )}
      </section>

      {/* Precios */}
      <section id="precios" className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-semibold">Precios </h3>
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

      {/* Preguntas frecuentes */}
      <section id="preguntas" className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-semibold">Preguntas frecuentes</h3>
        <div className="mt-4 space-y-3">
          <details className="p-4 rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm">
            <summary className="cursor-pointer font-medium">¿Los vídeos son automáticos?</summary>
            <p className="mt-2 text-sm text-slate-600">
              En este ejemplo solo mostramos la interfaz y el mensaje del profesor. El render de vídeo se añadirá más adelante.
            </p>
          </details>

          <details className="p-4 rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm">
            <summary className="cursor-pointer font-medium">¿Puedo usar mis propios apuntes?</summary>
            <p className="mt-2 text-sm text-slate-600">Sí, pega tu texto o súbelo como archivo.</p>
          </details>

          {/* Nuevas preguntas */}
          <details className="p-4 rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm">
            <summary className="cursor-pointer font-medium">¿Qué formatos de archivo admite?</summary>
            <p className="mt-2 text-sm text-slate-600">
              En este ejemplo trabajamos con texto pegado. Próximamente añadiremos PDF y DOCX.
            </p>
          </details>

          <details className="p-4 rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm">
            <summary className="cursor-pointer font-medium">¿Cuánto tarda en generarse un vídeo?</summary>
            <p className="mt-2 text-sm text-slate-600">
              El mensaje aparece en segundos. El vídeo final puede tardar 1–3 minutos según la cola de render.
            </p>
          </details>

          <details className="p-4 rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm">
            <summary className="cursor-pointer font-medium">¿Funciona en más idiomas?</summary>
            <p className="mt-2 text-sm text-slate-600">
              Sí, el mensaje también funciona en francés. Las voces y subtítulos se añadirán en próximas versiones.
            </p>
          </details>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-10 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-sm text-slate-500 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p>© {new Date().getFullYear()} Profesor Albert · Prototipo UI</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-600">Inicio</a>
            <a href="#ejemplo" className="hover:text-blue-600">Ejemplo</a>
            <a href="mailto:contacto@tudominio.com" className="hover:text-blue-600">Contacto</a>
          </div>
        </div>
      </footer>
    </>
  );
}
