"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Search, Mic, X, Sparkles, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/* SEARCH INDEX */

const dashboardSearch = [
  {
    id: "page-1",
    title: "Dashboard",
    description: "Main analytics overview",
    type: "page",
    route: "/dashboard",
    keywords: ["home", "analytics"],
  },
  {
    id: "page-2",
    title: "Orders",
    description: "View and manage orders",
    type: "page",
    route: "/order",
    keywords: ["orders", "purchase"],
  },
  {
    id: "page-3",
    title: "Inventory",
    description: "Manage stock inventory",
    type: "page",
    route: "/inventory",
    keywords: ["inventory", "stock", "products"],
  },
  {
    id: "page-4",
    title: "Payments",
    description: "Manage payments",
    type: "page",
    route: "/payments",
    keywords: ["payments", "money"],
  },
  {
    id: "page-5",
    title: "Customers",
    description: "Customer management",
    type: "page",
    route: "/customers",
    keywords: ["customer", "buyer"],
  },
  {
    id: "page-6",
    title: "Reports",
    description: "Analytics and reports",
    type: "page",
    route: "/reports",
    keywords: ["analytics", "data"],
  },
  {
    id: "page-7",
    title: "Return Products",
    description: "Manage returned products",
    type: "page",
    route: "/return",
    keywords: ["return", "refund"],
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: -18, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.985,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.22, ease: "easeOut" },
  },
};

