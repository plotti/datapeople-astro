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
  about: "Über Datapeople",
  howItWorks: "Warum Datapeople",
  services: "Leistungen",
  team: "Team",
  blog: "Blog",
  cta: "Gespräch vereinbaren",
};

export const hero = {
  line1: "Making data work for you",
  line2: { before: "and your ", emphasis: "AI", after: "." },
  sub: "Datapeople ist ein persönliches Netzwerk von echten Datenexperten aus Schweizer Unternehmen. Wir beraten unabhängig.",
  primaryCta: "Gespräch vereinbaren",
  secondaryCta: "So funktioniert's",
};

export const philosophy = {
  intro: "Anders als grosse Beratungen verkaufen wir keine Fahrplan-Werkzeuge und Workshop-Pakete. Als exklusives, einladungsbasiertes Netzwerk von Praktikern verkaufen wir Wissen aus echter Erfahrung — nicht aus Prospekten.",
  statementPlain: "Wir bauen ",
  statementEmphasis: "wirklich nur das, was Sie brauchen",
  statementEnd: ". Weniger ist mehr. Ja zu AI, aber nur auf einem soliden Datenfundament.",
};

export const processIntro = {
  kicker: "",
  title: "",
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
      desc: "Wir entwickeln zweckgebaute Data Warehouses, die mit Ihrem Unternehmen wachsen. Wir stellen offene Standards über Herstellerabhängigkeit.",
    },
    {
      title: "KI-Bereitschaft & Umsetzung",
      desc: "Wir bringen Ihr Datenfundament in Ordnung, damit KI-Projekte tatsächlich Ergebnisse liefern. Dies beinhaltet Beratung aber auch Umsetzung.",
    },
    {
      title: "Eigenständige Auswertungen & Analysen",
      desc: "Wir befähigen Ihr Team, eigene Fragen zu beantworten. Wir helfen auch als Spot-Resource bei besonders komplexen oder zeitkritischen Projekten.",
    },
    {
      title: "Aufbau & Schulung Ihres Datenteams",
      desc: "Bauen Sie interne Kompetenz auf, damit Sie nie wieder auf externe Berater angewiesen sind. Vermittlung von komplexen Themen und Fachkenntnissen ist etwas das viele von uns über Jahre an Hochschulen und in Unternehmen angesammelt haben.",
    },
    {
      title: "Fractional Data Science, Engineering oder Analyse",
      desc: "Wir integrieren uns 10-20% in Ihr Team und bringen Expertise, ohne dass Sie eine Vollzeit-Stelle erstellen müssen. Ideal für KMUs, die einen Bedarf nach spezifischer Expertise haben.",
    },
    {
      title: "Recruiting & Kandidatenempfehlungen",
      desc: "Wir kennen den Schweizer Datenmarkt und empfehlen geeignete Kandidaten für Ihr Datenteam. Ohne Headhunter-Vermittlungsgebühren — aus dem Netzwerk für das Netzwerk.",
    },
    {
      title: "Stundenweise Konsultation",
      desc: "Wie bei einem Anwalt: Sie buchen genau die Zeit, die Sie brauchen. Für Architektur-Reviews, Data-Stack-Modernisierung oder strategische Entscheidungen.",
    },
    {
      title: "Kurzfristige Change-Projekte",
      desc: "Wir fokussieren uns auf kurzfristige Projekte (max. 3 Monate) oder Fractional-Mandate (max. 50%). Wir möchten bewusst Abhängigkeiten vermeiden, stehen jedoch als langfristiger Sparringpartner für Support und Scope-Erweiterungen an Ihrer Seite.",
    },
  ] satisfies Service[],
};

export type AboutPoint = { title: string; desc: string };

export const aboutDataPeople = {
  kicker: "Was ist Data People?",
  title: "Eine Gemeinschaft von Datenexperten",
  intro: "Data People ist eine moderne Gilde, ein Kollektiv von Data Scientists, Data Engineers und Data Analysten. Alle Mitglieder arbeiten aktiv in Schweizer Unternehmen — von KMUs bis zu Grosskonzernen. Und eines verbindet uns: Die Passion für Daten und solides Craftmanship.",
  points: [
    {
      title: "Regelmässiger Austausch",
      desc: "Wir treffen uns regelmässig, tauschen Erfahrungen aus und diskutieren neue Entwicklungen. So behalten wir immer einen aktuellen, pragmatischen und tiefen Einblick in die Datenlandschaft — als Netzwerk, nicht als Einzelpersonen.",
    },
    {
      title: "Aus Leidenschaft",
      desc: "Datapeople setzt auch Projekte um. Allerdings nicht als primäre Verdienstquelle. Alles, was wir bei Data People tun, geschieht aus Leidenschaft für Technologie. Das ist unser Unterschied zu Beratungen, die Profit vor Qualität stellen.",
    },
    {
      title: "Vertrauensprinzip",
      desc: "Wir kennen und empfehlen unsere Mitglieder persönlich. Wir sind aber immer offen für neue Mitglieder.",
    },
    {
      title: "Aktiv in der Praxis",
      desc: "Unsere Mitglieder arbeiten täglich mit Daten in echten Unternehmen — in KMUs, Mittelschicht und Grosskonzernen. Wir kennen die Realität, nicht nur die Theorie. Wir kennen die Preise, Lizenzmodelle und Fallstricke aus echter Anwendung.",
    },
    {
      title: "Pro Bono für NGOs",
      desc: "Viele unserer Experten nutzen einen Teil ihrer Zeit für Projekte mit echtem Zweck — für NGOs und Non-Profit-Organisationen, die einen Bedarf an Datenanalyse haben. Wir geben unsere Expertise weiter, wenn es zählt.",
    },
  ] satisfies AboutPoint[],
};

