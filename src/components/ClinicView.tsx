"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from "react";
import {
  Bell,
  BookOpen,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Clock3,
  Dna,
  Download,
  FileCheck2,
  FileText,
  FlaskConical,
  Info,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  PanelLeftClose,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UploadCloud,
  Users,
  X,
} from "lucide-react";
import {
  disclaimer,
  kpis,
  labs,
  patients,
  risks,
  variants,
  type Patient,
  type RiskLevel,
} from "@/lib/api/mockData";
import { listPatients } from "@/lib/api/patients";
import { confidenceDots, riskTone } from "@/lib/clinical";
import { useReportStore } from "@/stores/useReportStore";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/patients", label: "Patients", icon: Users },
  { href: "/reports", label: "AI reports", icon: FileText },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function ClinicView() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className={`clinic ${collapsed ? "clinic--collapsed" : ""}`}>
      <aside className="sidebar">
        <Link href="/" className="brand sidebar__brand">
          <span className="brand-mark">
            <Dna size={18} />
          </span>
          <b>Gener</b>
          <span>X</span>
        </Link>
        <nav aria-label="Clinician navigation">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`side-link ${isActive(pathname, href) ? "side-link--active" : ""}`}
            >
              <Icon size={19} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar__bottom">
          <div className="clinic-status">
            <span className="live-dot" />
            <span>Secure workspace</span>
          </div>
          <button
            className="side-link side-link--button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
          >
            <PanelLeftClose size={19} />
            <span>Collapse</span>
          </button>
          <div className="physician">
            <div className="avatar avatar--small">AM</div>
            <div>
              <strong>Dr. A. Morgan</strong>
              <small>Cardiology</small>
            </div>
            <ChevronDown size={15} />
          </div>
        </div>
      </aside>
      <div className="clinic-main">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Open menu">
            <Menu size={19} />
          </button>
          <div className="topbar__search">
            <Search size={17} />
            <input
              aria-label="Search patients"
              placeholder="Search patients, reports, or IDs"
            />
            <kbd>⌘ K</kbd>
          </div>
          <div className="topbar__right">
            <button className="top-icon" aria-label="View notifications">
              <Bell size={18} />
              <span />
            </button>
            <div className="date-chip">
              <Clock3 size={15} /> Fri, Jul 10 · 2026
            </div>
          </div>
        </header>
        <main id="main-content" className="workspace">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
            >
              <RouteContent path={pathname} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function RouteContent({ path }: { path: string }) {
  if (path === "/dashboard") return <Dashboard />;
  if (path === "/patients") return <Patients />;
  if (path === "/patients/new") return <NewPatient />;
  if (path.endsWith("/labs")) return <UploadScreen type="labs" />;
  if (path.endsWith("/dna")) return <UploadScreen type="dna" />;
  if (path.endsWith("/analyze")) return <Analysis />;
  if (path.includes("/report/")) return <ClinicalReport />;
  if (path.startsWith("/patients/")) return <PatientProfile />;
  if (path === "/reports") return <Reports />;
  if (path === "/notifications") return <Notifications />;
  if (path === "/settings") return <SettingsPage />;
  return <Dashboard />;
}

function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <p className="page-kicker">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </div>
  );
}

