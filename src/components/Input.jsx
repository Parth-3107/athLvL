
function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  className = "",
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-medium text-slate-300">
        {label}
        {required && (
          <span className="ml-1 text-cyan-400">*</span>
        )}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
      />
    </div>
  )
}

export default Input