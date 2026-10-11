import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Logo from "../components/Logo"
import Input from "../components/Input"

function CreateCase() {
  const navigate = useNavigate()

  const [caseTitle, setCaseTitle] = useState("")
  const [caseId, setCaseId] = useState("")
  const [description, setDescription] = useState("")
  const [incidentDate, setIncidentDate] = useState("")
  const [location, setLocation] = useState("")

  function handleSubmit(e) {
    e.preventDefault()

    const trimmedCaseId = caseId.trim()
    const trimmedCaseTitle = caseTitle.trim()

    const newCase = {
      caseTitle: trimmedCaseTitle,
      caseId: trimmedCaseId,
      description: description.trim(),
      incidentDate,
      location: location.trim(),
      caseStatus: "Open",
      createdAt: new Date().toISOString(),
    }

    try {
      const existingCases = JSON.parse(
        localStorage.getItem("cases") || "[]"
      )

      if (!Array.isArray(existingCases)) {
        throw new Error("Invalid case data")
      }

      const duplicate = existingCases.some(
        (item) =>
          (item.caseId || "").toLowerCase() ===
          trimmedCaseId.toLowerCase()
      )

      if (duplicate) {
        alert("A case with this ID already exists.")
        return
      }

      existingCases.push(newCase)

      localStorage.setItem(
        "cases",
        JSON.stringify(existingCases)
      )

      alert("Case saved successfully!")
      navigate("/investigator")
    } catch (error) {
      alert("Could not save the case. Please try again.")
      console.error("Could not save case:", error)
    }
  }

  const inputClass =
    "w-full rounded-none border border-[#65503D]/70 bg-[#0A0706] px-4 py-3.5 font-mono text-sm text-[#E8E3DB] placeholder:text-[#857568] outline-none transition focus:border-[#0FFCBE] focus:ring-1 focus:ring-[#0FFCBE]/20"

  const labelClass =
    "mb-2 block text-[10px] font-medium tracking-[0.18em] text-[#D2C7B8]"

  return (
    <div className="min-h-screen overflow-hidden bg-[#0A0706] font-mono text-[#E8E3DB]">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#65503D]/50 bg-[#0A0706] px-6 py-5 sm:px-10 lg:px-14">
        <div className="flex items-center gap-4">
          <div className="h-8 w-[3px] bg-[#B4121B]" />

          <div>
            <p className="text-[10px] tracking-[0.3em] text-[#A99A88]">
              SYS_002
            </p>

            <div className="mt-1 text-sm font-bold tracking-[0.18em]">
              <Logo />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <span className="hidden text-[10px] tracking-[0.2em] text-[#D2C7B8] sm:inline">
            CASE MANAGEMENT
          </span>

          <button
            type="button"
            onClick={() => navigate("/investigator")}
            className="border border-[#65503D]/70 px-4 py-2.5 text-[10px] tracking-wider text-[#E8E3DB] transition hover:border-[#0FFCBE] hover:text-[#0FFCBE]"
          >
            ← BACK TO DASHBOARD
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-10 sm:py-12">
        {/* Page heading */}
        <section className="relative mb-8 overflow-hidden border border-[#65503D]/60 bg-[#160C09]">
          <div className="absolute inset-y-0 left-0 w-1 bg-[#B4121B]" />

          <div className="absolute -right-12 -top-16 h-56 w-56 rotate-45 border border-[#B4121B]/20" />
          <div className="absolute -right-6 -top-16 h-56 w-56 rotate-45 border border-[#65503D]/30" />

          <div className="relative z-10 p-6 sm:p-9">
            <p className="text-[10px] tracking-[0.3em] text-[#B4121B]">
              / INVESTIGATION WORKSPACE / NEW RECORD
            </p>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-[#F0E9DC] sm:text-4xl">
              CREATE NEW
              <span className="block text-[#B4121B]">CASE FILE</span>
            </h1>

            <p className="mt-4 max-w-xl text-xs leading-6 text-[#BDB0A0] sm:text-sm">
              Enter the incident details to register a new investigation
              and begin organizing relevant evidence.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#65503D]/50 bg-[#0A0706]/60 px-6 py-3 text-[9px] tracking-[0.15em] text-[#A99A88] sm:px-9">
            <span>MODULE: CASE REGISTRATION</span>
            <span>REQUIRED FIELDS: 05</span>
            <span className="text-[#0FFCBE]">● READY</span>
          </div>
        </section>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="border border-[#65503D]/60 bg-[#120B09]"
        >
          <div className="flex items-center justify-between gap-4 border-b border-[#65503D]/60 px-5 py-5 sm:px-8">
            <div>
              <p className="text-[9px] tracking-[0.25em] text-[#B4121B]">
                / RECORD DETAILS
              </p>

              <h2 className="mt-2 text-lg font-bold text-[#F0E9DC]">
                Incident Information
              </h2>
            </div>

            <span className="border border-[#65503D]/70 px-3 py-2 text-[9px] tracking-wider text-[#BDB0A0]">
              FORM_001
            </span>
          </div>

          <div className="space-y-7 p-5 sm:p-8">
            {/* Case title and ID */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  CASE TITLE <span className="text-[#B4121B]">*</span>
                </label>

                <Input
                  placeholder="e.g. Downtown Theft Investigation"
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  CASE IDENTIFIER <span className="text-[#B4121B]">*</span>
                </label>

                <Input
                  placeholder="e.g. CASE-2026-001"
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="incident-description"
                className={labelClass}
              >
                INCIDENT DESCRIPTION{" "}
                <span className="text-[#B4121B]">*</span>
              </label>

              <textarea
                id="incident-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a clear summary of the incident..."
                required
                rows={5}
                className={`${inputClass} resize-y`}
              />

              <p className="mt-2 text-[9px] tracking-wide text-[#857568]">
                Include relevant incident details. Avoid unsupported assumptions.
              </p>
            </div>

            {/* Date and location */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="incident-date" className={labelClass}>
                  INCIDENT DATE <span className="text-[#B4121B]">*</span>
                </label>

                <input
                  id="incident-date"
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  INCIDENT LOCATION{" "}
                  <span className="text-[#B4121B]">*</span>
                </label>

                <Input
                  placeholder="e.g. College Road, Nashik"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Security note */}
            <div className="flex gap-4 border-l-2 border-[#B4121B] bg-[#160C09] p-4">
              <span className="text-sm text-[#B4121B]">!</span>

              <div>
                <p className="text-[10px] tracking-[0.15em] text-[#E8E3DB]">
                  RECORDING NOTICE
                </p>

                <p className="mt-2 text-[10px] leading-5 text-[#A99A88]">
                  Check the case identifier and incident information before
                  saving. Case records are currently stored in this browser's
                  local storage.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#65503D]/60 bg-[#0D0807] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p className="text-[9px] tracking-wider text-[#857568]">
              * REQUIRED FIELDS
            </p>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/investigator")}
                className="border border-[#65503D]/80 px-5 py-3 text-[10px] font-semibold tracking-wider text-[#D2C7B8] transition hover:border-[#B4121B] hover:text-white"
              >
                CANCEL
              </button>

              <button
                type="submit"
                className="border border-[#0FFCBE]/50 bg-gradient-to-r from-[#0FFCBE] to-[#B2B5E0] px-6 py-3 text-[10px] font-bold tracking-wider text-[#090605] transition hover:brightness-110"
              >
                SAVE CASE FILE →
              </button>
            </div>
          </div>
        </form>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#65503D]/50 py-5 text-[9px] tracking-[0.15em] text-[#857568]">
          <span>SYS_002 // CASE REGISTRATION</span>
          <span>AUTHORISED PERSONNEL ONLY</span>
        </footer>
      </main>
    </div>
  )
}

export default CreateCase