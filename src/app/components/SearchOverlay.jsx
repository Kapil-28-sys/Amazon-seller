"use client";

import { useEffect, useState, useRef } from "react";
import { Search, Mic, X } from "lucide-react";
import { useRouter } from "next/navigation";

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

export default function SearchOverlay({ open, onClose, anchorRef }) {
  const router = useRouter();

  const [style, setStyle] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  /* RESET WHEN CLOSED */

  useEffect(() => {
    if (!open) {
      setSearchText("");
      setSelectedIndex(0);
      stopListening();
    }
  }, [open]);

  /* POSITION HANDLING (MOBILE + DESKTOP) */

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        setStyle({
          top: 70,
          left: 12,
          right: 12,
          width: "auto",
        });
        return;
      }

      if (anchorRef?.current) {
        const rect = anchorRef.current.getBoundingClientRect();

        setStyle({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
          width: Math.max(rect.width, 420),
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

  /* SEARCH FILTER */

  const results = dashboardSearch.filter((item) => {
    const text = searchText.toLowerCase();

    return (
      item.title.toLowerCase().includes(text) ||
      item.description.toLowerCase().includes(text) ||
      item.keywords?.some((k) => k.toLowerCase().includes(text))
    );
  });

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

  if (!open || !style) return null;

  return (
    <div className="fixed inset-0 z-[20000]">

      {/* BACKDROP */}

      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* SEARCH BOX */}

      <div
        style={style}
        className="absolute bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
      >

        {/* INPUT */}

        <div className="flex items-center gap-3 px-4 py-3 border-b">

          <Search className="w-4 h-4 text-gray-500 shrink-0" />

          <input
            autoFocus
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search pages, orders, products..."
            className="flex-1 outline-none text-sm min-w-0"
          />

          <button
            onClick={listening ? stopListening : startListening}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition shrink-0 ${
              listening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-red-300 hover:bg-red-500"
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>

          <button onClick={onClose}>
            <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
          </button>

        </div>

        {/* RESULTS */}

        <div className="max-h-[65vh] overflow-y-auto">

          {searchText ? (

            results.length ? (

              results.map((item, i) => (

                <div
                  key={item.id}
                  onClick={() => {
                    router.push(item.route);
                    onClose();
                  }}
                  className={`px-4 py-3 cursor-pointer border-b flex justify-between gap-3 ${
                    i === selectedIndex
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >

                  <div className="min-w-0">

                    <p className="text-sm font-semibold truncate">
                      {item.title}
                    </p>

                    <p className="text-xs text-gray-500 truncate">
                      {item.description}
                    </p>

                  </div>

                  <span className="text-xs text-gray-400 capitalize shrink-0">
                    {item.type}
                  </span>

                </div>

              ))

            ) : (

              <div className="py-10 text-center text-gray-500">
                No results found
              </div>

            )

          ) : (

            <div className="py-12 text-center text-gray-400 text-sm px-4">
              Search pages, orders, customers, products...
            </div>

          )}

        </div>

      </div>

    </div>
  );
}