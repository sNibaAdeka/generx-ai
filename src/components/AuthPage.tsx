"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Dna,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { HelixScene } from "./HelixScene";

type Mode = "login" | "register" | "forgot";
type LoginResponse = { error?: string };

export function AuthPage({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const copy =
    mode === "login"
      ? {
          eyebrow: "Welcome back",
          title: "Sign in to your workspace",
          action: "Sign in",
        }
      : mode === "register"
        ? {
            eyebrow: "Request access",
            title: "Set up your clinician workspace",
            action: "Create account",
          }
        : {
            eyebrow: "Password support",
            title: "Reset your password",
            action: "Send reset link",
          };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (mode === "forgot") {
      setSubmitted(true);
      return;
    }
    if (mode === "register") {
      router.push("/dashboard");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/mock-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json()) as LoginResponse;
      if (!response.ok) {
        setError(payload.error ?? "Unable to sign in.");
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("The demo sign-in service is temporarily unavailable.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main id="main-content" className="auth-page">
      <section className="auth-visual">
        <Link href="/" className="brand auth-brand">
          <span className="brand-mark">
            <Dna size={19} />
          </span>
          Gener<span>X</span>
        </Link>
        <HelixScene compact />
        <div className="auth-visual__caption">
          <span className="live-dot" /> Secure, explainable clinical review
        </div>
      </section>
      <section className="auth-panel">
        <div className="auth-card glass-card">
          <p className="eyebrow">
            <span /> {copy.eyebrow}
          </p>
          {submitted ? (
            <div className="success-state">
              <CheckCircle2 size={42} />
              <h1>Check your inbox</h1>
              <p>If this account exists, a reset link may arrive shortly.</p>
              <Link href="/login" className="button button--line">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1>{copy.title}</h1>
              <p className="auth-card__lede">
                Use the demo to explore the physician-facing GenerX workflow.
              </p>
              <form onSubmit={onSubmit} className="auth-form">
                {mode === "register" && (
                  <>
                    <label>
                      Full name
                      <input required placeholder="Dr. Avery Morgan" />
                    </label>
                    <label>
                      Professional role
                      <select defaultValue="Doctor">
                        <option>Doctor</option>
                        <option>Clinical pharmacist</option>
                        <option>Medical geneticist</option>
                      </select>
                    </label>
                  </>
                )}
                <label>
                  Email address
                  <span className="input-icon">
                    <Mail size={16} />
                    <input
                      type="email"
                      required
                      placeholder="name@clinic.org"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                    />
                  </span>
                </label>
                {mode !== "forgot" && (
                  <label>
                    Password
                    <span className="input-icon">
                      <LockKeyhole size={16} />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        placeholder="••••••••"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete={
                          mode === "login" ? "current-password" : "new-password"
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Show or hide password"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </span>
                  </label>
                )}
                {error && (
                  <p className="auth-error" role="alert">
                    {error}
                  </p>
                )}
                {mode === "login" && (
                  <div className="form-options">
                    <label className="checkbox">
                      <input type="checkbox" /> Remember me
                    </label>
                    <Link href="/forgot">Forgot password?</Link>
                  </div>
                )}
                {mode === "register" && (
                  <label className="checkbox">
                    <input type="checkbox" required /> I accept the prototype
                    terms and privacy notice.
                  </label>
                )}
                <button
                  className="button button--gold button--full"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Checking access…" : copy.action}{" "}
                  {!isSubmitting && <ArrowRight size={16} />}
                </button>
              </form>
              {mode === "login" ? (
                <p className="auth-switch">
                  New to GenerX? <Link href="/register">Request access</Link>
                </p>
              ) : (
                <p className="auth-switch">
                  Already have access? <Link href="/login">Sign in</Link>
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
