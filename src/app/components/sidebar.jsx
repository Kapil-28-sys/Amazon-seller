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
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[1200] md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed
          top-14 md:top-0
          left-0
          h-[calc(100vh-56px)] md:h-screen
          bg-[#232F3E]
          text-white
          z-[1250]
          transition-all duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${sidebarExpanded ? "w-64" : "w-16"}
          flex flex-col
        `}
      >
        <div
          onClick={toggleCollapse}
          className="flex items-center gap-3 px-3 py-4 border-b border-[#37475A] cursor-pointer"
        >
          <div className="w-9 h-9 bg-[#FF9900] text-black font-bold flex items-center justify-center rounded">
            A
          </div>

          {sidebarExpanded && (
            <Image
              src="/aamazon.png"
              alt="amazon"
              width={130}
              height={40}
            />
          )}

          <button
            type="button"
            className="ml-auto md:hidden"
            onClick={(e) => {
              e.stopPropagation();
              setMobileOpen(false);
            }}
          >
            <HiOutlineXMark className="text-2xl" />
          </button>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
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
        flex items-center gap-3
        px-3 py-2
        rounded-md
        transition-all duration-200
        ${
          active
            ? "bg-[#37475A] border-l-4 border-[#FF9900]"
            : "hover:bg-[#37475A]"
        }
      `}
    >
      <span className="text-xl">{icon}</span>

      {open && <span className="text-sm font-semibold">{label}</span>}

      {badge && open && (
        <span className="ml-auto bg-[#FFD814] text-black text-xs px-2 rounded-full font-bold">
          {badge}
        </span>
      )}
    </Link>
  );
}

function Dropdown({ icon, label, open, sidebarOpen, onClick, children }) {
  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-[#37475A] transition"
      >
        <span className="text-xl">{icon}</span>

        {sidebarOpen && (
          <>
            <span className="text-sm font-semibold">{label}</span>
            <HiChevronDown
              className={`ml-auto transition ${open ? "rotate-180" : ""}`}
            />
          </>
        )}
      </button>

      {open && sidebarOpen && <div className="ml-8 space-y-1">{children}</div>}
    </div>
  );
}

function SubItem({ label, href, active, closeSidebar }) {
  return (
    <Link
      href={href}
      onClick={closeSidebar}
      className={`
        block px-3 py-2 text-sm rounded-md transition
        ${
          active
            ? "bg-[#37475A] border-l-4 border-[#FF9900]"
            : "hover:bg-[#37475A]"
        }
      `}
    >
      {label}
    </Link>
  );
}