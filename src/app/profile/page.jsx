"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Camera,
  Settings2,
  Globe,
  Store,
  BadgeDollarSign,
  MapPinned,
} from "lucide-react";

export default function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [marketplaces, setMarketplaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const user = {
    username: "Lakshya Mehra",
    email: "lakshya@email.com",
    password: "mypassword123",
  };

  useEffect(() => {
    const fetchMarketplaceData = async () => {
      try {
        setLoading(true);
        setApiError("");

        const response = await fetch(
          "/api/Profile-api",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response:", result);

        setMarketplaces(result?.payload || []);
      } catch (error) {
        console.error("Fetch error:", error);
        setApiError(error.message || "Unable to load marketplace data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMarketplaceData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Account Settings
            </h1>
            <p className="text-slate-500 mt-1 font-medium">
              Manage your personal information and security preferences.
            </p>
          </div>

          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Settings2 size={16} />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:items-stretch mb-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 text-center relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-10"></div>

              <div className="flex flex-col items-center flex-grow justify-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-black ring-4 ring-white shadow-sm">
                    {user.username.charAt(0)}
                  </div>

                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full border border-slate-200 shadow-sm text-slate-600 hover:text-indigo-600 transition-colors">
                    <Camera size={14} />
                  </button>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mt-4">
                  {user.username}
                </h2>

                <p className="text-sm text-slate-500 font-medium lowercase">
                  @{user.username.split(" ")[0]}
                </p>

                <div className="mt-6">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    <ShieldCheck size={14} /> Verified Account
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
              <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                <h3 className="font-bold text-slate-800">
                  Personal Information
                </h3>
              </div>

              <div className="p-8 space-y-8 flex-grow">
                <div className="flex items-start gap-5 group">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <User size={20} />
                  </div>
                  <div className="flex-1 border-b border-slate-50 pb-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Full Name
                    </p>
                    <p className="text-lg font-semibold text-slate-800 mt-1">
                      {user.username}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5 group">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <Mail size={20} />
                  </div>
                  <div className="flex-1 border-b border-slate-50 pb-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Email Address
                    </p>
                    <p className="text-lg font-semibold text-slate-800 mt-1">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5 group">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                    <Lock size={20} />
                  </div>

                  <div className="flex-1 flex items-center justify-between pb-4">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Account Password
                      </p>
                      <p className="text-lg font-mono font-semibold text-slate-800 mt-1 tracking-tighter">
                        {showPassword ? user.password : "••••••••••••"}
                      </p>
                    </div>

                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Marketplace Information</h3>
            <p className="text-sm text-slate-500 mt-1">
              Data fetched from Amazon API
            </p>
          </div>

          <div className="p-6">
            {loading ? (
              <p className="text-slate-500">Loading data...</p>
            ) : apiError ? (
              <p className="text-red-500">{apiError}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {marketplaces.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <Store size={22} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">
                          {item.storeName}
                        </h4>
                        <p className="text-sm text-slate-500">
                          Marketplace #{index + 1}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Globe className="text-slate-400 mt-1" size={18} />
                        <div>
                          <p className="text-xs uppercase tracking-widest font-bold text-slate-400">
                            Country Code
                          </p>
                          <p className="text-sm font-semibold text-slate-800">
                            {item.marketplace?.countryCode}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPinned className="text-slate-400 mt-1" size={18} />
                        <div>
                          <p className="text-xs uppercase tracking-widest font-bold text-slate-400">
                            Domain Name
                          </p>
                          <p className="text-sm font-semibold text-slate-800 break-all">
                            {item.marketplace?.domainName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Store className="text-slate-400 mt-1" size={18} />
                        <div>
                          <p className="text-xs uppercase tracking-widest font-bold text-slate-400">
                            Store Name
                          </p>
                          <p className="text-sm font-semibold text-slate-800">
                            {item.storeName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <BadgeDollarSign className="text-slate-400 mt-1" size={18} />
                        <div>
                          <p className="text-xs uppercase tracking-widest font-bold text-slate-400">
                            Default Currency Code
                          </p>
                          <p className="text-sm font-semibold text-slate-800">
                            {item.marketplace?.defaultCurrencyCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}