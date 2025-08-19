export function verificationEmailHtml(brandName = "YukiFiles", siteUrl = "") {
  const actionUrl = `${siteUrl || ""}/auth/callback`
  return `<!doctype html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>${brandName} Verify</title>
  <style>
    body { background: #0f0f14; color: #e5e7eb; font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
    .container { max-width: 560px; margin: 0 auto; padding: 24px; }
    .card { background: linear-gradient(135deg, rgba(17,24,39,0.95), rgba(31,41,55,0.9)); border: 1px solid rgba(139,92,246,0.3); border-radius: 12px; padding: 24px; }
    .brand { display:flex; align-items:center; gap:10px; }
    .logo { width: 28px; height: 28px; background: linear-gradient(135deg,#8b5cf6,#22d3ee,#ec4899); border-radius: 6px; }
    .title { font-size: 20px; font-weight: 700; color: #fff; }
    .btn { display:inline-block; padding: 12px 18px; background: linear-gradient(135deg,#8b5cf6,#ec4899); color:#fff; text-decoration:none; border-radius: 8px; font-weight: 600; }
    .muted { color:#9ca3af; font-size: 13px; }
    .footer { margin-top: 16px; color:#6b7280; font-size: 12px; text-align:center; }
  </style>
  </head>
  <body>
    <div class="container">
      <div class="brand"><div class="logo"></div><div class="title">${brandName}</div></div>
      <div class="card" style="margin-top:16px">
        <h1 style="margin:0 0 12px 0; color:#fff;">Confirm your email</h1>
        <p class="muted">Click the button below to verify your email and activate your account.</p>
        <p style="margin: 20px 0">
          <a class="btn" href="{{ .ConfirmationURL }}" target="_blank" rel="noopener noreferrer">Verify Email</a>
        </p>
        <p class="muted">This link will expire soon. If you did not request this, you can safely ignore this email.</p>
      </div>
      <div class="footer">© ${new Date().getFullYear()} ${brandName}. All rights reserved.</div>
    </div>
  </body>
</html>`
}

