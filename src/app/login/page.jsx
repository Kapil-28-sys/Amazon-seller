"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Truck,
  Gift,
  Star,
  ShieldCheck,
  DollarSign,
  Store,
  Package,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] px-4 py-6">
      <div className="w-full max-w-[1100px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] grid md:grid-cols-2 overflow-hidden border border-gray-100">
        {/* LEFT SIDE */}
        <div className="relative hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-[#fdfbfb] via-[#ebedee] to-[#f7f7f7] p-12 border-r border-gray-50 overflow-hidden">
          {/* Background blur */}
          <div className="absolute top-16 left-8 w-[220px] h-[220px] bg-orange-200 rounded-full blur-[90px] opacity-30 animate-pulse" />
          <div className="absolute bottom-16 right-8 w-[260px] h-[260px] bg-blue-100 rounded-full blur-[110px] opacity-40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.8),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.7),transparent_35%)]" />

          <div className="relative z-10 text-center mb-8">
            <h3 className="text-xl font-bold text-gray-800 tracking-tight">
              Expand your business globally
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              The most trusted platform for sellers.
            </p>
          </div>

          {/* Single Orbit Section */}
          <div className="relative z-10 w-[380px] h-[380px] flex items-center justify-center">
            {/* Orbit ring */}
            <div className="absolute w-[310px] h-[310px] rounded-full border border-white/60 border-dashed opacity-60" />

            {/* Orbit icons */}
            <div className="absolute inset-0 animate-orbit">
              <OrbitIcon
                className="top-0 left-1/2 -translate-x-1/2"
                icon={ShoppingCart}
              />
              <OrbitIcon
                className="top-[12%] right-[10%]"
                icon={Truck}
              />
              <OrbitIcon
                className="right-0 top-1/2 -translate-y-1/2"
                icon={Gift}
              />
              <OrbitIcon
                className="bottom-[12%] right-[10%]"
                icon={DollarSign}
              />
              <OrbitIcon
                className="bottom-0 left-1/2 -translate-x-1/2"
                icon={ShieldCheck}
              />
              <OrbitIcon
                className="bottom-[12%] left-[10%]"
                icon={Star}
              />
              <OrbitIcon
                className="left-0 top-1/2 -translate-y-1/2"
                icon={Store}
              />
              <OrbitIcon
                className="top-[12%] left-[10%]"
                icon={Package}
              />
            </div>

            {/* Center illustration */}
            <div className="relative z-20 flex items-center justify-center w-[220px] h-[220px] rounded-full bg-white/40 backdrop-blur-md border border-white/50 shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
              <img
                src="/seller-img.png"
                alt="Seller Illustration"
                className="w-[300px] h-[300px] object-contain"
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col justify-center items-center p-8 lg:p-16">
          <div className="w-full max-w-[320px]">
            <div className="flex justify-center mb-10">
              <Image
                src="/AmazonLogo.png"
                alt="Amazon"
                width={120}
                height={36}
                className="brightness-90"
              />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              Sign in
            </h2>
            <p className="text-sm text-gray-500 mb-8 font-medium">
              Enter your credentials to manage your store.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[13px] font-bold text-gray-700 ml-1">
                  Email or mobile phone number
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-1.5 focus:border-orange-500 focus:ring-[3px] focus:ring-orange-100 outline-none transition-all placeholder:text-gray-300"
                />
              </div>

              <div>
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[13px] font-bold text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-[12px] font-semibold text-blue-600 hover:text-orange-600 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 mt-1.5 focus:border-orange-500 focus:ring-[3px] focus:ring-orange-100 outline-none transition-all placeholder:text-gray-300"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] hover:from-[#f5d78e] hover:to-[#eeb933] border border-[#a88734] py-3 rounded-xl font-bold text-gray-800 shadow-md active:scale-[0.98] transition-all"
              >
                Sign In
              </button>

              <div className="pt-4 border-t border-gray-100 mt-6 text-center">
                <p className="text-[11px] text-gray-500 leading-relaxed px-2">
                  By continuing, you agree to Amazon&apos;s{" "}
                  <span className="text-blue-600 cursor-pointer hover:underline">
                    Conditions of Use
                  </span>{" "}
                  and{" "}
                  <span className="text-blue-600 cursor-pointer hover:underline">
                    Privacy Notice
                  </span>
                  .
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .animate-float {
          animation: float 5.5s ease-in-out infinite;
        }

        .animate-orbit {
          animation: orbit 16s linear infinite;
        }

        .counter-spin {
          animation: counterSpin 16s linear infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes orbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes counterSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
      `}</style>
    </div>
  );
}

function OrbitIcon({ icon: Icon, className = "" }) {
  return (
    <div className={`absolute ${className}`}>
      <div className="counter-spin p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-white shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:scale-110 transition-transform duration-300">
        <Icon className="w-5 h-5 text-gray-700" strokeWidth={2.2} />
      </div>
    </div>
  );
}