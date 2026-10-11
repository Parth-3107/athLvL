import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Logo from "../components/Logo"

export default function CaseDetails() {
  const { caseId } = useParams()
  const navigate = useNavigate()

  const [caseData, setCaseData] = useState(null)
  const [suspectImages, setSuspectImages] = useState([])
  const [lastSeen, setLastSeen] = useState({
    location: "",
    date: "",
    time: "",
    notes: "",
  })
  const [caseStatus, setCaseStatus] = useState("Open")
  const [loading, setLoading] = useState(true)
  const [savingImages, setSavingImages] = useState(false)
  const [lastSeenMessage, setLastSeenMessage] = useState("")
  const [imageMessage, setImageMessage] = useState("")
  const [statusMessage, setStatusMessage] = useState("")

  useEffect(() => {
    try {
      const savedCases = JSON.parse(
        localStorage.getItem("cases") || "[]"
      )

      const selectedCase = savedCases.find(
        (item) => item.caseId === caseId
      )

      if (selectedCase) {
        setCaseData(selectedCase)

        const images =
          selectedCase.suspectImages ||
          (selectedCase.suspectImage
            ? [selectedCase.suspectImage]
            : [])

        setSuspectImages(images)

        setLastSeen({
          location: selectedCase.lastSeen?.location || "",
          date: selectedCase.lastSeen?.date || "",
          time: selectedCase.lastSeen?.time || "",
          notes: selectedCase.lastSeen?.notes || "",
        })

        setCaseStatus(
          selectedCase.status || selectedCase.caseStatus || "Open"
        )
      }
    } catch (error) {
      console.error("Could not load case:", error)
    } finally {
      setLoading(false)
    }
  }, [caseId])

  const updateCaseInStorage = (updatedCase) => {
    const savedCases = JSON.parse(
      localStorage.getItem("cases") || "[]"
    )

    const updatedCases = savedCases.map((item) =>
      item.caseId === caseId ? updatedCase : item
    )

    localStorage.setItem("cases", JSON.stringify(updatedCases))
    setCaseData(updatedCase)
  }

  const handleStatusChange = (event) => {
    const newStatus = event.target.value
    setCaseStatus(newStatus)
    setStatusMessage("")

    try {
      const updatedCase = {
        ...caseData,
        status: newStatus,
        caseStatus: newStatus,
        updatedAt: new Date().toISOString(),
      }

      updateCaseInStorage(updatedCase)
      setStatusMessage("Investigation status saved successfully.")
    } catch (error) {
      console.error("Could not save case status:", error)
      setStatusMessage("Could not save status.")
    }
  }

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this case? This action cannot be undone."
    )

    if (!confirmed) return

    try {
      const savedCases = JSON.parse(
        localStorage.getItem("cases") || "[]"
      )

      const updatedCases = savedCases.filter(
        (item) => item.caseId !== caseId
      )

      localStorage.setItem("cases", JSON.stringify(updatedCases))
      navigate("/investigator")
    } catch (error) {
      console.error("Could not delete case:", error)
      alert("Unable to delete this case.")
    }
  }

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files || [])
    setImageMessage("")

    if (!files.length) return

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setImageMessage("Please select image files only.")
        return false
      }

      if (file.size > 2 * 1024 * 1024) {
        setImageMessage(
          `${file.name} is larger than 2 MB and was skipped.`
        )
        return false
      }

      return true
    })

    if (!validFiles.length) {
      event.target.value = ""
      return
    }

    setSavingImages(true)

    const readers = validFiles.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()

          reader.onload = () => resolve(reader.result)
          reader.onerror = () =>
            reject(new Error(`Could not read ${file.name}`))

          reader.readAsDataURL(file)
        })
    )

    Promise.all(readers)
      .then((newImages) => {
        const updatedImages = [...suspectImages, ...newImages]

        const updatedCase = {
          ...caseData,
          suspectImages: updatedImages,
          suspectImage: updatedImages[0] || "",
        }

        updateCaseInStorage(updatedCase)
        setSuspectImages(updatedImages)
        setImageMessage("Photographs added successfully.")
      })
      .catch((error) => {
        console.error(error)
        setImageMessage(
          "Could not load the selected photographs."
        )
      })
      .finally(() => {
        setSavingImages(false)
        event.target.value = ""
      })
  }

  const handleRemoveImage = (index) => {
    const confirmed = window.confirm(
      "Remove this suspect photograph?"
    )

    if (!confirmed) return

    const updatedImages = suspectImages.filter(
      (_, imageIndex) => imageIndex !== index
    )

    try {
      const updatedCase = {
        ...caseData,
        suspectImages: updatedImages,
        suspectImage: updatedImages[0] || "",
      }

      updateCaseInStorage(updatedCase)
      setSuspectImages(updatedImages)
      setImageMessage("Photograph removed.")
    } catch (error) {
      console.error(error)
      setImageMessage("Could not remove photograph.")
    }
  }

  const handleLastSeenChange = (event) => {
    const { name, value } = event.target

    setLastSeen((previous) => ({
      ...previous,
      [name]: value,
    }))

    setLastSeenMessage("")
  }

  const handleSaveLastSeen = (event) => {
    event.preventDefault()

    try {
      const updatedCase = {
        ...caseData,
        lastSeen: { ...lastSeen },
        updatedAt: new Date().toISOString(),
      }

      updateCaseInStorage(updatedCase)
      setLastSeenMessage(
        "Last-seen information saved successfully."
      )
    } catch (error) {
      console.error("Could not save last-seen information:", error)
      setLastSeenMessage(
        "Could not save. Your browser storage may be full."
      )
    }
  }

  const inputClass =
    "w-full rounded-none border border-[#65503D]/70 bg-[#0A0706] px-4 py-3 font-mono text-sm text-[#E8E3DB] placeholder:text-[#857568] outline-none transition focus:border-[#0FFCBE] focus:ring-1 focus:ring-[#0FFCBE]/20"

  const labelClass =
    "mb-2 block text-[10px] font-medium tracking-[0.15em] text-[#D2C7B8]"

  const panelClass =
    "mb-7 border border-[#65503D]/60 bg-[#120B09]"

  const sectionHeaderClass =
    "border-b border-[#65503D]/60 px-5 py-5 sm:px-7"

  const sectionBodyClass = "p-5 sm:p-7"

  const primaryButton =
    "border border-[#0FFCBE]/50 bg-gradient-to-r from-[#0FFCBE] to-[#B2B5E0] px-5 py-3 text-[10px] font-bold tracking-wider text-[#090605] transition hover:brightness-110"

  const secondaryButton =
    "border border-[#65503D]/80 px-5 py-3 text-[10px] font-semibold tracking-wider text-[#E8E3DB] transition hover:border-[#0FFCBE] hover:text-[#0FFCBE]"

  const sightingReviews = Object.entries(
    caseData?.sightingReviews || {}
  ).sort(
    ([, reviewA], [, reviewB]) =>
      new Date(reviewB.reviewedAt || 0) -
      new Date(reviewA.reviewedAt || 0)
  )

  const getDecisionStyle = (decision) => {
    if (decision === "Relevant for further investigation") {
      return "border-[#0FFCBE]/40 bg-[#0FFCBE]/10 text-[#0FFCBE]"
    }

    if (decision === "Not relevant") {
      return "border-[#B4121B]/50 bg-[#B4121B]/10 text-[#F08B8B]"
    }

    return "border-[#B2B5E0]/40 bg-[#B2B5E0]/10 text-[#B2B5E0]"
  }

  const getStatusStyle = (status) => {
    if (status === "Closed") {
      return "border-white/20 bg-white/5 text-[#C0B8B2]"
    }

    if (status === "Under Review") {
      return "border-[#B2B5E0]/40 bg-[#B2B5E0]/10 text-[#B2B5E0]"
    }

    return "border-[#0FFCBE]/40 bg-[#0FFCBE]/10 text-[#0FFCBE]"
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0706] font-mono text-[#0FFCBE]">
        LOADING CASE FILE...
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-[#0A0706] px-5 py-10 font-mono text-[#E8E3DB] sm:px-10">
        <div className="mx-auto max-w-3xl border border-[#65503D]/60 bg-[#120B09] p-7 sm:p-10">
          <p className="text-[10px] tracking-[0.25em] text-[#B4121B]">
            / ERROR 404
          </p>

          <h1 className="mt-4 text-3xl font-bold">
            CASE NOT FOUND
          </h1>

          <p className="mt-4 text-sm leading-6 text-[#A99A88]">
            This case may have been deleted or does not exist.
          </p>

          <button
            onClick={() => navigate("/investigator")}
            className={`${primaryButton} mt-7`}
          >
            ← BACK TO DASHBOARD
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#0A0706] font-mono text-[#E8E3DB]">
      {/* Navigation */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#65503D]/50 bg-[#0A0706] px-5 py-5 sm:px-10 lg:px-14">
        <div className="flex items-center gap-4">
          <div className="h-8 w-[3px] bg-[#B4121B]" />
          <div>
            <p className="text-[10px] tracking-[0.3em] text-[#A99A88]">
              SYS_003
            </p>
            <div className="mt-1 text-sm font-bold tracking-[0.18em]">
              <Logo />
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/investigator")}
          className={secondaryButton}
        >
          ← BACK TO DASHBOARD
        </button>
      </header>

      <main className="mx-auto max-w-[1400px] px-5 py-8 sm:px-10 sm:py-12">
        {/* Case heading */}
        <section className="relative mb-7 overflow-hidden border border-[#65503D]/60 bg-[#160C09]">
          <div className="absolute inset-y-0 left-0 w-1 bg-[#B4121B]" />
          <div className="absolute -right-12 -top-16 h-56 w-56 rotate-45 border border-[#B4121B]/20" />
          <div className="absolute -right-6 -top-16 h-56 w-56 rotate-45 border border-[#65503D]/30" />

          <div className="relative z-10 p-6 sm:p-9">
            <p className="text-[10px] tracking-[0.25em] text-[#B4121B]">
              / CASE DATABASE / RECORD DETAILS
            </p>

            <div className="mt-5 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
              <div className="min-w-0">
                <h1 className="break-words text-3xl font-bold leading-tight text-[#F0E9DC] sm:text-4xl">
                  {caseData.caseTitle || caseData.title || "Untitled Case"}
                </h1>

                <p className="mt-4 break-all text-xs tracking-wider text-[#BDB0A0]">
                  CASE_ID:{" "}
                  <span className="text-[#0FFCBE]">
                    {caseData.caseId}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    navigate(
                      `/edit-case/${encodeURIComponent(caseData.caseId)}`
                    )
                  }
                  className={secondaryButton}
                >
                  EDIT CASE
                </button>

                <button
                  onClick={handleDelete}
                  className="border border-[#B4121B]/60 px-5 py-3 text-[10px] font-semibold tracking-wider text-[#F08B8B] transition hover:bg-[#B4121B]/10"
                >
                  DELETE CASE
                </button>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#65503D]/50 bg-[#0A0706]/60 px-6 py-3 text-[9px] tracking-wider text-[#A99A88] sm:px-9">
            <span>MODULE: CASE DETAILS</span>
            <span>PHOTOGRAPHS: {suspectImages.length}</span>
            <span className="text-[#0FFCBE]">● RECORD LOADED</span>
          </div>
        </section>

        {/* Case information */}
        <section className={panelClass}>
          <div className={sectionHeaderClass}>
            <p className="text-[9px] tracking-[0.25em] text-[#B4121B]">
              / 01 — CASE RECORD
            </p>
            <h2 className="mt-3 text-lg font-bold text-[#F0E9DC]">
              Case Information
            </h2>
          </div>

          <div className={`${sectionBodyClass} grid gap-6 sm:grid-cols-2`}>
            <div>
              <p className={labelClass}>INCIDENT DATE</p>
              <p className="text-sm text-[#E8E3DB]">
                {caseData.incidentDate || "Not provided"}
              </p>
            </div>

            <div>
              <p className={labelClass}>INCIDENT LOCATION</p>
              <p className="text-sm text-[#E8E3DB]">
                {caseData.location || "Not provided"}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className={labelClass}>INCIDENT DESCRIPTION</p>
              <p className="whitespace-pre-wrap text-sm leading-7 text-[#BDB0A0]">
                {caseData.description || "No description provided."}
              </p>
            </div>

            <div className="sm:col-span-2 border-t border-[#65503D]/50 pt-5">
              <p className={labelClass}>CREATED AT</p>
              <p className="text-xs text-[#A99A88]">
                {caseData.createdAt
                  ? new Date(caseData.createdAt).toLocaleString()
                  : "Not available"}
              </p>
            </div>
          </div>
        </section>

        {/* Investigation status */}
        <section className={panelClass}>
          <div className={sectionHeaderClass}>
            <p className="text-[9px] tracking-[0.25em] text-[#B4121B]">
              / 02 — INVESTIGATION CONTROL
            </p>
            <h2 className="mt-3 text-lg font-bold text-[#F0E9DC]">
              Investigation Status
            </h2>
            <p className="mt-2 text-xs leading-6 text-[#A99A88]">
              Update the current progress of this investigation.
            </p>
          </div>

          <div className={sectionBodyClass}>
            <div className="mb-5">
              <span
                className={`inline-flex border px-3 py-2 text-[10px] tracking-wider ${getStatusStyle(
                  caseStatus
                )}`}
              >
                {caseStatus.toUpperCase()}
              </span>
            </div>

            <label className={labelClass}>CASE STATUS</label>

            <select
              value={caseStatus}
              onChange={handleStatusChange}
              className={`${inputClass} max-w-md`}
            >
              <option value="Open">Open</option>
              <option value="Under Review">Under Review</option>
              <option value="Closed">Closed</option>
            </select>

            {statusMessage && (
              <p className="mt-4 text-xs text-[#0FFCBE]">
                {statusMessage}
              </p>
            )}
          </div>
        </section>

        {/* Suspect photographs */}
        <section className={panelClass}>
          <div className={sectionHeaderClass}>
            <p className="text-[9px] tracking-[0.25em] text-[#B4121B]">
              / 03 — REFERENCE EVIDENCE
            </p>
            <h2 className="mt-3 text-lg font-bold text-[#F0E9DC]">
              Suspect Photographs
            </h2>
            <p className="mt-2 text-xs leading-6 text-[#A99A88]">
              Upload reference photographs for this case. Each image must
              be 2 MB or smaller.
            </p>
          </div>

          <div className={sectionBodyClass}>
            <label className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-[#65503D] bg-[#0A0706] p-8 text-center transition hover:border-[#0FFCBE] sm:p-10">
              <span className="text-3xl text-[#B4121B]">＋</span>

              <span className="mt-3 text-xs font-bold tracking-wider text-[#0FFCBE]">
                SELECT SUSPECT PHOTOGRAPHS
              </span>

              <span className="mt-2 text-[10px] leading-5 text-[#857568]">
                JPG, PNG, WEBP and other browser-supported images
              </span>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={savingImages}
              />
            </label>

            {savingImages && (
              <p className="mt-4 text-xs text-[#B2B5E0]">
                Processing photographs...
              </p>
            )}

            {imageMessage && (
              <p className="mt-4 text-xs leading-5 text-[#0FFCBE]">
                {imageMessage}
              </p>
            )}

            {suspectImages.length === 0 ? (
              <div className="mt-5 border border-[#65503D]/50 bg-[#0A0706] p-7 text-center">
                <p className="text-xs text-[#A99A88]">
                  NO SUSPECT PHOTOGRAPHS UPLOADED
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {suspectImages.map((image, index) => (
                  <div
                    key={`${index}-${image.slice(0, 30)}`}
                    className="overflow-hidden border border-[#65503D]/60 bg-[#0A0706]"
                  >
                    <div className="flex h-56 items-center justify-center bg-[#080605] p-3">
                      <img
                        src={image}
                        alt={`Suspect reference ${index + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-[#65503D]/50 p-3">
                      <span className="text-[10px] text-[#D2C7B8]">
                        IMAGE_{String(index + 1).padStart(2, "0")}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="text-[10px] text-[#F08B8B] transition hover:text-white"
                      >
                        REMOVE ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Last-seen information */}
        <section className={panelClass}>
          <div className={sectionHeaderClass}>
            <p className="text-[9px] tracking-[0.25em] text-[#B4121B]">
              / 04 — SIGHTING DETAILS
            </p>
            <h2 className="mt-3 text-lg font-bold text-[#F0E9DC]">
              Last-Seen Information
            </h2>
            <p className="mt-2 text-xs leading-6 text-[#A99A88]">
              Record the reported location and time the suspect was last
              seen to help organize the investigation.
            </p>
          </div>

          <form
            onSubmit={handleSaveLastSeen}
            className={sectionBodyClass}
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>
                  LAST-SEEN LOCATION
                </label>
                <input
                  type="text"
                  name="location"
                  value={lastSeen.location}
                  onChange={handleLastSeenChange}
                  placeholder="e.g. Near Central Bus Stand"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>LAST-SEEN DATE</label>
                <input
                  type="date"
                  name="date"
                  value={lastSeen.date}
                  onChange={handleLastSeenChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>LAST-SEEN TIME</label>
                <input
                  type="time"
                  name="time"
                  value={lastSeen.time}
                  onChange={handleLastSeenChange}
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>ADDITIONAL NOTES</label>
                <textarea
                  name="notes"
                  value={lastSeen.notes}
                  onChange={handleLastSeenChange}
                  rows={4}
                  placeholder="Clothing, direction of travel, source of information, or other relevant details..."
                  className={`${inputClass} resize-y`}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-[#65503D]/50 pt-5 sm:flex-row sm:items-center">
              <button type="submit" className={primaryButton}>
                SAVE LAST-SEEN INFORMATION →
              </button>

              {lastSeenMessage && (
                <p className="text-xs leading-5 text-[#0FFCBE]">
                  {lastSeenMessage}
                </p>
              )}
            </div>
          </form>
        </section>

        {/* Sighting review history */}
        <section className={panelClass}>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#65503D]/60 px-5 py-5 sm:px-7">
            <div>
              <p className="text-[9px] tracking-[0.25em] text-[#B4121B]">
                / 05 — REVIEW LOG
              </p>
              <h2 className="mt-3 text-lg font-bold text-[#F0E9DC]">
                Sighting Review History
              </h2>
              <p className="mt-2 text-xs leading-6 text-[#A99A88]">
                Investigator decisions and notes for CCTV search results.
              </p>
            </div>

            <span className="border border-[#65503D]/70 px-3 py-2 text-[10px] text-[#0FFCBE]">
              {sightingReviews.length} REVIEWED
            </span>
          </div>

          <div className={sectionBodyClass}>
            {sightingReviews.length === 0 ? (
              <div className="border border-dashed border-[#65503D]/70 bg-[#0A0706] p-7 text-center">
                <p className="text-xs font-bold tracking-wider text-[#D2C7B8]">
                  NO SIGHTINGS REVIEWED
                </p>
                <p className="mt-3 text-[10px] leading-5 text-[#857568]">
                  Reviews saved from Search Results will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sightingReviews.map(([sightingId, review]) => (
                  <div
                    key={sightingId}
                    className="border border-[#65503D]/60 bg-[#0A0706] p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-[#F0E9DC]">
                          {sightingId}
                        </p>

                        <p className="mt-2 text-[10px] text-[#857568]">
                          {review.reviewedAt
                            ? `REVIEWED ${new Date(
                                review.reviewedAt
                              ).toLocaleString()}`
                            : "REVIEW DATE UNAVAILABLE"}
                        </p>
                      </div>

                      <span
                        className={`border px-3 py-2 text-[9px] leading-5 ${getDecisionStyle(
                          review.decision
                        )}`}
                      >
                        {review.decision || "No decision recorded"}
                      </span>
                    </div>

                    <div className="mt-5 border-t border-[#65503D]/40 pt-4">
                      <p className={labelClass}>INVESTIGATOR NOTES</p>
                      <p className="whitespace-pre-wrap text-xs leading-6 text-[#BDB0A0]">
                        {review.notes || "No notes added."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/sighting-review/${encodeURIComponent(
                            caseData.caseId
                          )}/${encodeURIComponent(sightingId)}`
                        )
                      }
                      className="mt-5 text-[10px] font-bold tracking-wider text-[#0FFCBE] hover:text-[#B2B5E0]"
                    >
                      OPEN REVIEW →
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/search-results/${encodeURIComponent(caseData.caseId)}`
                )
              }
              className={`${secondaryButton} mt-6`}
            >
              VIEW SEARCH RESULTS →
            </button>
          </div>
        </section>

        {/* AI Search */}
        <section className="relative overflow-hidden border border-[#65503D]/60 bg-[#160C09]">
          <div className="absolute inset-y-0 left-0 w-1 bg-[#B4121B]" />

          <div className="relative flex flex-col justify-between gap-6 p-6 sm:p-8 lg:flex-row lg:items-center">
            <div>
              <p className="text-[9px] tracking-[0.25em] text-[#B4121B]">
                / 06 — SEARCH MODULE
              </p>

              <h2 className="mt-3 text-xl font-bold text-[#F0E9DC]">
                AI-Assisted Suspect Search
              </h2>

              <p className="mt-3 max-w-2xl text-xs leading-6 text-[#A99A88]">
                Review suspect photographs and last-seen details before
                preparing a CCTV search. Search results may be prototype
                data and should be verified.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/ai-search/${encodeURIComponent(caseData.caseId)}`
                )
              }
              className={primaryButton}
            >
              PREPARE AI SEARCH →
            </button>
          </div>
        </section>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#65503D]/50 py-5 text-[9px] tracking-[0.15em] text-[#857568]">
          <span>SYS_003 // CASE DETAILS</span>
          <span>AUTHORISED PERSONNEL ONLY</span>
        </footer>
      </main>
    </div>
  )
}