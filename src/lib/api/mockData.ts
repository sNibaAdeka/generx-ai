export type RiskLevel = "Low" | "Moderate" | "Elevated" | "High";

export const mockDoctor = {
  id: "doctor-demo-001",
  name: "GenerX Demo Doctor",
  role: "Cardiology",
  email: "adyoka.sars@gmail.com",
  initials: "GD",
} as const;

export type Patient = {
  id: string;
  initials: string;
  name: string;
  age: number;
  sex: string;
  context: string;
  lastAnalysis: string;
  risk: RiskLevel;
  dataQuality: "Complete" | "Review data";
};

export const patients: Patient[] = [
  {
    id: "amara-velasquez",
    initials: "AV",
    name: "Amara Velasquez",
    age: 68,
    sex: "F",
    context: "Atrial fibrillation care review",
    lastAnalysis: "Today, 09:42",
    risk: "Elevated",
    dataQuality: "Complete",
  },
  {
    id: "mateo-rossi",
    initials: "MR",
    name: "Mateo Rossi",
    age: 57,
    sex: "M",
    context: "Coronary disease follow-up",
    lastAnalysis: "Yesterday, 15:18",
    risk: "Moderate",
    dataQuality: "Complete",
  },
  {
    id: "leila-adams",
    initials: "LA",
    name: "Leila Adams",
    age: 74,
    sex: "F",
    context: "Heart failure medication review",
    lastAnalysis: "Jul 08, 11:20",
    risk: "High",
    dataQuality: "Review data",
  },
  {
    id: "hugo-park",
    initials: "HP",
    name: "Hugo Park",
    age: 46,
    sex: "M",
    context: "Statin response review",
    lastAnalysis: "Jul 06, 08:05",
    risk: "Low",
    dataQuality: "Complete",
  },
  {
    id: "sana-patel",
    initials: "SP",
    name: "Sana Patel",
    age: 62,
    sex: "F",
    context: "Anticoagulation care review",
    lastAnalysis: "Jul 03, 16:32",
    risk: "Moderate",
    dataQuality: "Complete",
  },
  {
    id: "noah-bauer",
    initials: "NB",
    name: "Noah Bauer",
    age: 52,
    sex: "M",
    context: "Cardiomyopathy care review",
    lastAnalysis: "Jun 29, 14:11",
    risk: "Elevated",
    dataQuality: "Review data",
  },
];

export const kpis = [
  {
    label: "Active patients",
    value: "42",
    delta: "+6 this month",
    points: [18, 23, 21, 27, 26, 31, 37],
  },
  {
    label: "Reports this week",
    value: "18",
    delta: "+12% vs. last week",
    points: [8, 9, 13, 11, 17, 15, 18],
  },
  {
    label: "Cases requiring review",
    value: "3",
    delta: "Review within 24h",
    points: [9, 8, 6, 7, 4, 4, 3],
  },
  {
    label: "Pending uploads",
    value: "5",
    delta: "2 received today",
    points: [2, 5, 4, 6, 4, 6, 5],
  },
];

export const variants = [
  {
    gene: "CYP2C19",
    variant: "rs4244285",
    diplotype: "*1/*2",
    phenotype: "Intermediate Metabolizer",
    drugs: ["Clopidogrel"],
    status: "Actionable",
  },
  {
    gene: "CYP2C9",
    variant: "rs1799853",
    diplotype: "*1/*2",
    phenotype: "Intermediate Metabolizer",
    drugs: ["Warfarin"],
    status: "Actionable",
  },
  {
    gene: "VKORC1",
    variant: "rs9923231",
    diplotype: "A/G",
    phenotype: "Sensitivity marker",
    drugs: ["Warfarin"],
    status: "Review",
  },
  {
    gene: "SLCO1B1",
    variant: "rs4149056",
    diplotype: "*1/*1",
    phenotype: "Normal Function",
    drugs: ["Statins"],
    status: "Informative",
  },
];

export const risks: Array<{
  label: string;
  level: RiskLevel;
  confidence: number;
  rationale: string;
}> = [
  {
    label: "Bleeding risk",
    level: "Elevated",
    confidence: 82,
    rationale:
      "The available data suggest this may be associated with INR 3.4, warfarin exposure, and pharmacogenomic factors.",
  },
  {
    label: "Thrombosis risk",
    level: "Moderate",
    confidence: 71,
    rationale:
      "Clinical context and medication history may warrant further review of antiplatelet response.",
  },
  {
    label: "Adverse drug reaction",
    level: "Moderate",
    confidence: 76,
    rationale:
      "The data suggest a potential for altered warfarin response; consider clinical evaluation.",
  },
  {
    label: "Reduced effectiveness",
    level: "Elevated",
    confidence: 79,
    rationale:
      "CYP2C19 phenotype may be relevant when evaluating clopidogrel response.",
  },
];

export const labs = [
  {
    name: "INR",
    value: "3.4",
    unit: "",
    range: "2.0–3.0 therapeutic",
    status: "elevated",
    points: [2.4, 2.8, 2.6, 3.0, 3.4],
  },
  {
    name: "Creatinine",
    value: "89",
    unit: "µmol/L",
    range: "44–97",
    status: "normal",
    points: [83, 84, 87, 86, 89],
  },
  {
    name: "Platelets",
    value: "176",
    unit: "×10⁹/L",
    range: "150–400",
    status: "normal",
    points: [190, 185, 181, 177, 176],
  },
  {
    name: "BNP",
    value: "144",
    unit: "pg/mL",
    range: "review by context",
    status: "review",
    points: [130, 148, 139, 151, 144],
  },
];

export const disclaimer =
  "GenerX is a clinical decision support tool designed to assist healthcare professionals. It does not establish medical diagnoses or prescribe treatment. Final clinical decisions remain the responsibility of the licensed physician.";
