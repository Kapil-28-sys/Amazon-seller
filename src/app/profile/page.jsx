"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Copy,
  RefreshCcw,
  Pencil,
  Save,
  X,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

export default function ProfilePage() {
  const fileInputRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [marketplaces, setMarketplaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const [user, setUser] = useState({
    username: "jajotmarketingajmer",
    email: "jajotmarketingajmer@gmail.com",
    password: "Amazon@1234",
    profileImage: "",
  });

  const [formData, setFormData] = useState({
    username: "jajotmarketingajmer",
    email: "jajotmarketingajmer@gmail.com",
    password: "Amazon@1234",
    profileImage: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const fetchMarketplaceData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setApiError("");

      const response = await fetch("/api/Profile-api", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setMarketplaces(result?.payload || []);
    } catch (error) {
      console.error("Fetch error:", error);
      setApiError(error.message || "Unable to load marketplace data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMarketplaceData();
  }, []);

  const stats = useMemo(() => {
    const total = marketplaces.length;
    const countries = new Set(
      marketplaces.map((item) => item.marketplace?.countryCode).filter(Boolean)
    ).size;
    const currencies = new Set(
      marketplaces
        .map((item) => item.marketplace?.defaultCurrencyCode)
        .filter(Boolean)
    ).size;

    return { total, countries, currencies };
  }, [marketplaces]);

  const validateForm = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
    };

    let isValid = true;

    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
      isValid = false;
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleEditToggle = () => {
    setIsEditing(true);
    setFormData(user);
    setErrors({
      username: "",
      email: "",
      password: "",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(user);
    setErrors({
      username: "",
      email: "",
      password: "",
    });
  };

  const handleSave = () => {
    if (!validateForm()) return;

    setUser(formData);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      profileImage: imageUrl,
    }));
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(user.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-indigo-200/20 blur-3xl" />
        <div className="absolute top-24 right-0 h-80 w-80 rounded-full bg-violet-200/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-200/20 blur-3xl" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10"
      >
        {/* Header */}
        <motion.div
          variants={item}
          className="mb-8 rounded-[28px] border border-white/60 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_30%)]" />
          <div className="relative px-6 py-8 sm:px-8 lg:px-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.2em] uppercase text-slate-200 mb-4">
                <Sparkles size={14} />
                Professional Profile Panel
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                Account Settings
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
                Manage your account details, security preferences, and
                marketplace configuration in a premium dashboard experience.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {!isEditing ? (
                <motion.button
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEditToggle}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-900 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Pencil size={18} />
                  Edit Profile
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 text-white font-semibold shadow-lg hover:bg-emerald-600 transition-all"
                  >
                    <Save size={18} />
                    Save Changes
                  </motion.button>

                  <motion.button
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancel}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/10 text-white font-semibold border border-white/20 hover:bg-white/15 transition-all"
                  >
                    <X size={18} />
                    Cancel
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <motion.div variants={item} className="xl:col-span-1">
            <div className="h-full rounded-[28px] border border-slate-200/70 bg-white shadow-sm overflow-hidden">
              <div className="h-28 bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 relative">
                <div className="absolute inset-0 bg-black/10" />
              </div>

              <div className="px-6 pb-6 -mt-12 relative">
                <div className="relative w-fit mx-auto">
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    className="w-24 h-24 rounded-full bg-white p-1 shadow-xl overflow-hidden"
                  >
                    {formData.profileImage || user.profileImage ? (
                      <img
                        src={isEditing ? formData.profileImage : user.profileImage}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-indigo-700 text-3xl font-black border border-white">
                        {(isEditing ? formData.username : user.username)
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 p-2.5 bg-slate-900 text-white rounded-full shadow-lg border-4 border-white"
                  >
                    <Camera size={14} />
                  </motion.button>
                </div>

                <div className="text-center mt-4">
                  <h2 className="text-xl font-bold text-slate-900 break-all">
                    {isEditing ? formData.username : user.username}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1 break-all">
                    @
                    {(isEditing ? formData.username : user.username)
                      .replace(/\s+/g, "")
                      .toLowerCase()}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck size={14} />
                    Verified Account
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3">
                  <MiniInfoCard
                    icon={<Mail size={16} />}
                    label="Primary Email"
                    value={isEditing ? formData.email : user.email}
                  />
                  <MiniInfoCard
                    icon={<Lock size={16} />}
                    label="Security"
                    value="Password Protected"
                  />
                </div>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100 transition-all"
                >
                  <Upload size={16} />
                  Upload Profile Image
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Personal Information */}
          <motion.div variants={item} className="xl:col-span-2">
            <div className="rounded-[28px] border border-slate-200/70 bg-white shadow-sm overflow-hidden h-full">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Settings2 size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Personal Information
                    </h3>
                    <p className="text-sm text-slate-500">
                      Update profile details with full functionality
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-5">
                {/* Username */}
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:px-5 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                      <User size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.22em]">
                        Full Name
                      </p>

                      {!isEditing ? (
                        <p className="mt-1 text-base sm:text-lg font-semibold text-slate-800 break-all">
                          {user.username}
                        </p>
                      ) : (
                        <>
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter username"
                          />
                          {errors.username && (
                            <p className="text-sm text-red-500 mt-2">
                              {errors.username}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:px-5 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 p-3 rounded-2xl bg-sky-50 text-sky-600">
                      <Mail size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.22em]">
                          Email Address
                        </p>

                        {!isEditing && (
                          <button
                            onClick={handleCopyEmail}
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-all"
                          >
                            <Copy size={14} />
                            {copied ? "Copied" : "Copy Email"}
                          </button>
                        )}
                      </div>

                      {!isEditing ? (
                        <p className="mt-1 text-base sm:text-lg font-semibold text-slate-800 break-all">
                          {user.email}
                        </p>
                      ) : (
                        <>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="Enter email"
                          />
                          {errors.email && (
                            <p className="text-sm text-red-500 mt-2">
                              {errors.email}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:px-5 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      <div className="shrink-0 p-3 rounded-2xl bg-amber-50 text-amber-600">
                        <Lock size={20} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.22em]">
                          Account Password
                        </p>

                        {!isEditing ? (
                          <p className="mt-1 text-base sm:text-lg font-mono font-semibold text-slate-800 break-all">
                            {showPassword ? user.password : "••••••••••••"}
                          </p>
                        ) : (
                          <>
                            <div className="relative mt-2">
                              <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="Enter password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                              >
                                {showPassword ? (
                                  <EyeOff size={18} />
                                ) : (
                                  <Eye size={18} />
                                )}
                              </button>
                            </div>
                            {errors.password && (
                              <p className="text-sm text-red-500 mt-2">
                                {errors.password}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {!isEditing && (
                      <motion.button
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => setShowPassword(!showPassword)}
                        className="shrink-0 p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Extra cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <ActionCard
                    title="Security Status"
                    desc="Your account is protected and verified."
                    icon={<ShieldCheck size={18} />}
                    tone="emerald"
                  />
                  <ActionCard
                    title="Profile Preferences"
                    desc="Update image, details, and visibility settings."
                    icon={<ImageIcon size={18} />}
                    tone="indigo"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Marketplace section */}
        <motion.div variants={item}>
          <div className="rounded-[28px] border border-slate-200/70 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/80 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Marketplace Information
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Connected marketplace data fetched from your API
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  Sync Active
                </div>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fetchMarketplaceData(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all"
                >
                  <RefreshCcw
                    size={16}
                    className={refreshing ? "animate-spin" : ""}
                  />
                  Refresh
                </motion.button>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, index) => (
                    <MarketplaceSkeleton key={index} />
                  ))}
                </div>
              ) : apiError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-red-500 mt-0.5" size={18} />
                    <div className="flex-1">
                      <p className="font-semibold text-red-700">
                        Unable to load marketplace data
                      </p>
                      <p className="text-sm text-red-600 mt-1">{apiError}</p>

                      <button
                        onClick={() => fetchMarketplaceData()}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-all"
                      >
                        <RefreshCcw size={14} />
                        Retry
                      </button>
                    </div>
                  </div>
                </div>
              ) : marketplaces.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-14 text-center">
                  <Store className="mx-auto text-slate-400" size={34} />
                  <h4 className="mt-4 text-lg font-bold text-slate-800">
                    No marketplace data found
                  </h4>
                  <p className="text-sm text-slate-500 mt-2">
                    Connect a marketplace source to see details here.
                  </p>
                </div>
              ) : (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {marketplaces.map((market, index) => (
                    <motion.div
                      key={index}
                      variants={marketplaceAnimation}
                      whileHover={{ y: -6 }}
                      className="group rounded-[24px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-3 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Store size={24} />
                          </div>

                          <div>
                            <h4 className="text-lg font-bold text-slate-900 leading-tight">
                              {market.storeName || "Unnamed Store"}
                            </h4>
                            <p className="text-sm text-slate-500">
                              Marketplace #{index + 1}
                            </p>
                          </div>
                        </div>

                        <div className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-200">
                          Active
                        </div>
                      </div>

                      <div className="space-y-4">
                        <MarketplaceRow
                          icon={<Globe size={17} />}
                          label="Country Code"
                          value={market.marketplace?.countryCode || "N/A"}
                        />
                        <MarketplaceRow
                          icon={<MapPinned size={17} />}
                          label="Domain Name"
                          value={market.marketplace?.domainName || "N/A"}
                          breakAll
                        />
                        <MarketplaceRow
                          icon={<Store size={17} />}
                          label="Store Name"
                          value={market.storeName || "N/A"}
                        />
                        <MarketplaceRow
                          icon={<BadgeDollarSign size={17} />}
                          label="Default Currency"
                          value={
                            market.marketplace?.defaultCurrencyCode || "N/A"
                          }
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Save State Message */}
        <AnimatePresence>
          {!isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-6 right-6 z-50"
            >
              <div className="rounded-2xl border border-slate-200 bg-white shadow-xl px-4 py-3 text-sm font-medium text-slate-700">
                Profile ready and synced
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function StatsCard({ title, value, icon, subtext }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <h3 className="text-3xl font-black text-slate-900 mt-2">{value}</h3>
          <p className="text-xs text-slate-400 mt-2">{subtext}</p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function MiniInfoCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="text-slate-500">{icon}</div>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 font-bold">
            {label}
          </p>
          <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ActionCard({ title, desc, icon, tone = "indigo" }) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`rounded-2xl border p-4 transition-all duration-300 hover:shadow-md ${tones[tone]}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-slate-900">{title}</h4>
          <p className="text-sm text-slate-600 mt-1">{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

function MarketplaceRow({ icon, label, value, breakAll = false }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-white border border-slate-100 px-4 py-3">
      <div className="mt-0.5 text-slate-400">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-400">
          {label}
        </p>
        <p
          className={`text-sm font-semibold text-slate-800 mt-1 ${
            breakAll ? "break-all" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function MarketplaceSkeleton() {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-slate-200" />
        <div className="flex-1">
          <div className="h-4 w-40 bg-slate-200 rounded mb-3" />
          <div className="h-3 w-24 bg-slate-200 rounded" />
        </div>
      </div>

      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-100 p-4">
            <div className="h-3 w-24 bg-slate-200 rounded mb-3" />
            <div className="h-4 w-40 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

const marketplaceAnimation = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};