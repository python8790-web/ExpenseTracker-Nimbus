import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button";
import GlassCard from "../components/GlassCard";
import { IconWallet, IconMail, IconLock } from "../components/Icons";
import { useAuth } from "../context/AuthContext";
import * as authApi from "../api/auth";

function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token, user } = await authApi.login(email, password);
      setAuth(token, user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="nimbus-bg flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grain" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="glass glass-card mb-4 flex h-14 w-14 items-center justify-center text-mint-400">
            <IconWallet className="h-7 w-7" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
            Welcome back
          </h1>
          <p className="mt-1.5 text-mist">
            Sign in to keep your spending in view
          </p>
        </div>

        <GlassCard as="panel" className="p-7 sm:p-8">
          {error ? (
            <div className="mb-5 rounded-xl border border-coral-400/30 bg-coral-400/10 px-4 py-3 text-sm text-coral-400">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleLogin}>
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
              placeholder="Enter your password"
              value={password}
              icon={<IconLock className="h-full w-full" />}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <Button text="Sign in" type="submit" fullWidth loading={loading} className="mt-2" />
          </form>

          <p className="mt-6 text-center text-sm text-mist">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-mint-400 hover:text-mint-500">
              Create one
            </Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}

export default Login;
