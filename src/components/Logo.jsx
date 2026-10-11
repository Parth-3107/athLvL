
function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-600 shadow-lg shadow-blue-900/30">
        <span className="text-lg font-extrabold text-white">
          AI
        </span>
      </div>

      <div>
        <h1 className="text-base font-bold tracking-wide text-white">
          SUSPECT<span className="text-cyan-400">SEARCH</span>
        </h1>

        <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
          Investigation Intelligence
        </p>
      </div>
    </div>
  )
}

export default Logo