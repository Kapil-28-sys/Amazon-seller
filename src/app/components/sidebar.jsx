"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

import {
  HiOutlineHome,
  HiOutlineChartBar,
  HiOutlineShoppingCart,
  HiOutlineArrowPath,
  HiOutlineExclamationTriangle,
  HiOutlineBolt,
  HiChevronDown,
  HiOutlineXMark,
} from "react-icons/hi2";

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(null);

  const sidebarExpanded = mobileOpen || !collapsed;

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileOpen(false);
    }
  };

  const toggleCollapse = () => {
    if (window.innerWidth >= 768) {
      setCollapsed(!collapsed);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`
          fixed inset-0 z-[1200] md:hidden
          bg-black/40 backdrop-blur-[2px]
          transition-all duration-300
          ${mobileOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
          }
        `}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-14 md:top-0
          h-[calc(100vh-56px)] md:h-screen
          bg-gradient-to-b from-[#232F3E] via-[#1f2937] to-[#111827]
          text-white
          z-[1250]
          flex flex-col
          border-r border-white/10
          shadow-2xl
          transition-all duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${sidebarExpanded ? "w-64" : "w-16"}
        `}
      >
        {/* Top Logo Area */}
        <div
          onClick={toggleCollapse}
          className="
            group relative
            flex items-center gap-3
            px-3 py-4
            border-b border-white/10
            cursor-pointer
            overflow-hidden
          "
        >
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative z-10 w-9 h-9 bg-[#FF9900] text-black font-extrabold flex items-center justify-center rounded-lg shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            A
          </div>

          <div
            className={`
              relative z-10 overflow-hidden transition-all duration-300
              ${sidebarExpanded ? "max-w-[140px] opacity-100" : "max-w-0 opacity-0"}
            `}
          >
            <Image
              src="/aamazon.png"
              alt="amazon"
              width={130}
              height={40}
              className="object-contain translate-x-0 transition-all duration-300"
            />
          </div>

          <button
            type="button"
            className="relative z-10 ml-auto md:hidden p-1 rounded-full hover:bg-white/10 transition"
            onClick={(e) => {
              e.stopPropagation();
              setMobileOpen(false);
            }}
          >
            <HiOutlineXMark className="text-2xl" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <MenuItem
            icon={<HiOutlineHome />}
            label="Dashboard"
            href="/dashboard"
            open={sidebarExpanded}
            active={pathname === "/dashboard"}
            closeSidebar={closeSidebar}
          />

          <MenuItem
            icon={<HiOutlineHome />}
            label="Inventory"
            href="/inventory"
            open={sidebarExpanded}
            active={pathname === "/inventory"}
            closeSidebar={closeSidebar}
          />

          <MenuItem
            icon={<HiOutlineChartBar />}
            label="Category"
            href="/listing"
            open={sidebarExpanded}
            active={pathname === "/listing"}
            closeSidebar={closeSidebar}
          />

          <Dropdown
            icon={<HiOutlineShoppingCart />}
            label="Orders"
            sidebarOpen={sidebarExpanded}
            open={openMenu === "orders"}
            onClick={() => toggleMenu("orders")}
            active={
              pathname === "/order" || pathname === "/order/create"
            }
          >
            <SubItem
              label="All Orders"
              href="/order"
              active={pathname === "/order"}
              closeSidebar={closeSidebar}
            />

            <SubItem
              label="Create Order"
              href="/order/create"
              active={pathname === "/order/create"}
              closeSidebar={closeSidebar}
            />
          </Dropdown>

          <MenuItem
            icon={<HiOutlineArrowPath />}
            label="Payments"
            href="/payments"
            open={sidebarExpanded}
            active={pathname === "/payments"}
            closeSidebar={closeSidebar}
          />

          <MenuItem
            icon={<HiOutlineChartBar />}
            label="Sales"
            href="/Sales"
            open={sidebarExpanded}
            active={pathname === "/sales"}
            closeSidebar={closeSidebar}
          />

          <MenuItem
            icon={<HiOutlineArrowPath />}
            label="Reports"
            href="/reports"
            open={sidebarExpanded}
            active={pathname === "/reports"}
            closeSidebar={closeSidebar}
          />

          <MenuItem
            icon={<HiOutlineExclamationTriangle />}
            label="Customer Details"
            href="/customers"
            open={sidebarExpanded}
            badge="!"
            active={pathname === "/customers"}
            closeSidebar={closeSidebar}
          />

          <MenuItem
            icon={<HiOutlineBolt />}
            label="Returns Products"
            href="/return"
            open={sidebarExpanded}
            active={pathname === "/return"}
            closeSidebar={closeSidebar}
          />
        </nav>
      </aside>
    </>
  );
}

function MenuItem({ icon, label, href, open, active, badge, closeSidebar }) {
  return (
    <Link
      href={href}
      onClick={closeSidebar}
      className={`
        group relative overflow-hidden
        flex items-center gap-3
        px-3 py-3 rounded-xl
        transition-all duration-300 ease-in-out
        transform hover:scale-[1.02]
        ${active
          ? "bg-gradient-to-r from-[#37475A] to-[#2d3a4e] border-l-4 border-[#FF9900] shadow-lg shadow-black/20"
          : "hover:bg-white/10"
        }
      `}
    >
      {/* Hover Shine */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <span
        className={`
          relative z-10 text-xl transition-all duration-300
          ${active ? "text-[#FFB84D] scale-110" : "group-hover:scale-110"}
        `}
      >
        {icon}
      </span>

      <div
        className={`
          relative z-10 overflow-hidden transition-all duration-300
          ${open ? "max-w-[160px] opacity-100" : "max-w-0 opacity-0"}
        `}
      >
        <span className="text-sm font-semibold whitespace-nowrap tracking-wide">
          {label}
        </span>
      </div>

      {badge && open && (
        <span className="relative z-10 ml-auto bg-[#FFD814] text-black text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
          {badge}
        </span>
      )}
    </Link>
  );
}

function Dropdown({
  icon,
  label,
  open,
  sidebarOpen,
  onClick,
  children,
  active,
}) {
  return (
    <div className="overflow-hidden rounded-xl">
      <button
        type="button"
        onClick={onClick}
        className={`
          group relative overflow-hidden
          flex items-center gap-3 w-full
          px-3 py-3 rounded-xl
          transition-all duration-300 ease-in-out
          transform hover:scale-[1.02]
          ${active ? "bg-white/10" : "hover:bg-white/10"}
        `}
      >
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <span
          className={`
            relative z-10 text-xl transition-transform duration-300
            ${open ? "text-[#FFB84D] scale-110" : "group-hover:scale-110"}
          `}
        >
          {icon}
        </span>

        {sidebarOpen && (
          <>
            <span className="relative z-10 text-sm font-semibold tracking-wide">
              {label}
            </span>

            <HiChevronDown
              className={`
                relative z-10 ml-auto text-lg
                transition-transform duration-300
                ${open ? "rotate-180 text-[#FFB84D]" : ""}
              `}
            />
          </>
        )}
      </button>

      <div
        className={`
          grid transition-all duration-300 ease-in-out
          ${open && sidebarOpen ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"}
        `}
      >
        <div className="overflow-hidden">
          <div className="ml-8 space-y-1 border-l border-white/10 pl-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function SubItem({ label, href, active, closeSidebar }) {
  return (
    <Link
      href={href}
      onClick={closeSidebar}
      className={`
        block px-3 py-2.5 text-sm rounded-lg
        transition-all duration-300
        transform hover:translate-x-1
        ${active
          ? "bg-[#37475A] text-[#FFB84D] border-l-4 border-[#FF9900] shadow"
          : "text-white/80 hover:bg-white/10 hover:text-white"
        }
      `}
    >
      {label}
    </Link>
  );
}