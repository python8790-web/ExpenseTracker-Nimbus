import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button";
import GlassCard from "../components/GlassCard";
import { IconWallet, IconMail, IconLock, IconUser } from "../components/Icons";
import * as authApi from "../api/auth";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authApi.register(name, email, password);
      setSuccess("Account created! Redirecting to sign in…");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="nimbus-bg flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grain" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="glass glass-card mb-4 flex h-14 w-14 items-center justify-center text-violet-400">
            <IconWallet className="h-7 w-7" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
            Create your account
          </h1>
          <p className="mt-1.5 text-mist">
            Start tracking every rupee, effortlessly
          </p>
        </div>

        <GlassCard as="panel" className="p-7 sm:p-8">
          {error ? (
            <div className="mb-5 rounded-xl border border-coral-400/30 bg-coral-400/10 px-4 py-3 text-sm text-coral-400">
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="mb-5 rounded-xl border border-mint-400/30 bg-mint-400/10 px-4 py-3 text-sm text-mint-400">
              {success}
            </div>
          ) : null}

          <form onSubmit={handleRegister}>
            <Input
              label="Full name"
              type="text"
              placeholder="Jordan Lee"
              value={name}
              icon={<IconUser className="h-full w-full" />}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              icon={<IconMail className="h-full w-full" />}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              icon={<IconLock className="h-full w-full" />}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />

            <Input
              label="Confirm password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              icon={<IconLock className="h-full w-full" />}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />

            <Button text="Create account" type="submit" fullWidth loading={loading} className="mt-2" />
          </form>

          <p className="mt-6 text-center text-sm text-mist">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-violet-400 hover:text-violet-500">
              Sign in
            </Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}

export default Register;
