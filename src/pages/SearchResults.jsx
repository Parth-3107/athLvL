import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import Logo from "../components/Logo"

export default function SearchResults() {
  const { caseId } = useParams()
  const navigate = useNavigate()

  const [caseData, setCaseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    try {
      const cases = JSON.parse(
        localStorage.getItem("cases") || "[]"
      )

      const selected = cases.find(
        (item) => item.caseId === caseId
      )

      setCaseData(selected || null)
    } catch (error) {
      console.error("Could not load case:", error)
      setLoadError(true)
      setCaseData(null)
    } finally {
      setLoading(false)
    }
  }, [caseId])

  const sampleResults = [
    {
      id: "SIGHT-001",
      camera: "CAM-014",
      location: "College Road",
      timestamp: "2026-09-28 14:32",
      confidence: 92,
      status: "Pending review",
    },
    {
      id: "SIGHT-002",
      camera: "CAM-027",
      location: "Gangapur Road",
      timestamp: "2026-09-28 15:08",
      confidence: 84,
      status: "Pending review",
    },
    {
      id: "SIGHT-003",
      camera: "CAM-031",
      location: "Mumbai Naka",
      timestamp: "2026-09-28 16:17",
      confidence: 76,
      status: "Pending review",
    },
  ]

  const reviews = caseData?.sightingReviews || {}

  const reviewedCount = sampleResults.filter(
    (item) => Boolean(reviews[item.id]?.decision)
  ).length

  const pendingCount = sampleResults.length - reviewedCount

  const inputLabelClass =
    "text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8C7769]"

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0706] font-mono text-sm text-[#0FFCBE]">
        <span className="mr-3 h-2 w-2 animate-pulse rounded-full bg-[#0FFCBE]" />
        LOADING SEARCH RESULTS...
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
            ERROR // {loadError ? "STORAGE" : "404"}
          </p>

          <h1 className="mt-4 text-2xl font-bold">
            {loadError ? "UNABLE TO LOAD CASE" : "CASE NOT FOUND"}
          </h1>

          <p className="mt-3 text-sm text-[#9C8D82]">
            {loadError
              ? "The saved case information could not be read."
              : "The requested investigation file does not exist or may have been removed."}
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

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        {/* Page heading */}
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="border-l-2 border-[#B4121B] pl-5">
            <p className="text-[10px] font-semibold tracking-[0.3em] text-[#0FFCBE]">
              INVESTIGATION WORKSPACE / SEARCH MODULE
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              SEARCH <span className="text-[#B4121B]">RESULTS</span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#9C8D82]">
              Review possible sightings associated with this
              investigation and record an investigator decision.
            </p>

            <p className="mt-3 break-words text-xs text-[#B9A99A]">
              {caseData.caseTitle}{" "}
              <span className="mx-2 text-[#65503D]">/</span>
              <span className="text-[#0FFCBE]">{caseData.caseId}</span>
            </p>
          </div>

          <span className="border border-amber-700/50 bg-amber-950/30 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-300">
            Demo Results
          </span>
        </div>

        {/* Prototype notice */}
        <div className="mt-7 border border-amber-700/40 bg-amber-950/15 p-4">
          <p className="text-xs font-bold tracking-wider text-amber-300">
            IMPORTANT // ILLUSTRATIVE DATA
          </p>

          <p className="mt-2 text-xs leading-6 text-amber-100/75">
            These are hardcoded sample entries for demonstration.
            Similarity percentages are illustrative values, not
            real AI detections or verified identity matches.
          </p>
        </div>

        {/* Summary cards */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border border-[#49302D] bg-[#120B09] p-5">
            <div className="flex items-center justify-between">
              <p className={inputLabelClass}>Possible Sightings</p>
              <span className="text-lg text-[#B4121B]">01</span>
            </div>

            <p className="mt-4 text-3xl font-bold">
              {String(sampleResults.length).padStart(2, "0")}
            </p>

            <p className="mt-2 text-[10px] text-[#76645A]">
              SAMPLE RECORDS
            </p>
          </div>

          <div className="border border-[#49302D] bg-[#120B09] p-5">
            <div className="flex items-center justify-between">
              <p className={inputLabelClass}>Cameras Represented</p>
              <span className="text-lg text-[#B2B5E0]">02</span>
            </div>

            <p className="mt-4 text-3xl font-bold">
              {String(
                new Set(sampleResults.map((item) => item.camera)).size
              ).padStart(2, "0")}
            </p>

            <p className="mt-2 text-[10px] text-[#76645A]">
              SAMPLE CAMERA IDS
            </p>
          </div>

          <div className="border border-[#49302D] bg-[#120B09] p-5">
            <div className="flex items-center justify-between">
              <p className={inputLabelClass}>Reviewed</p>
              <span className="text-lg text-[#0FFCBE]">03</span>
            </div>

            <p className="mt-4 text-3xl font-bold text-[#0FFCBE]">
              {String(reviewedCount).padStart(2, "0")}
            </p>

            <p className="mt-2 text-[10px] text-[#76645A]">
              OF {sampleResults.length} SIGHTINGS
            </p>
          </div>

          <div className="border border-[#49302D] bg-[#120B09] p-5">
            <div className="flex items-center justify-between">
              <p className={inputLabelClass}>Awaiting Review</p>
              <span className="text-lg text-amber-300">04</span>
            </div>

            <p className="mt-4 text-3xl font-bold text-amber-300">
              {String(pendingCount).padStart(2, "0")}
            </p>

            <p className="mt-2 text-[10px] text-[#76645A]">
              REQUIRE ATTENTION
            </p>
          </div>
        </section>

        {/* Sightings list */}
        <section className="mt-9">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#49302D] pb-4">
            <div>
              <p className="text-[10px] tracking-[0.25em] text-[#B4121B]">
                01 / MATCH CANDIDATES
              </p>

              <h2 className="mt-2 text-xl font-bold tracking-wide">
                POSSIBLE SIGHTINGS
              </h2>

              <p className="mt-2 text-xs text-[#8C7769]">
                Open a record to document the investigator's assessment.
              </p>
            </div>

            <span className="text-[10px] tracking-wider text-[#76645A]">
              {sampleResults.length} RECORDS
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {sampleResults.map((result, index) => {
              const sightingReview = reviews[result.id]
              const decision = sightingReview?.decision

              return (
                <article
                  key={result.id}
                  className="overflow-hidden border border-[#49302D] bg-[#120B09] transition hover:border-[#65503D]"
                >
                  {/* Sighting header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#49302D] bg-[#0D0807] px-5 py-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[10px] tracking-[0.2em] text-[#B4121B]">
                        CANDIDATE {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="text-xs font-semibold text-[#0FFCBE]">
                        {result.id}
                      </span>
                    </div>

                    <span
                      className={`border px-3 py-1 text-[10px] uppercase tracking-wider ${
                        decision
                          ? "border-[#0FFCBE]/30 bg-[#0FFCBE]/5 text-[#0FFCBE]"
                          : "border-amber-700/40 bg-amber-950/20 text-amber-300"
                      }`}
                    >
                      {decision || "Pending Review"}
                    </span>
                  </div>

                  {/* Sighting details */}
                  <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_200px]">
                    <div>
                      <h3 className="text-xl font-bold">
                        {result.location}
                      </h3>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className={inputLabelClass}>
                            Camera Identifier
                          </p>
                          <p className="mt-2 text-sm text-[#0FFCBE]">
                            {result.camera}
                          </p>
                        </div>

                        <div>
                          <p className={inputLabelClass}>
                            Sample Timestamp
                          </p>
                          <p className="mt-2 text-sm">
                            {result.timestamp}
                          </p>
                        </div>
                      </div>

                      {sightingReview?.reviewedAt && (
                        <div className="mt-5 border-t border-[#49302D] pt-4">
                          <p className={inputLabelClass}>
                            Last Reviewed
                          </p>

                          <p className="mt-2 text-xs text-[#B9A99A]">
                            {new Date(
                              sightingReview.reviewedAt
                            ).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Illustrative similarity */}
                    <div className="border border-[#49302D] bg-[#0A0706] p-5 lg:text-center">
                      <p className={inputLabelClass}>
                        Demo Similarity
                      </p>

                      <p className="mt-3 text-4xl font-bold text-[#B2B5E0]">
                        {result.confidence}%
                      </p>

                      <div className="mt-4 h-1.5 overflow-hidden bg-[#49302D]">
                        <div
                          className="h-full bg-gradient-to-r from-[#B4121B] to-[#B2B5E0]"
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>

                      <p className="mt-3 text-[10px] leading-5 text-amber-300">
                        NOT A VERIFIED MATCH
                      </p>
                    </div>
                  </div>

                  {/* Review action */}
                  <div className="flex flex-col gap-4 border-t border-[#49302D] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                      <p className="text-[10px] tracking-[0.15em] text-[#8C7769]">
                        INVESTIGATOR DECISION
                      </p>

                      <p className="mt-1 text-sm text-[#B9A99A]">
                        {decision || "No review recorded yet"}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        navigate(
                          `/sighting-review/${encodeURIComponent(
                            caseId
                          )}/${encodeURIComponent(result.id)}`
                        )
                      }
                      className="border border-[#65503D] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#E8E3DB] transition hover:border-[#0FFCBE] hover:text-[#0FFCBE]"
                    >
                      {decision ? "View / Edit Review →" : "Review Sighting →"}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* Footer actions */}
        <div className="mt-8 flex flex-wrap gap-3 border-t border-[#49302D] pt-6">
          <button
            onClick={() =>
              navigate(`/ai-search/${encodeURIComponent(caseId)}`)
            }
            className="border border-[#65503D] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#B9A99A] transition hover:border-[#B4121B] hover:text-white"
          >
            ← Search Configuration
          </button>

          <button
            onClick={() =>
              navigate(`/case/${encodeURIComponent(caseId)}`)
            }
            className="bg-gradient-to-r from-[#0FFCBE] to-[#B2B5E0] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#0A0706] transition hover:brightness-110"
          >
            Return to Case →
          </button>
        </div>

        <footer className="mt-8 border-t border-[#49302D] py-5">
          <p className="text-center text-[10px] tracking-wider text-[#76645A]">
            AI-ASSISTED SUSPECT SEARCH SYSTEM // RESULTS MODULE
          </p>
        </footer>
      </main>
    </div>
  )
}