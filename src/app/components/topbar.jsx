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
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import SearchOverlay from "./SearchOverlay";
import AllProductsModal from "./AllProductModel";

export default function TopBar({ collapsed }) {
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      // localStorage/sessionStorage clear if you store token there
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();

      toast.success("Logged out successfully");

      // close dropdown
      setOpenProfile(false);

      // redirect to login page
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");
      console.error(error);
    }
  };

  return (
    <>
      <header
        className={`
          fixed top-0 h-14 bg-[#232F3E] text-white border-b border-[#37475A]
          z-40 px-4 transition-all duration-300
          ${collapsed ? "md:left-16 md:w-[calc(100%-4rem)]" : "md:left-64 md:w-[calc(100%-16rem)]"}
          left-0 w-full
        `}
      >
        <div className="h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              ref={searchRef}
              onClick={() => setOpenSearch(true)}
              className="flex items-center w-[420px] bg-white rounded-md px-3 py-1.5 gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500 flex-1">
                Search orders, products, shipments
              </span>
              <span className="text-[10px] text-gray-500 border px-2 py-0.5 rounded">
                Ctrl + K
              </span>
              <Mic className="w-4 h-4 text-[#FF9900]" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setRefreshing(true);
                toast.loading("Updating data...", { id: "refresh" });

                setTimeout(() => {
                  toast.success("Dashboard updated!", { id: "refresh" });
                  window.location.reload();
                }, 1200);
              }}
              className="p-2 rounded-md hover:bg-[#37475A]"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>

            <button className="flex items-center gap-1 text-xs hover:text-[#FF9900]">
              <HelpCircle className="w-4 h-4" />
              Help
            </button>

            <button className="relative p-2 rounded-md hover:bg-[#37475A]">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 bg-[#FF9900] text-black text-[10px] px-1 rounded-full">
                3
              </span>
            </button>

            <div ref={profileRef} className="relative">
              <div
                onClick={() => setOpenProfile(!openProfile)}
                className="flex items-center gap-2 cursor-pointer hover:bg-[#37475A] px-2 py-1 rounded"
              >
                <div className="h-8 w-8 bg-[#FF9900] text-black rounded-full flex items-center justify-center font-bold">
                  A
                </div>
                <ChevronDown className="w-4 h-4" />
              </div>

              {openProfile && (
                <div className="absolute right-0 top-12 w-56 bg-white text-black rounded-md shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b text-sm">
                    <div className="font-semibold">Amazon Seller</div>
                    <div className="text-xs text-gray-500">seller@email.com</div>
                  </div>

                  <Link href="/profile">
                    <MenuItem icon={<User size={16} />} label="Profile" />
                  </Link>
                  <Link href="/order">
                    <MenuItem icon={<Package size={16} />} label="Orders" />
                  </Link>
                  <Link href="/">
                    <MenuItem icon={<Truck size={16} />} label="Shipments" />
                  </Link>
                  <Link href="/reports">
                    <MenuItem icon={<BarChart3 size={16} />} label="Reports" />
                  </Link>
                  <Link href="/">
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
    flex items-center gap-3 px-4 py-2 text-sm cursor-pointer
    hover:bg-gray-100
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
    <div className={className} onClick={onClick}>
      {icon}
      {label}
    </div>
  );
}