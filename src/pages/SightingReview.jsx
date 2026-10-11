import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Logo from "../components/Logo"

const sampleResults = [
  {
    id: "SIGHT-001",
    camera: "CAM-014",
    location: "College Road",
    timestamp: "2026-09-28 14:32",
    confidence: 92,
  },
  {
    id: "SIGHT-002",
    camera: "CAM-027",
    location: "Gangapur Road",
    timestamp: "2026-09-28 15:08",
    confidence: 84,
  },
  {
    id: "SIGHT-003",
    camera: "CAM-031",
    location: "Mumbai Naka",
    timestamp: "2026-09-28 16:17",
    confidence: 76,
  },
]

const assessmentOptions = [
  "Relevant for further investigation",
  "Not relevant",
  "Needs further review",
]

export default function SightingReview() {
  const { caseId, sightingId } = useParams()
  const navigate = useNavigate()

  const [caseData, setCaseData] = useState(null)
  const [decision, setDecision] = useState("")
  const [notes, setNotes] = useState("")
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const sighting = sampleResults.find(
    (item) => item.id === sightingId
  )

  useEffect(() => {
    try {
      const cases = JSON.parse(
        localStorage.getItem("cases") || "[]"
      )

      const selected = cases.find(
        (item) => item.caseId === caseId
      )

      setCaseData(selected || null)

      const previousReview =
        selected?.sightingReviews?.[sightingId]

      if (previousReview) {
        setDecision(previousReview.decision || "")
        setNotes(previousReview.notes || "")
      } else {
        setDecision("")
        setNotes("")
      }

      setSaved(false)
      setError("")
    } catch (err) {
      console.error("Could not load review:", err)
      setCaseData(null)
      setError("Could not load the saved investigation data.")
    } finally {
      setLoading(false)
    }
  }, [caseId, sightingId])

  const images =
    caseData?.suspectImages ||
    (caseData?.suspectImage ? [caseData.suspectImage] : [])

  const inputClass =
    "w-full rounded-lg border border-[#49302D] bg-[#0A0706] px-4 py-3 text-sm text-[#E8E3DB] outline-none transition placeholder:text-[#76645A] focus:border-[#B4121B] focus:ring-1 focus:ring-[#B4121B]/40"

  const labelClass =
    "mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8C7769]"

  const sectionClass =
    "mt-6 overflow-hidden border border-[#49302D] bg-[#120B09]"

  const sectionHeaderClass =
    "border-b border-[#49302D] px-5 py-4 sm:px-7"

  const goToResults = () => {
    navigate(`/search-results/${encodeURIComponent(caseId)}`)
  }

  const handleSave = () => {
    setError("")

    if (!decision) {
      setError("Please select an assessment before saving.")
      return
    }

    try {
      const cases = JSON.parse(
        localStorage.getItem("cases") || "[]"
      )

      const caseExists = cases.some(
        (item) => item.caseId === caseId
      )

      if (!caseExists) {
        setError("This case no longer exists. Your review was not saved.")
        return
      }

      const reviewedAt = new Date().toISOString()

      const updatedCases = cases.map((item) => {
        if (item.caseId !== caseId) return item

        return {
          ...item,
          sightingReviews: {
            ...(item.sightingReviews || {}),
            [sightingId]: {
              decision,
              notes: notes.trim(),
              reviewedAt,
            },
          },
          updatedAt: reviewedAt,
        }
      })

      localStorage.setItem(
        "cases",
        JSON.stringify(updatedCases)
      )

      const updatedCase = updatedCases.find(
        (item) => item.caseId === caseId
      )

      setCaseData(updatedCase || null)
      setSaved(true)
    } catch (err) {
      console.error("Could not save review:", err)
      setError(
        "Could not save the review. Browser storage may be unavailable or full."
      )
      setSaved(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0706] font-mono text-sm text-[#0FFCBE]">
        <span className="mr-3 h-2 w-2 animate-pulse rounded-full bg-[#0FFCBE]" />
        LOADING SIGHTING REVIEW...
      </div>
    )
  }

  if (!caseData || !sighting) {
    const caseMissing = !caseData

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
            {caseMissing ? "CASE NOT FOUND" : "SIGHTING NOT FOUND"}
          </h1>

          <p className="mt-3 text-sm text-[#9C8D82]">
            {error ||
              (caseMissing
                ? "The investigation file could not be loaded."
                : "This sighting ID is not available in the demonstration dataset.")}
          </p>

          <button
            onClick={() =>
              caseMissing
                ? navigate("/investigator")
                : goToResults()
            }
            className="mt-8 border border-[#B4121B] bg-[#B4121B]/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] transition hover:bg-[#B4121B]/20"
          >
            {caseMissing ? "Back to Dashboard" : "Back to Results"}
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
            onClick={goToResults}
            className="border border-[#65503D] px-4 py-2 text-xs uppercase tracking-wider text-[#B9A99A] transition hover:border-[#B4121B] hover:text-white"
          >
            ← Search Results
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        {/* Page heading */}
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="border-l-2 border-[#B4121B] pl-5">
            <p className="text-[10px] font-semibold tracking-[0.3em] text-[#0FFCBE]">
              INVESTIGATION WORKSPACE / MANUAL REVIEW
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              SIGHTING <span className="text-[#B4121B]">REVIEW</span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#9C8D82]">
              Review the available reference information and record
              an investigator assessment for this sighting.
            </p>

            <p className="mt-3 break-words text-xs text-[#B9A99A]">
              {caseData.caseTitle}{" "}
              <span className="mx-2 text-[#65503D]">/</span>
              <span className="text-[#0FFCBE]">{caseData.caseId}</span>
            </p>
          </div>

          <span className="border border-amber-700/50 bg-amber-950/30 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-300">
            Demo Sighting
          </span>
        </div>

        {/* Prototype notice */}
        <div className="mt-7 border border-amber-700/40 bg-amber-950/15 p-4">
          <p className="text-xs font-bold tracking-wider text-amber-300">
            IMPORTANT // EVIDENCE LIMITATION
          </p>

          <p className="mt-2 text-xs leading-6 text-amber-100/75">
            The sighting details and similarity score are illustrative
            sample data. No actual CCTV frame or facial comparison is
            available in this prototype. An assessment here records
            an investigator's review; it does not establish identity.
          </p>
        </div>

        {/* Sighting information */}
        <section className={sectionClass}>
          <div className={sectionHeaderClass}>
            <p className="text-[10px] tracking-[0.25em] text-[#B4121B]">
              01 / RECORD
            </p>

            <h2 className="mt-2 text-lg font-bold tracking-wide">
              SIGHTING INFORMATION
            </h2>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-7">
            <div>
              <p className={labelClass}>Sighting ID</p>
              <p className="text-sm font-semibold text-[#0FFCBE]">
                {sighting.id}
              </p>
            </div>

            <div>
              <p className={labelClass}>Camera ID</p>
              <p className="text-sm font-semibold">
                {sighting.camera}
              </p>
            </div>

            <div>
              <p className={labelClass}>Location</p>
              <p className="text-sm font-semibold">
                {sighting.location}
              </p>
            </div>

            <div>
              <p className={labelClass}>Sample Timestamp</p>
              <p className="text-sm">{sighting.timestamp}</p>
            </div>

            <div>
              <p className={labelClass}>Demo Similarity Score</p>
              <p className="text-xl font-bold text-[#B2B5E0]">
                {sighting.confidence}%
              </p>
              <p className="mt-1 text-[10px] text-amber-300">
                NOT A VERIFIED MATCH
              </p>
            </div>

            <div>
              <p className={labelClass}>Review Status</p>
              <p
                className={`text-sm font-semibold ${
                  decision
                    ? "text-[#0FFCBE]"
                    : "text-amber-300"
                }`}
              >
                {decision || "Pending review"}
              </p>
            </div>
          </div>
        </section>

        {/* Evidence comparison */}
        <section className={sectionClass}>
          <div className={sectionHeaderClass}>
            <p className="text-[10px] tracking-[0.25em] text-[#B4121B]">
              02 / VISUAL REFERENCE
            </p>

            <h2 className="mt-2 text-lg font-bold tracking-wide">
              EVIDENCE COMPARISON
            </h2>

            <p className="mt-2 text-xs leading-5 text-[#8C7769]">
              Compare the available reference photograph with the
              placeholder for the CCTV frame.
            </p>
          </div>

          <div className="grid gap-5 p-5 md:grid-cols-2 sm:p-7">
            {/* Reference image */}
            <div>
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">
                  SUSPECT REFERENCE
                </h3>

                <span className="text-[10px] tracking-wider text-[#8C7769]">
                  SOURCE IMAGE
                </span>
              </div>

              {images.length > 0 ? (
                <div className="overflow-hidden border border-[#49302D] bg-[#0A0706]">
                  <div className="flex h-72 items-center justify-center p-3">
                    <img
                      src={images[0]}
                      alt="Suspect reference photograph"
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="border-t border-[#49302D] px-4 py-3">
                    <p className="text-[10px] text-[#0FFCBE]">
                      REFERENCE IMAGE AVAILABLE
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex h-72 flex-col items-center justify-center border border-dashed border-[#65503D] bg-[#0D0807] p-5 text-center">
                  <span className="text-3xl text-[#65503D]">▧</span>

                  <p className="mt-4 text-sm text-[#B9A99A]">
                    No reference image
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#76645A]">
                    Upload a reference photograph from Case Details.
                  </p>
                </div>
              )}
            </div>

            {/* CCTV frame placeholder */}
            <div>
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">
                  CCTV FRAME
                </h3>

                <span className="text-[10px] tracking-wider text-[#8C7769]">
                  PLACEHOLDER
                </span>
              </div>

              <div className="flex h-72 flex-col items-center justify-center border border-dashed border-[#65503D] bg-[#0D0807] p-5 text-center">
                <div className="flex h-16 w-16 items-center justify-center border border-[#49302D] text-3xl text-[#65503D]">
                  ▣
                </div>

                <p className="mt-5 text-sm font-semibold text-[#B9A99A]">
                  Footage frame unavailable
                </p>

                <p className="mt-2 max-w-xs text-xs leading-5 text-[#76645A]">
                  Connect a CCTV processing backend to retrieve and
                  display an actual footage frame.
                </p>

                <span className="mt-4 border border-[#49302D] px-3 py-1 text-[9px] tracking-[0.2em] text-[#76645A]">
                  NO FRAME LOADED
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Investigator assessment */}
        <section className={sectionClass}>
          <div className={sectionHeaderClass}>
            <p className="text-[10px] tracking-[0.25em] text-[#B4121B]">
              03 / DECISION
            </p>

            <h2 className="mt-2 text-lg font-bold tracking-wide">
              INVESTIGATOR ASSESSMENT
            </h2>

            <p className="mt-2 text-xs leading-5 text-[#8C7769]">
              Record your assessment based on the available
              information. You can revise it later.
            </p>
          </div>

          <div className="space-y-6 p-5 sm:p-7">
            <fieldset>
              <legend className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#B9A99A]">
                Select an assessment
              </legend>

              <div className="space-y-3">
                {assessmentOptions.map((option, index) => (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-start gap-4 border p-4 transition ${
                      decision === option
                        ? "border-[#0FFCBE]/60 bg-[#0FFCBE]/[0.05]"
                        : "border-[#49302D] hover:border-[#65503D]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="decision"
                      value={option}
                      checked={decision === option}
                      onChange={(event) => {
                        setDecision(event.target.value)
                        setSaved(false)
                        setError("")
                      }}
                      className="mt-1 accent-[#0FFCBE]"
                    />

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">
                        {option}
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-[#8C7769]">
                        {index === 0
                          ? "Flag this sighting for additional investigation. This is not an identity confirmation."
                          : index === 1
                            ? "Record that this sample sighting is not considered relevant to the case."
                            : "Keep this sighting open for additional evidence or assessment."}
                      </span>
                    </span>

                    {decision === option && (
                      <span className="text-[10px] font-bold tracking-wider text-[#0FFCBE]">
                        SELECTED
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Notes */}
            <div>
              <label htmlFor="investigatorNotes" className={labelClass}>
                Investigator Notes
              </label>

              <textarea
                id="investigatorNotes"
                value={notes}
                onChange={(event) => {
                  setNotes(event.target.value)
                  setSaved(false)
                  setError("")
                }}
                rows={6}
                maxLength={5000}
                placeholder="Record observations, limitations, and reasons for your assessment..."
                className={`${inputClass} resize-y leading-6`}
              />

              <p className="mt-2 text-right text-[10px] text-[#76645A]">
                {notes.length}/5000 CHARACTERS
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="border border-[#B4121B]/60 bg-[#B4121B]/10 p-4 text-sm text-[#F09A9F]"
              >
                <span className="mr-2 font-bold">!</span>
                {error}
              </div>
            )}

            {/* Saved confirmation */}
            {saved && (
              <div
                role="status"
                className="border border-[#0FFCBE]/30 bg-[#0FFCBE]/[0.05] p-4"
              >
                <p className="text-sm font-semibold text-[#0FFCBE]">
                  Assessment saved successfully.
                </p>

                <p className="mt-2 text-xs leading-5 text-[#8CADA1]">
                  Your decision and notes have been saved to this
                  case's review history.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 border-t border-[#49302D] pt-6 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={handleSave}
                className="bg-gradient-to-r from-[#0FFCBE] to-[#B2B5E0] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#0A0706] transition hover:brightness-110"
              >
                Save Assessment →
              </button>

              <button
                type="button"
                onClick={goToResults}
                className="border border-[#65503D] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#B9A99A] transition hover:border-[#B4121B] hover:text-white"
              >
                Back to Results
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 border-t border-[#49302D] py-5">
          <p className="text-center text-[10px] tracking-wider text-[#76645A]">
            AI-ASSISTED SUSPECT SEARCH SYSTEM // REVIEW MODULE
          </p>
        </footer>
      </main>
    </div>
  )
}