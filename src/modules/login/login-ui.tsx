import type { CiObject } from '@/db/schema/core/ci';
import { Html } from '@elysiajs/html';

// ─── Login Page Renderer ───────────────────────────────────────────────────────

export const renderLogin = (ci?: CiObject | any, errorMessage?: string, loginChallenge?: string) => {
  const primaryColor = ci?.theme?.light?.primary || '#3b2b5f';
  const fontFamily = ci?.typography?.fontFamily || 'Inter';
  const logoUrl = ci?.logo;

  const gradientStart = ci?.theme?.light?.secondary || '#e39bd4';
  const gradientEnd = ci?.theme?.light?.accent || '#f7b483';
  const textColor = ci?.theme?.light?.foreground || '#1a1a1a';
  const subTextColor = ci?.theme?.light?.mutedForeground || '#3b2b5f';

  const defaultName = 'METTHIER';
  const defaultBrandName = 'metthier';
  const defaultSlogan = 'RISE ABOVE ORDINARY';

  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`;

  const defaultLogoSvg = (
    <svg width="50" height="50" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 32L14 10L21 32" stroke="#f26922" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M19 32L26 10L33 32" stroke="#3b2b5f" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{logoUrl ? 'Login' : defaultName + ' Login'}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href={fontUrl} rel="stylesheet" />
        <style>{`
          * { box-sizing: border-box; }
          body {
              margin: 0; padding: 0; font-family: '${fontFamily}', sans-serif;
              background-color: #ffffff; display: flex;
              justify-content: center; align-items: center; min-height: 100vh;
          }
          .container { width: 100%; max-width: 360px; padding: 24px; display: flex; flex-direction: column; align-items: center; }
          h1 { color: ${primaryColor}; font-size: 32px; font-weight: 700; margin: 0 0 40px 0; letter-spacing: -0.5px; text-transform: uppercase; }
          .logo-circle {
              width: 250px; height: 250px; border-radius: 50%;
              background: linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%);
              display: flex; justify-content: center; align-items: center;
              margin-bottom: 48px; position: relative; overflow: hidden;
          }
          .logo-circle-deco-1 { position: absolute; width: 160px; height: 220px; border: 1.5px solid rgba(255,255,255,0.4); border-radius: 30px; transform: rotate(-35deg); top: -50px; left: -30px; }
          .logo-circle-deco-2 { position: absolute; width: 160px; height: 220px; border: 1.5px solid rgba(255,255,255,0.4); border-radius: 30px; transform: rotate(25deg); bottom: -80px; right: -40px; }
          .logo-content { z-index: 10; display: flex; align-items: center; gap: 12px; }
          .form-group { width: 100%; margin-bottom: 20px; display: flex; flex-direction: column; }
          label { font-size: 14px; font-weight: 600; color: #5d6778; margin-bottom: 8px; text-align: left; width: 100%; }
          .input-wrapper { position: relative; width: 100%; }
          input { width: 100%; height: 48px; background-color: #f1f3f6; border: none; border-radius: 8px; padding: 0 45px 0 16px; font-size: 15px; color: #1a1a1a; font-family: inherit; outline: none; transition: all 0.2s; }
          input::placeholder { color: #aeb4be; font-weight: 400; }
          input:focus { box-shadow: 0 0 0 2px ${primaryColor}40; }
          .icon { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: #aeb4be; width: 20px; height: 20px; }
          .login-btn { width: 100%; height: 48px; background-color: #ebeced; color: #ffffff; border: none; border-radius: 8px; font-size: 16px; font-weight: 500; cursor: default; margin-top: 16px; transition: all 0.2s; }
          .login-btn:hover { opacity: 0.9; }
          .error-message { width: 100%; color: #d32f2f; background-color: #ffebee; padding: 12px; border-radius: 8px; font-size: 14px; margin-bottom: 20px; text-align: center; border: 1px solid #ffcdd2; }
        `}</style>
      </head>
      <body>
        <div class="container">
          <h1>{logoUrl ? '' : defaultName}</h1>
          <div class="logo-circle">
            <div class="logo-circle-deco-1"></div>
            <div class="logo-circle-deco-2"></div>
            <div class="logo-content">
              {logoUrl ? <img src={logoUrl} alt="Logo" style="max-height: 150px; max-width: 150px; z-index: 10; object-fit: contain;" /> : defaultLogoSvg}
              {!logoUrl && (
                <div style="display:flex; flex-direction:column; justify-content:center;">
                  <div style={`font-size:22px; color:${textColor}; letter-spacing:-0.5px; font-weight: 500; font-family: '${fontFamily}', sans-serif;`}>{defaultBrandName}</div>
                  <div style={`font-size:7px; color:${subTextColor}; letter-spacing:1.5px; margin-top:2px; font-weight:700;`}>{defaultSlogan}</div>
                </div>
              )}
            </div>
          </div>

          <form action={loginChallenge ? `/login?login_challenge=${loginChallenge}` : '/login'} method="POST" style="width: 100%;">
            <div class="form-group">
              <label for="username">Username</label>
              <div class="input-wrapper">
                <input type="text" id="username" name="username" placeholder="Username" required />
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <div class="input-wrapper">
                <input type="password" id="password" name="password" placeholder="Password" required />
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
            </div>

            {errorMessage && <div id="errorMessage" class="error-message">{errorMessage}</div>}

            <button type="submit" class="login-btn" id="loginBtn">Login</button>
          </form>
        </div>

        <script>{`
          const usernameInput = document.getElementById('username');
          const passwordInput = document.getElementById('password');
          const loginBtn = document.getElementById('loginBtn');
          const errorMsg = document.getElementById('errorMessage');
          const themeColor = "${primaryColor}";
          
          function updateBtnState() {
              if (usernameInput.value.trim() !== '' && passwordInput.value.trim() !== '') {
                  loginBtn.style.backgroundColor = themeColor;
                  loginBtn.style.cursor = 'pointer';
              } else {
                  loginBtn.style.backgroundColor = '#ebeced';
                  loginBtn.style.cursor = 'default';
              }
          }

          function clearError() {
              if (errorMsg) {
                  errorMsg.style.display = 'none';
              }
          }

          usernameInput.addEventListener('input', () => {
              updateBtnState();
              clearError();
          });
          passwordInput.addEventListener('input', () => {
              updateBtnState();
              clearError();
          });
        `}</script>
      </body>
    </html>
  );
};
