import thomasEbermann from "../assets/team/thomas-ebermann.png";
import romanHofmann from "../assets/team/roman-hofmann.png";
import thomasMassie from "../assets/team/thomas-massie.png";
import paschalisDimitriou from "../assets/team/paschalis-dimitriou.png";
import philippEgli from "../assets/team/philipp-egli.jpg";
import logo3Plus from "../assets/logos/logo-3plus.svg";
import logoOmnicom from "../assets/logos/logo-omnicom.png";
import logoOneplus from "../assets/logos/logo-oneplus.png";
import logoChMedia from "../assets/logos/logo-ch-media.jpg";
import logoRieter from "../assets/logos/logo-rieter.png";
import logoComparis from "../assets/logos/logo-comparis.png";
import type { ImageMetadata } from "astro";

export const nav = {
  howItWorks: "So funktioniert's",
  services: "Leistungen",
  team: "Team",
  blog: "Blog",
  cta: "Gespräch vereinbaren",
};

export const hero = {
  serifLine: "Making data work for you",
  sansLine: "and your AI.",
  sub: "Datapeople hilft mittelständischen Schweizer Unternehmen, ihre Datenprobleme zu lösen. Kein Hype. Keine Abhängigkeit. Festpreis.",
  primaryCta: "Gespräch vereinbaren",
  secondaryCta: "So funktioniert's",
  facts: ["Sechs Monate", "Festpreis", "Senior-only Team"],
};

export const philosophy = {
  intro:
    "Sie könnten eine grosse Beratungsfirma beauftragen. Die verkaufen Ihnen einen Fahrplan, drei Workshops und eine Abhängigkeit. Wir machen das anders.",
  statementPlain: "Wir kommen, bauen das",
  statementEmphasis: "Fundament",
  statementEnd:
    ", befähigen Ihr Team und bleiben der Partner an Ihrer Seite.",
};

export const processIntro = {
  kicker: "Sechs Monate. Festpreis.",
  title: "Danach läuft es bei Ihnen.",
};

export type ProcessStep = {
  num: string;
  title: string;
  desc: string;
};

export const processSteps: ProcessStep[] = [
  {
    num: "01",
    title: "Verstehen",
    desc: "Wir hören zuerst zu. Wir erfassen Ihre Datenlandschaft, sprechen mit Ihren Leuten und finden heraus, wo es wirklich schmerzt. Keine Annahmen.",
  },
  {
    num: "02",
    title: "Bauen",
    desc: "Wir entwerfen und setzen eine massgeschneiderte Datenarchitektur für Ihr Unternehmen um. Keine Standardanpassung. Wirklich individuell.",
  },
  {
    num: "03",
    title: "Befähigen & Bestärken",
    desc: "Wir schulen Ihr Team und übergeben die Verantwortung. Wir ziehen uns zurück, sobald Sie sicher laufen — bleiben aber als Partner für Support und Scope-Erweiterungen an Ihrer Seite.",
  },
];

export type Service = { title: string; desc: string };

export const services = {
  title: "Wie sieht das in der Praxis aus?",
  items: [
    {
      title: "Massgeschneiderte Datenarchitektur & Data Warehouse",
      desc: "Zweckgebaute Data Warehouses, die mit Ihrem Unternehmen wachsen. Keine Herstellerabhängigkeit.",
    },
    {
      title: "KI-Bereitschaft & Umsetzung",
      desc: "Bringen Sie Ihr Datenfundament in Ordnung, damit KI-Projekte tatsächlich Ergebnisse liefern.",
    },
    {
      title: "Eigenständige Auswertungen & Analysen",
      desc: "Befähigen Sie Ihr Team, eigene Fragen zu beantworten, ohne auf die IT zu warten.",
    },
    {
      title: "Aufbau & Schulung Ihres Datenteams",
      desc: "Bauen Sie interne Kompetenz auf, damit Sie nie wieder auf externe Berater angewiesen sind.",
    },
  ] satisfies Service[],
};