export type AdvantagePoint = { title: string; desc: string };

export const advantages = {
  kicker: "Warum Data People?",
  title: "Wissen aus echter Anwendung",
  intro: "Unsere Empfehlungen basieren nicht auf Verkaufsprospekten, sondern auf täglicher Arbeit mit echten Datenproblemen. Als exklusives Netzwerk beraten wir wie keine Einzelperson oder Technologie es kann.",
  items: [
    {
      title: "Netzwerk statt Einzelkämpfer",
      desc: "Wir kennen die meisten Lösungen nicht nur aus Hochglanz-Prospekten, sondern aus der tatsächlichen Anwendung. Als Kollektiv können wir beraten wie keine einzelne Person — wir haben das Wissen vieler.",
    },
    {
      title: "Echte Preise, echte Modelle",
      desc: "Wir kennen die Preise, Lizenzmodelle und versteckten Kosten aus erster Hand. Kein Verkaufsblatt kann Ihnen das sagen — nur wer es tatsächlich gekauft und implementiert hat.",
    },
    {
      title: "Vendor-unabhängige Beratung",
      desc: "Wir können als vendor-unabhängige Agentur beraten. Wir sind nicht an einen bestimmten Hersteller oder Technologie-Stack gebunden — wir empfehlen, was funktioniert, nicht was gut verkäuft.",
    },
    {
      title: "Leidenschaft als Treiber",
      desc: "Alles, was wir bei Data People tun, geschieht aus Leidenschaft für Technologie und gute Lösungen. Der Profit ist nicht unser Hauptmotiv — die Qualität der Lösung schon. Das ist der Unterschied.",
    },
  ] satisfies AdvantagePoint[],
};

export type TeamMember = {
  name: string;
  role: string;
  desc: string;
  photo: ImageMetadata;
};

export const team: { title: string; intro: string; members: TeamMember[] } = {
  title: "Erfahrung zählt.",
  intro: "Datapeople ist der handverlesene Experten-Zirkel, der wie eine moderne Gilde das gebündelte Daten-Know-how der Schweiz vereint.",
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
    "Wir hatten jahrelang versucht, unsere Dashboarding-Landschaft ohne Ergebnis zu konsolidieren. Als Datapeople kam, haben sie erstmal viel zugehört. Im Grunde ist bei unserem Tech fast alles gleich geblieben. Aber dank dem neuen semantischen Layer können wir endlich viel redundante Arbeit sparen, es ist unglaublich. Danke Jungs.",
  attribution: "CEO, Schweizer Mediaagentur-Gruppe",
};

export type Logo = { name: string; src: ImageMetadata | string };

export const logos: { title: string; lead: string; items: Logo[] } = {
  title: "Wo wir schon tätig waren",
  lead: "Hier ein paar der Unternehmen, in denen wir viele Jahre Erfahrung mit unterschiedlichen Datenlandschaften, Prozessen und Personen gesammelt haben. Jedes tickt anders — aber viele Herausforderungen und Lösungen sind tatsächlich ähnlich.",
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
  sub: "",
  ctaLabel: "Nachricht senden",
  email: "info@datapeople.ch",
  phone: "+41 77 221 88 62",
  phoneHref: "+41772218862",
  address: "Datapeople GmbH\nGeschäftsführung: Siri Fischer (Vorsitz) & Dr. Thomas Ebermann\nUID MWST: CHE-394.497.750\nBankverbindung: UBS AG\nIBAN: CH31 0022 5225 1209 5001 R\nWildbachstrasse 3, 8008 Zürich",
};

export const footerNav = {
  navigation: [
    { label: "Über Data People", href: "/#about" },
    { label: "So funktioniert's", href: "/#how-it-works" },
    { label: "Leistungen", href: "/#services" },
    { label: "Team", href: "/#team" },
    { label: "Blog", href: "/blog/" },
  ],
  contact: [
    { label: "Kontakt", href: "/#contact" },
  ],
};
