"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const data = await api(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      localStorage.setItem("quantacus_token", data.token);
      document.cookie = `quantacus_token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
      router.push("/upload");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card stack auth-card" onSubmit={submit}>
      <div>
        <h1>{mode === "login" ? "Login" : "Create Account"}</h1>
        <p className="muted">Access the Quantacus product intelligence dashboard.</p>
      </div>

      {mode === "register" ? (
        <input
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          placeholder="Name"
        />
      ) : null}

      <input
        value={form.email}
        onChange={(event) => setForm({ ...form, email: event.target.value })}
        placeholder="Email"
        type="email"
      />
      <input
        value={form.password}
        onChange={(event) => setForm({ ...form, password: event.target.value })}
        placeholder="Password"
        type="password"
      />

      {error ? <span className="badge invalid">{error}</span> : null}

      <button className="button" disabled={busy} type="submit">
        {busy ? "Please wait..." : mode === "login" ? "Login" : "Register"}
      </button>
      <button
        className="button secondary"
        type="button"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login" ? "Create account" : "Use existing account"}
      </button>
    </form>
  );
}
