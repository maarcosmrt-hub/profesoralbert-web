import { useEffect, useMemo, useRef, useState } from "react";

// =====================
// Helpers
// =====================
type Level = "Fácil" | "Media" | "Difícil";
type Tone = "Amable" | "Motivador" | "Serio";

function buildProfessorMessage({
  notes,
  subject,
  level,
  tone,
}: {
  notes: string;
  subject: string;
  level: Level;
  tone: Tone;
}) {
  // Mock simple: en tu proyecto ya tienes helpers propios; aquí solo dejamos un fallback.
  const intro =
    tone === "Amable"
      ? "Hola, soy el Profesor Albert. Vamos despacio y con buen rollo."
      : tone === "Motivador"
      ? "¡Hola! Soy el Profesor Albert. ¡Vamos a por ello, paso a paso!"
      : "Buenas. Soy el Profesor Albert. Seré directo y claro.";
  return `${intro}

Hoy trabajaremos ${subject} a nivel ${level}. He leído tus apuntes y esto es lo esencial:

${notes.trim().slice(0, 400)}${notes.length > 400 ? "…" : ""}

Resumen:
1) Qué debes entender primero.
2) Un ejemplo típico.
3) Un mini-ejercicio para practicar.

Cuando quieras, pulsa abajo para generar el vídeo.`;
}

// Límite semanal: 1 uso (versión localStorage; backend real más tarde)
const QUOTA_KEY = "pa_free_last_use_iso";
function canUseFree() {
  const last = localStorage.getItem(QUOTA_KEY);
  if (!last) return true;
  const lastDate = new Date(last);
  const now = new Date();
  const diffDays = (now.getTime() - lastDate.getTime()) / 86_400_000;
  return diffDays >= 7;
}
function markUsed() {
  localStorage.setItem(QUOTA_KEY, new Date().toISOString());
}

// Scroll-spy hook
function useScrollSpy(ids: string[], rootMargin = "-45% 0px -50% 0px") {
  const [activeId, setActiveId] = useState<string | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin, threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids, rootMargin]);
  return activeId;
}

// =====================
// Componentes UI
// =====================
function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    // Este estado inicial se replica en index.html para evitar FOUC
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      className="rounded-xl px-3 py-2 border border-white/20 bg-white/70 dark:bg-white/5 hover:bg-white/90 transition"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Cambiar tema"
      title="Cambiar tema"
    >
      {theme === "dark" ? "☀️ Claro" : "🌙 Oscuro"}
    </button>
  );
}

