import { Elysia } from "elysia";
import { html, Html } from "@elysiajs/html";

type WorkspaceTheme = {
  name: string;
  brandName: string;
  slogan: string;
  primaryColor: string;
  gradientStart: string;
  gradientEnd: string;
  textColor: string;
  subTextColor: string;
  logoSvg: any;
};

const workspaces: Record<string, WorkspaceTheme> = {
  metthier: {
    name: "METTHIER",
    brandName: "metthier",
    slogan: "RISE ABOVE ORDINARY",
    primaryColor: "#3b2b5f",
    gradientStart: "#e39bd4",
    gradientEnd: "#f7b483",
    textColor: "#1a1a1a",
    subTextColor: "#3b2b5f",
    logoSvg: (
      <svg width="40" height="38" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 32L14 10L21 32" stroke="#f26922" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M19 32L26 10L33 32" stroke="#3b2b5f" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    )
  },
  samco: {
    name: "SAMCO",
    brandName: "samco",
    slogan: "SECURITY SERVICES",
    primaryColor: "#004899",
    gradientStart: "#3b82f6",
    gradientEnd: "#1e3a8a",
    textColor: "#ffffff",
    subTextColor: "#bfdbfe",
    logoSvg: (
      <svg width="40" height="38" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 12 C 24 6, 12 6, 12 15 C 12 24, 28 22, 28 30 C 28 38, 14 38, 10 32" stroke="#ffffff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    )
  },
  decathlon: {
    name: "DECATHLON",
    brandName: "decathlon",
    slogan: "SPORT FOR ALL",
    primaryColor: "#0082c3",
    gradientStart: "#38bdf8",
    gradientEnd: "#0284c7",
    textColor: "#ffffff",
    subTextColor: "#e0f2fe",
    logoSvg: (
      <svg width="40" height="38" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 8 L18 8 C 28 8, 28 30, 18 30 L10 30 Z" fill="#ffffff" />
        <path d="M22 30 L32 30" stroke="#ffffff" stroke-width="5" stroke-linecap="round" />
      </svg>
    )
  }
};

const renderLogin = (theme: WorkspaceTheme) => (
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{theme.name} Login</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <style>{`
        * {
            box-sizing: border-box;
        }
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
            background-color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            width: 100%;
            max-width: 360px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        h1 {
            color: ${theme.primaryColor};
            font-size: 32px;
            font-weight: 700;
            margin: 0 0 40px 0;
            letter-spacing: -0.5px;
        }
        .logo-circle {
            width: 250px;
            height: 250px;
            border-radius: 50%;
            background: linear-gradient(135deg, ${theme.gradientStart} 0%, ${theme.gradientEnd} 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 48px;
            position: relative;
            overflow: hidden;
        }
        /* Background decorative outlines inside the circle */
        .logo-circle-deco-1 {
            position: absolute;
            width: 160px;
            height: 220px;
            border: 1.5px solid rgba(255, 255, 255, 0.4);
            border-radius: 30px;
            transform: rotate(-35deg);
            top: -50px;
            left: -30px;
        }
        .logo-circle-deco-2 {
            position: absolute;
            width: 160px;
            height: 220px;
            border: 1.5px solid rgba(255, 255, 255, 0.4);
            border-radius: 30px;
            transform: rotate(25deg);
            bottom: -80px;
            right: -40px;
        }
        .logo-content {
            z-index: 10;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .form-group {
            width: 100%;
            margin-bottom: 20px;
            display: flex;
            flex-direction: column;
        }
        label {
            font-size: 14px;
            font-weight: 600;
            color: #5d6778;
            margin-bottom: 8px;
            text-align: left;
            width: 100%;
        }
        .input-wrapper {
            position: relative;
            width: 100%;
        }
        input {
            width: 100%;
            height: 48px;
            background-color: #f1f3f6;
            border: none;
            border-radius: 8px;
            padding: 0 45px 0 16px;
            font-size: 15px;
            color: #1a1a1a;
            font-family: inherit;
            outline: none;
            transition: all 0.2s;
        }
        input::placeholder {
            color: #aeb4be;
            font-weight: 400;
        }
        input:focus {
            box-shadow: 0 0 0 2px rgba(59, 43, 95, 0.15);
        }
        .icon {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: #aeb4be;
            width: 20px;
            height: 20px;
        }
        
        .login-btn {
            width: 100%;
            height: 48px;
            background-color: #ebeced;
            color: #ffffff;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            cursor: default;
            margin-top: 16px;
            transition: all 0.2s;
        }
        .login-btn:hover {
            opacity: 0.9;
        }
    `}</style>
</head>
<body>
    <div class="container">
        <h1>{theme.name}</h1>
        
        <div class="logo-circle">
            <div class="logo-circle-deco-1"></div>
            <div class="logo-circle-deco-2"></div>
            <div class="logo-content">
                {theme.logoSvg}
                <div style="display:flex; flex-direction:column; justify-content:center;">
                    <div style={`font-size:22px; color:${theme.textColor}; letter-spacing:-0.5px; font-weight: 500; font-family: 'Inter', sans-serif;`}>{theme.brandName}</div>
                    <div style={`font-size:7px; color:${theme.subTextColor}; letter-spacing:1.5px; margin-top:2px; font-weight:700;`}>{theme.slogan}</div>
                </div>
            </div>
        </div>

        <div class="form-group">
            <label for="username">Username</label>
            <div class="input-wrapper">
                <input type="text" id="username" placeholder="Username" />
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <div class="input-wrapper">
                <input type="password" id="password" placeholder="Password" />
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
        </div>

        <button class="login-btn" id="loginBtn">Login</button>
    </div>
    
    <script>{`
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const loginBtn = document.getElementById('loginBtn');
        const themeColor = "${theme.primaryColor}";
        
        function updateBtnState() {
            if (usernameInput.value.trim() !== '' && passwordInput.value.trim() !== '') {
                loginBtn.style.backgroundColor = themeColor;
                loginBtn.style.cursor = 'pointer';
            } else {
                loginBtn.style.backgroundColor = '#ebeced';
                loginBtn.style.cursor = 'default';
            }
        }
        
        usernameInput.addEventListener('input', updateBtnState);
        passwordInput.addEventListener('input', updateBtnState);
    `}</script>
</body>
</html>
);

const app = new Elysia()
  .use(html())
  .get("/", ({ redirect }) => redirect("/login"))
  .get("/login", ({ query }) => {
    // Determine the theme strictly from query string
    const workspaceKey = (query.w as string || "metthier").toLowerCase();
    const theme = workspaces[workspaceKey] || workspaces.metthier;
    return renderLogin(theme);
  })
  .get("/:workspace", ({ params: { workspace }, redirect }) => {
    if (workspace === "login") return; // Handled by /login route explicitly above if Elysia routing precedence behaves
    return redirect(`/login?w=${workspace}`);
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
