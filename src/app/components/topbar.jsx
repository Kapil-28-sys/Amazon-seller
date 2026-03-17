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

import SearchOverlay from "./SearchOverlay";
import AllProductsModal from "./AllProductModel";

export default function TopBar({ collapsed, setMobileOpen }) {
  const router = useRouter();

  const [openSearch, setOpenSearch] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const profileRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleKey(e) {
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenSearch(true);
      }

      if (e.key === "Escape") {
        setOpenSearch(false);
        setOpenProfile(false);
        setOpenProducts(false);
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();

      toast.success("Logged out successfully");
      setOpenProfile(false);
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

  return (
    <>
      <header
        className={`
          fixed top-0 h-14 bg-[#232F3E] text-white border-b border-[#37475A]
          z-[9999] transition-all duration-300
          left-0 w-full
          ${collapsed ? "md:left-16 md:w-[calc(100%-4rem)]" : "md:left-64 md:w-[calc(100%-16rem)]"}
        `}
      >
        <div className="h-full px-3 md:px-4">
          {/* MOBILE */}
          <div className="flex md:hidden items-center justify-between h-full w-full gap-2">
            {/* Left */}
            <div className="flex items-center justify-start shrink-0">
              <button
                type="button"
                onClick={handleMobileMenuOpen}
                className="flex items-center justify-center h-10 w-10 rounded-md hover:bg-[#37475A] active:scale-95 transition"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Center */}
            <div className="flex-1 min-w-0">
              <button
                type="button"
                ref={searchRef}
                onClick={() => setOpenSearch(true)}
                className="w-full flex items-center bg-white rounded-md px-3 py-2 gap-2 overflow-hidden"
              >
                <Search className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="text-xs text-gray-500 truncate">Search</span>
              </button>
            </div>

            {/* Right */}
            <div
              ref={profileRef}
              className="relative flex items-center justify-end shrink-0"
            >
              <button
                type="button"
                onClick={() => setOpenProfile((prev) => !prev)}
                className="h-9 w-9 bg-[#FF9900] text-black rounded-full flex items-center justify-center font-bold"
              >
                A
              </button>

              {openProfile && (
                <>
                  {/* overlay */}
                  <div
                    className="fixed inset-0 z-[11990] bg-black/20"
                    onClick={() => setOpenProfile(false)}
                  />

                  {/* dropdown */}
                  <div className="fixed top-14 right-3 w-56 bg-white text-black rounded-md shadow-xl overflow-hidden z-[12000] border border-gray-200">
                    <div className="px-4 py-3 border-b text-sm bg-gray-50">
                      <div className="font-semibold">Amazon Seller</div>
                      <div className="text-xs text-gray-500">
                        seller@email.com
                      </div>
                    </div>

                    <Link href="/profile" onClick={() => setOpenProfile(false)}>
                      <MenuItem icon={<User size={16} />} label="Profile" />
                    </Link>

                    <Link href="/order" onClick={() => setOpenProfile(false)}>
                      <MenuItem icon={<Package size={16} />} label="Orders" />
                    </Link>

                    <Link href="/" onClick={() => setOpenProfile(false)}>
                      <MenuItem icon={<Truck size={16} />} label="Shipments" />
                    </Link>

                    <Link href="/reports" onClick={() => setOpenProfile(false)}>
                      <MenuItem icon={<BarChart3 size={16} />} label="Reports" />
                    </Link>

                    <Link href="/" onClick={() => setOpenProfile(false)}>
                      <MenuItem icon={<Settings size={16} />} label="Settings" />
                    </Link>

                    <div className="border-t" />

                    <MenuItem
                      icon={<LogOut size={16} />}
                      label="Logout"
                      onClick={handleLogout}
                      danger
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center h-full w-full">
            <div className="flex-1 min-w-0 flex items-center z-[9999]">
              <button
                type="button"
                ref={searchRef}
                onClick={() => setOpenSearch(true)}
                className="w-full max-w-[420px] flex items-center bg-white rounded-md px-3 py-2 gap-2 overflow-hidden"
              >
                <Search className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="text-xs text-gray-500 flex-1 truncate text-left">
                  Search orders, products, shipments
                </span>
                <span className="text-[10px] text-gray-500 border px-2 py-0.5 rounded shrink-0">
                  Ctrl + K
                </span>
                <Mic className="w-4 h-4 text-[#FF9900] shrink-0" />
              </button>
            </div>

            <div className="flex items-center gap-2 lg:gap-4 shrink-0 ml-4">
              <button
                type="button"
                onClick={() => {
                  setRefreshing(true);
                  toast.loading("Updating data...", { id: "refresh" });

                  setTimeout(() => {
                    toast.success("Dashboard updated!", { id: "refresh" });
                    window.location.reload();
                  }, 1200);
                }}
                className="p-2 rounded-md hover:bg-[#37475A] transition"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>

              <button
                type="button"
                className="flex items-center gap-1 text-xs hover:text-[#FF9900] px-2"
              >
                <HelpCircle className="w-4 h-4" />
                Help
              </button>

              <button
                type="button"
                className="relative p-2 rounded-md hover:bg-[#37475A] transition"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 bg-[#FF9900] text-black text-[10px] px-1 rounded-full">
                  3
                </span>
              </button>

              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  onClick={() => setOpenProfile((prev) => !prev)}
                  className="flex items-center gap-2 cursor-pointer hover:bg-[#37475A] px-2 py-1 rounded transition"
                >
                  <div className="h-8 w-8 bg-[#FF9900] text-black rounded-full flex items-center justify-center font-bold">
                    A
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition ${
                      openProfile ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openProfile && (
                  <div className="absolute right-0 top-12 w-56 bg-white text-black rounded-md shadow-lg overflow-hidden z-[1300]">
                    <div className="px-4 py-3 border-b text-sm bg-gray-50">
                      <div className="font-semibold">Amazon Seller</div>
                      <div className="text-xs text-gray-500">
                        seller@email.com
                      </div>
                    </div>

                    <Link href="/profile" onClick={() => setOpenProfile(false)}>
                      <MenuItem icon={<User size={16} />} label="Profile" />
                    </Link>

                    <Link href="/order" onClick={() => setOpenProfile(false)}>
                      <MenuItem icon={<Package size={16} />} label="Orders" />
                    </Link>

                    <Link href="/" onClick={() => setOpenProfile(false)}>
                      <MenuItem icon={<Truck size={16} />} label="Shipments" />
                    </Link>

                    <Link href="/reports" onClick={() => setOpenProfile(false)}>
                      <MenuItem icon={<BarChart3 size={16} />} label="Reports" />
                    </Link>

                    <Link href="/" onClick={() => setOpenProfile(false)}>
                      <MenuItem icon={<Settings size={16} />} label="Settings" />
                    </Link>

                    <div className="border-t" />

                    <MenuItem
                      icon={<LogOut size={16} />}
                      label="Logout"
                      onClick={handleLogout}
                      danger
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

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

function MenuItem({ icon, label, href, onClick, danger }) {
  const className = `
    flex items-center gap-3 px-4 py-3 text-sm cursor-pointer
    hover:bg-gray-100 transition
    ${danger ? "text-red-600" : ""}
  `;

  if (href) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {icon}
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={`${className} w-full text-left`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}