export default function SearchOverlay({ open, onClose, anchorRef }) {
  const router = useRouter();

  const [style, setStyle] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  /* RESET WHEN CLOSED */

  useEffect(() => {
    if (!open) {
      setSearchText("");
      setSelectedIndex(0);
      setIsFocused(false);
      stopListening();
    }
  }, [open]);

  /* AUTO FOCUS */

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 120);

      return () => clearTimeout(timer);
    }
  }, [open]);

  /* POSITION HANDLING */

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        setStyle({
          top: 76,
          left: 12,
          right: 12,
          width: "auto",
        });
        return;
      }

      if (anchorRef?.current) {
        const rect = anchorRef.current.getBoundingClientRect();

        setStyle({
          top: rect.bottom + window.scrollY + 12,
          left: rect.left + window.scrollX,
          width: Math.max(rect.width + 50, 520),
        });
      } else {
        setStyle({
          top: 90,
          left: window.innerWidth / 2 - 260,
          width: 520,
        });
      }
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [open, anchorRef]);

  /* FILTERED RESULTS */

  const results = useMemo(() => {
    const text = searchText.trim().toLowerCase();

    if (!text) return [];

    return dashboardSearch.filter((item) => {
      return (
        item.title.toLowerCase().includes(text) ||
        item.description.toLowerCase().includes(text) ||
        item.keywords?.some((k) => k.toLowerCase().includes(text))
      );
    });
  }, [searchText]);

  /* RESET INDEX WHEN SEARCH CHANGES */

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchText]);

  /* KEYBOARD NAVIGATION */

  useEffect(() => {
    const handleKey = (e) => {
      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (results[selectedIndex]) {
          router.push(results[selectedIndex].route);
          setSearchText("");
          setSelectedIndex(0);
          onClose();
        }
      }

      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, results, selectedIndex, router, onClose]);

  /* VOICE SEARCH */

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setSearchText(transcript);
    };

    recognition.onend = () => setListening(false);

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const handleRoute = (route) => {
    router.push(route);
    setSearchText("");
    setSelectedIndex(0);
    onClose();
  };

  if (!style) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[20000]">
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-md"
            onClick={onClose}
          />

          {/* PANEL */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            style={style}
            className="absolute"
          >
            <div className="relative overflow-hidden rounded-[28px] border border-white/30 bg-white/80 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
              {/* animated glow layers */}
              <motion.div
                animate={{
                  opacity: [0.35, 0.7, 0.35],
                  scale: [1, 1.08, 1],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute -top-16 left-8 h-32 w-32 rounded-full bg-orange-300/30 blur-3xl"
              />
              <motion.div
                animate={{
                  opacity: [0.25, 0.55, 0.25],
                  scale: [1.05, 1, 1.05],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute -right-10 top-8 h-28 w-28 rounded-full bg-sky-300/20 blur-3xl"
              />

              {/* top premium line */}
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#FF9900] to-transparent" />

              {/* INPUT SECTION */}
              <div className="relative border-b border-slate-200/80 px-4 py-3 sm:px-5 sm:py-4">
                <motion.div
                  animate={
                    isFocused
                      ? {
                          boxShadow: [
                            "0 0 0 rgba(255,153,0,0)",
                            "0 0 0 4px rgba(255,153,0,0.10)",
                            "0 0 0 0 rgba(255,153,0,0)",
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-3 py-3 shadow-sm"
                >
                  <motion.div
                    animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 2.8, repeat: Infinity }}
                    className="shrink-0"
                  >
                    <Search className="h-4 w-4 text-slate-500" />
                  </motion.div>

                  <input
                    ref={inputRef}
                    autoFocus
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Search pages, orders, products..."
                    className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 min-w-0"
                  />

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="hidden sm:flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-500">
                      <Sparkles className="h-3 w-3" />
                      Smart Search
                    </div>

                    <button
                      onClick={listening ? stopListening : startListening}
                      className="relative flex h-10 w-10 items-center justify-center rounded-full"
                      type="button"
                    >
                      <AnimatePresence>
                        {listening && (
                          <>
                            <motion.span
                              initial={{ scale: 0.8, opacity: 0.45 }}
                              animate={{ scale: 1.6, opacity: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{
                                duration: 1.4,
                                repeat: Infinity,
                                ease: "easeOut",
                              }}
                              className="absolute inset-0 rounded-full bg-red-400"
                            />
                            <motion.span
                              initial={{ scale: 0.8, opacity: 0.35 }}
                              animate={{ scale: 2, opacity: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{
                                duration: 1.8,
                                repeat: Infinity,
                                ease: "easeOut",
                              }}
                              className="absolute inset-0 rounded-full bg-red-300"
                            />
                          </>
                        )}
                      </AnimatePresence>

                      <motion.span
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.94 }}
                        className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition ${
                          listening
                            ? "bg-red-500 text-white shadow-lg shadow-red-200"
                            : "bg-[#FF9900] text-black shadow-lg shadow-orange-200 hover:bg-[#ffad29]"
                        }`}
                      >
                        <Mic className="h-4 w-4" />
                      </motion.span>
                    </button>

                    <motion.button
                      whileHover={{ rotate: 90, scale: 1.06 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={onClose}
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  </div>
                </motion.div>

                <div className="mt-3 flex items-center justify-between px-1 text-[11px] text-slate-500">
                  <span>Navigate faster with smart search</span>
                  <span className="hidden sm:inline">↑ ↓ to move • Enter to open</span>
                </div>
              </div>

              {/* RESULTS */}
              <div className="max-h-[65vh] overflow-y-auto">
                <AnimatePresence mode="wait">
                  {searchText ? (
                    results.length ? (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-2"
                      >
                        {results.map((item, i) => {
                          const active = i === selectedIndex;

                          return (
                            <motion.div
                              key={item.id}
                              variants={itemVariants}
                              initial="hidden"
                              animate="show"
                              exit="hidden"
                              whileHover={{ y: -2, scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => handleRoute(item.route)}
                              className={`group relative mb-2 cursor-pointer overflow-hidden rounded-2xl border transition-all ${
                                active
                                  ? "border-orange-300 bg-gradient-to-r from-orange-50 to-white shadow-[0_10px_30px_rgba(255,153,0,0.18)]"
                                  : "border-transparent bg-white/60 hover:border-slate-200 hover:bg-white"
                              }`}
                            >
                              {/* hover shine */}
                              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                                <motion.div
                                  initial={{ x: "-120%" }}
                                  whileHover={{ x: "120%" }}
                                  transition={{ duration: 0.8, ease: "easeInOut" }}
                                  className="absolute inset-y-0 w-20 rotate-12 bg-white/50 blur-md"
                                />
                              </div>

                              <div className="relative flex items-center justify-between gap-3 px-4 py-3.5">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <p
                                      className={`truncate text-sm font-semibold ${
                                        active ? "text-slate-900" : "text-slate-800"
                                      }`}
                                    >
                                      {item.title}
                                    </p>

                                    {active && (
                                      <motion.span
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-700"
                                      >
                                        Selected
                                      </motion.span>
                                    )}
                                  </div>

                                  <p className="mt-1 truncate text-xs text-slate-500">
                                    {item.description}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-500">
                                    {item.type}
                                  </span>

                                  <motion.div
                                    animate={active ? { x: [0, 3, 0] } : {}}
                                    transition={{ duration: 1.2, repeat: Infinity }}
                                    className="text-slate-400"
                                  >
                                    <ArrowUpRight className="h-4 w-4" />
                                  </motion.div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="flex flex-col items-center justify-center px-6 py-14 text-center"
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.08, 1],
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{ duration: 2.4, repeat: Infinity }}
                          className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100"
                        >
                          <Search className="h-6 w-6 text-slate-400" />
                        </motion.div>

                        <p className="text-sm font-semibold text-slate-700">
                          No results found
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Try searching dashboard, reports, inventory or orders
                        </p>
                      </motion.div>
                    )
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="px-5 py-8"
                    >
                      <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center">
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm"
                        >
                          <Sparkles className="h-6 w-6 text-orange-500" />
                        </motion.div>

                        <p className="text-sm font-semibold text-slate-700">
                          Search pages, orders, customers, products...
                        </p>
                        <p className="mt-2 text-xs text-slate-500">
                          Use keyboard navigation or voice search for faster access
                        </p>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {["Dashboard", "Orders", "Inventory", "Reports", "Payments", "Customers"].map(
                          (item, i) => (
                            <motion.button
                              key={item}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.04 }}
                              whileHover={{ y: -2, scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSearchText(item)}
                              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm transition hover:border-orange-200 hover:text-orange-600"
                              type="button"
                            >
                              {item}
                            </motion.button>
                          )
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}