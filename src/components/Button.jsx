
function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
}) {
  const styles = {
    primary:
      "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-950/30 hover:brightness-110",
    secondary:
      "border border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700",
    outline:
      "border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-lg px-5 py-3 text-sm font-semibold transition-all duration-200 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button