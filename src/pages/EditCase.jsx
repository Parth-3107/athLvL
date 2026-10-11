import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Logo from "../components/Logo"

function EditCase() {
  const { caseId } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    caseTitle: "",
    description: "",
    incidentDate: "",
    location: "",
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    try {
      const savedCases = JSON.parse(
        localStorage.getItem("cases") || "[]"
      )

      const selectedCase = savedCases.find(
        (item) => item.caseId === caseId
      )

      if (!selectedCase) {
        setError("Case not found.")
      } else {
        setFormData({
          caseTitle: selectedCase.caseTitle || "",
          description: selectedCase.description || "",
          incidentDate: selectedCase.incidentDate || "",
          location: selectedCase.location || "",
        })
      }
    } catch (err) {
      console.error("Could not load case:", err)
      setError("Could not load case information.")
    } finally {
      setLoading(false)
    }
  }, [caseId])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    if (error) {
      setError("")
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError("")

    if (!formData.caseTitle.trim()) {
      setError("Please enter a case title.")
      return
    }

    try {
      const savedCases = JSON.parse(
        localStorage.getItem("cases") || "[]"
      )

      const caseExists = savedCases.some(
        (item) => item.caseId === caseId
      )

      if (!caseExists) {
        setError("Case not found. Your changes could not be saved.")
        return
      }

      const updatedCases = savedCases.map((item) =>
        item.caseId === caseId
          ? {
              ...item,
              caseTitle: formData.caseTitle.trim(),
              description: formData.description.trim(),
              incidentDate: formData.incidentDate,
              location: formData.location.trim(),
              updatedAt: new Date().toISOString(),
            }
          : item
      )

      localStorage.setItem(
        "cases",
        JSON.stringify(updatedCases)
      )

      navigate(`/case/${encodeURIComponent(caseId)}`)
    } catch (err) {
      console.error("Could not save case:", err)
      setError("Could not save changes. Please try again.")
    }
  }

  const inputClass =
    "w-full rounded-lg border border-[#49302D] bg-[#0A0706] px-4 py-3 text-sm text-[#E8E3DB] outline-none transition placeholder:text-[#76645A] focus:border-[#B4121B] focus:ring-1 focus:ring-[#B4121B]/40 disabled:cursor-not-allowed disabled:opacity-50"

  const labelClass =
    "mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-[#B9A99A]"

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0706] font-mono text-sm text-[#0FFCBE]">
        <span className="mr-3 h-2 w-2 animate-pulse rounded-full bg-[#0FFCBE]" />
        LOADING INVESTIGATION FILE...
      </div>
    )
  }

  if (error === "Case not found." && !formData.caseTitle) {
    return (
      <div className="min-h-screen bg-[#0A0706] font-mono text-[#E8E3DB]">
        <header className="flex items-center justify-between border-b border-[#49302D] bg-[#120B09] px-6 py-4 sm:px-10">
          <Logo />

          <button
            onClick={() => navigate("/investigator")}
            className="border border-[#65503D] px-4 py-2 text-xs uppercase tracking-wider text-[#B9A99A] transition hover:border-[#B4121B] hover:text-white"
          >
            Back to Dashboard
          </button>
        </header>

        <main className="mx-auto max-w-3xl px-6 py-20 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center border border-[#B4121B]/50 bg-[#B4121B]/10 text-2xl text-[#B4121B]">
            !
          </div>

          <p className="text-xs tracking-[0.3em] text-[#B4121B]">
            ERROR // 404
          </p>

          <h1 className="mt-4 text-2xl font-bold tracking-wide">
            CASE NOT FOUND
          </h1>

          <p className="mt-3 text-sm text-[#9C8D82]">
            This investigation file does not exist or may have been
            removed.
          </p>

          <button
            onClick={() => navigate("/investigator")}
            className="mt-8 border border-[#B4121B] bg-[#B4121B]/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#E8E3DB] transition hover:bg-[#B4121B]/20"
          >
            Return to Dashboard
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0706] font-mono text-[#E8E3DB]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[#49302D] bg-[#0A0706]/95 backdrop-blur">
        <div className="flex items-center justify-between px-5 py-4 sm:px-8">
          <Logo />

          <button
            type="button"
            onClick={() =>
              navigate(`/case/${encodeURIComponent(caseId)}`)
            }
            className="border border-[#65503D] px-4 py-2 text-xs uppercase tracking-wider text-[#B9A99A] transition hover:border-[#B4121B] hover:text-white"
          >
            ← Cancel
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
        {/* Page heading */}
        <div className="mb-8 border-l-2 border-[#B4121B] pl-5">
          <p className="text-[10px] font-semibold tracking-[0.3em] text-[#0FFCBE]">
            INVESTIGATION WORKSPACE / CASE MANAGEMENT
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            EDIT <span className="text-[#B4121B]">CASE FILE</span>
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#9C8D82]">
            Modify investigation details and keep the case record
            accurate and up to date.
          </p>
        </div>

        {/* Case metadata */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="border border-[#49302D] bg-[#120B09] p-4">
            <p className="text-[10px] tracking-[0.2em] text-[#8C7769]">
              RECORD IDENTIFIER
            </p>

            <p className="mt-2 break-all text-sm font-semibold text-[#0FFCBE]">
              {caseId}
            </p>
          </div>

          <div className="border border-[#49302D] bg-[#120B09] p-4">
            <p className="text-[10px] tracking-[0.2em] text-[#8C7769]">
              MODIFICATION STATUS
            </p>

            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#B2B5E0]">
              <span className="h-2 w-2 rounded-full bg-[#B2B5E0]" />
              EDIT MODE ACTIVE
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-6 border border-[#B4121B]/60 bg-[#B4121B]/10 p-4 text-sm text-[#F09A9F]"
          >
            <span className="mr-2 font-bold">!</span>
            {error}
          </div>
        )}

        {/* Edit form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden border border-[#49302D] bg-[#120B09]"
        >
          <div className="flex items-center justify-between border-b border-[#49302D] px-5 py-4 sm:px-7">
            <div>
              <h2 className="text-sm font-bold tracking-wider">
                CASE INFORMATION
              </h2>

              <p className="mt-1 text-[10px] tracking-wide text-[#8C7769]">
                UPDATE THE FIELDS BELOW
              </p>
            </div>

            <span className="border border-[#65503D] px-2 py-1 text-[9px] tracking-widest text-[#B9A99A]">
              FORM 01
            </span>
          </div>

          <div className="space-y-6 p-5 sm:p-7">
            {/* Case ID */}
            <div>
              <label htmlFor="caseId" className={labelClass}>
                Case ID
              </label>

              <input
                id="caseId"
                value={caseId}
                disabled
                className={inputClass}
              />

              <p className="mt-2 text-[10px] text-[#76645A]">
                // Case identifier is permanent and cannot be changed.
              </p>
            </div>

            {/* Case title */}
            <div>
              <label htmlFor="caseTitle" className={labelClass}>
                Case Title <span className="text-[#B4121B]">*</span>
              </label>

              <input
                id="caseTitle"
                name="caseTitle"
                value={formData.caseTitle}
                onChange={handleChange}
                required
                maxLength={120}
                className={inputClass}
                placeholder="Enter investigation title..."
              />
            </div>

            {/* Incident date */}
            <div>
              <label htmlFor="incidentDate" className={labelClass}>
                Incident Date
              </label>

              <input
                id="incidentDate"
                type="date"
                name="incidentDate"
                value={formData.incidentDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className={labelClass}>
                Incident Location
              </label>

              <input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                maxLength={200}
                className={inputClass}
                placeholder="Enter incident location..."
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className={labelClass}>
                Case Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                maxLength={5000}
                className={`${inputClass} resize-y leading-6`}
                placeholder="Document the incident, available evidence, and relevant investigation details..."
              />

              <p className="mt-2 text-right text-[10px] text-[#76645A]">
                {formData.description.length}/5000 CHARACTERS
              </p>
            </div>
          </div>

          {/* Form actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#49302D] bg-[#0D0807] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <p className="text-[10px] leading-5 text-[#76645A]">
              Changes will be saved to this case record.
            </p>

            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  navigate(`/case/${encodeURIComponent(caseId)}`)
                }
                className="border border-[#65503D] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#B9A99A] transition hover:border-[#B4121B] hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-gradient-to-r from-[#0FFCBE] to-[#B2B5E0] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#0A0706] transition hover:brightness-110"
              >
                Save Changes →
              </button>
            </div>
          </div>
        </form>

        {/* Footer note */}
        <div className="mt-6 flex items-start gap-3 border border-[#49302D]/70 p-4">
          <span className="text-sm text-[#0FFCBE]">i</span>

          <p className="text-[10px] leading-5 text-[#8C7769]">
            <span className="text-[#B9A99A]">SYSTEM NOTE:</span>{" "}
            Only the case title, incident date, location, and description
            are modified here. Suspect photographs, investigation status,
            and sighting history remain unchanged.
          </p>
        </div>
      </main>
    </div>
  )
}

export default EditCase