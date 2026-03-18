"use client";

import { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import SearchOverlay from "./SearchOverlay";
import AllProductsModal from "./AllProductModel";

export default function TopBar({ collapsed, setMobileOpen }) {
  const router = useRouter();

  const [openSearch, setOpenSearch] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [openMobileProfile, setOpenMobileProfile] = useState(false);
  const [openDesktopProfile, setOpenDesktopProfile] = useState(false);

  const mobileProfileRef = useRef(null);
  const desktopProfileRef = useRef(null);
  const searchRef = useRef(null);

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
          fixed top-0 h-17 text-white border-b border-white/10
          z-[9999] transition-all duration-300
          left-0 w-full
          bg-[#232F3E]/95 backdrop-blur-xl  
          ${
            collapsed
              ? "md:left-16 md:w-[calc(100%-4rem)]"
              : "md:left-64 md:w-[calc(100%-16rem)]"
          }
        `}
      >
        {/* top highlight line */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF9900] to-transparent opacity-80" />

        <div className="h-full px-3 md:px-4">
          {/* MOBILE */}
          <div className="flex md:hidden items-center justify-between h-full w-full gap-2">
            {/* Left */}
            <div className="flex items-center shrink-0">
              <motion.button
                whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.08)" }}
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={handleMobileMenuOpen}
                className="flex items-center justify-center h-10 w-10 rounded-xl transition shadow-sm"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 text-white" />
              </motion.button>
            </div>

            {/* Center */}
            <div className="flex-1 min-w-0">
              <motion.button
                ref={searchRef}
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setOpenSearch(true)}
                className="w-full flex items-center bg-white rounded-xl px-3 py-2 gap-2 overflow-hidden shadow-md border border-white/70"
              >
                <motion.div
                  animate={{ x: [0, 1.5, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2 }}
                >
                  <Search className="w-4 h-4 text-gray-500 shrink-0" />
                </motion.div>
                <span className="text-xs text-gray-500 truncate">Search</span>
              </motion.button>
            </div>

            {/* Right */}
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
                className="relative h-9 w-9 bg-gradient-to-br from-[#FFB84D] to-[#FF9900] text-black rounded-full flex items-center justify-center font-bold shadow-[0_6px_20px_rgba(255,153,0,0.35)]"
              >
                <span>A</span>
                <span className="absolute inset-0 rounded-full border border-white/40" />
              </motion.button>
            </div>
          </div>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center h-full w-full">
            <div className="flex-1 min-w-0 flex items-center">
              <motion.button
                ref={searchRef}
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.985 }}
                type="button"
                onClick={() => setOpenSearch(true)}
                className="group relative w-full max-w-[440px] flex items-center bg-white rounded-xl px-3 py-2 gap-2 overflow-hidden border border-white/70 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-transparent via-[#FF9900]/10 to-transparent" />
                <motion.div
                  animate={{ x: [0, 1.5, 0] }}
                  transition={{ repeat: Infinity, duration: 2.4 }}
                  className="relative z-10"
                >
                  <Search className="w-4 h-4 text-gray-500 shrink-0" />
                </motion.div>

                <span className="relative z-10 text-xs text-gray-500 flex-1 truncate text-left">
                  Search orders, products, shipments
                </span>

                <motion.span
                  whileHover={{ scale: 1.04 }}
                  className="relative z-10 text-[10px] text-gray-500 border px-2 py-0.5 rounded-md shrink-0 bg-gray-50"
                >
                  Ctrl + K
                </motion.span>

                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 2.2 }}
                  className="relative z-10"
                >
                  <Mic className="w-4 h-4 text-[#FF9900] shrink-0" />
                </motion.div>
              </motion.button>
            </div>

            <div className="flex items-center gap-2 lg:gap-4 shrink-0 ml-4">
              <motion.button
                whileHover={{ scale: 1.08, rotate: 8 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={handleRefresh}
                className="p-2 rounded-xl hover:bg-white/10 transition"
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
                whileHover={{ y: -1, color: "#FF9900" }}
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
                className="relative p-2 rounded-xl hover:bg-white/10 transition"
              >
                <Bell className="w-4 h-4" />
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  className="absolute top-1 right-1 bg-[#FF9900] text-black text-[10px] px-1 rounded-full font-semibold shadow"
                >
                  3
                </motion.span>
              </motion.button>

              <div ref={desktopProfileRef} className="relative">
                <motion.button
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.08)" }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDesktopProfile((prev) => !prev);
                  }}
                  className="flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded-xl transition"
                >
                  <div className="relative h-8 w-8 bg-gradient-to-br from-[#FFB84D] to-[#FF9900] text-black rounded-full flex items-center justify-center font-bold shadow-[0_6px_20px_rgba(255,153,0,0.35)]">
                    A
                    <span className="absolute inset-0 rounded-full border border-white/40" />
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
                      className="absolute right-0 top-12 w-56 bg-white/95 backdrop-blur-xl text-black rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] overflow-hidden z-[12000] border border-gray-200"
                    >
                      <ProfileContent
                        onClose={closeAllProfiles}
                        onLogout={handleLogout}
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
              className="absolute top-14 right-3 w-56 bg-white/95 backdrop-blur-xl text-black rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.22)] overflow-hidden border border-gray-200"
            >
              <ProfileContent
                onClose={closeAllProfiles}
                onLogout={handleLogout}
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

function ProfileContent({ onClose, onLogout }) {
  return (
    <>
      <div className="px-4 py-3 border-b text-sm bg-gradient-to-r from-gray-50 to-orange-50">
        <div className="font-semibold">Amazon Seller</div>
        <div className="text-xs text-gray-500">seller@email.com</div>
      </div>

      <MenuLink
        href="/profile"
        icon={<User size={16} />}
        label="Profile"
        onClose={onClose}
      />
      <MenuLink
        href="/order"
        icon={<Package size={16} />}
        label="Orders"
        onClose={onClose}
      />
      <MenuLink
        href="/"
        icon={<Truck size={16} />}
        label="Shipments"
        onClose={onClose}
      />
      <MenuLink
        href="/reports"
        icon={<BarChart3 size={16} />}
        label="Reports"
        onClose={onClose}
      />
      <MenuLink
        href="/"
        icon={<Settings size={16} />}
        label="Settings"
        onClose={onClose}
      />

      <div className="border-t" />

      <motion.button
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left text-red-600 hover:bg-red-50 active:bg-red-100 transition"
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
        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition cursor-pointer"
      >
        {icon}
        <span>{label}</span>
      </motion.div>
    </Link>
  );
}