import { Html } from '@elysiajs/html';

// ─── Not Found Page Renderer ───────────────────────────────────────────────────

export const renderNotFound = () => (
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>404 – Not Found</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        body { 
          font-family: 'Inter', sans-serif; 
          display: flex; 
          justify-content: center;
          align-items: center; 
          min-height: 100vh; 
          margin: 0; 
          background: #f8f9fa; 
        }
        .box { text-align: center; }
        h1 { font-size: 6rem; color: #3b2b5f; margin: 0; font-weight: 700; }
        p  { color: #6b7280; margin-top: 8px; font-size: 1.1rem; }
      `}</style>
    </head>
    <body>
      <div class="box">
        <h1>404</h1>
        <p>Page not found.</p>
      </div>
    </body>
  </html>
);
