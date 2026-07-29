import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import GlassCard from "../components/GlassCard";
import Input from "../components/Input";
import Button from "../components/Button";
import { IconUser, IconMail, IconLock, IconLogout } from "../components/Icons";
import { useAuth } from "../context/AuthContext";
import * as authApi from "../api/auth";

function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  async function handleProfileSubmit(e: FormEvent) {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setSavingProfile(true);
    try {
      const updated = await authApi.updateMe({ name, email });
      updateUser(updated);
      setProfileSuccess("Profile updated.");
    } catch (err: any) {
      setProfileError(err.response?.data?.message || "Could not update profile.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      setPasswordSuccess("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || "Could not update password.");
    } finally {
      setSavingPassword(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="nimbus-bg min-h-screen pb-16">
      <div className="grain" />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        <div className="mb-7 flex items-center gap-4">
          <div className="glass glass-card flex h-16 w-16 items-center justify-center text-2xl font-semibold text-mint-400">
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              {user?.name}
            </h1>
            <p className="text-mist">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <GlassCard as="panel" className="p-6 sm:p-7">
            <h2 className="mb-5 font-display text-lg font-semibold">Personal information</h2>

            {profileError ? (
              <div className="mb-4 rounded-xl border border-coral-400/30 bg-coral-400/10 px-4 py-2.5 text-sm text-coral-400">
                {profileError}
              </div>
            ) : null}
            {profileSuccess ? (
              <div className="mb-4 rounded-xl border border-mint-400/30 bg-mint-400/10 px-4 py-2.5 text-sm text-mint-400">
                {profileSuccess}
              </div>
            ) : null}

            <form onSubmit={handleProfileSubmit}>
              <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} icon={<IconUser className="h-full w-full" />} required />
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} icon={<IconMail className="h-full w-full" />} required />
              <Button text="Save changes" type="submit" loading={savingProfile} />
            </form>
          </GlassCard>

          <GlassCard as="panel" className="p-6 sm:p-7">
            <h2 className="mb-5 font-display text-lg font-semibold">Change password</h2>

            {passwordError ? (
              <div className="mb-4 rounded-xl border border-coral-400/30 bg-coral-400/10 px-4 py-2.5 text-sm text-coral-400">
                {passwordError}
              </div>
            ) : null}
            {passwordSuccess ? (
              <div className="mb-4 rounded-xl border border-mint-400/30 bg-mint-400/10 px-4 py-2.5 text-sm text-mint-400">
                {passwordSuccess}
              </div>
            ) : null}

            <form onSubmit={handlePasswordSubmit}>
              <Input
                label="Current password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                icon={<IconLock className="h-full w-full" />}
                required
                autoComplete="current-password"
              />
              <Input
                label="New password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={<IconLock className="h-full w-full" />}
                required
                minLength={6}
                autoComplete="new-password"
              />
              <Input
                label="Confirm new password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<IconLock className="h-full w-full" />}
                required
                minLength={6}
                autoComplete="new-password"
              />
              <Button text="Update password" type="submit" variant="secondary" loading={savingPassword} />
            </form>
          </GlassCard>

          <GlassCard className="flex items-center justify-between p-5">
            <div>
              <p className="font-medium text-ink">Log out</p>
              <p className="text-sm text-mist">End your session on this device.</p>
            </div>
            <Button text="Log out" variant="danger" onClick={handleLogout} className="!px-4 !py-2.5">
              <IconLogout className="h-4 w-4" /> Log out
            </Button>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}

export default Profile;
