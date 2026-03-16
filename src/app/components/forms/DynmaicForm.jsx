"use client";

import { ChevronDown } from "lucide-react";

export default function DynamicForm({ fields = [], formData, setFormData }) {
  function handleChange(name, value) {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {fields.map((field, index) => {
        const Icon = field.icon;
        const isFullWidth =
          field.type === "textarea" ||
          field.type === "checkbox" ||
          field.type === "radio";

        /* ================= INPUT ================= */
        if (field.type === "input") {
          return (
            <div
              key={index}
              className={`group ${isFullWidth ? "md:col-span-2" : ""}`}
            >
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {field.label}
              </label>

              {field.description && (
                <p className="mb-3 text-xs text-slate-500">{field.description}</p>
              )}

              <div className="relative">
                {Icon && (
                  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                )}

                <input
                  type={field.inputType || "text"}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm transition-all outline-none
                  focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10
                  hover:border-slate-300 ${
                    Icon ? "pl-11" : ""
                  }`}
                />
              </div>
            </div>
          );
        }

        /* ================= TEXTAREA ================= */
        if (field.type === "textarea") {
          return (
            <div key={index} className="md:col-span-2 group">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {field.label}
              </label>

              {field.description && (
                <p className="mb-3 text-xs text-slate-500">{field.description}</p>
              )}

              <textarea
                rows={5}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm resize-none transition-all outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-300"
              />
            </div>
          );
        }

        /* ================= SELECT ================= */
        if (field.type === "select") {
          return (
            <div key={index} className="group relative">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {field.label}
              </label>

              {field.description && (
                <p className="mb-3 text-xs text-slate-500">{field.description}</p>
              )}

              <div className="relative">
                <select
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 pr-11 text-sm text-slate-700 shadow-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:border-slate-300"
                >
                  {field.options.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          );
        }

        /* ================= CHECKBOX ================= */
        if (field.type === "checkbox") {
          return (
            <div key={index} className="md:col-span-2">
              <label className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md cursor-pointer">
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    checked={formData[field.name] || false}
                    onChange={(e) =>
                      handleChange(field.name, e.target.checked)
                    }
                    className="mt-1 h-5 w-5 rounded accent-indigo-600"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    {field.label}
                  </p>

                  {field.description && (
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {field.description}
                    </p>
                  )}
                </div>
              </label>
            </div>
          );
        }

        /* ================= RADIO ================= */
        if (field.type === "radio") {
          return (
            <div key={index} className="md:col-span-2">
              <label className="mb-3 block text-sm font-semibold text-slate-700">
                {field.label}
              </label>

              {field.description && (
                <p className="mb-4 text-xs text-slate-500">{field.description}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {field.options.map((opt, i) => {
                  const active = formData[field.name] === opt;

                  return (
                    <label
                      key={i}
                      className={`flex items-center gap-3 rounded-2xl border p-4 cursor-pointer transition-all shadow-sm ${
                        active
                          ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/10"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={field.name}
                        value={opt}
                        checked={active}
                        onChange={() => handleChange(field.name, opt)}
                        className="h-4 w-4 accent-indigo-600"
                      />

                      <span
                        className={`text-sm font-medium ${
                          active ? "text-indigo-700" : "text-slate-700"
                        }`}
                      >
                        {opt}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}