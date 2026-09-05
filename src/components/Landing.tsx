"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Atom,
  BadgeCheck,
  BrainCircuit,
  Dna,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { PixelHero } from "./ui/pixel-perfect-hero";

const genes = [
  ["CYP2C19", "Clopidogrel response"],
  ["CYP2C9", "Warfarin metabolism"],
  ["VKORC1", "Warfarin sensitivity"],
  ["UGT1A6", "Medication metabolism"],
  ["SLCO1B1", "Statin transport"],
  ["CYP2D6", "Drug response"],
];

export function Landing() {
  return (
    <main id="main-content" className="marketing">
      <nav className="marketing-nav" aria-label="Primary navigation">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <Dna size={19} />
          </span>
          Gener<span>X</span>
        </Link>
        <div className="marketing-nav__links">
          <a href="#product">Product</a>
          <a href="#science">Science</a>
          <a href="#trust">Trust</a>
        </div>
        <div className="marketing-nav__actions">
          <Link href="/login" className="button button--ghost">
            Sign in
          </Link>
          <a href="#request" className="button button--gold">
            Request access <ArrowRight size={16} />
          </a>
        </div>
      </nav>

      <PixelHero
        word1="Clinical"
        word2="precision."
        description="A precise, explainable workspace that connects pharmacogenomic signals, labs and medication context for physician review."
        primaryCta="Request access"
        primaryCtaMobile="Access"
        secondaryCta="Sign in"
        secondaryCtaMobile="Sign in"
        secondaryHref="/login"
        onPrimaryClick={() => window.location.assign("/register")}
      />

      <section id="product" className="story-section story-section--genomics">
        <div className="section-heading">
          <p className="eyebrow">
            <span /> Genomic input
          </p>
          <h2>
            The translation chain,
            <br />
            not a black box.
          </h2>
          <p>
            GenerX makes the pharmacogenomic path visible—from the observed
            diplotype to a phenotype and a reviewable clinical recommendation.
          </p>
        </div>
        <div className="translation-card glass-card">
          <div className="translation-card__path">
            <div>
              <small>01 · RAW SIGNAL</small>
              <strong className="mono">CYP2C19 *1/*2</strong>
              <span>Detected diplotype</span>
            </div>
            <ArrowRight />
            <div>
              <small>02 · CPIC FRAMEWORK</small>
              <strong>Intermediate</strong>
              <span>Metabolizer phenotype</span>
            </div>
            <ArrowRight />
            <div>
              <small>03 · CLINICAL REVIEW</small>
              <strong>Consider context</strong>
              <span>Evidence-based next step</span>
            </div>
          </div>
          <div className="gene-cloud">
            {genes.map(([gene, detail], index) => (
              <button
                key={gene}
                className="gene-chip"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <span className="mono">{gene}</span>
                <small>{detail}</small>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="science" className="story-section story-section--explain">
        <div className="section-heading">
          <p className="eyebrow">
            <span /> Evidence synthesis
          </p>
          <h2>
            Every signal
            <br />
            leaves a trace.
          </h2>
          <p>
            Clinical teams see not only a result, but the factors, uncertainty,
            and guideline context behind it.
          </p>
        </div>
        <div className="feature-grid">
          <Feature
            icon={<Activity />}
            number="01"
            title="Contributing factors"
            body="Lab values, medication exposure and variants stay connected to every conclusion."
          />
          <Feature
            icon={<BrainCircuit />}
            number="02"
            title="Confidence & freshness"
            body="Make data completeness, recency and analytical confidence visible before review."
          />
          <Feature
            icon={<BadgeCheck />}
            number="03"
            title="Evidence hierarchy"
            body="Bring CPIC, PharmGKB, DPWG and guideline context into the same reading flow."
          />
          <Feature
            icon={<ShieldCheck />}
            number="04"
            title="Clinical guardrails"
            body="Probabilistic language supports the physician’s judgment—never replaces it."
          />
        </div>
      </section>

      <section id="trust" className="trust-section">
        <p className="eyebrow">
          <span /> Evidence-aware by design
        </p>
        <div className="source-row">
          <span>CPIC</span>
          <span>PharmGKB</span>
          <span>DPWG</span>
          <span>FDA biomarkers</span>
          <span>ESC guidelines</span>
        </div>
        <p className="trust-note">
          Sources are presented as review context. GenerX is designed for
          clinical decision support, not autonomous diagnosis.
        </p>
      </section>

      <section id="request" className="cta-section">
        <div className="cta-card">
          <div>
            <p className="eyebrow">
              <span /> For clinical teams
            </p>
            <h2>
              Bring a clearer signal
              <br />
              to every review.
            </h2>
          </div>
          <Link href="/register" className="button button--gold button--large">
            Request access <Sparkles size={17} />
          </Link>
        </div>
      </section>
      <footer className="marketing-footer">
        <span className="brand">
          <span className="brand-mark">
            <Atom size={18} />
          </span>
          Gener<span>X</span>
        </span>
        <p>Clinical Decision Support System · Research prototype · © 2026</p>
        <Link href="/login">Clinician sign in</Link>
      </footer>
    </main>
  );
}

function Feature({
  icon,
  number,
  title,
  body,
}: {
  icon: React.ReactNode;
  number: string;
  title: string;
  body: string;
}) {
  return (
    <article className="feature-card glass-card">
      <div className="feature-card__top">
        <span className="feature-icon">{icon}</span>
        <small>{number}</small>
      </div>
      <h3>{title}</h3>
      <p>{body}</p>
      <div className="feature-card__signal">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
    </article>
  );
}
