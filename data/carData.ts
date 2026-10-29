export type ColorId = "red" | "white" | "green";
export type Colorway = {
  id: ColorId;
  name: string;
  italian: string;
  finish: string;
  number: string;
  accent: string;
  secondary: string;
  swatch: string;
  front: string;
  rear: string;
  interior: string;
  phaseStops: [number, number, number, number];
};
const image = (name: string) => `/assets/images/pagani-huayra-bc-${name}.webp`;
export const colors: Colorway[] = [
  {
    id: "red",
    name: "Rosso",
    italian: "Passione, in rosso.",
    finish: "RED / EXPOSED CARBON",
    number: "01",
    accent: "#c81720",
    secondary: "#175aca",
    swatch: "#db2029",
    front: image("red-carbon-blue"),
    rear: image("red-carbon-blue-rear-open"),
    interior: "Bespoke red interior",
    phaseStops: [0, 0.28, 0.68, 0.86],
  },

];
export const carData = {
  brand: "PAGANI",
  model: "HUAYRA BC",
  edition: "MACCHINA VOLANTE",
  year: "2017",
  price: "€2,600,000",
  units: "20",
  origin: "MODENA, ITALY",
  portfolio: "https://portfolio.ibithun.com",
  email:
    "mailto:bithun@ibithun.com?subject=Let%E2%80%99s%20build%20a%20website%20like%20the%20Huayra%20concept",
  navigation: [
    { label: "Story", href: "#story" },
    { label: "Design", href: "#design" },
    { label: "Engineering", href: "#engineering" },
    { label: "Specs", href: "#specs" },
  ],
  phases: [
    {
      number: "01",
      name: "ORIGIN",
      title: "HUAYRA BC",
      subtitle: "MACCHINA VOLANTE",
      note: "The Flying Machine",
      metric: "20",
      unit: "UNITS PRODUCED WORLDWIDE",
      detail: "€2,600,000",
    },
    {
      number: "02",
      name: "FORM",
      title: "CARBON SCULPTURE",
      subtitle: "AERODYNAMIC MASTERY",
      note: "Every surface has a purpose.",
      metric: "01",
      unit: "SINGULAR VISION",
      detail: "CARBOTANIUM™",
    },
    {
      number: "03",
      name: "RITUAL",
      title: "GULLWING DOORS",
      subtitle: "THE THEATRE OF ENTRY",
      note: "An invitation to something extraordinary.",
      metric: "73°",
      unit: "A DIFFERENT PERSPECTIVE",
      detail: "THE RITUAL OF ENTRY",
    },
    {
      number: "04",
      name: "POWER",
      title: "AMG V12 BITURBO",
      subtitle: "ENGINEERED TO BE FELT",
      note: "The heart of the machine. Uncovered.",
      metric: "764",
      unit: "CV / 1,000 NM",
      detail: "XTRAC 7-SPEED AMT",
    },
  ],
  specificationSource: "https://www.pagani.com/huayra-bc/",
  specifications: [
    { label: "Engine", value: "V12", unit: "5,980 CC / AMG BITURBO" },
    { label: "Power", value: "764", unit: "CV AT 6,200 RPM" },
    { label: "Torque", value: "1,000", unit: "NM AT 4,000 RPM" },
    { label: "Transmission", value: "7", unit: "SPEED / XTRAC AUTOMATED MANUAL" },
    { label: "Dry weight", value: "1,218", unit: "KG" },
    { label: "Drive", value: "RWD", unit: "REAR-WHEEL DRIVE" },
  ],
  technicalDetails: [
    { label: "Structure", value: "Carbo-titanium monocoque with steel front and rear subframes." },
    { label: "Braking", value: "Brembo carbon-ceramic discs, 380 × 34 mm. Six-piston front and four-piston rear calipers." },
    { label: "Road wheels", value: "Forged aluminium, 20-inch front and 21-inch rear." },
    { label: "Tyres", value: "Pirelli P Zero Corsa or P Zero Trofeo R." },
    { label: "Suspension", value: "Independent double wishbones with adjustable Öhlins dampers." },
  ],
  features: [
    {
      number: "01",
      title: "CARBOTANIUM BODY",
      text: "Carbon fibre and titanium. A material language where strength, lightness and visible craftsmanship become one.",
    },
    {
      number: "02",
      title: "ACTIVE AERODYNAMICS",
      text: "Air is part of the design. Sculpted surfaces and active elements turn movement into a conversation with the road.",
    },
    {
      number: "03",
      title: "BESPOKE INTERIOR",
      text: "A personal world of leather, exposed carbon and finely machined metal. Every touchpoint considered.",
    },
    {
      number: "04",
      title: "TRACK DNA",
      text: "A singular focus on the experience of driving. Mechanical theatre, expressed through every detail.",
    },
  ],
};
export const FRAME_COUNT = 240;
