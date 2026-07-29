import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IconWallet, IconGrid, IconUser, IconLogout } from "./Icons";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      isActive ? "bg-white/12 text-ink" : "text-mist hover:text-ink hover:bg-white/6"
    }`;

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6">
      <nav className="glass glass-pill mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="glass-strong flex h-9 w-9 items-center justify-center rounded-2xl text-mint-400">
            <IconWallet className="h-5 w-5" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">
            Nimbus
          </span>
        </div>

        <div className="hidden items-center gap-1 sm:flex">
          <NavLink to="/dashboard" className={linkClass}>
            <IconGrid className="h-4 w-4" />
            Dashboard
          </NavLink>
          <NavLink to="/profile" className={linkClass}>
            <IconUser className="h-4 w-4" />
            Profile
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-mist sm:inline">
            {user?.name}
          </span>
          <button
            onClick={handleLogout}
            className="glass-strong flex h-9 w-9 items-center justify-center rounded-full text-mist transition hover:text-coral-400"
            aria-label="Log out"
            title="Log out"
          >
            <IconLogout className="h-4.5 w-4.5" />
          </button>
        </div>
      </nav>

      <div className="mx-auto mt-2 flex max-w-6xl justify-center gap-1 sm:hidden">
        <NavLink to="/dashboard" className={linkClass}>
          <IconGrid className="h-4 w-4" /> Dashboard
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          <IconUser className="h-4 w-4" /> Profile
        </NavLink>
      </div>
    </header>
  );
}

export default Navbar;
