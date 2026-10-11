
import Logo from "../components/Logo"

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      <div className="flex min-h-screen">

        <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-white/10 bg-[#101A32] p-12 lg:flex">
          <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-purple-600/20 blur-[100px]" />

          <div className="relative z-10">
            <Logo />
          </div>

          <div className="relative z-10 max-w-xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
              Intelligent Investigation
            </p>

            <h2 className="text-5xl font-bold leading-tight tracking-tight">
              Find the trail.
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Connect the evidence.
              </span>
            </h2>

            <p className="mt-6 max-w-md text-base leading-8 text-slate-400">
              A centralized workspace for authorized
              investigators to search CCTV footage,
              review potential matches, and examine
              camera-to-camera movement.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              {["Face Detection", "CCTV Search", "Route Analysis"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-xs text-slate-500">
            AI-Assisted Suspect Search System
          </p>
        </section>

        <section className="flex w-full items-center justify-center bg-[#0B1120] p-6 lg:w-1/2">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <Logo />
            </div>
            {children}
          </div>
        </section>

      </div>
    </div>
  )
}

export default AuthLayout