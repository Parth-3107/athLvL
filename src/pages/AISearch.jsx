import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Logo from "../components/Logo"

export default function AISearch() {
  const { caseId } = useParams()
  const navigate = useNavigate()

  const [caseData, setCaseData] = useState(null)
  const [loading, setLoading] = useState(true)

  const [searchConfig, setSearchConfig] = useState({
    jurisdiction: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    cameraMode: "all",
    cameraIds: "",
  })

  const [message, setMessage] = useState("")
  const [review, setReview] = useState(false)
  const [savedMessage, setSavedMessage] = useState("")

  useEffect(() => {
    try {
      const savedCases = JSON.parse(
        localStorage.getItem("cases") || "[]"
      )

      const selectedCase = savedCases.find(
        (item) => item.caseId === caseId
      )

      setCaseData(selectedCase || null)

      if (selectedCase) {
        const existing = selectedCase.searchConfig || {}

        setSearchConfig({
          jurisdiction:
            existing.jurisdiction ||
            selectedCase.lastSeen?.location ||
            selectedCase.location ||
            "",
          startDate:
            existing.startDate ||
            selectedCase.lastSeen?.date ||
            "",
          startTime: existing.startTime || "",
          endDate: existing.endDate || "",
          endTime: existing.endTime || "",
          cameraMode: existing.cameraMode || "all",
          cameraIds: existing.cameraIds || "",
        })
      }
    } catch (error) {
      console.error("Could not load case:", error)
      setCaseData(null)
    } finally {
      setLoading(false)
    }
  }, [caseId])

  const images =
    caseData?.suspectImages ||
    (caseData?.suspectImage ? [caseData.suspectImage] : [])

  const lastSeen = caseData?.lastSeen || {}

  const inputClass =
    "w-full rounded-lg border border-[#49302D] bg-[#0A0706] px-4 py-3 text-sm text-[#E8E3DB] outline-none transition placeholder:text-[#76645A] focus:border-[#B4121B] focus:ring-1 focus:ring-[#B4121B]/40"

  const labelClass =
    "mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-[#B9A99A]"

  const sectionClass =
    "mt-6 overflow-hidden border border-[#49302D] bg-[#120B09]"

  const sectionHeaderClass =
    "border-b border-[#49302D] px-5 py-4 sm:px-7"

  const handleChange = (event) => {
    const { name, value } = event.target

    setSearchConfig((previous) => ({
      ...previous,
      [name]: value,
    }))

    setMessage("")
    setSavedMessage("")
    setReview(false)
  }

  const saveSearchConfig = (config) => {
    const savedCases = JSON.parse(
      localStorage.getItem("cases") || "[]"
    )

    const caseExists = savedCases.some(
      (item) => item.caseId === caseId
    )

    if (!caseExists) {
      throw new Error("Case no longer exists.")
    }

    const updatedCases = savedCases.map((item) =>
      item.caseId === caseId
        ? {
            ...item,
            searchConfig: { ...config },
            updatedAt: new Date().toISOString(),
          }
        : item
    )

    localStorage.setItem("cases", JSON.stringify(updatedCases))

    const updatedCase = updatedCases.find(
      (item) => item.caseId === caseId
    )

    setCaseData(updatedCase || null)
  }

  const handleSave = () => {
    try {
      saveSearchConfig(searchConfig)
      setSavedMessage("Configuration saved successfully.")
      setMessage("")
    } catch (error) {
      console.error("Could not save configuration:", error)
      setSavedMessage(
        "Could not save configuration. Please try again."
      )
    }
  }

  const handleReview = (event) => {
    event.preventDefault()
    setMessage("")
    setSavedMessage("")
    setReview(false)

    if (!searchConfig.jurisdiction.trim()) {
      setMessage("Enter a search jurisdiction or location.")
      return
    }

    if (!searchConfig.startDate || !searchConfig.endDate) {
      setMessage("Select both the start and end dates.")
      return
    }

    const start = new Date(
      `${searchConfig.startDate}T${searchConfig.startTime || "00:00"}`
    )

    const end = new Date(
      `${searchConfig.endDate}T${searchConfig.endTime || "23:59"}`
    )

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      setMessage("Enter valid dates and times.")
      return
    }

    if (end < start) {
      setMessage("The end date and time must be after the start.")
      return
    }

    if (
      searchConfig.cameraMode === "selected" &&
      !searchConfig.cameraIds.trim()
    ) {
      setMessage("Enter at least one camera ID.")
      return
    }

    if (images.length === 0) {
      setMessage(
        "Upload at least one reference photograph first."
      )
      return
    }

    setReview(true)
  }

  const handleViewResults = () => {
    try {
      saveSearchConfig(searchConfig)
      navigate(`/search-results/${encodeURIComponent(caseId)}`)
    } catch (error) {
      console.error("Could not save configuration:", error)
      setSavedMessage(
        "Could not save configuration. Please try again."
      )
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0706] font-mono text-sm text-[#0FFCBE]">
        <span className="mr-3 h-2 w-2 animate-pulse rounded-full bg-[#0FFCBE]" />
        LOADING INVESTIGATION FILE...
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-[#0A0706] font-mono text-[#E8E3DB]">
        <header className="border-b border-[#49302D] bg-[#120B09] px-6 py-4 sm:px-10">
          <Logo />
        </header>

        <main className="mx-auto max-w-3xl px-6 py-20 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center border border-[#B4121B]/50 bg-[#B4121B]/10 text-2xl text-[#B4121B]">
            !
          </div>

          <p className="text-xs tracking-[0.3em] text-[#B4121B]">
            ERROR // 404
          </p>

          <h1 className="mt-4 text-2xl font-bold">
            CASE NOT FOUND
          </h1>

          <p className="mt-3 text-sm text-[#9C8D82]">
            The requested investigation file could not be loaded.
          </p>

          <button
            onClick={() => navigate("/investigator")}
            className="mt-8 border border-[#B4121B] bg-[#B4121B]/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] transition hover:bg-[#B4121B]/20"
          >
            Back to Dashboard
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
            onClick={() =>
              navigate(`/case/${encodeURIComponent(caseId)}`)
            }
            className="border border-[#65503D] px-4 py-2 text-xs uppercase tracking-wider text-[#B9A99A] transition hover:border-[#B4121B] hover:text-white"
          >
            ← Back to Case
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        {/* Page heading */}
        <div className="border-l-2 border-[#B4121B] pl-5">
          <p className="text-[10px] font-semibold tracking-[0.3em] text-[#0FFCBE]">
            INVESTIGATION WORKSPACE / AI MODULE
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            AI-ASSISTED <span className="text-[#B4121B]">CCTV SEARCH</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#9C8D82]">
            Configure the search location, footage time range, and
            cameras for this investigation.
          </p>
        </div>

        {/* System status */}
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <div className="border border-[#49302D] bg-[#120B09] p-4">
            <p className="text-[10px] tracking-[0.2em] text-[#8C7769]">
              ACTIVE CASE
            </p>
            <p className="mt-2 truncate text-sm font-semibold text-[#0FFCBE]">
              {caseData.caseId}
            </p>
          </div>

          <div className="border border-[#49302D] bg-[#120B09] p-4">
            <p className="text-[10px] tracking-[0.2em] text-[#8C7769]">
              REFERENCE IMAGES
            </p>
            <p className="mt-2 text-sm font-semibold text-[#B2B5E0]">
              {images.length} AVAILABLE
            </p>
          </div>

          <div className="border border-[#49302D] bg-[#120B09] p-4">
            <p className="text-[10px] tracking-[0.2em] text-[#8C7769]">
              CONFIGURATION
            </p>
            <p className="mt-2 text-sm font-semibold text-[#E8E3DB]">
              {review ? "READY FOR REVIEW" : "EDIT MODE"}
            </p>
          </div>
        </div>

        {/* Case summary */}
        <section className={sectionClass}>
          <div className={sectionHeaderClass}>
            <p className="text-[10px] tracking-[0.25em] text-[#B4121B]">
              01 / RECORD
            </p>
            <h2 className="mt-2 text-lg font-bold tracking-wide">
              CASE SUMMARY
            </h2>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
            <div>
              <p className={labelClass}>Case Title</p>
              <p className="break-words text-sm">
                {caseData.caseTitle || "Untitled case"}
              </p>
            </div>

            <div>
              <p className={labelClass}>Case ID</p>
              <p className="break-all text-sm text-[#0FFCBE]">
                {caseData.caseId}
              </p>
            </div>

            <div>
              <p className={labelClass}>Last-Seen Location</p>
              <p className="text-sm">
                {lastSeen.location || "Not provided"}
              </p>
            </div>

            <div>
              <p className={labelClass}>Last-Seen Date and Time</p>
              <p className="text-sm">
                {[lastSeen.date, lastSeen.time]
                  .filter(Boolean)
                  .join(" ") || "Not provided"}
              </p>
            </div>
          </div>
        </section>

        {/* Reference photographs */}
        <section className={sectionClass}>
          <div className={sectionHeaderClass}>
            <p className="text-[10px] tracking-[0.25em] text-[#B4121B]">
              02 / EVIDENCE
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold tracking-wide">
                REFERENCE PHOTOGRAPHS
              </h2>

              <span className="border border-[#65503D] px-3 py-1 text-[10px] text-[#B9A99A]">
                {images.length} FILE(S)
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            {images.length === 0 ? (
              <div className="border border-dashed border-[#65503D] bg-[#0A0706] p-7 text-center">
                <p className="text-sm text-[#B9A99A]">
                  No reference photographs available.
                </p>

                <p className="mt-2 text-xs leading-5 text-[#76645A]">
                  Upload at least one reference photograph from the
                  Case Details page before reviewing the search
                  configuration.
                </p>

                <button
                  onClick={() =>
                    navigate(`/case/${encodeURIComponent(caseId)}`)
                  }
                  className="mt-5 border border-[#65503D] px-4 py-2 text-xs uppercase tracking-wider transition hover:border-[#B4121B]"
                >
                  Open Case Details
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="overflow-hidden border border-[#49302D] bg-[#0A0706]"
                  >
                    <div className="flex items-center justify-between border-b border-[#49302D] px-3 py-2">
                      <span className="text-[10px] tracking-widest text-[#8C7769]">
                        REF // {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="h-2 w-2 rounded-full bg-[#0FFCBE]" />
                    </div>

                    <div className="flex h-56 items-center justify-center bg-[#0D0807] p-2">
                      <img
                        src={image}
                        alt={`Reference photograph ${index + 1}`}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <p className="border-t border-[#49302D] px-3 py-3 text-xs text-[#B9A99A]">
                      Reference Photograph {index + 1}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Search configuration */}
        <section className={sectionClass}>
          <div className={sectionHeaderClass}>
            <p className="text-[10px] tracking-[0.25em] text-[#B4121B]">
              03 / PARAMETERS
            </p>

            <h2 className="mt-2 text-lg font-bold tracking-wide">
              CCTV SEARCH CONFIGURATION
            </h2>

            <p className="mt-2 text-xs leading-5 text-[#8C7769]">
              Specify where and when footage should be reviewed.
            </p>
          </div>

          <form onSubmit={handleReview} className="space-y-7 p-5 sm:p-7">
            {/* Location */}
            <div>
              <label htmlFor="jurisdiction" className={labelClass}>
                Search Jurisdiction / Location
              </label>

              <input
                id="jurisdiction"
                type="text"
                name="jurisdiction"
                value={searchConfig.jurisdiction}
                onChange={handleChange}
                maxLength={200}
                placeholder="e.g. Nashik City, College Road"
                className={inputClass}
              />

              <p className="mt-2 text-[10px] text-[#76645A]">
                // Define the geographical area for the footage search.
              </p>
            </div>

            {/* Date and time */}
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-bold tracking-wide">
                  FOOTAGE DATE AND TIME RANGE
                </h3>
                <p className="mt-1 text-xs text-[#8C7769]">
                  Select the period to investigate.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="startDate" className={labelClass}>
                    Start Date
                  </label>

                  <input
                    id="startDate"
                    type="date"
                    name="startDate"
                    value={searchConfig.startDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="startTime" className={labelClass}>
                    Start Time
                  </label>

                  <input
                    id="startTime"
                    type="time"
                    name="startTime"
                    value={searchConfig.startTime}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className={labelClass}>
                    End Date
                  </label>

                  <input
                    id="endDate"
                    type="date"
                    name="endDate"
                    value={searchConfig.endDate}
                    onChange={handleChange}
                    min={searchConfig.startDate || undefined}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="endTime" className={labelClass}>
                    End Time
                  </label>

                  <input
                    id="endTime"
                    type="time"
                    name="endTime"
                    value={searchConfig.endTime}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Camera selection */}
            <div>
              <h3 className="text-sm font-bold tracking-wide">
                CAMERA SELECTION
              </h3>

              <p className="mb-4 mt-1 text-xs text-[#8C7769]">
                Choose which camera sources to include.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <label
                  className={`flex cursor-pointer items-start gap-3 border p-4 transition ${
                    searchConfig.cameraMode === "all"
                      ? "border-[#0FFCBE]/60 bg-[#0FFCBE]/5"
                      : "border-[#49302D] hover:border-[#65503D]"
                  }`}
                >
                  <input
                    type="radio"
                    name="cameraMode"
                    value="all"
                    checked={searchConfig.cameraMode === "all"}
                    onChange={handleChange}
                    className="mt-1 accent-[#0FFCBE]"
                  />

                  <span>
                    <span className="block text-sm font-semibold">
                      All Available Cameras
                    </span>

                    <span className="mt-2 block text-xs leading-5 text-[#8C7769]">
                      Include all cameras available to the system in
                      the selected jurisdiction.
                    </span>
                  </span>
                </label>

                <label
                  className={`flex cursor-pointer items-start gap-3 border p-4 transition ${
                    searchConfig.cameraMode === "selected"
                      ? "border-[#0FFCBE]/60 bg-[#0FFCBE]/5"
                      : "border-[#49302D] hover:border-[#65503D]"
                  }`}
                >
                  <input
                    type="radio"
                    name="cameraMode"
                    value="selected"
                    checked={searchConfig.cameraMode === "selected"}
                    onChange={handleChange}
                    className="mt-1 accent-[#0FFCBE]"
                  />

                  <span>
                    <span className="block text-sm font-semibold">
                      Selected Cameras
                    </span>

                    <span className="mt-2 block text-xs leading-5 text-[#8C7769]">
                      Specify individual camera IDs to include in the
                      search configuration.
                    </span>
                  </span>
                </label>
              </div>

              {searchConfig.cameraMode === "selected" && (
                <div className="mt-5">
                  <label htmlFor="cameraIds" className={labelClass}>
                    Camera IDs
                  </label>

                  <input
                    id="cameraIds"
                    type="text"
                    name="cameraIds"
                    value={searchConfig.cameraIds}
                    onChange={handleChange}
                    maxLength={500}
                    placeholder="e.g. CAM-001, CAM-002"
                    className={inputClass}
                  />

                  <p className="mt-2 text-[10px] text-[#76645A]">
                    Separate multiple camera IDs with commas.
                  </p>
                </div>
              )}
            </div>

            {/* Validation message */}
            {message && (
              <div
                role="alert"
                className="border border-[#B4121B]/60 bg-[#B4121B]/10 p-4 text-sm text-[#F09A9F]"
              >
                <span className="mr-2 font-bold">!</span>
                {message}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 border-t border-[#49302D] pt-6 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={handleSave}
                className="border border-[#65503D] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#B9A99A] transition hover:border-[#0FFCBE] hover:text-[#0FFCBE]"
              >
                Save Configuration
              </button>

              <button
                type="submit"
                className="bg-gradient-to-r from-[#0FFCBE] to-[#B2B5E0] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#0A0706] transition hover:brightness-110"
              >
                Review Configuration →
              </button>
            </div>

            {savedMessage && (
              <p
                role="status"
                className={`text-xs ${
                  savedMessage.includes("Could not")
                    ? "text-[#F09A9F]"
                    : "text-[#0FFCBE]"
                }`}
              >
                {savedMessage}
              </p>
            )}
          </form>
        </section>

        {/* Configuration review */}
        {review && (
          <section className="mt-6 overflow-hidden border border-[#0FFCBE]/40 bg-[#0FFCBE]/[0.03]">
            <div className="border-b border-[#0FFCBE]/20 px-5 py-4 sm:px-7">
              <p className="text-[10px] tracking-[0.25em] text-[#0FFCBE]">
                04 / VALIDATION COMPLETE
              </p>

              <h2 className="mt-2 text-lg font-bold tracking-wide">
                CONFIGURATION REVIEW
              </h2>

              <p className="mt-2 text-xs leading-5 text-[#8CADA1]">
                Check these parameters before continuing.
              </p>
            </div>

            <div className="space-y-4 p-5 sm:p-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="border border-[#49302D] bg-[#0A0706] p-4">
                  <p className={labelClass}>Jurisdiction</p>
                  <p className="break-words text-sm">
                    {searchConfig.jurisdiction}
                  </p>
                </div>

                <div className="border border-[#49302D] bg-[#0A0706] p-4">
                  <p className={labelClass}>Camera Selection</p>
                  <p className="text-sm">
                    {searchConfig.cameraMode === "all"
                      ? "All available cameras"
                      : searchConfig.cameraIds}
                  </p>
                </div>

                <div className="border border-[#49302D] bg-[#0A0706] p-4">
                  <p className={labelClass}>Start Date and Time</p>
                  <p className="text-sm">
                    {searchConfig.startDate}{" "}
                    {searchConfig.startTime || "00:00"}
                  </p>
                </div>

                <div className="border border-[#49302D] bg-[#0A0706] p-4">
                  <p className={labelClass}>End Date and Time</p>
                  <p className="text-sm">
                    {searchConfig.endDate}{" "}
                    {searchConfig.endTime || "23:59"}
                  </p>
                </div>

                <div className="border border-[#49302D] bg-[#0A0706] p-4 sm:col-span-2">
                  <p className={labelClass}>Reference Photographs</p>
                  <p className="text-sm text-[#0FFCBE]">
                    {images.length} photograph(s) available
                  </p>
                </div>
              </div>

              <div className="border border-amber-700/40 bg-amber-950/20 p-4">
                <p className="text-xs font-bold tracking-wider text-amber-300">
                  IMPORTANT // PROTOTYPE LIMITATION
                </p>

                <p className="mt-2 text-xs leading-6 text-amber-100/80">
                  These settings are ready for review. This page only
                  validates and stores the configuration; it does not
                  access CCTV footage or perform facial matching.
                  Search results may contain illustrative sample
                  entries unless a search-processing backend is
                  connected.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setReview(false)}
                  className="border border-[#65503D] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#B9A99A] transition hover:border-[#B4121B] hover:text-white"
                >
                  ← Edit Configuration
                </button>

                <button
                  type="button"
                  onClick={handleViewResults}
                  className="bg-gradient-to-r from-[#0FFCBE] to-[#B2B5E0] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#0A0706] transition hover:brightness-110"
                >
                  Save & View Results →
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-8 border-t border-[#49302D] py-5">
          <p className="text-center text-[10px] tracking-wider text-[#76645A]">
            AI-ASSISTED SUSPECT SEARCH SYSTEM // INVESTIGATION MODULE
          </p>
        </footer>
      </main>
    </div>
  )
}