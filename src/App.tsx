// src/App.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Menu, X, Play, BookOpen, ClipboardList, Sparkles, ChevronRight, Check, Info } from "lucide-react";
import { motion } from "framer-motion";

const titleCls = "font-extrabold tracking-tight";
const h1Cls = `${titleCls} text-3xl md:text-4xl leading-tight md:leading-tight`;
const h2Cls = `${titleCls} text-2xl md:text-3xl leading-snug md:leading-snug`;
const proseCls = "max-w-prose text-base md:text-lg leading-7 md:leading-8";

const btnBase = "inline-flex items-center justify-center rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400";
const btnPri  = `${btnBase} h-11 px-5 bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]`;
const btnSec  = `${btnBase} h-11 px-5 border border-slate-300 hover:bg-slate-100`;
const card    = "rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm border-slate-200/70";
const lift    = "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md";
const input   = "rounded-xl border p-2 outline-none focus:ring-2 focus:ring-blue-200 border-slate-300 bg-white";
const selectCls = (v: string) => `${input} ${v ? "text-slate-900" : "text-slate-400"}`;

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200/70 rounded ${className}`} />
);

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      const vis = entries.filter(e => e.isIntersecting).sort((a,b)=> b.intersectionRatio - a.intersectionRatio);
      if (vis[0]) setActive((vis[0].target as HTMLElement).id);
    }, { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.2, 0.5, 0.8, 1]});
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}
function useScrolledShadow(offset = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);
  return scrolled;
}

export default function App() {
  const [step, setStep] = useState(1);
  const [inputMode, setInputMode] = useState<"paste" | "file">("paste");
  const [rawNotes, setRawNotes] = useState("");
  const [script, setScript] = useState("");
  const [tone, setTone] = useState("");
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [autoVideo, setAutoVideo] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [error, setError] = useState<string>("");

  const activeId = useScrollSpy(["como-funciona","ejemplo","precios","preguntas"]);
  const scrolled = useScrolledShadow(8);

  const canGenerate = useMemo(() => {
    const hasNotes = rawNotes.trim().length > 0;
    return hasNotes && !!subject && !!level && !!tone;
  }, [rawNotes, subject, level, tone]);

  // ===== helpers de mensaje (tus originales condensados) =====
  function pick<T>(arr: T[]) { return arr[Math.floor(Math.random() * Math.max(1, arr.length))]; }
  function normalize(s: string) { return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
  function extractTopics(text: string, max = 3) {
    const stop = new Set(["el","la","los","las","un","una","unas","unos","de","del","y","o","u","en","para","por","con","sin","que","como","es","son","se","al","lo","su","sus","más","menos","muy","tambien","también","pero","si","no","a","entre","sobre","hasta","desde","cuando","donde","dónde","qué","cuál","cual","porque","porqué"]);
    const words = normalize(text).replace(/[^a-záéíóúüñ0-9\s-]/gi, " ").split(/\s+/).filter(w => w.length > 3 && !stop.has(w));
    const freq: Record<string, number> = {};
    for (const w of words) freq[w] = (freq[w] || 0) + 1;
    const top = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0, max).map(([w])=>w);
    return top.map(t => t[0].toUpperCase() + t.slice(1));
  }
  function openings(t: string, s: string, l: string) {
    const subj = s || "la asignatura que elijas";
    const lev  = l || "el nivel que elijas";
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
    return pick(map[t] || map["claro y motivador"]);
  }
  function planLine(topics: string[]) {
    if (topics.length >= 2) return pick([`Para empezar, veremos ${topics[0]}, y después aplicaremos ${topics[1]} con un ejemplo.`,`Primero entenderemos ${topics[0]}; luego conectaremos con **${topics[1]}** paso a paso.`,`Iniciaremos con ${topics[0]} y continuaremos con ${topics[1]} para fijar ideas.`]);
    if (topics.length === 1) return pick([`Para empezar, vamos a ver ${topics[0]} y practicarlo con un ejercicio breve.`,`Arrancamos por ${topics[0]} y lo afianzamos con un ejemplo guiado.`]);
    return pick(["Para empezar, veremos la idea principal y la llevaremos a un ejemplo claro.","Comenzaremos con una definición sencilla y la fijaremos con un ejemplo guiado."]);
  }
  function reassurance(t: string) {
    const map: Record<string,string[]> = {
      "formal y académico": ["Al finalizar, dispondrás de una síntesis ordenada para repasar.","Cerraremos con un breve resumen para consolidar el aprendizaje."],
      "divertido y cercano": ["Ya verás que sale solo, ¡lo hacemos juntos!","Verás que no era tan complicado 😉"],
      "claro y motivador": ["Vas a ver que es más fácil de lo que parece.","En pocos minutos, lo tendrás claro."],
    };
    return pick(map[t] || map["claro y motivador"]);
  }
  const ctaLine = () => pick(["Cuando quieras, pulsa abajo para generar el vídeo.","Listo: ahora puedes crear el vídeo con un clic.","¿Lo vemos en pizarra? Pulsa para generar el vídeo."]);
  function buildProfessorMessage(s: string, l: string, t: string, raw: string) {
    const intro = openings(t, s, l);
    const topics = extractTopics(raw, 3);
    const plan = planLine(topics);
    const extra = reassurance(t);
    const cta = ctaLine();
    const idea = raw.trim() ? `\n\nIdea principal: ${raw.replace(/\s+/g, " ").slice(0, 160).trim()}…` : "";
    return `${intro}\n\n${plan}${idea}\n\n${extra} ${cta}`;
  }

  const handleGenerateScript = async () => {
    setError("");
    if (!canGenerate || loading) {
      if (!canGenerate) setError("Pega apuntes y elige Asignatura, Dificultad y Tono.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const s = buildProfessorMessage(subject, level, tone || "claro y motivador", rawNotes);
    setScript(s);
    setLoading(false);
    setStep(2);
    if (autoVideo) setTimeout(handleGenerateVideo, 300);
  };

  const handleGenerateVideo = async () => {
    if (loading) return;
    setLoading(true);
    setVideoUrl("");
    await new Promise((r) => setTimeout(r, 1200));
    setVideoUrl("mock://albert-video-ejemplo");
    setLoading(false);
    setStep(3);
  };

  return (
    <>
      {/* Header fijo */}
      <header className={`sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-slate-200/70 ${scrolled ? "shadow-sm" : ""}`}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-3">
            <img src="/albert.png?v=3" alt="Profesor Albert" className="w-10 h-10 rounded-2xl object-cover shadow-sm" />
            <div>
              <div className="font-semibold tracking-wide">Profesor Albert</div>
              <div className="text-xs text-slate-500">Tu profe IA que explica con pizarra</div>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2 text-sm">
            {[
              {id:"como-funciona", label:"Cómo funciona"},
              {id:"ejemplo", label:"Ejemplo"},
              {id:"precios", label:"Precios"},
              {id:"preguntas", label:"Preguntas frecuentes"}
            ].map(i=>(
              <a key={i.id}
                 href={`#${i.id}`}
                 className={`px-3 py-2 rounded-lg transition ${activeId===i.id ? "text-sky-700 bg-sky-600/10" : "hover:text-sky-600"}`}>
                {i.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a className={`${btnPri}`} href="#ejemplo">
              Probar gratis
            </a>
            {/* Drawer móvil */}
            <button
              aria-label="Abrir menú"
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-slate-300 hover:bg-slate-100"
              onClick={()=>setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={()=>setMobileOpen(false)} />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="absolute right-0 top-0 h-full w-[82%] max-w-xs bg-white border-l border-slate-200 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold">Menú</div>
                <button aria-label="Cerrar menú" onClick={()=>setMobileOpen(false)} className="p-2 rounded-lg hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="mt-4 grid gap-2">
                {[
                  {id:"como-funciona", label:"Cómo funciona"},
                  {id:"ejemplo", label:"Ejemplo"},
                  {id:"precios", label:"Precios"},
                  {id:"preguntas", label:"Preguntas frecuentes"}
                ].map(i=>(
                  <a key={i.id} href={`#${i.id}`} onClick={()=>setMobileOpen(false)}
                     className={`px-3 py-2 rounded-lg ${activeId===i.id?"bg-sky-600/10 text-sky-700":"hover:bg-slate-100"}`}>
                    {i.label}
                  </a>
                ))}
              </nav>
            </motion.aside>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="top" className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white -z-10" />
        <div className="max-w-6xl mx-auto px-4 pt-10 md:pt-14 pb-6 md:pb-8 grid md:grid-cols-2 gap-8 items-center">
          <motion.div initial={{opacity:0, y:10}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.4}}>
            <h1 className={`${h1Cls} text-slate-900`}>
              Convierte tus apuntes en <span className="text-blue-600">vídeos explicativos</span> con un profesor IA
            </h1>
            <p className={`${proseCls} mt-4 text-slate-600`}>
              Pega tus apuntes y recibe un <strong>mensaje del profesor</strong>. Después, genera un <strong>vídeo</strong> en un clic.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a href="#ejemplo" className={`${btnPri}`}>
                <Play className="w-4 h-4 mr-2" /> Ver ejemplo
              </a>
              <a href="#como-funciona" className={`${btnSec}`}>
                Ver cómo funciona
              </a>
            </div>
            <div className="mt-2 text-sm text-slate-500">Sin registro • Gratis</div>
          </motion.div>

          <motion.div initial={{opacity:0, y:10}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.4, delay:0.05}}>
            <div className={`${card} ${lift} p-5`}>
              <div className="flex items-center gap-3">
                <img src="/albert.png?v=3" alt="Profesor Albert" className="w-20 h-20 rounded-2xl object-cover shadow" loading="eager" />
                <div>
                  <div className="text-slate-500 text-sm">Profesor virtual</div>
                  <div className="font-semibold text-lg">Albert</div>
                </div>
              </div>
              <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-4 text-slate-600">
                “Explicaciones claras con pizarra digital.”
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Definición</div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2"><ClipboardList className="w-4 h-4" /> Ejemplo</div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Ejercicio</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="max-w-6xl mx-auto px-4 pt-6 pb-12">
        <h2 className={`${h2Cls}`}>Cómo funciona</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {n:"1", title:"Pega tus apuntes", desc:"Usa el campo de texto o sube un archivo."},
            {n:"2", title:"Elige opciones",   desc:"Asignatura, dificultad y tono. Sin eso, el botón se desactiva."},
            {n:"3", title:"Mensaje y vídeo",  desc:"Ves el mensaje y, si quieres, generas el vídeo."},
          ].map((c)=>(
            <div key={c.n} className={`${card} ${lift} p-5`}>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">{c.n}</div>
                <div className="font-semibold">{c.title}</div>
              </div>
              <p className="mt-2 text-sm text-slate-600">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ejemplo */}
      <section id="ejemplo" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className={`${h2Cls}`}>Ejemplo</h2>

        <div className={`${card} p-5 mt-4`}>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold">1) Apuntes</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setInputMode("paste")} className={`${btnSec} h-9 px-3 ${inputMode==="paste"?"bg-slate-100":""}`}>
                Pegar texto
              </button>
              <button onClick={() => setInputMode("file")} className={`${btnSec} h-9 px-3 ${inputMode==="file"?"bg-slate-100":""}`}>
                Subir archivo
              </button>
            </div>
          </div>

          {inputMode === "paste" ? (
            <div className="relative mt-3">
              <textarea
                className="w-full min-h-[140px] rounded-xl border p-3 outline-none focus:ring-2 focus:ring-blue-200 border-slate-200 bg-slate-50"
                placeholder="Pega aquí tus apuntes o el tema que quieres explicar…"
                value={rawNotes}
                onChange={(e) => setRawNotes(e.target.value.slice(0, 1000))}
              />
              <div className="absolute bottom-2 right-3 text-xs text-slate-400">{rawNotes.length}/1000</div>
            </div>
          ) : (
            <div className="mt-3">
              <input type="file" className={`${input}`} />
              <p className="text-xs text-slate-500 mt-1">* Ejemplo: no se procesa, es solo UI.</p>
            </div>
          )}

          {/* Selects */}
          <div className="mt-3 grid sm:grid-cols-3 gap-3">
            <select value={subject} onChange={(e)=>setSubject(e.target.value)} className={selectCls(subject)}>
              <option value="" disabled>Asignatura</option>
              <option>Matemáticas</option><option>Física</option><option>Química</option><option>Historia</option><option>Lengua</option>
            </select>
            <select value={level} onChange={(e)=>setLevel(e.target.value)} className={selectCls(level)}>
              <option value="" disabled>Dificultad</option>
              <option>Primaria</option><option>ESO</option><option>Bachillerato</option><option>Universidad</option>
            </select>
            <select value={tone} onChange={(e)=>setTone(e.target.value)} className={selectCls(tone)}>
              <option value="" disabled>Tono</option>
              <option>claro y motivador</option><option>formal y académico</option><option>divertido y cercano</option>
            </select>
          </div>

          <label className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={autoVideo} onChange={(e)=>setAutoVideo(e.target.checked)} />
            Generar vídeo automáticamente tras el mensaje
          </label>

          {error && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-300/60 bg-rose-50/70 p-3 text-sm text-rose-700">
              <Info className="w-4 h-4 mt-0.5" /> {error}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={handleGenerateScript}
              disabled={!canGenerate || loading}
              aria-disabled={!canGenerate || loading}
              className={`${btnPri} ${!canGenerate || loading ? "opacity-60 cursor-not-allowed" : ""}`}
              title={!canGenerate ? "Pega apuntes y elige Asignatura, Dificultad y Tono" : undefined}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                  Preparando…
                </span>
              ) : (
                <><Play className="w-4 h-4 mr-2" />Mostrar mensaje del profesor</>
              )}
            </button>
            <button
              onClick={handleGenerateVideo}
              disabled={loading || !script}
              className={`${btnSec} ${loading || !script ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              Generar vídeo
            </button>
          </div>
        </div>

        {/* Mensaje del profesor */}
        {step >= 2 && (
          <div className={`${card} p-5 mt-4`}>
            <div className="font-semibold">Mensaje del profesor</div>
            {!script ? (
              <div className="mt-3 space-y-2">
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-2/5" />
              </div>
            ) : (
              <pre className="mt-2 whitespace-pre-wrap text-sm bg-slate-50 p-3 rounded-xl border border-slate-200">
                {script}
              </pre>
            )}
          </div>
        )}

        {/* Resultado */}
        {step >= 3 && (
          <div className={`${card} p-5 mt-4`}>
            <div className="font-semibold">3) Resultado</div>
            {videoUrl ? (
              <div className="mt-2 text-sm text-slate-600">
                Vídeo listo (ejemplo): <code>{videoUrl}</code>
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-slate-400/70 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-slate-600">Renderizando…</span>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Precios (Pro a 16,99 €/mes) */}
      <section id="precios" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className={`${h2Cls}`}>Precios</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {[
            {title:"Gratis", price:"0 €/mes", bullets:["1 vídeo corto/semana","Marca de agua","Resolución 720p"], tag:null},
            {title:"Estudiante", price:"7,99 €/mes", bullets:["Hasta 20 vídeos/mes","1080p sin marca de agua","Plantillas pizarra + subtítulos"], tag:"Más popular"},
            {title:"Pro (docente)", price:"16,99 €/mes", bullets:["Hasta 100 vídeos/mes","Packs por grupos","Exportación avanzada"], tag:null},
          ].map((p)=>(
            <div key={p.title} className={`${card} ${lift} p-5 relative ${p.tag ? "ring-1 ring-sky-300" : ""}`}>
              {p.tag && <div className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border border-sky-200 text-sky-700 bg-sky-50 absolute -top-2 right-4">{p.tag}</div>}
              <div className="font-semibold">{p.title}</div>
              <div className="text-3xl mt-2 tracking-tight">{p.price}</div>
              <ul className="mt-3 text-sm space-y-2">
                {p.bullets.map((b)=>(
                  <li key={b} className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 text-sky-600" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <button className={`${btnPri} w-full mt-4`}>Elegir plan</button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="preguntas" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className={`${h2Cls}`}>Preguntas frecuentes</h2>
        <div className="mt-4 space-y-3">
          {[
            {q:"¿Los vídeos son automáticos?", a:"En este ejemplo solo mostramos la interfaz y el mensaje del profesor. El render de vídeo se añadirá más adelante."},
            {q:"¿Puedo usar mis propios apuntes?", a:"Sí, pega tu texto o súbelo como archivo."},
            {q:"¿Qué formatos de archivo admite?", a:"En este ejemplo trabajamos con texto pegado. Próximamente añadiremos PDF y DOCX."},
            {q:"¿Cuánto tarda en generarse un vídeo?", a:"El mensaje aparece en segundos. El vídeo final puede tardar 1–3 minutos según la cola de render."},
            {q:"¿Funciona en más idiomas?", a:"Sí, el mensaje también funciona en francés. Las voces y subtítulos se añadirán en próximas versiones."},
          ].map((f, i)=>(
            <details key={i} className={`${card} p-4 group`}>
              <summary className="cursor-pointer font-medium flex items-center justify-between list-none">
                <span>{f.q}</span>
                <span className="transition-transform duration-200 group-open:rotate-90">
                  <ChevronRight className="w-5 h-5" />
                </span>
              </summary>
              <div className="mt-2 text-sm text-slate-600">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/70 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-slate-600 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p>© {new Date().getFullYear()} Profesor Albert · <a className="underline-offset-2 hover:underline" href="mailto:contacto@tudominio.com">Contacto</a></p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-900">Política de privacidad</a>
            <a href="#" className="hover:text-slate-900">Cookies</a>
          </div>
        </div>
      </footer>
    </>
  );
}
