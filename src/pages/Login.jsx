
import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("investigator")
  const [showPassword, setShowPassword] = useState(false)

  function handleLogin(e) {
    e.preventDefault()

    if (role === "investigator") {
      navigate("/investigator")
    } else {
      alert("Admin dashboard will be connected next.")
    }
  }

  function handleDemoCredentials() {
    setRole("investigator")
    setEmail("investigator@department.gov")
    setPassword("demo123")
  }

  const fieldClass =
    "w-full border border-[#B8A38C] bg-[#FFFDF2] px-4 py-3.5 text-sm text-[#17120F] outline-none transition-colors placeholder:text-[#8D8073] focus:border-[#277D69] focus:ring-2 focus:ring-[#277D69]/15"

  return (
    <main
      className="min-h-screen bg-[#160B09] p-3 text-[#FFFDF2] sm:p-5 lg:p-7"
      style={{ fontFamily: "Consolas, 'Courier New', monospace" }}
    >
      <div className="relative mx-auto grid min-h-[calc(100vh-24px)] max-w-[1600px] overflow-hidden border border-[#705043] bg-[#160B09] sm:min-h-[calc(100vh-40px)] lg:min-h-[calc(100vh-56px)] lg:grid-cols-[0.92fr_1.08fr]">
        {/* Subtle geometric background accents */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 20%, rgba(180,18,27,0.19), transparent 42%), radial-gradient(ellipse at 80% 90%, rgba(103,65,43,0.22), transparent 40%)",
          }}
        />

        {/* Left branding panel */}
        <section className="relative flex min-h-[570px] flex-col border-b border-[#705043] px-6 py-7 sm:px-10 sm:py-9 lg:min-h-[760px] lg:border-b-0 lg:border-r lg:px-12 xl:px-16">
          {/* Top system label */}
          <div className="flex items-center justify-between gap-4 border-b border-[#624238] pb-5 text-[10px] tracking-[0.16em] sm:text-xs">
            <span className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#D9C6A9]" />
              SYS_001
            </span>

            <span className="text-[#D9C6A9]">
              INVESTIGATION SYSTEM
            </span>
          </div>

          {/* Navigation labels */}
          <div className="mt-8 space-y-3 text-[10px] tracking-[0.12em] text-[#D9C6A9] sm:mt-12 sm:text-xs">
            {[
              "CCTV ANALYTICS",
              "SUSPECT IDENTIFICATION",
              "CASE MANAGEMENT",
              "SECURE ACCESS",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="h-px w-4 bg-[#B4121B]" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Main title */}
          <div className="my-auto py-12">
            <div className="border-l-2 border-[#B4121B] pl-5 sm:pl-7">
              <p className="mb-5 text-[10px] tracking-[0.2em] text-[#D9C6A9] sm:text-xs">
                AI-ASSISTED INVESTIGATION
              </p>

              <h1 className="text-5xl font-black uppercase leading-[0.94] tracking-[-0.065em] sm:text-6xl xl:text-7xl">
                Suspect
                <span className="mt-2 block text-[#B4121B]">
                  Search
                </span>
              </h1>

              <p className="mt-6 max-w-sm text-xs leading-6 tracking-[0.08em] text-[#E8DCC9] sm:text-sm">
                IDENTIFICATION SUPPORT
                <br />
                FROM CCTV FOOTAGE
              </p>
            </div>

            {/* Process description, not live system metrics */}
            <div className="mt-10 grid grid-cols-2 gap-3 border-t border-[#624238] pt-5 text-[10px] tracking-[0.08em] text-[#D9C6A9] sm:mt-14 sm:text-xs">
              <p>01 / CASE CREATION</p>
              <p>02 / CCTV SEARCH</p>
              <p>03 / SIGHTING REVIEW</p>
              <p>04 / CASE HISTORY</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-end justify-between gap-4 border-t border-[#624238] pt-5 text-[9px] leading-5 tracking-[0.12em] text-[#D9C6A9] sm:text-[10px]">
            <p>
              FOR AUTHORISED PERSONNEL ONLY
              <br />
              INVESTIGATION WORKSPACE
            </p>

            <span className="text-[#B4121B]">SYS / 001</span>
          </div>
        </section>

        {/* Right login panel */}
        <section className="relative flex items-center justify-center bg-[#E6D8C5] px-4 py-8 text-[#17120F] sm:px-8 sm:py-12 lg:px-10 xl:px-14">
          {/* Decorative corner marks */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-5 top-5 flex gap-2 sm:right-8 sm:top-8"
          >
            <span className="h-2.5 w-2.5 bg-[#B4121B]" />
            <span className="h-2.5 w-2.5 bg-[#B8A38C]" />
            <span className="h-2.5 w-2.5 bg-[#B8A38C]" />
          </div>

          <div className="w-full max-w-[540px] border border-[#B8A38C] bg-[#FFFDF2] p-5 sm:p-8 md:p-10">
            {/* Card header */}
            <div className="flex items-center justify-between gap-3 border-b border-[#D8C8B5] pb-5 text-[10px] tracking-[0.12em] sm:text-xs">
              <span className="flex items-center gap-3">
                <span className="h-0.5 w-7 bg-[#B4121B]" />
                SECURE ACCESS
              </span>

              <span className="text-[#806B59]">[ LOGIN ]</span>
            </div>

            <div className="pt-7 sm:pt-9">
              <h2 className="text-3xl font-bold tracking-[-0.055em] sm:text-4xl">
                Welcome back.
              </h2>

              <p className="mt-3 text-xs leading-6 text-[#66584B] sm:text-sm">
                Sign in to access your investigation workspace.
              </p>
            </div>

            <form onSubmit={handleLogin} className="mt-7 space-y-5 sm:mt-9 sm:space-y-6">
              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="mb-2 block text-xs font-semibold tracking-[0.1em] text-[#55463A]"
                >
                  ROLE
                </label>

                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`${fieldClass} appearance-none`}
                  style={{ borderRadius: 0 }}
                >
                  <option value="investigator">Investigator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold tracking-[0.1em] text-[#55463A]"
                >
                  EMAIL ADDRESS
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="name@department.gov"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldClass}
                  style={{ borderRadius: 0 }}
                  autoComplete="username"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-semibold tracking-[0.1em] text-[#55463A]"
                >
                  PASSWORD
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${fieldClass} pr-20`}
                    style={{ borderRadius: 0 }}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-0 px-3 text-[10px] font-semibold tracking-wide text-[#66584B] hover:text-[#17120F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#277D69]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-[#66584B] underline decoration-[#B8A38C] underline-offset-4 hover:text-[#17120F]"
                  onClick={() =>
                    alert("Password reset will be added later.")
                  }
                >
                  Forgot password?
                </button>
              </div>

              {/* Primary gradient button */}
              <button
                type="submit"
                className="w-full border border-[#277D69] px-5 py-4 text-sm font-bold tracking-[0.1em] text-[#071511] transition-colors hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#277D69]"
                style={{
                  borderRadius: 0,
                  background:
                    "linear-gradient(100deg, #0FFCBE 0%, #B2B5E0 100%)",
                }}
              >
                CONTINUE <span className="ml-3 text-lg">→</span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 text-[10px] tracking-[0.12em] text-[#806B59]">
                <span className="h-px flex-1 bg-[#D8C8B5]" />
                OR
                <span className="h-px flex-1 bg-[#D8C8B5]" />
              </div>

              {/* Demo credentials */}
              <button
                type="button"
                onClick={handleDemoCredentials}
                className="w-full border border-[#8D7762] bg-transparent px-4 py-3.5 text-xs font-semibold tracking-[0.08em] text-[#33271F] transition-colors hover:bg-[#E6D8C5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#277D69]"
                style={{ borderRadius: 0 }}
              >
                USE DEMO CREDENTIALS
              </button>
            </form>

            {/* Authorised access notice */}
            <div className="mt-7 flex gap-3 border-l-2 border-[#B4121B] pl-4 text-[9px] leading-5 tracking-[0.07em] text-[#66584B] sm:mt-9 sm:text-[10px]">
              <p>
                AUTHORISED PERSONNEL ONLY.
                <br />
                UNAUTHORISED ACCESS IS PROHIBITED.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#D8C8B5] pt-4 text-[9px] tracking-[0.1em] text-[#806B59]">
              <span>INVESTIGATION PORTAL</span>
              <span>VERSION 1.0</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Login