function Dashboard() {
  return (
    <>
      <PageHeader
        eyebrow="Clinician workspace"
        title="Good morning, Dr. Morgan."
        description="Here is the clinical activity requiring your attention today."
        actions={
          <Link href="/patients/new" className="button button--gold">
            <Plus size={17} /> New patient
          </Link>
        }
      />
      <section className="kpi-grid">
        {kpis.map((kpi, i) => (
          <Card key={kpi.label} className="kpi-card" delay={i * 0.05}>
            <div>
              <p>{kpi.label}</p>
              <strong>{kpi.value}</strong>
              <small
                className={kpi.label.includes("review") ? "text-warning" : ""}
              >
                {kpi.delta}
              </small>
            </div>
            <Sparkline values={kpi.points} />
          </Card>
        ))}
      </section>
      <section className="dashboard-grid">
        <Card className="reports-card">
          <CardHeading
            title="Recent clinical reports"
            detail="All reports"
            href="/reports"
          />
          <div className="report-list">
            {patients.slice(0, 4).map((patient) => (
              <Link
                href={`/patients/${patient.id}/report/rpt-2026-041`}
                className="report-list__item"
                key={patient.id}
              >
                <div className="avatar">{patient.initials}</div>
                <div>
                  <strong>{patient.name}</strong>
                  <small>{patient.context}</small>
                </div>
                <RiskBadge level={patient.risk} />
                <time>{patient.lastAnalysis}</time>
                <ChevronRight size={17} />
              </Link>
            ))}
          </div>
        </Card>
        <Card className="review-card">
          <CardHeading title="Needs review" detail="3 cases" />
          <div className="review-stack">
            {patients
              .filter((p) => p.risk === "High" || p.risk === "Elevated")
              .map((patient) => (
                <div key={patient.id} className="review-item">
                  <div className="review-ring">
                    <span>
                      {patient.risk === "High" ? "91" : "82"}
                      <small>%</small>
                    </span>
                  </div>
                  <div>
                    <strong>{patient.name}</strong>
                    <p>
                      {patient.risk} risk · {patient.context}
                    </p>
                    <Link href={`/patients/${patient.id}`}>
                      Open patient <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </section>
      <section className="dashboard-grid dashboard-grid--wide">
        <Card className="activity-card">
          <CardHeading title="Activity timeline" detail="Today" />
          <div className="timeline">
            <TimelineItem
              icon={<UploadCloud size={15} />}
              title="DNA report processed"
              detail="Amara Velasquez · 6 variants available for review"
              time="09:42"
            />
            <TimelineItem
              icon={<Sparkles size={15} />}
              title="Analysis complete"
              detail="Mateo Rossi · report generated with 4 evidence sources"
              time="09:18"
            />
            <TimelineItem
              icon={<FlaskConical size={15} />}
              title="Lab results added"
              detail="Leila Adams · INR and platelet values require attention"
              time="08:36"
            />
            <TimelineItem
              icon={<Users size={15} />}
              title="Patient record created"
              detail="Hugo Park · awaiting data uploads"
              time="Yesterday"
            />
          </div>
        </Card>
        <Card className="data-card">
          <CardHeading title="Data readiness" detail="Across your cohort" />
          <div className="readiness">
            <div>
              <span className="readiness__num">89%</span>
              <p>profiles have current labs</p>
            </div>
            <div className="progress">
              <i style={{ width: "89%" }} />
            </div>
            <div className="data-card__footer">
              <span>
                <b>38</b> complete
              </span>
              <span>
                <b>4</b> need review
              </span>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
}

function Patients() {
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState<Patient[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const load = () => {
    setError(null);
    setRecords(null);
    void listPatients()
      .then(setRecords)
      .catch(() =>
        setError("Patient records could not be loaded. Please retry."),
      );
  };
  useEffect(() => {
    load();
  }, []);
  const header = (
    <PageHeader
      eyebrow="Patient management"
      title="Patients"
      description="A consolidated view of data readiness, recent analysis and review status."
      actions={
        <Link href="/patients/new" className="button button--gold">
          <Plus size={17} /> New patient
        </Link>
      }
    />
  );
  if (error)
    return (
      <>
        {header}
        <Card className="empty-state">
          <CircleAlert size={31} />
          <h3>Patient records are temporarily unavailable</h3>
          <p>{error}</p>
          <button className="button button--line" onClick={load}>
            Retry
          </button>
        </Card>
      </>
    );
  if (!records)
    return (
      <>
        {header}
        <PatientListSkeleton />
      </>
    );
  const results = records.filter((patient) =>
    patient.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      {header}
      <Card className="table-card">
        <div className="table-toolbar">
          <label className="table-search">
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by patient name or ID"
            />
          </label>
          <button className="filter-button">
            All contexts <ChevronDown size={15} />
          </button>
          <button className="filter-button">
            All risk levels <ChevronDown size={15} />
          </button>
        </div>
        <div className="patient-table">
          <div className="patient-table__head">
            <span>Patient</span>
            <span>Care context</span>
            <span>Data readiness</span>
            <span>Last analysis</span>
            <span>Risk status</span>
            <span />
          </div>
          {results.map((patient) => (
            <PatientRow key={patient.id} patient={patient} />
          ))}
        </div>
        {!results.length && (
          <div className="empty-state">
            <Dna size={31} />
            <h3>No matching patients</h3>
            <p>Try another name, or add a new patient profile.</p>
            <Link href="/patients/new" className="button button--line">
              Create patient
            </Link>
          </div>
        )}
      </Card>
    </>
  );
}

function PatientListSkeleton() {
  return (
    <Card className="table-card patient-skeleton">
      <div className="table-toolbar">
        <span className="skeleton skeleton--field" />
        <span className="skeleton skeleton--button" />
        <span className="skeleton skeleton--button" />
      </div>
      {Array.from({ length: 6 }, (_, index) => (
        <div className="skeleton-row" key={index}>
          <span className="skeleton skeleton--avatar" />
          <span className="skeleton skeleton--wide" />
          <span className="skeleton skeleton--short" />
          <span className="skeleton skeleton--short" />
        </div>
      ))}
    </Card>
  );
}

function PatientRow({ patient }: { patient: Patient }) {
  return (
    <Link href={`/patients/${patient.id}`} className="patient-row">
      <div className="patient-cell">
        <div className="avatar">{patient.initials}</div>
        <div>
          <strong>{patient.name}</strong>
          <small>
            GRX-{patient.id.slice(0, 5).toUpperCase()} · {patient.age}y ·{" "}
            {patient.sex}
          </small>
        </div>
      </div>
      <span>{patient.context}</span>
      <span
        className={`quality ${patient.dataQuality === "Complete" ? "quality--complete" : "quality--review"}`}
      >
        <i />
        {patient.dataQuality}
      </span>
      <time>{patient.lastAnalysis}</time>
      <RiskBadge level={patient.risk} />
      <MoreHorizontal size={18} />
    </Link>
  );
}

function NewPatient() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const goNext = (e: FormEvent) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
    else router.push("/patients/amara-velasquez");
  };
  return (
    <>
      <PageHeader
        eyebrow="Patient management"
        title="Create patient"
        description="Set up a profile in three concise steps. You can complete clinical data later."
      />
      <div className="form-shell">
        <div className="stepper">
          {[
            "Personal information",
            "Clinical context",
            "Medications & allergies",
          ].map((label, index) => (
            <div
              className={
                step >= index + 1
                  ? "stepper__step stepper__step--active"
                  : "stepper__step"
              }
              key={label}
            >
              <span>{index + 1}</span>
              <p>{label}</p>
            </div>
          ))}
        </div>
        <Card className="patient-form">
          <form onSubmit={goNext}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
              >
                <h2>
                  {step === 1
                    ? "Personal information"
                    : step === 2
                      ? "Clinical context"
                      : "Medications & allergies"}
                </h2>
                <p className="form-lede">
                  {step === 1
                    ? "Identifiers are displayed only in this prototype."
                    : step === 2
                      ? "Frame the current care context without making a diagnosis."
                      : "Add information that may inform a later review."}
                </p>
                {step === 1 ? (
                  <div className="form-grid">
                    <Field
                      label="Full name"
                      placeholder="e.g., Amara Velasquez"
                    />
                    <Field label="Date of birth" type="date" />
                    <Field label="Sex">
                      <select defaultValue="">
                        <option disabled value="">
                          Select
                        </option>
                        <option>Female</option>
                        <option>Male</option>
                        <option>Other / not recorded</option>
                      </select>
                    </Field>
                    <Field
                      label="Patient ID"
                      placeholder="Generated automatically"
                    />
                  </div>
                ) : step === 2 ? (
                  <div className="form-grid">
                    <Field label="Primary care context">
                      <select defaultValue="">
                        <option disabled value="">
                          Select context
                        </option>
                        <option>Atrial fibrillation care review</option>
                        <option>Coronary disease follow-up</option>
                        <option>Heart failure medication review</option>
                      </select>
                    </Field>
                    <Field
                      label="Assigned clinician"
                      placeholder="Dr. Avery Morgan"
                    />
                    <Field label="Relevant history" className="form-grid__full">
                      <textarea placeholder="Add concise context for the clinical team…" />
                    </Field>
                  </div>
                ) : (
                  <div className="form-grid">
                    <Field
                      label="Current medications"
                      className="form-grid__full"
                    >
                      <textarea placeholder="Medication, dose, frequency…" />
                    </Field>
                    <Field label="Allergies" className="form-grid__full">
                      <textarea placeholder="Drug, food or environmental allergies…" />
                    </Field>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="form-actions">
              <button
                type="button"
                onClick={() => setStep(Math.max(1, step - 1))}
                className="button button--ghost"
                disabled={step === 1}
              >
                Back
              </button>
              <div>
                <button type="button" className="button button--line">
                  Save draft
                </button>
                <button className="button button--gold" type="submit">
                  {step === 3 ? "Create patient" : "Continue"}{" "}
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

function PatientProfile() {
  const [tab, setTab] = useState("Overview");
  return (
    <>
      <div className="patient-hero">
        <div className="patient-hero__person">
          <div className="avatar avatar--large">AV</div>
          <div>
            <p className="page-kicker">GRX-AMARA-00041</p>
            <h1>Amara Velasquez</h1>
            <span>68 years · F · Atrial fibrillation care review</span>
          </div>
        </div>
        <div className="patient-hero__actions">
          <Link
            href="/patients/amara-velasquez/labs"
            className="button button--line"
          >
            <FlaskConical size={16} /> Upload labs
          </Link>
          <Link
            href="/patients/amara-velasquez/dna"
            className="button button--line"
          >
            <Dna size={16} /> Upload DNA
          </Link>
          <Link
            href="/patients/amara-velasquez/analyze"
            className="button button--gold"
          >
            <Sparkles size={16} /> Run analysis
          </Link>
        </div>
      </div>
      <div className="patient-facts">
        <span>
          <Clock3 size={15} /> Last analysis <b>Today, 09:42</b>
        </span>
        <span>
          <ShieldCheck size={15} /> Data readiness <b>Complete</b>
        </span>
        <span>
          <Stethoscope size={15} /> Assigned <b>Dr. A. Morgan</b>
        </span>
      </div>
      <div className="tabs">
        {[
          "Overview",
          "Clinical data",
          "Genomics",
          "Medication & allergies",
          "Analysis",
          "Reports",
          "Timeline",
        ].map((label) => (
          <button
            onClick={() => setTab(label)}
            className={
              tab === label ? "tabs__tab tabs__tab--active" : "tabs__tab"
            }
            key={label}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "Overview" ? (
        <OverviewTab />
      ) : tab === "Genomics" ? (
        <GenomicsTab />
      ) : tab === "Clinical data" ? (
        <ClinicalDataTab />
      ) : (
        <GenericProfileTab title={tab} />
      )}
    </>
  );
}

function OverviewTab() {
  return (
    <div className="profile-grid">
      <div>
        <section className="vitals-grid">
          <Vital
            label="Heart rate"
            value="74"
            unit="bpm"
            status="Within review range"
          />
          <Vital
            label="Blood pressure"
            value="128/76"
            unit="mmHg"
            status="Recent entry"
          />
          <Vital label="SpO₂" value="97" unit="%" status="Recent entry" />
          <Vital label="Weight" value="68.2" unit="kg" status="7-day trend" />
        </section>
        <Card>
          <CardHeading title="Latest review items" detail="Updated today" />
          <ul className="finding-list">
            <li>
              <CircleAlert size={16} /> INR 3.4 may warrant clinician review in
              the context of anticoagulation therapy.
            </li>
            <li>
              <Dna size={16} /> CYP2C19 phenotype is available to support
              medication response evaluation.
            </li>
            <li>
              <FileCheck2 /> Data sources are complete; latest lab upload
              received today.
            </li>
          </ul>
        </Card>
      </div>
      <Card className="variants-card">
        <CardHeading
          title="Detected pharmacogenomic signals"
          detail="4 reviewed"
        />
        <div className="variant-quick-list">
          {variants.map((v) => (
            <div key={v.gene}>
              <div>
                <strong className="mono">{v.gene}</strong>
                <small>{v.phenotype}</small>
              </div>
              <span className="mini-status">{v.status}</span>
            </div>
          ))}
        </div>
        <Link href="/patients/amara-velasquez/dna" className="text-link">
          Open genomics <ChevronRight size={14} />
        </Link>
      </Card>
    </div>
  );
}

function ClinicalDataTab() {
  return (
    <section className="lab-grid">
      {labs.map((lab) => (
        <Card key={lab.name} className="lab-card">
          <p>{lab.name}</p>
          <strong className="mono">
            {lab.value}
            <small>{lab.unit}</small>
          </strong>
          <span>{lab.range}</span>
          <Sparkline values={lab.points} />
        </Card>
      ))}
    </section>
  );
}
function GenomicsTab() {
  return (
    <Card className="genomics-card">
      <CardHeading
        title="Diplotype → phenotype → review context"
        detail="Core gene panel"
      />
      <div className="variant-table">
        <div className="variant-table__head">
          <span>Gene / variant</span>
          <span>Diplotype</span>
          <span>Phenotype</span>
          <span>Actionable medications</span>
        </div>
        {variants.map((v) => (
          <div key={v.gene}>
            <span>
              <b className="mono">{v.gene}</b>
              <small className="mono">{v.variant}</small>
            </span>
            <span className="mono">{v.diplotype}</span>
            <span>{v.phenotype}</span>
            <span>
              {v.drugs.map((drug) => (
                <i className="drug-chip" key={drug}>
                  {drug}
                </i>
              ))}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
function GenericProfileTab({ title }: { title: string }) {
  return (
    <Card className="empty-state">
      <BookOpen size={31} />
      <h3>{title} workspace</h3>
      <p>
        Prototype data for this section is organized to become available as the
        clinician workflow progresses.
      </p>
      <Link
        href="/patients/amara-velasquez/analyze"
        className="button button--line"
      >
        Review analysis inputs
      </Link>
    </Card>
  );
}

function UploadScreen({ type }: { type: "labs" | "dna" }) {
  const [file, setFile] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");
  const isDNA = type === "dna";
  const choose = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.files?.[0]?.name;
    if (!name) return;
    setFile(name);
    setStatus("processing");
    setTimeout(() => setStatus("done"), 1400);
  };
  return (
    <>
      <PageHeader
        eyebrow={isDNA ? "Pharmacogenomics" : "Clinical data"}
        title={isDNA ? "DNA results" : "Laboratory results"}
        description={
          isDNA
            ? "Upload a pharmacogenomic PDF or SNP report for mock extraction."
            : "Upload a lab report or add structured values for physician review."
        }
        actions={
          <Link
            href="/patients/amara-velasquez"
            className="button button--ghost"
          >
            Back to patient
          </Link>
        }
      />
      <div className="upload-layout">
        <Card className="dropzone-card">
          <input
            id="file-upload"
            className="visually-hidden"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={choose}
          />
          <label htmlFor="file-upload" className="dropzone">
            <span className="dropzone__icon">
              {isDNA ? <Dna size={25} /> : <UploadCloud size={25} />}
            </span>
            <h2>Drop {isDNA ? "a DNA report" : "a lab report"} here</h2>
            <p>PDF, PNG or JPG · mock processing only</p>
            <span className="button button--line">Select a file</span>
          </label>
          {isDNA && (
            <p className="future-note">
              <span>Future version</span> VCF parsing is planned after clinical
              validation.
            </p>
          )}
          {file && (
            <div className="file-row">
              <FileText size={18} />
              <div>
                <strong>{file}</strong>
                <small>
                  {status === "processing"
                    ? "Extracting structured data…"
                    : status === "done"
                      ? "Processed · ready for review"
                      : "Ready"}
                </small>
                {status === "processing" && (
                  <div className="processing-bar">
                    <i />
                  </div>
                )}
              </div>
              {status === "done" ? (
                <ShieldCheck className="text-success" size={19} />
              ) : (
                <Clock3 size={18} />
              )}
            </div>
          )}
        </Card>
        <Card>
          <CardHeading
            title={isDNA ? "Extracted variants" : "Recent lab values"}
            detail={status === "done" ? "Updated now" : "Most recent"}
          />
          {isDNA ? (
            <div className="upload-preview">
              {variants.map((variant, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: status === "done" ? i * 0.09 : 0 }}
                  key={variant.gene}
                >
                  <span className="mono">{variant.gene}</span>
                  <b>{variant.phenotype}</b>
                  <small>
                    {variant.diplotype} · {variant.variant}
                  </small>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="upload-preview">
              {labs.map((lab) => (
                <div key={lab.name}>
                  <span>{lab.name}</span>
                  <b className="mono">
                    {lab.value} {lab.unit}
                  </b>
                  <small>{lab.range}</small>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

function Analysis() {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const phases = [
    "Normalizing data",
    "Extracting pharmacogenomic features",
    "Matching evidence context",
    "Preparing review summary",
  ];
  const run = () => {
    setRunning(true);
    let value = 0;
    const interval = window.setInterval(() => {
      value += 1;
      setStep(value);
      if (value === phases.length) {
        window.clearInterval(interval);
        window.setTimeout(
          () => router.push("/patients/amara-velasquez/report/rpt-2026-041"),
          700,
        );
      }
    }, 950);
  };
  return (
    <>
      <PageHeader
        eyebrow="Pre-flight review"
        title="Ready to review this patient?"
        description="Confirm the available information before generating a mock clinical support report."
      />
      <div className="analysis-layout">
        <Card>
          <CardHeading
            title="Data ready for review"
            detail="4 of 4 core inputs"
          />
          <div className="checklist">
            <CheckItem
              label="Patient context & medication list"
              detail="Updated today"
              checked
            />
            <CheckItem
              label="Recent laboratory values"
              detail="4 structured values · lab report from today"
              checked
            />
            <CheckItem
              label="Pharmacogenomic data"
              detail="4 core findings · processed today"
              checked
            />
            <CheckItem
              label="Symptoms & physiological data"
              detail="Latest patient entry: 2 days ago"
              checked
            />
          </div>
        </Card>
        <Card>
          <CardHeading title="Optional inputs" detail="Not required" />
          <div className="optional-card">
            <div className="future-note">
              <span>Future version</span> Voice sample and longitudinal wearable
              inputs require validation before use.
            </div>
            <p>
              Missing optional inputs will be shown as data gaps. The report
              will use conservative, probabilistic wording.
            </p>
          </div>
        </Card>
      </div>
      <Card className="analysis-callout">
        <div>
          <span className="callout-icon">
            <Sparkles size={20} />
          </span>
          <div>
            <h2>Run mock analysis</h2>
            <p>
              The prototype will synthesize the available record into a
              structured report. No clinical inference is performed.
            </p>
          </div>
        </div>
        <button onClick={run} className="button button--gold button--large">
          Run analysis <ChevronRight size={17} />
        </button>
      </Card>
      <AnimatePresence>
        {running && (
          <motion.div
            className="processing-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="processing-orb">
              <Dna size={42} />
              <i />
            </div>
            <p className="eyebrow">
              <span /> Analysis in progress
            </p>
            <h2>{phases[Math.min(step, phases.length - 1)]}</h2>
            <div className="processing-steps">
              {phases.map((phase, i) => (
                <span className={i <= step ? "active" : ""} key={phase}>
                  {i < step ? "✓" : i + 1} {phase}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ClinicalReport() {
  const reportId = "rpt-2026-041";
  const report = useReportStore((state) => state.reports[reportId]);
  const setNotes = useReportStore((state) => state.setNotes);
  const setReviewed = useReportStore((state) => state.setReviewed);
  const save = useReportStore((state) => state.save);
  const notes = report?.notes ?? "";
  const reviewed = report?.reviewed ?? false;
  const saved = report?.saved ?? false;
  return (
    <div className="report-page">
      <div className="report-top">
        <Link href="/patients/amara-velasquez" className="button button--ghost">
          ← Back to patient
        </Link>
        <div className="report-top__actions">
          <button
            className="button button--line"
            onClick={() => window.print()}
          >
            <Download size={16} /> Print / PDF
          </button>
          <button
            className="button button--gold"
            onClick={() => save(reportId)}
          >
            {saved ? "Saved" : "Save report"}
          </button>
        </div>
      </div>
      <section className="report-header">
        <div>
          <p className="page-kicker">
            Clinical support report · GRX-RPT-2026-041
          </p>
          <h1>Amara Velasquez</h1>
          <p>
            Generated Jul 10, 2026 · 09:42 ·{" "}
            <span className="mono">GenerX-v0.3-prototype</span>
          </p>
        </div>
        <div className="report-header__meta">
          <span>
            <i className="quality quality--complete">
              <i />
            </i>{" "}
            Data complete
          </span>
          <span>
            <Clock3 size={15} /> Latest source: today
          </span>
          <span>
            <ShieldCheck size={15} />{" "}
            {reviewed
              ? "Reviewed by physician"
              : "Draft · clinician review pending"}
          </span>
        </div>
      </section>
      <section className="report-summary">
        <span className="section-label">Patient summary</span>
        <p>
          The available record suggests an anticoagulation care review with
          current laboratory, medication and pharmacogenomic inputs. This report
          surfaces factors that may warrant further evaluation by the licensed
          physician.
        </p>
      </section>
      <ReportSection
        number="01"
        title="Risk assessment"
        subtitle="Each estimate is a structured review aid, not a diagnosis."
      >
        <div className="risk-grid">
          {risks.map((risk) => (
            <RiskCard key={risk.label} {...risk} />
          ))}
        </div>
      </ReportSection>
      <ReportSection
        number="02"
        title="Pharmacogenomic findings"
        subtitle="Visible translation from diplotype to phenotype and medication context."
      >
        <div className="report-variants">
          {variants.map((variant) => (
            <div key={variant.gene}>
              <span>
                <b className="mono">{variant.gene}</b>
                <small className="mono">
                  {variant.variant} · {variant.diplotype}
                </small>
              </span>
              <span>{variant.phenotype}</span>
              <span>
                {variant.drugs.map((drug) => (
                  <i className="drug-chip" key={drug}>
                    {drug}
                  </i>
                ))}
              </span>
              <button aria-label={`Open ${variant.gene} detail`}>
                <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </ReportSection>
      <ReportSection
        number="03"
        title="Explainable factors"
        subtitle="Why this report surfaces an elevated bleeding-risk review item."
      >
        <div className="explanation">
          <div className="explanation__number">
            82<small>% confidence</small>
          </div>
          <p>
            The data suggest an elevated bleeding-risk review item may be
            associated with a <mark>prolonged INR (3.4)</mark>, current{" "}
            <mark>warfarin exposure</mark>, and the available{" "}
            <mark>UGT1A6 / CYP2C9 pharmacogenomic context</mark>. Consider
            further clinical evaluation alongside medical history and current
            monitoring targets.
          </p>
        </div>
        <div className="source-factors">
          <span>Lab source · today</span>
          <span>Medication list · today</span>
          <span>DNA report · today</span>
          <span>Evidence set · prototype</span>
        </div>
      </ReportSection>
      <ReportSection
        number="04"
        title="Supporting evidence"
        subtitle="Reference context is presented for clinician review; source links are intentionally mocked."
      >
        <div className="evidence-grid">
          <Evidence
            source="CPIC"
            level="Level A"
            title="CYP2C19 and clopidogrel guidance"
            body="Actionable phenotype context may be relevant for clinical review."
          />
          <Evidence
            source="PharmGKB"
            level="Evidence context"
            title="Warfarin pharmacogenomics"
            body="Gene-drug factors may inform interpretation alongside INR monitoring."
          />
          <Evidence
            source="DPWG"
            level="Guideline context"
            title="CYP2C9 and VKORC1"
            body="Dose-related interpretations require licensed clinical review."
          />
        </div>
      </ReportSection>
      <ReportSection
        number="05"
        title="Physician notes"
        subtitle="Draft notes are stored locally in this demo only."
      >
        <label className="notes">
          <span className="visually-hidden">Physician notes</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(reportId, e.target.value)}
            placeholder="Add review notes, decisions, or follow-up items…"
          />
        </label>
      </ReportSection>
      <section className="review-gate">
        <div>
          <ShieldCheck size={22} />
          <div>
            <strong>Physician approval required</strong>
            <p>
              Patient sharing remains unavailable until this report has been
              reviewed by a licensed physician.
            </p>
          </div>
        </div>
        <button
          onClick={() => setReviewed(reportId, !reviewed)}
          className={reviewed ? "button button--line" : "button button--gold"}
        >
          {reviewed ? "Reviewed by physician" : "Mark as reviewed"}
        </button>
        <button className="button button--ghost" disabled={!reviewed}>
          <Send size={15} /> Share with patient
        </button>
      </section>
      <p className="disclaimer">
        <Info size={16} /> {disclaimer}
      </p>
    </div>
  );
}

function Reports() {
  return (
    <>
      <PageHeader
        eyebrow="Report management"
        title="AI reports"
        description="Structured clinical support reports across your patient cohort."
        actions={
          <button className="button button--line">
            <Download size={16} /> Export index
          </button>
        }
      />
      <Card className="table-card">
        <div className="table-toolbar">
          <label className="table-search">
            <Search size={16} />
            <input placeholder="Search reports" />
          </label>
          <button className="filter-button">
            All statuses <ChevronDown size={15} />
          </button>
        </div>
        <div className="patient-table">
          <div className="patient-table__head">
            <span>Report / patient</span>
            <span>Primary review item</span>
            <span>Generated</span>
            <span>Review status</span>
            <span>Risk status</span>
            <span />
          </div>
          {patients.slice(0, 5).map((p) => (
            <Link
              href={`/patients/${p.id}/report/rpt-2026-041`}
              className="patient-row"
              key={p.id}
            >
              <div className="patient-cell">
                <div className="avatar">{p.initials}</div>
                <div>
                  <strong>GRX-RPT-2026-041</strong>
                  <small>{p.name}</small>
                </div>
              </div>
              <span>{p.context}</span>
              <time>{p.lastAnalysis}</time>
              <span className="quality quality--review">
                <i /> Draft review
              </span>
              <RiskBadge level={p.risk} />
              <ChevronRight size={17} />
            </Link>
          ))}
        </div>
      </Card>
    </>
  );
}

function Notifications() {
  const notices = [
    {
      icon: <FlaskConical />,
      title: "Laboratory value requires review",
      body: "Amara Velasquez · INR 3.4 is visible in the latest lab record.",
      time: "12 min ago",
      tone: "warning",
    },
    {
      icon: <Sparkles />,
      title: "Clinical report is ready",
      body: "Mateo Rossi · a mock support report was generated.",
      time: "36 min ago",
      tone: "signal",
    },
    {
      icon: <UploadCloud />,
      title: "DNA report processed",
      body: "Hugo Park · 4 variants are available for review.",
      time: "1h ago",
      tone: "neutral",
    },
  ];
  return (
    <>
      <PageHeader
        eyebrow="Workspace alerts"
        title="Notifications"
        description="Updates about pending review, source processing and report status."
        actions={<button className="button button--line">Mark all read</button>}
      />
      <Card className="notifications-card">
        <p className="date-divider">Today</p>
        {notices.map((notice) => (
          <div className="notification" key={notice.title}>
            <span
              className={`notification__icon notification__icon--${notice.tone}`}
            >
              {notice.icon}
            </span>
            <div>
              <strong>{notice.title}</strong>
              <p>{notice.body}</p>
            </div>
            <time>{notice.time}</time>
            <button aria-label="Dismiss notification">
              <X size={16} />
            </button>
          </div>
        ))}
      </Card>
    </>
  );
}

function SettingsPage() {
  const [saved, setSaved] = useState(false);
  return (
    <>
      <PageHeader
        eyebrow="Workspace preferences"
        title="Settings"
        description="Manage your clinician profile and prototype notification preferences."
      />
      <div className="settings-layout">
        <Card className="settings-nav">
          <button className="active">Profile</button>
          <button>Notifications</button>
          <button>Privacy & security</button>
          <button>Language</button>
        </Card>
        <Card className="settings-panel">
          <h2>Clinician profile</h2>
          <p className="form-lede">
            Shown in report metadata and team assignments.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSaved(true);
            }}
            className="settings-form"
          >
            <div className="form-grid">
              <Field label="Full name" placeholder="Dr. Avery Morgan" />
              <Field label="Clinical specialty">
                <select defaultValue="Cardiology">
                  <option>Cardiology</option>
                  <option>Clinical Pharmacology</option>
                  <option>Medical Genetics</option>
                </select>
              </Field>
              <Field
                label="Clinical organization"
                placeholder="GenerX Research Clinic"
                className="form-grid__full"
              />
            </div>
            <div className="settings-toggle">
              <div>
                <strong>Review notifications</strong>
                <p>
                  Receive visible workspace alerts for items that may require
                  review.
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                aria-label="Enable review notifications"
              />
            </div>
            <button className="button button--gold">
              {saved ? "Saved" : "Save changes"}
            </button>
          </form>
        </Card>
      </div>
    </>
  );
}

function Card({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.section
      className={`card ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.36 }}
    >
      {children}
    </motion.section>
  );
}
function CardHeading({
  title,
  detail,
  href,
}: {
  title: string;
  detail: string;
  href?: string;
}) {
  return (
    <div className="card-heading">
      <h2>{title}</h2>
      {href ? (
        <Link href={href}>
          {detail} <ChevronRight size={14} />
        </Link>
      ) : (
        <span>{detail}</span>
      )}
    </div>
  );
}
function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const coords = values
    .map(
      (v, i) =>
        `${(i / (values.length - 1)) * 100},${100 - ((v - min) / (max - min || 1)) * 76 - 10}`,
    )
    .join(" ");
  return (
    <svg
      className="sparkline"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      role="img"
      aria-label="Trend over recent days"
    >
      <polyline
        points={coords}
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span className={`risk-badge risk-badge--${riskTone(level)}`}>
      <i />
      {level}
    </span>
  );
}
function RiskCard({
  label,
  level,
  confidence,
  rationale,
}: {
  label: string;
  level: RiskLevel;
  confidence: number;
  rationale: string;
}) {
  return (
    <article className="risk-card">
      <div>
        <p>{label}</p>
        <RiskBadge level={level} />
      </div>
      <strong>
        {confidence}
        <small>%</small>
      </strong>
      <div className="confidence" aria-label={`${confidence}% confidence`}>
        {Array.from({ length: 10 }, (_, i) => (
          <i
            key={i}
            className={i < confidenceDots(confidence) ? "filled" : ""}
          />
        ))}
        <span>confidence</span>
      </div>
      <p>{rationale}</p>
    </article>
  );
}
function TimelineItem({
  icon,
  title,
  detail,
  time,
}: {
  icon: ReactNode;
  title: string;
  detail: string;
  time: string;
}) {
  return (
    <div className="timeline-item">
      <span>{icon}</span>
      <div>
        <strong>{title}</strong>
        <p>{detail}</p>
      </div>
      <time>{time}</time>
    </div>
  );
}
function Vital({
  label,
  value,
  unit,
  status,
}: {
  label: string;
  value: string;
  unit: string;
  status: string;
}) {
  return (
    <Card className="vital">
      <p>{label}</p>
      <strong className="mono">
        {value}
        <small>{unit}</small>
      </strong>
      <span>{status}</span>
      <Sparkline values={[5, 7, 6, 9, 8, 11]} />
    </Card>
  );
}
function CheckItem({
  label,
  detail,
  checked,
}: {
  label: string;
  detail: string;
  checked: boolean;
}) {
  return (
    <div className="check-item">
      <span
        className={
          checked
            ? "check-item__mark check-item__mark--checked"
            : "check-item__mark"
        }
      >
        {checked ? "✓" : "–"}
      </span>
      <div>
        <strong>{label}</strong>
        <p>{detail}</p>
      </div>
    </div>
  );
}
function ReportSection({
  number,
  title,
  subtitle,
  children,
}: {
  number: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="report-section">
      <div className="report-section__heading">
        <span>{number}</span>
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
function Evidence({
  source,
  level,
  title,
  body,
}: {
  source: string;
  level: string;
  title: string;
  body: string;
}) {
  return (
    <article className="evidence-card">
      <div>
        <span>{source}</span>
        <small>{level}</small>
      </div>
      <h3>{title}</h3>
      <p>{body}</p>
      <button>
        Mock source <ChevronRight size={13} />
      </button>
    </article>
  );
}
function Field({
  label,
  placeholder,
  type = "text",
  children,
  className = "",
}: {
  label: string;
  placeholder?: string;
  type?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      {label}
      {children || (
        <input
          type={type}
          placeholder={placeholder}
          required={type !== "date"}
        />
      )}
    </label>
  );
}
function isActive(path: string, href: string) {
  return href === "/dashboard" ? path === href : path.startsWith(href);
}