function Navbar() {
  const sections = ["como-funciona", "ejemplo", "precios", "faq"] as const;
  const activeId = useScrollSpy(sections as unknown as string[]);

  const base =
    "px-3 py-2 rounded-lg transition hover:text-sky-600 dark:hover:text-sky-400";
  const active =
    "text-sky-700 dark:text-sky-300 bg-sky-600/10 dark:bg-sky-400/10";

  return (
    <nav className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/30 border-b border-black/5 dark:border-white/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 p-2">
        <a href="#top" className="flex items-center gap-2">
          <img src="/albert.png" alt="Profesor Albert" className="w-8 h-8 rounded-xl" />
          <span className="font-semibold">Profesor Albert</span>
        </a>
        <div className="flex items-center gap-1">
          {sections.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={`${base} ${activeId === id ? active : ""}`}
            >
              {id === "como-funciona"
                ? "Cómo funciona"
                : id === "ejemplo"
                ? "Ejemplo"
                : id === "precios"
                ? "Precios"
                : "Preguntas frecuentes"}
            </a>
          ))}
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <header id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100 to-white dark:from-slate-900 dark:to-black pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 py-12 flex flex-col-reverse md:flex-row items-center gap-8">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
            Aprende con <span className="text-sky-600">IA</span> a tu ritmo.
          </h1>
          <p className="mt-4 text-lg opacity-80">
            Pega tus apuntes y recibe un <strong>mensaje del profesor</strong> claro y motivador.
            Luego, genera un <strong>vídeo</strong> en un clic.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href="#ejemplo"
              className="rounded-2xl px-5 py-3 bg-sky-600 text-white font-medium hover:bg-sky-700 transition shadow"
            >
              Probar el ejemplo
            </a>
            <a
              href="#como-funciona"
              className="rounded-2xl px-5 py-3 bg-white/70 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:bg-white/90 transition"
            >
              Cómo funciona
            </a>
          </div>
        </div>
        <div className="flex-1 w-full">
          <div className="relative rounded-3xl p-1 bg-gradient-to-br from-white/60 to-white/20 dark:from-white/10 dark:to-white/5">
            <div className="rounded-3xl p-6 bg-white/70 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-xl">
              <img
                src="/albert.png"
                alt="Avatar Profesor Albert"
                className="w-full h-auto rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl sm:text-4xl font-bold">Cómo funciona</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            {
              title: "1. Pega tus apuntes",
              desc: "Usa el campo de texto o sube un archivo.",
            },
            {
              title: "2. Elige opciones",
              desc: "Asignatura, dificultad y tono. Sin eso, el botón se desactiva.",
            },
            {
              title: "3. Mensaje y vídeo",
              desc: "Ves el mensaje del profesor y, si quieres, generas un vídeo.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl p-6 bg-white/70 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow"
            >
              <h3 className="font-semibold">{c.title}</h3>
              <p className="mt-2 opacity-80">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExampleForm() {
  const [notes, setNotes] = useState("");
  const [subject, setSubject] = useState<string>("");
  const [level, setLevel] = useState<Level | "">("");
  const [tone, setTone] = useState<Tone | "">("");
  const [autoVideo, setAutoVideo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const canGenerate = useMemo(() => {
    const hasNotes = notes.trim().length > 0;
    return hasNotes && !!subject && !!level && !!tone;
  }, [notes, subject, level, tone]);

  const quotaOk = useMemo(() => {
    try {
      return canUseFree();
    } catch {
      return true; // Por si localStorage no está disponible
    }
  }, [notes, subject, level, tone]);

  const handleGenerateMessage = async () => {
    setError("");
    if (!canGenerate) return;
    if (!quotaOk) {
      setError("Has usado tu mensaje gratis esta semana. Suscríbete para seguir generando.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const msg = buildProfessorMessage({
      notes,
      subject,
      level: level as Level,
      tone: tone as Tone,
    });
    setMessage(msg);
    markUsed(); // Marca consumo gratis
    setLoading(false);
    if (autoVideo) {
      handleGenerateVideo();
    }
  };

  const handleGenerateVideo = () => {
    alert("🎬 Vídeo generado (mock).");
  };

  const baseSelect =
    "rounded-xl p-2 bg-white/70 dark:bg-white/5 border border-black/5 dark:border-white/10 text-gray-500 has-[option:checked]:text-gray-900 dark:has-[option:checked]:text-white";

  return (
    <div className="space-y-4">
      <textarea
        className="w-full h-40 rounded-xl p-3 bg-white/70 dark:bg-white/5 border border-black/5 dark:border-white/10 outline-none"
        placeholder="Pega aquí tus apuntes…"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select
          className={baseSelect}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          <option value="" disabled>
            Asignatura (elige)
          </option>
          <option>Matemáticas</option>
          <option>Física</option>
          <option>Química</option>
          <option>Historia</option>
          <option>Lengua</option>
          <option>Biología</option>
        </select>
        <select
          className={baseSelect}
          value={level}
          onChange={(e) => setLevel(e.target.value as Level)}
        >
          <option value="" disabled>
            Dificultad (elige)
          </option>
          <option value="Fácil">Fácil</option>
          <option value="Media">Media</option>
          <option value="Difícil">Difícil</option>
        </select>
        <select
          className={baseSelect}
          value={tone}
          onChange={(e) => setTone(e.target.value as Tone)}
        >
          <option value="" disabled>
            Tono (elige)
          </option>
          <option value="Amable">Amable</option>
          <option value="Motivador">Motivador</option>
          <option value="Serio">Serio</option>
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm opacity-80">
        <input
          type="checkbox"
          checked={autoVideo}
          onChange={(e) => setAutoVideo(e.target.checked)}
        />
        Generar vídeo automáticamente tras el mensaje
      </label>

      {!!error && (
        <div className="rounded-xl p-3 border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-xl px-4 py-2 font-medium bg-sky-600 text-white hover:bg-sky-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleGenerateMessage}
          disabled={!canGenerate || loading}
          aria-disabled={!canGenerate || loading}
        >
          {loading ? "Generando…" : "Mostrar mensaje del profesor"}
        </button>
        <button
          className="rounded-xl px-4 py-2 font-medium bg-white/70 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleGenerateVideo}
          disabled={!message}
        >
          Generar vídeo
        </button>
      </div>

      {message && (
        <div className="rounded-2xl p-4 bg-white/70 dark:bg-white/5 border border-black/5 dark:border-white/10 whitespace-pre-wrap">
          {message}
        </div>
      )}
    </div>
  );
}

function ExampleSection() {
  return (
    <section id="ejemplo" className="scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl sm:text-4xl font-bold">Ejemplo</h2>
          <span className="text-sm opacity-70">
            Gratis: 1 mensaje/semana
          </span>
        </div>
        <div className="mt-6 rounded-3xl p-6 bg-white/70 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow">
          <ExampleForm />
        </div>
      </div>
    </section>
  );
}

function Prices() {
  const plans = [
    {
      name: "Gratis",
      price: "0 €",
      features: ["1 mensaje/semana", "Generación de vídeo de prueba", "Soporte básico"],
      cta: "Empieza gratis",
      tone: "free" as const,
    },
    {
      name: "Estudiante",
      price: "4,99 € / mes",
      features: ["Mensajes ilimitados", "Vídeos HD", "Prioridad en cola"],
      cta: "Suscribirme",
      tone: "primary" as const,
    },
    {
      name: "Pro",
      price: "12,99 € / mes",
      features: ["Todo Estudiante", "Exportaciones avanzadas", "Soporte prioritario"],
      cta: "Ir a Pro",
      tone: "secondary" as const,
    },
  ];

  return (
    <section id="precios" className="scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl sm:text-4xl font-bold">Precios</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-3xl p-6 border shadow bg-white/70 dark:bg-white/5 border-black/5 dark:border-white/10`}
            >
              <h3 className="text-xl font-semibold">{p.name}</h3>
              <p className="mt-2 text-2xl font-extrabold">{p.price}</p>
              <ul className="mt-4 space-y-2 opacity-90">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span>✔️</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`mt-6 w-full rounded-xl px-4 py-2 font-medium transition ${
                  p.tone === "primary"
                    ? "bg-sky-600 text-white hover:bg-sky-700"
                    : p.tone === "secondary"
                    ? "bg-slate-800 text-white hover:bg-slate-900"
                    : "bg-white/70 dark:bg-white/10 border border-black/5 dark:border-white/10 hover:bg-white/90"
                }`}
                onClick={() => alert(`Checkout mock: ${p.name}`)}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "¿Qué hace exactamente el ejemplo?",
      a: "Genera un mensaje del profesor a partir de tus apuntes y opciones (asignatura, dificultad y tono).",
    },
    {
      q: "¿El vídeo es real?",
      a: "De momento es un mock de resultado. En planes de pago habrá vídeo real con más opciones.",
    },
    {
      q: "¿Por qué el botón a veces está desactivado?",
      a: "Necesitas pegar apuntes y elegir asignatura, dificultad y tono.",
    },
    {
      q: "¿Hay límite en el plan gratis?",
      a: "Sí, 1 mensaje por semana (luego puedes suscribirte).",
    },
    {
      q: "¿Puedo usarlo en móvil?",
      a: "Sí, está optimizado para pantallas pequeñas y tema oscuro.",
    },
  ];
  return (
    <section id="faq" className="scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl sm:text-4xl font-bold">Preguntas frecuentes</h2>
        <div className="mt-6 divide-y divide-black/5 dark:divide-white/10 rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 overflow-hidden">
          {faqs.map((f, i) => (
            <details key={f.q} className="group open:bg-white/80 dark:open:bg-white/10 p-4">
              <summary className="cursor-pointer font-medium">
                {i + 1}. {f.q}
              </summary>
              <p className="mt-2 opacity-80">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  // Para el scroll suave si tu Tailwind base no lo incluye
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  // Truco: ancla fantasma superior para #top
  const topRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-slate-100">
      <div ref={topRef} id="top" />
      <Navbar />
      <Hero />
      <main>
        <HowItWorks />
        <ExampleSection />
        <Prices />
        <FAQ />
      </main>
      <footer className="border-t border-black/5 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-10 text-sm opacity-70">
          © {new Date().getFullYear()} Profesor Albert. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
