"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { Outfit } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Icon } from "@phosphor-icons/react";
import {
  ArrowUpRight,
  CaretLeft,
  CaretRight,
  Crosshair,
  FacebookLogo,
  InstagramLogo,
  Lifebuoy,
  List,
  MapPin,
  NavigationArrow,
  Phone,
  Scales,
  TiktokLogo,
  WhatsappLogo,
  Wrench,
  X,
} from "@phosphor-icons/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const outfit = Outfit({ subsets: ["latin"], display: "swap" });

/* -------------------------------------------------------------------------- */
/*  DATOS DEL NEGOCIO (editar aqui)                                           */
/* -------------------------------------------------------------------------- */

const BUSINESS_NAME = "Golden Tires";
const PHONE_DISPLAY = "(305) 333-4411";
const PHONE_TEL = "tel:+13053334411";

// [WHATSAPP] Solo digitos con codigo de pais, ej. "13053334411".
// Mientras SHOW_WHATSAPP sea false, todo usa el telefono.
const SHOW_WHATSAPP = true;
const WHATSAPP_NUMBER = "+13053334411";
const waHref = (msg: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

const ADDRESS = "581 W 28th St, Hialeah, FL 33010"; // verificar contra la ficha de Maps
const MAPS_PLACE_URL =
  "https://www.google.com/maps/place/GOLDEN+TIRES/@25.8474104,-80.3041874,15z/data=!3m1!4b1!4m6!3m5!1s0x88d9bb9da6badd09:0x85500cbc8a079ebf!8m2!3d25.8473915!4d-80.2938876!16s%2Fg%2F11fvyv926y";
const COORDS = { lat: 25.8473915, lng: -80.2938876 };
const MAPS_EMBED_URL = `https://www.google.com/maps?q=${COORDS.lat},${COORDS.lng}&z=17&output=embed`;
const MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${COORDS.lat},${COORDS.lng}`;

// Verificar, dato de 2023. Indice 0 = lunes.
const HOURS: { day: string; hours: string }[] = [
  { day: "Lunes", hours: "8:00 AM - 6:00 PM" },
  { day: "Martes", hours: "8:00 AM - 6:00 PM" },
  { day: "Miércoles", hours: "8:00 AM - 6:00 PM" },
  { day: "Jueves", hours: "8:00 AM - 6:00 PM" },
  { day: "Viernes", hours: "8:00 AM - 6:00 PM" },
  { day: "Sábado", hours: "8:00 AM - 4:00 PM" },
  { day: "Domingo", hours: "Cerrado" },
];
// Mantener en sincronia con HOURS
const HOURS_SUMMARY = [
  "Lun - Vie: 8:00 AM - 6:00 PM",
  "Sáb: 8:00 AM - 4:00 PM",
  "Dom: cerrado",
];

// Facebook y TikTok: agregar URL y aparecen solos
const SOCIALS = [
  { name: "Instagram", url: "https://www.instagram.com/goldentires_/", Icon: InstagramLogo },
  { name: "Facebook", url: "", Icon: FacebookLogo }, // [URL]
  { name: "TikTok", url: "", Icon: TiktokLogo }, // [URL]
].filter((s) => s.url);

// [MARCAS] Solo marcas confirmadas. Si queda vacio, el marquee muestra categorias.
const BRANDS: string[] = [];
const MARQUEE_FALLBACK = ["Llantas", "Rines", "Montaje", "Balanceo", "Alineación", "Hialeah"];

// Ajustar a lo que el negocio realmente ofrece
const SERVICES: { name: string; Icon: Icon }[] = [
  { name: "Montaje de llantas", Icon: Wrench },
  { name: "Balanceo", Icon: Scales },
  { name: "Alineación", Icon: Crosshair },
  { name: "Reparación de ponchaduras", Icon: Lifebuoy },
];

/* -------------------------------------------------------------------------- */
/*  IMAGENES (reemplazar por fotos reales del local)                          */
/* -------------------------------------------------------------------------- */

const IMAGES = {
  hero: "", // foto propia del local; si esta vacio se usa la textura CSS
  turismo: "https://picsum.photos/seed/tire-sedan/1200/1200",
  rines: "https://picsum.photos/seed/alloy-wheel/1200/800",
  suv: "https://picsum.photos/seed/suv-truck/800/800",
  performance: "https://picsum.photos/seed/sport-tire/800/800",
  servicio: "https://picsum.photos/seed/tire-garage/1600/700",
  pillA: "https://picsum.photos/seed/tread-detail/400/200",
  pillB: "https://picsum.photos/seed/rim-detail/400/200",
  pillC: "https://picsum.photos/seed/garage-lift/400/200",
  portraits: [
    "https://picsum.photos/seed/driver-one/600/800",
    "https://picsum.photos/seed/driver-two/600/800",
    "https://picsum.photos/seed/driver-three/600/800",
    "https://picsum.photos/seed/driver-four/600/800",
  ],
};

/* -------------------------------------------------------------------------- */
/*  PRODUCTOS (price null = "Cotiza tu medida")                               */
/* -------------------------------------------------------------------------- */

type Product = {
  id: string;
  name: string;
  price: number | null;
  image: string;
  span: string;
  big?: boolean;
};

const PRODUCTS: Product[] = [
  { id: "turismo", name: "Llantas para turismo", price: null, image: '/tour.jpg', span: "md:col-span-2 md:row-span-2", big: true },
  { id: "rines", name: "Rines", price: null, image: '/hero2.jpg', span: "md:col-span-2 md:row-span-1" },
  { id: "suv", name: "SUV y camioneta", price: null, image: "/SUV.jpg", span: "md:col-span-1 md:row-span-1" },
  { id: "performance", name: "Alto rendimiento", price: null, image: "/high.jpg", span: "md:col-span-1 md:row-span-1" },
  { id: "servicio", name: "Montaje, balanceo y alineación", price: null, image: "/shop.jpg", span: "md:col-span-4 md:row-span-1", big: true },
];

/* -------------------------------------------------------------------------- */
/*  RESENAS: REEMPLAZAR con resenas reales de Google. No inventar estrellas.  */
/* -------------------------------------------------------------------------- */

const REVIEWS_ARE_PLACEHOLDER = false;
const REVIEWS = [
  { quote: "Servicio, amable y rápido. Muy conocedores de lo que hacen. Los recomeniendo al 100%", author: "Jennifer Fulop", image: "/Op3.png" },
  { quote: "Calidad rapidez y buenos precios y muy buen trato los recomiendo como cliente viejo que soy", author: "Alberto Hernandez Villegas", image: "/Op2.png" },
  { quote: "Excelente el trabajo de estos muchachos. Rápido, precio excepcional, sin duda de los mejores de Miami.  Te dan precio real y no varía a la hora de cobrarte.", author: "Erislandy Amaya", image: "/Op1.png" },
  { quote: "Muy buena experiencia te ayudan y el servicio es muy rápido los recomiendo al 100 ..5 estrellas para estos muchachos", author: "Yenier Martinez", image: "/Op4.png" },
];

/* -------------------------------------------------------------------------- */
/*  FRASE CON SCRUBBING                                                       */
/* -------------------------------------------------------------------------- */

type Token = { type: "word"; text: string } | { type: "pill"; src: string };

const PHRASE: Token[] = [
  { type: "word", text: "Llantas" },
  { type: "pill", src: IMAGES.pillA },
  { type: "word", text: "nuevas," },
  { type: "word", text: "rines" },
  { type: "pill", src: IMAGES.pillB },
  { type: "word", text: "y" },
  { type: "word", text: "montaje" },
  { type: "pill", src: IMAGES.pillC },
  { type: "word", text: "en" },
  { type: "word", text: "un" },
  { type: "word", text: "solo" },
  { type: "word", text: "lugar." },
];

const NAV_LINKS = [
  { label: "Llantas", href: "#llantas" },
  { label: "Servicios", href: "#servicios" },
  { label: "Reseñas", href: "#resenas" },
  { label: "Ubicación", href: "#ubicacion" },
];

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;

/* -------------------------------------------------------------------------- */
/*  NAV                                                                       */
/* -------------------------------------------------------------------------- */

function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-4 z-50 px-4">
      <div className="mx-auto max-w-5xl">
        <nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl md:px-6">
          <a href="#inicio" className="text-xl tracking-tight text-[#F4F1EA]" aria-label={BUSINESS_NAME}>
            <span className="font-extralight">GOLDEN</span>
            <span className="ml-1.5 font-black text-[#F5A300]">TIRES</span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-[#F4F1EA]/80 transition-colors hover:text-white">
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-5 md:flex">
            <a href={PHONE_TEL} className="flex items-center gap-2 text-sm font-medium text-[#F4F1EA]">
              <Phone size={18} weight="fill" className="text-[#F5A300]" />
              {PHONE_DISPLAY}
            </a>
            <a href="#cotiza" className="rounded-full bg-[#F5A300] px-5 py-2 text-sm font-bold text-[#0A0A0B] transition-colors hover:bg-[#F4F1EA]">
              Cotizar
            </a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <a href={PHONE_TEL} aria-label="Llamar" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5A300] text-[#0A0A0B]">
              <Phone size={20} weight="fill" />
            </a>
            <button
              type="button"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-[#F4F1EA]"
            >
              {open ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="mt-2 flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#0A0A0B]/90 p-6 backdrop-blur-xl md:hidden">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-lg text-[#F4F1EA]">
                {l.label}
              </a>
            ))}
            <a href="#cotiza" onClick={() => setOpen(false)} className="rounded-full bg-[#F5A300] px-5 py-3 text-center font-bold text-[#0A0A0B]">
              Cotizar
            </a>
          </div>
        )}
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  PAGINA                                                                    */
/* -------------------------------------------------------------------------- */

export default function Page() {
  const rootRef = useRef<HTMLElement>(null);
  const locSectionRef = useRef<HTMLElement>(null);
  const locLeftRef = useRef<HTMLDivElement>(null);

  const [today, setToday] = useState(-1);
  const [size, setSize] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const short = new Date().toLocaleDateString("en-US", {
      weekday: "short",
      timeZone: "America/New_York",
    });
    setToday(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(short));
  }, []);

  const review = REVIEWS[index];
  const nextReview = REVIEWS[(index + 1) % REVIEWS.length];
  const prev = () => setIndex((i) => (i - 1 + REVIEWS.length) % REVIEWS.length);
  const next = () => setIndex((i) => (i + 1) % REVIEWS.length);

  const marqueeItems = BRANDS.length > 0 ? BRANDS : MARQUEE_FALLBACK;
  const marqueeHalf = [...marqueeItems, ...marqueeItems];

  const quoteMessage = `Hola ${BUSINESS_NAME}, quiero cotizar llantas.${size.trim() ? ` Mi medida es ${size.trim()}.` : ""}`;
  const primaryHref = SHOW_WHATSAPP ? waHref(quoteMessage) : PHONE_TEL;

  /* Animaciones globales */
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      // Hero
      gsap.from(".hero-line", { y: 50, opacity: 0, duration: 1.1, stagger: 0.15, ease: "power3.out" });
      gsap.from(".hero-fade", { y: 24, opacity: 0, duration: 0.9, delay: 0.55, stagger: 0.12, ease: "power3.out" });

      // Marquee infinito
      gsap.to(".marquee-track", { xPercent: -50, duration: 40, ease: "none", repeat: -1 });

      // Entrada del bento
      const grid = root.querySelector<HTMLElement>(".bento-grid");
      if (grid) {
        gsap.from(".bento-card", {
          y: 60,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: grid, start: "top 80%", toggleActions: "play none none none" },
        });
      }

      // Scrubbing: cada palabra pasa de 0.1 a 1.0 en secuencia
      const phrase = root.querySelector<HTMLElement>(".scrub-phrase");
      if (phrase) {
        gsap.fromTo(
          ".scrub",
          { opacity: 0.1 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.15,
            scrollTrigger: { trigger: phrase, start: "top 80%", end: "bottom 45%", scrub: true },
          }
        );
      }

      // Retratos: scale 0.8 a 1.0 al entrar, opacity 0.2 al salir
      gsap.utils.toArray<HTMLElement>(".portrait-scroll", root).forEach((el) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 95%", end: "bottom 5%", scrub: true },
        });
        tl.fromTo(el, { scale: 0.8, opacity: 1 }, { scale: 1, duration: 0.45, ease: "none" }).to(
          el,
          { opacity: 0.2, duration: 0.45, ease: "none" },
          0.55
        );
      });

      // Pin split de ubicacion (solo desde lg)
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        if (!locSectionRef.current || !locLeftRef.current) return;
        ScrollTrigger.create({
          trigger: locSectionRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: locLeftRef.current,
          pinSpacing: false,
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  /* Cambio de resena */
  useGSAP(
    () => {
      gsap.fromTo(
        ".slide-anim",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" }
      );
    },
    { scope: rootRef, dependencies: [index] }
  );

  return (
    <main
      ref={rootRef}
      className={`${outfit.className} w-full max-w-full overflow-x-hidden bg-[#0A0A0B] text-[#F4F1EA] antialiased`}
    >
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      <Nav />

      {/* ATTENTION: Hero Cinematic Center */}
      <section
        id="inicio"
        className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#0A0A0B] px-6 pb-24 pt-32"
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(/hero3.jpg)",
            backgroundPosition:
              "center",
            backgroundSize:
              "cover",
          }}
        />
        {IMAGES.hero ? (
          <img
            src='{IMAGES.hero}'
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-60 contrast-125 grayscale"
          />
        ) : null}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at center, rgba(10,10,11,0.35) 0%, rgba(10,10,11,0.92) 78%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />

        <div className="relative z-10 flex w-full max-w-6xl flex-col items-center text-center">
          <h1
            className="w-full max-w-6xl leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(2.6rem, 9vw, 7.5rem)" }}
          >
            <span className="hero-line block whitespace-nowrap font-extralight text-[#F4F1EA]">
              LAS MEJORES
            </span>
            <span className="hero-line block whitespace-nowrap">
              <span
                className="inline-block font-black text-[#F5A300]"
                style={{ transform: "skewX(-8deg)" }}
              >
                LLANTAS
              </span>
            </span>
          </h1>

          <p className="hero-fade mt-6 text-lg font-light text-[#F4F1EA]/80 md:text-2xl">
            Llantas, rines y montaje en Hialeah.
          </p>

          <div className="hero-fade mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
            <a
              href="#cotiza"
              className="inline-flex h-14 w-full items-center justify-center rounded-full bg-[#F5A300] px-8 text-lg font-bold text-[#0A0A0B] transition-colors hover:bg-[#F4F1EA] sm:w-auto"
            >
              Cotizar llantas
            </a>
            <a
              href={PHONE_TEL}
              className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full border border-white px-8 text-lg font-bold text-white transition-colors hover:bg-white hover:text-[#0A0A0B] sm:w-auto"
            >
              <Phone size={22} weight="fill" />
              Llamar ahora
            </a>
          </div>
        </div>
      </section>

      {/* INTEREST: Marquee */}
      <section aria-label="Marcas y categorias" className="overflow-hidden border-y border-white/10 bg-[#0A0A0B] py-10">
        <div className="marquee-track flex w-max items-center">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
              {marqueeHalf.map((item, i) => (
                <div key={`${copy}-${i}`} className="flex items-center">
                  <span
                    className="cursor-default px-8 font-black uppercase text-[#6B6B70] transition-colors duration-300 hover:text-[#F5A300]"
                    style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
                  >
                    {item}
                  </span>
                  <span className="h-3 w-3 rounded-full bg-[#F5A300]" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* INTEREST: Lo mas pedido (seccion clara) */}
      <section id="llantas" className="scroll-mt-24 bg-[#EDEDED] py-32 text-[#0A0A0B] md:py-48">
        <div className="mb-14 w-full bg-[#F5A300]">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <h2 className="text-2xl font-extrabold uppercase tracking-tight text-[#0A0A0B] md:text-4xl">
              Lo más pedido
            </h2>
            <a href="#cotiza" className="hidden text-sm font-bold text-[#0A0A0B] underline underline-offset-4 sm:block">
              Cotiza tu medida
            </a>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6">
          <div className="bento-grid grid grid-flow-dense auto-rows-[280px] grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-[repeat(3,240px)]">
            {PRODUCTS.map((p) => (
              <a
                key={p.id}
                href="#cotiza"
                className={`bento-card group relative block overflow-hidden bg-[#141416] ${p.span}`}
              >
                <img
                  src={p.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover brightness-75 contrast-125 grayscale transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 pr-20 text-[#F4F1EA] md:p-8 md:pr-24">
                  <h3
                    className={`${p.big ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"} font-extrabold leading-tight`}
                  >
                    {p.name}
                  </h3>
                  <p className="mt-2 text-sm text-[#F4F1EA]/80 md:text-base">
                    {p.price !== null ? `Desde $${p.price}` : "Cotiza tu medida"}
                  </p>
                </div>
                <span className="absolute bottom-0 right-0 flex h-14 w-14 items-center justify-center bg-[#F5A300] text-[#0A0A0B] transition-colors duration-300 group-hover:bg-[#F4F1EA]">
                  <ArrowUpRight size={24} weight="bold" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* INTEREST: Por que Golden Tires (frase con scrubbing) + servicios */}
      <section id="servicios" className="relative scroll-mt-24 bg-[#0A0A0B] py-32 md:py-48">
        <div className="mx-auto max-w-7xl px-6">
          <p
            className="scrub-phrase max-w-6xl font-semibold leading-[1.1] tracking-tight text-[#F4F1EA]"
            style={{ fontSize: "clamp(2.2rem, 5.5vw, 5.5rem)" }}
          >
            {PHRASE.map((t, i) =>
              t.type === "word" ? (
                <span key={i} className="scrub mr-[0.28em] inline-block">
                  {t.text}
                </span>
              ) : (
                <span
                  key={i}
                  aria-hidden
                  className="scrub mr-[0.28em] inline-block h-[0.72em] w-[1.5em] rounded-full bg-cover bg-center align-middle contrast-125 grayscale"
                  style={{ display: "none" }}
                />
              )
            )}
          </p>

          <ul className="mt-20 divide-y divide-white/10 border-y border-white/10 md:mt-28">
            {SERVICES.map(({ name, Icon: ServiceIcon }) => (
              <li key={name} className="flex items-center gap-5 py-6 text-xl font-medium text-[#F4F1EA] md:text-2xl">
                <ServiceIcon size={30} weight="duotone" className="text-[#F5A300]" />
                {name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* DESIRE: Resenas */}
      <section id="resenas" className="relative scroll-mt-24 overflow-hidden bg-[#141416] py-32 md:py-48">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#F5A300]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-[#F4502A]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6">
          <h2
            className="mb-16 leading-none tracking-tight md:mb-24"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}
          >
            <span className="block font-extralight text-[#F4F1EA]">Lo que dicen</span>
            <span className="block font-black text-[#F5A300]">nuestros clientes</span>
          </h2>

          <div className="grid items-center gap-16 lg:grid-cols-12">
            <div className="flex justify-center lg:col-span-5">
              <div className="relative h-[420px] w-[300px] sm:w-[340px]">
                <div className="portrait-scroll absolute left-0 top-0 h-[380px] w-[260px] overflow-hidden rounded-2xl">
                  <img
                    key={`a-${index}`}
                    src={review.image}
                    alt="Cliente de Golden Tires"
                    className="slide-anim h-full w-full object-cover contrast-125 grayscale"
                  />
                </div>
                <div className="portrait-scroll absolute bottom-0 right-0 h-[220px] w-[170px] overflow-hidden rounded-2xl border-4 border-[#141416]">
                  <img
                    key={`b-${index}`}
                    src={nextReview.image}
                    alt=""
                    className="slide-anim h-full w-full object-cover contrast-125 grayscale"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <blockquote
                className="slide-anim font-light leading-[1.15] tracking-tight text-[#F4F1EA]"
                style={{ fontSize: "clamp(1.6rem, 3vw, 3rem)" }}
              >
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <p className="slide-anim mt-8 text-lg font-bold text-[#F5A300]">{review.author}</p>
              {REVIEWS_ARE_PLACEHOLDER && (
                <p className="mt-2 text-sm text-[#F4F1EA]/60">
                  Reseñas de ejemplo. Reemplazar con reseñas reales de Google.
                </p>
              )}
              <div className="mt-10 flex gap-3">
                <button
                  type="button"
                  aria-label="Reseña anterior"
                  onClick={prev}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-[#F4F1EA] transition-colors hover:border-[#F5A300] hover:text-[#F5A300]"
                >
                  <CaretLeft size={20} weight="bold" />
                </button>
                <button
                  type="button"
                  aria-label="Reseña siguiente"
                  onClick={next}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-[#F4F1EA] transition-colors hover:border-[#F5A300] hover:text-[#F5A300]"
                >
                  <CaretRight size={20} weight="bold" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DESIRE: Ubicacion y horarios (pin split desde lg) */}
      <section
        id="ubicacion"
        ref={locSectionRef}
        className="relative scroll-mt-24 bg-[#0A0A0B] py-32 md:py-48 lg:py-0"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-start lg:gap-20">
          <div ref={locLeftRef} className="lg:flex lg:h-screen lg:items-center">
            <h2
              className="leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(2.6rem, 5vw, 5rem)" }}
            >
              <span className="block font-extralight text-[#F4F1EA]">Pásate por</span>
              <span className="block font-black text-[#F5A300]">Golden Tires</span>
            </h2>
          </div>

          <div className="flex flex-col gap-16 lg:py-48">
            {/* Mapa + direccion */}
            <div>
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <iframe
                  title="Mapa de Golden Tires"
                  src={MAPS_EMBED_URL}
                  className="h-[380px] w-full"
                  style={{ filter: "grayscale(1) invert(0.9) contrast(0.9)" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="mt-6 flex items-start gap-3 text-[#F4F1EA]">
                <MapPin size={26} weight="fill" className="mt-0.5 shrink-0 text-[#F5A300]" />
                <p className="text-xl">{ADDRESS}</p>
              </div>
              <a
                href={MAPS_PLACE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex h-14 items-center justify-center rounded-full border border-white px-8 text-lg font-bold text-white transition-colors hover:bg-white hover:text-[#0A0A0B]"
              >
                Ver en Google Maps
              </a>
            </div>

            {/* Horario */}
            <div>
              <h3 className="mb-6 text-3xl font-extrabold text-[#F4F1EA]">Horario</h3>
              <ul className="divide-y divide-white/10 border-y border-white/10">
                {HOURS.map((h, i) => (
                  <li
                    key={h.day}
                    className={`flex items-center justify-between px-4 py-4 text-lg ${
                      today === i ? "bg-[#F5A300] font-bold text-[#0A0A0B]" : "text-[#F4F1EA]/80"
                    }`}
                  >
                    <span>{h.day}</span>
                    <span>{h.hours}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Como llegar */}
            <a
              href={MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-16 w-full items-center justify-center gap-3 rounded-full bg-[#F5A300] text-lg font-bold text-[#0A0A0B] transition-colors hover:bg-[#F4F1EA]"
            >
              <NavigationArrow size={24} weight="fill" />
              Cómo llegar
            </a>
          </div>
        </div>
      </section>

      {/* ACTION: CTA final */}
      <section id="cotiza" className="relative scroll-mt-24 overflow-hidden bg-[#0A0A0B] py-32 md:py-48">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F5A300]/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <h2
            className="leading-[0.95] tracking-tight"
            style={{ fontSize: "clamp(2.2rem, 7vw, 6.5rem)" }}
          >
            <span className="block font-extralight text-[#F4F1EA]">Cotiza tu llanta</span>
            <span className="block font-black text-[#F5A300]">ahora</span>
          </h2>

          <div className="mx-auto mt-14 max-w-3xl">
            <div className="flex flex-col gap-4 md:flex-row">
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                aria-label="Tu medida"
                placeholder="Tu medida (ej. 205/55 R16)"
                className="h-16 w-full flex-1 rounded-full border border-white/20 bg-[#141416] px-6 text-lg text-[#F4F1EA] outline-none placeholder:text-[#F4F1EA]/50 focus:border-[#F5A300]"
              />
              <a
                href={primaryHref}
                target={SHOW_WHATSAPP ? "_blank" : undefined}
                rel={SHOW_WHATSAPP ? "noopener noreferrer" : undefined}
                className="inline-flex h-16 items-center justify-center gap-3 rounded-full bg-[#F5A300] px-8 text-lg font-bold text-[#0A0A0B] transition-colors hover:bg-[#F4F1EA]"
              >
                {SHOW_WHATSAPP ? (
                  <>
                    <WhatsappLogo size={24} weight="fill" />
                    Cotizar por WhatsApp
                  </>
                ) : (
                  <>
                    <Phone size={24} weight="fill" />
                    Llamar con mi medida
                  </>
                )}
              </a>
            </div>

            {!SHOW_WHATSAPP && size.trim() !== "" && (
              <p className="mt-4 text-lg text-[#F4F1EA]">
                Tu medida: <strong className="text-[#F5A300]">{size.trim()}</strong>. Dila cuando llames.
              </p>
            )}

            <a
              href={PHONE_TEL}
              className="mt-4 inline-flex h-16 w-full items-center justify-center gap-3 rounded-full border border-white px-10 text-lg font-bold text-white transition-colors hover:bg-white hover:text-[#0A0A0B] md:w-auto"
            >
              <Phone size={24} weight="fill" />
              Llamar {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      {/* ACTION: Footer */}
      <footer className="border-t border-white/10 bg-[#0A0A0B]">
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-20">
          <a
            href={PHONE_TEL}
            className="inline-flex items-center gap-4 font-black text-[#F5A300]"
            style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)" }}
          >
            <Phone weight="fill" className="h-[1em] w-[1em]" />
            {PHONE_DISPLAY}
          </a>

          <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-5 text-lg font-bold text-[#F4F1EA]">Llantas</h3>
              <ul className="space-y-3 text-[#F4F1EA]/70">
                {["Turismo", "SUV y camioneta", "Alto rendimiento", "Rines"].map((l) => (
                  <li key={l}>
                    <a href="#llantas" className="transition-colors hover:text-[#F5A300]">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-5 text-lg font-bold text-[#F4F1EA]">Servicios</h3>
              <ul className="space-y-3 text-[#F4F1EA]/70">
                {SERVICES.map((s) => (
                  <li key={s.name}>
                    <a href="#servicios" className="transition-colors hover:text-[#F5A300]">
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-5 text-lg font-bold text-[#F4F1EA]">Contacto</h3>
              <div className="space-y-3 text-[#F4F1EA]/70">
                <p>{ADDRESS}</p>
                {HOURS_SUMMARY.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                {SHOW_WHATSAPP && (
                  <a
                    href={waHref("Hola Golden Tires")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#F4F1EA] transition-colors hover:text-[#F5A300]"
                  >
                    <WhatsappLogo size={20} weight="fill" />
                    WhatsApp
                  </a>
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-5 text-lg font-bold text-[#F4F1EA]">Síguenos</h3>
              <ul className="space-y-3 text-[#F4F1EA]/70">
                {SOCIALS.map(({ name, url, Icon: SocialIcon }) => (
                  <li key={name}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 transition-colors hover:text-[#F5A300]"
                    >
                      <SocialIcon size={22} weight="fill" />
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 border-t border-white/10 pt-6 text-sm text-[#F4F1EA]/60">
            &copy; 2026 Golden Tires
          </div>
        </div>
      </footer>
    </main>
  );
}