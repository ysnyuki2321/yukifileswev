"use client"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  // Best-effort client log for visibility
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.error("[GlobalError]", error?.message, error?.stack, error?.digest)
  }

  return (
    <html>
      <body>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ maxWidth: 560, padding: 16, color: "#fff", background: "#0f172a", borderRadius: 12, border: "1px solid rgba(139,92,246,0.3)" }}>
            <h2 style={{ fontSize: 20, marginBottom: 8 }}>Something went wrong</h2>
            <p style={{ opacity: 0.8, marginBottom: 16 }}>{error?.message || "A client error occurred."}</p>
            {error?.digest && <p style={{ fontFamily: "monospace", fontSize: 12, opacity: 0.7 }}>Digest: {error.digest}</p>}
            <button onClick={() => reset()} style={{ marginTop: 12, padding: "8px 12px", background: "#8b5cf6", borderRadius: 8 }}>Try again</button>
          </div>
        </div>
      </body>
    </html>
  )
}