export type TeamMember = {
  name: string;
  role: string;
  desc: string;
  photo: ImageMetadata;
};

export const team: { title: string; members: TeamMember[] } = {
  title: "Nur Seniors. Keine Praktikanten. Keine Übergaben.",
  members: [
    {
      name: "Thomas Ebermann",
      role: "Lead Data Engineer & Kommunikationsexperte",
      desc: "Promovierter Experte mit über 10 Jahren Erfahrung in komplexen Data Warehouse Projekten. Spezialisiert auf die Überbrückung zwischen technischen Lösungen und Geschäftsanforderungen.",
      photo: thomasEbermann,
    },
    {
      name: "Roman Hofmann",
      role: "Azure-Experte & Power BI Spezialist",
      desc: "Zertifizierter Azure-Experte mit umfassender Erfahrung in Microsoft-basierten Data-Platform-Lösungen und Enterprise-Scale-Umsetzungen.",
      photo: romanHofmann,
    },
    {
      name: "Thomas Massie",
      role: "Theoretischer Ökologe & Datenanalyst",
      desc: "Promovierter theoretischer Ökologe mit Spezialisierung auf die Analyse komplexer Systeme und deren Übertragung auf Geschäftsprozesse und Datenstrukturen.",
      photo: thomasMassie,
    },
    {
      name: "Paschalis Dimitriou",
      role: "Senior Data Engineer & KI-Experte",
      desc: "Senior Engineer mit Spezialisierung auf moderne ML/KI-Integration in Data Warehouse Umgebungen und skalierbare Datenverarbeitungs-Pipelines.",
      photo: paschalisDimitriou,
    },
    {
      name: "Philipp Egli",
      role: "Strategie & Veränderung",
      desc: "Bringt strategische Klarheit in komplexe Datenprojekte. Verbindet geschäftliche Anforderungen mit technischer Umsetzung.",
      photo: philippEgli,
    },
  ],
};

export const testimonial = {
  quote:
    "Wir hatten jahrelang versucht, unsere Reporting-Landschaft zu konsolidieren — drei Beratungen, drei Roadmaps, kein Ergebnis. Datapeople kam, hat zugehört, und in fünf Monaten stand das Data Warehouse. Danach sind sie gegangen, wie versprochen.",
  attribution: "CEO, Schweizer Mediaagentur-Gruppe",
};

export type Logo = { name: string; src: ImageMetadata | string };

export const logos: { title: string; lead: string; items: Logo[] } = {
  title: "Projekte in führenden Unternehmen",
  lead: "Unsere Arbeit trägt keine Signatur auf der Oberfläche — wir arbeiten an dem, was darunter liegt.",
  items: [
    { name: "3+", src: logo3Plus },
    { name: "Omnicom Media Group", src: logoOmnicom },
    { name: "OnePlus Schweiz", src: logoOneplus },
    { name: "CH Media", src: logoChMedia },
    { name: "Rieter", src: logoRieter },
    { name: "Comparis", src: logoComparis },
  ],
};

export const contact = {
  title: "Finden wir heraus, ob wir zusammenpassen.",
  sub: "Festpreis. Keine versteckten Kosten. Keine endlosen Verlängerungen. Wir tragen das Risiko — nicht Sie.",
  ctaLabel: "Nachricht senden",
  email: "hello@datapeople.ch",
  phone: "+41 77 221 88 62",
  phoneHref: "+41772218862",
  address: "Bachtelstrasse 25c, 8400 Winterthur, Schweiz",
};

export const footerNav = {
  navigation: [
    { label: "So funktioniert's", href: "/#how-it-works" },
    { label: "Leistungen", href: "/#services" },
    { label: "Team", href: "/#team" },
    { label: "Blog", href: "/blog/" },
  ],
  contact: [
    { label: "Kontakt", href: "/#contact" },
  ],
};
