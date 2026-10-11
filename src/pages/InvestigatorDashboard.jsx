import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Logo from "../components/Logo"

function InvestigatorDashboard() {
  const navigate = useNavigate()
  const [cases, setCases] = useState([])

  useEffect(() => {
    try {
      const savedCases = JSON.parse(
        localStorage.getItem("cases") || "[]"
      )
      setCases(Array.isArray(savedCases) ? savedCases : [])
    } catch (error) {
      console.error("Could not load cases:", error)
      setCases([])
    }
  }, [])

  const activeCases = cases.filter(
    (item) => item.caseStatus !== "Closed"
  ).length

  const statusStyles = {
    Open: "border-[#0FFCBE]/40 bg-[#0FFCBE]/10 text-[#0FFCBE]",
    "Under Review":
      "border-[#B2B5E0]/40 bg-[#B2B5E0]/10 text-[#B2B5E0]",
    Closed: "border-white/20 bg-white/5 text-[#C0B8B2]",
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#0A0706] font-mono text-[#E8E3DB]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#65503D]/50 bg-[#0A0706] px-6 py-5 sm:px-10 lg:px-14">
        <div className="flex items-center gap-4">
          <div className="h-8 w-[3px] bg-[#B4121B]" />
          <div>
            <p className="text-[10px] tracking-[0.3em] text-[#A99A88]">
              SYS_001
            </p>
            <div className="mt-1 text-sm font-bold tracking-[0.18em]">
              <Logo />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <span className="hidden text-[10px] tracking-[0.2em] text-[#D2C7B8] sm:inline">
            INVESTIGATION SYSTEM
          </span>

          <span className="h-3 w-3 bg-[#B4121B]" />
          <span className="h-3 w-3 bg-[#D2C7B8]/70" />
          <span className="h-3 w-3 border border-[#D2C7B8]/50" />

          <button
            onClick={() => navigate("/")}
            className="border border-[#65503D]/70 px-3 py-2 text-[10px] tracking-wider text-[#E8E3DB] transition hover:border-[#B4121B] hover:text-white"
          >
            LOG OUT ↗
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-5 py-8 sm:px-10 sm:py-12 lg:px-14">
        <section className="relative mb-9 overflow-hidden border border-[#65503D]/60 bg-[#160C09]">
          <div className="absolute inset-y-0 left-0 w-1 bg-[#B4121B]" />
          <div className="absolute -right-10 -top-20 h-64 w-64 rotate-45 border border-[#B4121B]/20" />
          <div className="absolute -right-5 -top-20 h-64 w-64 rotate-45 border border-[#65503D]/30" />

          <div className="relative z-10 flex flex-col justify-between gap-7 p-6 sm:p-9 lg:flex-row lg:items-end lg:p-10">
            <div>
              <p className="text-[10px] tracking-[0.3em] text-[#B4121B]">
                / INVESTIGATION WORKSPACE
              </p>

              <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[#F0E9DC] sm:text-4xl lg:text-5xl">
                INVESTIGATOR
                <span className="block text-[#B4121B]">
                  DASHBOARD
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-xs leading-6 text-[#BDB0A0] sm:text-sm">
                Manage investigation files, organize suspect information,
                and review potential CCTV sightings.
              </p>
            </div>

            <button
              onClick={() => navigate("/create-case")}
              className="w-full max-w-sm border border-[#0FFCBE]/50 bg-gradient-to-r from-[#0FFCBE] to-[#B2B5E0] px-5 py-4 text-xs font-bold tracking-wider text-[#090605] transition hover:brightness-110 sm:w-auto"
            >
              + CREATE NEW CASE <span className="ml-5">→</span>
            </button>
          </div>

          <div className="relative z-10 flex flex-wrap gap-x-8 gap-y-2 border-t border-[#65503D]/50 bg-[#0A0706]/60 px-6 py-3 text-[9px] tracking-[0.15em] text-[#A99A88] sm:px-9">
            <span>ACCESS: AUTHORISED</span>
            <span>MODULE: CASE MANAGEMENT</span>
            <span className="text-[#0FFCBE]">● WORKSPACE ACTIVE</span>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            {
              title: "ACTIVE CASES",
              value: activeCases,
              detail: "Cases currently in progress",
              accent: "#0FFCBE",
            },
            {
              title: "CCTV SEARCHES",
              value: "00",
              detail: "Searches initiated",
              accent: "#B2B5E0",
            },
            {
              title: "POTENTIAL SIGHTINGS",
              value: "00",
              detail: "Matches awaiting review",
              accent: "#B4121B",
            },
          ].map((item, index) => (
            <div
              key={item.title}
              className="relative overflow-hidden border border-[#65503D]/60 bg-[#120B09] p-5 sm:p-6"
            >
              <div
                className="absolute left-0 top-0 h-full w-[3px]"
                style={{ backgroundColor: item.accent }}
              />

              <div className="flex items-start justify-between gap-3">
                <p className="text-[10px] tracking-[0.2em] text-[#BDB0A0]">
                  {item.title}
                </p>
                <span
                  className="text-[10px]"
                  style={{ color: item.accent }}
                >
                  SYS_00{index + 1}
                </span>
              </div>

              <p
                className="mt-7 text-4xl font-bold tracking-wider"
                style={{ color: item.accent }}
              >
                {String(item.value).padStart(2, "0")}
              </p>

              <p className="mt-3 text-[10px] text-[#9F9184]">
                {item.detail}
              </p>

              <div className="mt-5 h-px bg-[#65503D]/40">
                <div
                  className="h-px w-1/3"
                  style={{ backgroundColor: item.accent }}
                />
              </div>
            </div>
          ))}
        </section>

        <section className="mt-7 grid gap-6 xl:grid-cols-3">
          <div className="overflow-hidden border border-[#65503D]/60 bg-[#120B09] xl:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#65503D]/60 px-5 py-5 sm:px-7">
              <div>
                <p className="text-[9px] tracking-[0.25em] text-[#B4121B]">
                  / CASE DATABASE
                </p>

                <h2 className="mt-3 text-lg font-bold tracking-wide text-[#F0E9DC]">
                  Recent Cases
                </h2>

                <p className="mt-2 text-[10px] text-[#A99A88]">
                  YOUR SAVED INVESTIGATION FILES
                </p>
              </div>

              <span className="border border-[#65503D]/70 px-3 py-2 text-[10px] text-[#0FFCBE]">
                {String(cases.length).padStart(2, "0")} RECORDS
              </span>
            </div>

            {cases.length === 0 ? (
              <div className="px-6 py-12 text-center sm:px-10">
                <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#B4121B]/60 text-2xl text-[#B4121B]">
                  +
                </div>

                <h3 className="mt-5 text-sm font-bold tracking-wider text-[#E8E3DB]">
                  NO CASES REGISTERED
                </h3>

                <p className="mx-auto mt-3 max-w-sm text-xs leading-6 text-[#A99A88]">
                  Create your first case to begin organizing suspect
                  information and investigation records.
                </p>

                <button
                  onClick={() => navigate("/create-case")}
                  className="mt-6 border border-[#65503D] px-5 py-3 text-[10px] tracking-wider text-[#E8E3DB] transition hover:border-[#0FFCBE] hover:text-[#0FFCBE]"
                >
                  CREATE FIRST CASE →
                </button>
              </div>
            ) : (
              <div>
                {[...cases].reverse().map((item, index) => {
                  const status = item.caseStatus || "Open"

                  return (
                    <button
                      key={`${item.caseId || "case"}-${index}`}
                      onClick={() =>
                        navigate(
                          `/case/${encodeURIComponent(item.caseId)}`
                        )
                      }
                      className="group block w-full border-b border-[#65503D]/40 px-5 py-5 text-left transition last:border-b-0 hover:bg-[#21120F] sm:px-7"
                    >
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div className="min-w-0">
                          <h3 className="break-words text-sm font-bold text-[#F0E9DC] transition group-hover:text-[#0FFCBE]">
                            {item.caseTitle || item.title || "Untitled Case"}
                          </h3>

                          <p className="mt-2 break-all text-[10px] tracking-wider text-[#B4121B]">
                            CASE_ID: {item.caseId || "N/A"}
                          </p>
                        </div>

                        <span
                          className={`w-fit border px-3 py-1.5 text-[9px] tracking-wider ${
                            statusStyles[status] || statusStyles.Open
                          }`}
                        >
                          {status.toUpperCase()}
                        </span>
                      </div>

                      {item.description && (
                        <p className="mt-4 line-clamp-2 text-xs leading-6 text-[#BDB0A0]">
                          {item.description}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-[#A99A88]">
                        <span>
                          <span className="text-[#D2C7B8]">DATE: </span>
                          {item.incidentDate || item.date || "N/A"}
                        </span>

                        <span>
                          <span className="text-[#D2C7B8]">LOCATION: </span>
                          {item.location || "N/A"}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-[9px] tracking-wider text-[#0FFCBE]">
                          OPEN CASE FILE
                        </span>
                        <span className="text-sm text-[#B4121B] transition group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <section className="border border-[#65503D]/60 bg-[#120B09] p-5 sm:p-6">
              <p className="text-[9px] tracking-[0.25em] text-[#B4121B]">
                / SYSTEM OVERVIEW
              </p>

              <h2 className="mt-3 text-lg font-bold text-[#F0E9DC]">
                Quick Overview
              </h2>

              <div className="mt-6 space-y-5">
                {[
                  {
                    label: "Create and manage cases",
                    color: "#0FFCBE",
                    code: "MOD_01",
                  },
                  {
                    label: "Upload suspect images",
                    color: "#B2B5E0",
                    code: "MOD_02",
                  },
                  {
                    label: "Review potential matches",
                    color: "#B4121B",
                    code: "MOD_03",
                  },
                ].map((item) => (
                  <div
                    key={item.code}
                    className="flex items-start gap-3"
                  >
                    <span
                      className="mt-1.5 h-2 w-2 shrink-0"
                      style={{ backgroundColor: item.color }}
                    />

                    <div className="min-w-0">
                      <p className="text-xs leading-5 text-[#D2C7B8]">
                        {item.label}
                      </p>
                      <p className="mt-1 text-[9px] tracking-wider text-[#857568]">
                        {item.code}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-[#65503D]/50 pt-4">
                <div className="flex items-center justify-between gap-3 text-[10px]">
                  <span className="text-[#A99A88]">SYSTEM STATUS</span>
                  <span className="text-[#0FFCBE]">● ONLINE</span>
                </div>
              </div>
            </section>

            <section className="border border-[#65503D]/60 bg-[#120B09] p-5 sm:p-6">
              <p className="text-[9px] tracking-[0.25em] text-[#B4121B]">
                / QUICK ACCESS
              </p>

              <h2 className="mt-3 text-lg font-bold text-[#F0E9DC]">
                Investigation Tools
              </h2>

              <button
                onClick={() => navigate("/create-case")}
                className="mt-5 w-full border border-[#65503D] px-4 py-3 text-left text-[10px] tracking-wider text-[#E8E3DB] transition hover:border-[#0FFCBE] hover:text-[#0FFCBE]"
              >
                <span className="mr-3 text-[#B4121B]">01</span>
                CREATE NEW CASE <span className="float-right">↗</span>
              </button>

              <button
                onClick={() => {
                  if (cases.length === 0) {
                    window.alert(
                      "Create a case before starting an AI search."
                    )
                    return
                  }

                  const latestCase = [...cases].reverse()[0]

                  navigate(
                    `/ai-search/${encodeURIComponent(latestCase.caseId)}`
                  )
                }}
                className="mt-3 w-full border border-[#65503D] px-4 py-3 text-left text-[10px] tracking-wider text-[#E8E3DB] transition hover:border-[#B2B5E0] hover:text-[#B2B5E0]"
              >
                <span className="mr-3 text-[#B4121B]">02</span>
                OPEN AI SEARCH <span className="float-right">↗</span>
              </button>
            </section>

            <section className="border-l-2 border-[#B4121B] bg-[#160C09] p-5">
              <p className="text-[9px] tracking-[0.2em] text-[#B4121B]">
                SECURITY NOTICE
              </p>

              <p className="mt-3 text-[10px] leading-6 text-[#BDB0A0]">
                Authorised personnel only. AI search results may contain
                prototype data and must be verified before investigative
                decisions are made.
              </p>
            </section>
          </aside>
        </section>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#65503D]/50 py-5 text-[9px] tracking-[0.15em] text-[#857568]">
          <span>SYS_001 // SUSPECTSEARCH</span>
          <span>AUTHORISED PERSONNEL ONLY</span>
        </footer>
      </main>
    </div>
  )
}

export default InvestigatorDashboard