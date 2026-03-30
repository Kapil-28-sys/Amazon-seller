"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import toast from "react-hot-toast";
import {
  Search,
  Mic,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  Bell,
  User,
  Settings,
  LogOut,
  Package,
  BarChart3,
  Truck,
  Menu,
  Users,
  CreditCard,
  FileText,
  ShieldCheck,
  Code2,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import SearchOverlay from "./SearchOverlay";
import AllProductsModal from "./AllProductModel";

const ROLE = {
  SELLER: "SELLER",
  OWNER: "OWNER",
  MAIN_OWNER: "MAIN_OWNER",
  DEVELOPER: "DEVELOPER",
};

function normalizeRole(role) {
  if (!role) return ROLE.SELLER;

  const value = String(role).trim().toUpperCase();

  if (value === "SELLER") return ROLE.SELLER;
  if (value === "OWNER") return ROLE.OWNER;
  if (value === "MAIN_OWNER") return ROLE.MAIN_OWNER;
  if (value === "DEVELOPER") return ROLE.DEVELOPER;

  return ROLE.SELLER;
}

function getRoleConfig(role, user) {
  const safeRole = normalizeRole(role);

  const displayName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    (safeRole === ROLE.DEVELOPER
      ? "Developer"
      : safeRole === ROLE.OWNER || safeRole === ROLE.MAIN_OWNER
      ? "Main Owner"
      : "Amazon Seller");

  const displayEmail = user?.email || "user@email.com";

  const configs = {
    [ROLE.SELLER]: {
      title: "Amazon Seller",
      subtitle: displayEmail,
      searchPlaceholder: "Search orders, products, shipments",
      quickLinks: [
        { label: "Profile", href: "/profile", icon: <User size={16} /> },
        { label: "Orders", href: "/order", icon: <Package size={16} /> },
        { label: "Shipments", href: "/shipments", icon: <Truck size={16} /> },
        { label: "Reports", href: "/reports", icon: <BarChart3 size={16} /> },
        { label: "Settings", href: "/settings", icon: <Settings size={16} /> },
      ],
      badge: "Seller Panel",
      name: displayName,
      email: displayEmail,
    },

    [ROLE.OWNER]: {
      title: "Main Owner",
      subtitle: displayEmail,
      searchPlaceholder: "Search sellers, sales, orders, reports",
      quickLinks: [
        {
          label: "Dashboard",
          href: "/owner/dashboard",
          icon: <LayoutDashboard size={16} />,
        },
        { label: "Sellers", href: "/owner/sellers", icon: <Users size={16} /> },
        {
          label: "Payments",
          href: "/owner/payments",
          icon: <CreditCard size={16} />,
        },
        {
          label: "Reports",
          href: "/owner/reports",
          icon: <FileText size={16} />,
        },
        {
          label: "Settings",
          href: "/owner/settings",
          icon: <Settings size={16} />,
        },
      ],
      badge: "Owner Panel",
      name: displayName,
      email: displayEmail,
    },

    [ROLE.MAIN_OWNER]: {
      title: "Main Owner",
      subtitle: displayEmail,
      searchPlaceholder: "Search sellers, sales, orders, reports",
      quickLinks: [
        {
          label: "Dashboard",
          href: "/owner/dashboard",
          icon: <LayoutDashboard size={16} />,
        },
        { label: "Sellers", href: "/owner/sellers", icon: <Users size={16} /> },
        {
          label: "Payments",
          href: "/owner/payments",
          icon: <CreditCard size={16} />,
        },
        {
          label: "Reports",
          href: "/owner/reports",
          icon: <FileText size={16} />,
        },
        {
          label: "Settings",
          href: "/owner/settings",
          icon: <Settings size={16} />,
        },
      ],
      badge: "Owner Panel",
      name: displayName,
      email: displayEmail,
    },

    [ROLE.DEVELOPER]: {
      title: "Developer",
      subtitle: displayEmail,
      searchPlaceholder: "Search logs, APIs, permissions, settings",
      quickLinks: [
        {
          label: "Dashboard",
          href: "/developer/dashboard",
          icon: <LayoutDashboard size={16} />,
        },
        {
          label: "Permissions",
          href: "/Permissions",
          icon: <ShieldCheck size={16} />,
        },
        {
          label: "Logs",
          href: "/developer/logs",
          icon: <BarChart3 size={16} />,
        },
        {
          label: "API Settings",
          href: "/developer/api",
          icon: <Code2 size={16} />,
        },
        {
          label: "Settings",
          href: "/developer/settings",
          icon: <Settings size={16} />,
        },
      ],
      badge: "Developer Panel",
      name: displayName,
      email: displayEmail,
    },
  };

  return configs[safeRole] || configs[ROLE.SELLER];
}

export default function TopBar({ collapsed, setMobileOpen }) {
  const router = useRouter();

  const [user, setUser] = useState(null);

  const [openSearch, setOpenSearch] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [openMobileProfile, setOpenMobileProfile] = useState(false);
  const [openDesktopProfile, setOpenDesktopProfile] = useState(false);

  const mobileProfileRef = useRef(null);
  const desktopProfileRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }
  }, []);

  const currentRole = useMemo(() => {
    return normalizeRole(user?.role);
  }, [user]);

  const currentConfig = useMemo(() => {
    return getRoleConfig(currentRole, user);
  }, [currentRole, user]);

  const avatarInitial = useMemo(() => {
    const source =
      currentConfig?.name || user?.name || user?.email || currentRole || "A";
    return String(source).charAt(0).toUpperCase();
  }, [currentConfig, user, currentRole]);

  useEffect(() => {
    function handleKey(e) {
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenSearch(true);
      }

      if (e.key === "Escape") {
        setOpenSearch(false);
        setOpenMobileProfile(false);
        setOpenDesktopProfile(false);
        setOpenProducts(false);
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    function handleOutside(e) {
      if (
        mobileProfileRef.current &&
        !mobileProfileRef.current.contains(e.target)
      ) {
        setOpenMobileProfile(false);
      }

      if (
        desktopProfileRef.current &&
        !desktopProfileRef.current.contains(e.target)
      ) {
        setOpenDesktopProfile(false);
      }
    }

    document.addEventListener("click", handleOutside);
    return () => document.removeEventListener("click", handleOutside);
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();

      toast.success("Logged out successfully");
      setOpenMobileProfile(false);
      setOpenDesktopProfile(false);
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");
      console.error(error);
    }
  };

  const handleMobileMenuOpen = () => {
    if (setMobileOpen) {
      setMobileOpen(true);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    toast.loading("Updating data...", { id: "refresh" });

    setTimeout(() => {
      toast.success("Dashboard updated!", { id: "refresh" });
      setRefreshing(false);
      window.location.reload();
    }, 1200);
  };

  const closeAllProfiles = () => {
    setOpenMobileProfile(false);
    setOpenDesktopProfile(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={`
          fixed top-0 h-17 border-b z-[9999] transition-all duration-300
          left-0 w-full
          text-[var(--amazon-text-white)]
          border-[color:var(--sidebar-border)]
          bg-[color:var(--amazon-blue)]/95
          backdrop-blur-xl
          ${
            collapsed
              ? "md:left-16 md:w-[calc(100%-4rem)]"
              : "md:left-64 md:w-[calc(100%-16rem)]"
          }
        `}
      >
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--amazon-orange)] to-transparent opacity-80" />

        <div className="h-full px-3 md:px-4">
          {/* MOBILE */}
          <div className="flex md:hidden items-center justify-between h-full w-full gap-2">
            <div className="flex items-center shrink-0">
              <motion.button
                whileHover={{
                  scale: 1.04,
                  backgroundColor: "var(--sidebar-soft)",
                }}
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={handleMobileMenuOpen}
                className="flex items-center justify-center h-10 w-10 rounded-xl transition shadow-sm"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 text-[var(--amazon-text-white)]" />
              </motion.button>
            </div>

            <div className="flex-1 min-w-0">
              <motion.button
                ref={searchRef}
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setOpenSearch(true)}
                className="w-full flex items-center rounded-xl px-3 py-2 gap-2 overflow-hidden shadow-md border bg-[var(--amazon-bg-white)] border-[color:var(--amazon-border-light)]"
              >
                <motion.div
                  animate={{ x: [0, 1.5, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2 }}
                >
                  <Search className="w-4 h-4 text-[var(--amazon-text-secondary)] shrink-0" />
                </motion.div>
                <span className="text-xs text-[var(--amazon-text-secondary)] truncate">
                  {currentConfig?.searchPlaceholder || "Search"}
                </span>
              </motion.button>
            </div>

            <div
              ref={mobileProfileRef}
              className="relative flex items-center justify-end shrink-0"
            >
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMobileProfile((prev) => !prev);
                }}
                className="relative h-9 w-9 rounded-full flex items-center justify-center font-bold text-[var(--amazon-text-primary)] bg-gradient-to-br from-[var(--amazon-btn-orange)] to-[var(--amazon-orange)]"
                style={{
                  boxShadow: "0 6px 20px rgba(255, 153, 0, 0.35)",
                }}
              >
                <span>{avatarInitial}</span>
                <span className="absolute inset-0 rounded-full border border-white/40" />
              </motion.button>
            </div>
          </div>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center h-full w-full">
            <div className="flex-1 min-w-0 flex items-center gap-3">
              <motion.button
                ref={searchRef}
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.985 }}
                type="button"
                onClick={() => setOpenSearch(true)}
                className="group relative w-full max-w-[440px] flex items-center rounded-xl px-3 py-2 gap-2 overflow-hidden border shadow-[0_8px_24px_rgba(0,0,0,0.12)] bg-[var(--amazon-bg-white)] border-[color:var(--amazon-border-light)]"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-transparent via-[color:var(--amazon-orange)]/10 to-transparent" />

                <motion.div
                  animate={{ x: [0, 1.5, 0] }}
                  transition={{ repeat: Infinity, duration: 2.4 }}
                  className="relative z-10"
                >
                  <Search className="w-4 h-4 text-[var(--amazon-text-secondary)] shrink-0" />
                </motion.div>

                <span className="relative z-10 text-xs text-[var(--amazon-text-secondary)] flex-1 truncate text-left">
                  {currentConfig?.searchPlaceholder ||
                    "Search orders, products, shipments"}
                </span>

                <motion.span
                  whileHover={{ scale: 1.04 }}
                  className="relative z-10 text-[10px] px-2 py-0.5 rounded-md shrink-0 border bg-[var(--amazon-bg-main)] text-[var(--amazon-text-secondary)] border-[color:var(--amazon-border-light)]"
                >
                  Ctrl + K
                </motion.span>

                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 2.2 }}
                  className="relative z-10"
                >
                  <Mic className="w-4 h-4 text-[var(--amazon-orange)] shrink-0" />
                </motion.div>
              </motion.button>
            </div>

            <div className="flex items-center gap-2 lg:gap-4 shrink-0 ml-4">
              <motion.button
                whileHover={{ scale: 1.08, rotate: 8 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={handleRefresh}
                className="p-2 rounded-xl transition hover:bg-[color:var(--sidebar-hover)]"
              >
                <motion.div
                  animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
                  transition={
                    refreshing
                      ? { repeat: Infinity, duration: 0.8, ease: "linear" }
                      : { duration: 0.2 }
                  }
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
              </motion.button>

              <motion.button
                whileHover={{ y: -1, color: "var(--amazon-orange)" }}
                whileTap={{ scale: 0.96 }}
                type="button"
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition"
              >
                <HelpCircle className="w-4 h-4" />
                Help
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                type="button"
                className="relative p-2 rounded-xl transition hover:bg-[color:var(--sidebar-hover)]"
              >
                <Bell className="w-4 h-4" />
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  className="absolute top-1 right-1 text-[10px] px-1 rounded-full font-semibold shadow text-[var(--amazon-text-primary)] bg-[var(--amazon-orange)]"
                >
                  3
                </motion.span>
              </motion.button>

              <div ref={desktopProfileRef} className="relative">
                <motion.button
                  whileHover={{
                    scale: 1.03,
                    backgroundColor: "var(--sidebar-soft)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDesktopProfile((prev) => !prev);
                  }}
                  className="flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded-xl transition"
                >
                  <div
                    className="relative h-8 w-8 rounded-full flex items-center justify-center font-bold text-[var(--amazon-text-primary)] bg-gradient-to-br from-[var(--amazon-btn-orange)] to-[var(--amazon-orange)]"
                    style={{
                      boxShadow: "0 6px 20px rgba(255, 153, 0, 0.35)",
                    }}
                  >
                    {avatarInitial}
                    <span className="absolute inset-0 rounded-full border border-white/40" />
                  </div>

                  <div className="hidden lg:block text-left leading-tight">
                    <p className="text-xs font-semibold text-[var(--amazon-text-white)] max-w-[140px] truncate">
                      {currentConfig?.name}
                    </p>
                    <p className="text-[10px] text-white/65 max-w-[140px] truncate">
                      {currentConfig?.badge}
                    </p>
                  </div>

                  <motion.div
                    animate={{ rotate: openDesktopProfile ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {openDesktopProfile && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="absolute right-0 top-12 w-64 rounded-2xl overflow-hidden z-[12000] border backdrop-blur-xl bg-[color:var(--amazon-bg-white)]/95 border-[color:var(--amazon-border-light)] text-[var(--amazon-text-primary)]"
                      style={{
                        boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
                      }}
                    >
                      <ProfileContent
                        onClose={closeAllProfiles}
                        onLogout={handleLogout}
                        config={currentConfig}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* MOBILE PROFILE DROPDOWN */}
      <AnimatePresence>
        {openMobileProfile && (
          <motion.div
            className="md:hidden fixed inset-0 z-[12000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenMobileProfile(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -14, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="absolute top-14 right-3 w-64 rounded-2xl overflow-hidden border backdrop-blur-xl text-[var(--amazon-text-primary)] bg-[color:var(--amazon-bg-white)]/95 border-[color:var(--amazon-border-light)]"
              style={{
                boxShadow: "0 20px 50px rgba(0,0,0,0.22)",
              }}
            >
              <ProfileContent
                onClose={closeAllProfiles}
                onLogout={handleLogout}
                config={currentConfig}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay
        open={openSearch}
        onClose={() => setOpenSearch(false)}
        anchorRef={searchRef}
      />

      <AllProductsModal
        open={openProducts}
        onClose={() => setOpenProducts(false)}
      />
    </>
  );
}

function ProfileContent({ onClose, onLogout, config }) {
  return (
    <>
      <div className="px-4 py-3 border-b text-sm bg-gradient-to-r from-[var(--amazon-bg-main)] to-[color:var(--amazon-btn-orange)]/10 border-[color:var(--amazon-border-light)]">
        <div className="font-semibold text-[var(--amazon-text-primary)]">
          {config?.title}
        </div>
        <div className="text-xs text-[var(--amazon-text-secondary)]">
          {config?.email}
        </div>
      </div>

      {config?.quickLinks?.map((item, index) => (
        <MenuLink
          key={`${item.label}-${index}`}
          href={item.href}
          icon={item.icon}
          label={item.label}
          onClose={onClose}
        />
      ))}

      <div className="border-t border-[color:var(--amazon-border-light)]" />

      <motion.button
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition text-red-600 hover:bg-red-50 active:bg-red-100"
      >
        <LogOut size={16} />
        <span>Logout</span>
      </motion.button>
    </>
  );
}

function MenuLink({ href, icon, label, onClose }) {
  return (
    <Link href={href} onClick={onClose}>
      <motion.div
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-3 px-4 py-3 text-sm transition cursor-pointer text-[var(--amazon-text-secondary)] hover:bg-[var(--amazon-bg-main)] active:bg-[var(--amazon-border-light)]"
      >
        {icon}
        <span>{label}</span>
      </motion.div>
    </Link>
  );
}