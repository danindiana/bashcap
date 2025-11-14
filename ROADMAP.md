# Bashcap Development Roadmap

A phase-based implementation guide organized by development stages. Each phase builds on the previous, with clear dependencies and estimated effort.

**Legend:**
- 🔴 **CRITICAL** - Blocks progress, must complete
- 🟡 **IMPORTANT** - Needed for production
- 🟢 **ENHANCEMENT** - Nice to have, can defer
- ⏱️ Estimated effort: S (hours) | M (days) | L (week+)

---

## Phase 1: MVP Foundation (Week 1-2)
**Goal:** Get basic functionality working end-to-end

### 1.1 Database Setup ⏱️ M 🔴
**Complete all together - they're interdependent**
- [ ] Choose database (PostgreSQL recommended for structured data)
- [ ] Install: `npm install pg` or `npm install mongoose`
- [ ] Create User model (username, email, password_hash, is_verified, created_at)
- [ ] Create Telemetry model (user_id, command_data, timestamp, session_id)
- [ ] Write connection config in `config/database.js`
- [ ] Test connection with simple query
- [ ] Replace all in-memory `users` array references

**Files to create:** `config/database.js`, `models/User.js`, `models/Telemetry.js`

### 1.2 Environment & Secrets ⏱️ S 🔴
**Do before database to avoid hardcoding credentials**
- [ ] Install: `npm install dotenv`
- [ ] Create `.env` file with variables:
  ```
  NODE_ENV=development
  PORT=3000
  DATABASE_URL=postgresql://...
  JWT_SECRET=<random-256-bit-string>
  EMAIL_USER=your-email@gmail.com
  EMAIL_PASS=your-app-password
  BASE_URL=http://localhost:3000
  ```
- [ ] Add `.env` to `.gitignore`
- [ ] Create `.env.example` (template without secrets)
- [ ] Update code to use `process.env.*`

**Files to modify:** All `.js` files, create `.env`, `.gitignore`

### 1.3 Fix Email Service ⏱️ S 🔴
**Prerequisite: 1.2 completed**
- [ ] Set up Gmail App Password or SendGrid account
- [ ] Update nodemailer config to use env vars
- [ ] Create email templates in `utils/emailTemplates.js`
- [ ] Test registration email
- [ ] Test password reset email
- [ ] Add error handling for email failures

**Files to create:** `utils/emailTemplates.js`

### 1.4 Complete Missing Frontend ⏱️ M 🔴
- [ ] Create `upload-telemetry.html` (form to submit telemetry JSON)
- [ ] Add basic CSS/styling (use CDN like Bootstrap)
- [ ] Add client-side JWT storage (localStorage)
- [ ] Create dashboard page showing user's telemetry
- [ ] Add navigation header with logout
- [ ] Add form validation (required fields, email format, password strength)

**Files to create:** `upload-telemetry.html`, `dashboard.html`, `public/styles.css`

### 1.5 Implement Telemetry Core ⏱️ M 🔴
- [ ] Define telemetry JSON schema (what fields are expected?)
- [ ] Add authentication middleware to protect `/upload-telemetry`
- [ ] Parse and validate incoming telemetry data
- [ ] Save to database with user_id association
- [ ] Create GET endpoint: `/api/telemetry` (fetch user's data)
- [ ] Display telemetry on dashboard

**Files to modify:** `bashcap_server_webguiv2.js` or refactor

### 1.6 Basic Testing ⏱️ S 🟡
- [ ] Fix `test.js` import/export syntax
- [ ] Add tests for: registration, login, email verification
- [ ] Add test for telemetry upload
- [ ] Ensure `npm test` passes

---

## Phase 2: Security Hardening (Week 3)
**Goal:** Make the application secure enough for real use

### 2.1 Input Validation ⏱️ M 🔴
**Install:** `npm install express-validator`
- [ ] Add validation to `/register`: email format, username length, password strength
- [ ] Add validation to `/login`: sanitize inputs
- [ ] Add validation to `/upload-telemetry`: validate JSON structure
- [ ] Return clear error messages for validation failures

### 2.2 Rate Limiting & Protection ⏱️ S 🟡
**Install:** `npm install express-rate-limit helmet`
- [ ] Add rate limiting to `/login` (5 attempts per 15 min)
- [ ] Add rate limiting to `/register` (3 per hour per IP)
- [ ] Add rate limiting to `/forgot` (3 per hour)
- [ ] Install helmet.js for security headers
- [ ] Configure CORS properly

### 2.3 Authentication Improvements ⏱️ M 🟡
- [ ] Fix deprecated express-jwt usage (upgrade to v8 syntax)
- [ ] Implement token refresh endpoint
- [ ] Add password strength validator (min 8 chars, uppercase, number, special)
- [ ] Add account lockout after 5 failed logins
- [ ] Hash email verification tokens before storing
- [ ] Add token expiration to email verification (24 hours)

### 2.4 Error Handling & Logging ⏱️ M 🟡
**Install:** `npm install winston morgan`
- [ ] Create centralized error handler middleware
- [ ] Set up winston for file logging
- [ ] Add morgan for HTTP request logging
- [ ] Log all authentication events
- [ ] Log errors without exposing stack traces to users
- [ ] Create separate logs: `error.log`, `combined.log`, `auth.log`

---

## Phase 3: Code Quality & Structure (Week 4)
**Goal:** Make code maintainable and professional

### 3.1 Project Restructure ⏱️ L 🟡
**Big refactor - do all at once to avoid breaking changes**
```
/bashcap
├── config/
│   ├── database.js
│   └── email.js
├── models/
│   ├── User.js
│   └── Telemetry.js
├── routes/
│   ├── auth.js (register, login, verify, reset)
│   └── telemetry.js
├── controllers/
│   ├── authController.js
│   └── telemetryController.js
├── middleware/
│   ├── authenticate.js
│   ├── validate.js
│   └── errorHandler.js
├── utils/
│   ├── emailTemplates.js
│   └── tokenGenerator.js
├── public/
│   ├── css/
│   ├── js/
│   └── index.html
├── tests/
│   ├── auth.test.js
│   └── telemetry.test.js
├── server.js (main entry point)
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

- [ ] Create folder structure
- [ ] Move code to appropriate files
- [ ] Update imports/requires
- [ ] Test that everything still works

### 3.2 Linting & Formatting ⏱️ S 🟢
**Install:** `npm install --save-dev eslint prettier`
- [ ] Initialize ESLint: `npx eslint --init`
- [ ] Create `.prettierrc` config
- [ ] Add lint script to package.json
- [ ] Fix all linting errors
- [ ] Set up pre-commit hook (optional)

### 3.3 Package.json Cleanup ⏱️ S 🟡
- [ ] Add proper metadata (name, version, description, author, license)
- [ ] Add `"start": "node server.js"`
- [ ] Add `"dev": "nodemon server.js"`
- [ ] Install: `npm install --save-dev nodemon`
- [ ] Separate dependencies from devDependencies
- [ ] Specify engines: `"node": ">=14.0.0"`

### 3.4 Enhanced Testing ⏱️ M 🟡
- [ ] Add test for password reset flow
- [ ] Add test for telemetry retrieval
- [ ] Add test for rate limiting
- [ ] Add test for validation errors
- [ ] Install: `npm install --save-dev supertest` (better than chai-http)
- [ ] Aim for 70%+ code coverage

---

## Phase 4: Production Readiness (Week 5-6)
**Goal:** Deploy safely to production

### 4.1 Documentation ⏱️ M 🟡
- [ ] Rewrite README.md with:
  - Clear project description
  - Installation guide
  - Configuration instructions
  - API endpoint documentation
  - Example API calls with curl/Postman
- [ ] Add inline code comments to complex functions
- [ ] Create CONTRIBUTING.md if open source
- [ ] Document environment variables in .env.example

### 4.2 Deployment Setup ⏱️ L 🟡
**Choose your platform first**
- [ ] Create Dockerfile:
  ```dockerfile
  FROM node:18-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production
  COPY . .
  EXPOSE 3000
  CMD ["node", "server.js"]
  ```
- [ ] Create docker-compose.yml (app + database)
- [ ] Set up production database (AWS RDS, Heroku Postgres, etc.)
- [ ] Configure HTTPS (Let's Encrypt, Cloudflare, etc.)
- [ ] Set up reverse proxy (nginx) if self-hosting
- [ ] Configure production env vars on hosting platform

### 4.3 Monitoring & Health ⏱️ M 🟡
- [ ] Add `/health` endpoint (returns DB connection status)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure error alerting (Sentry, LogDNA)
- [ ] Set up database backups (automated daily)
- [ ] Create runbook for common issues

### 4.4 Performance ⏱️ M 🟢
**Install:** `npm install compression redis`
- [ ] Add database indexes on frequently queried fields (user.email, telemetry.user_id)
- [ ] Implement pagination for `/api/telemetry` (limit, offset params)
- [ ] Add compression middleware
- [ ] Set up Redis for session caching (optional)
- [ ] Implement request timeout handling
- [ ] Load test with tools like `ab` or `k6`

---

## Phase 5: Advanced Features (Future/Optional)
**Goal:** Differentiate the product

### 5.1 Enhanced Authentication ⏱️ L 🟢
- [ ] OAuth2 integration (Google, GitHub)
- [ ] Two-factor authentication (TOTP)
- [ ] API key generation for CLI clients
- [ ] User roles (admin, regular user)

### 5.2 Advanced Telemetry ⏱️ L 🟢
- [ ] Real-time telemetry dashboard (WebSockets)
- [ ] Telemetry analytics (top commands, usage patterns)
- [ ] Export to CSV/JSON formats
- [ ] Webhooks for telemetry events
- [ ] Telemetry visualization charts

### 5.3 Admin Features ⏱️ M 🟢
- [ ] Admin dashboard
- [ ] User management (suspend, delete)
- [ ] System metrics (total users, telemetry volume)
- [ ] Audit logs

---

## Quick Start Path (Minimum Viable)

If you want to get something working FAST, do this minimal subset:

### Week 1 Sprint:
1. **Environment setup** (1.2) - 2 hours
2. **Database basics** (1.1) - Use SQLite for quick start: `npm install sqlite3` - 4 hours
3. **Email stubs** (1.3) - Console.log instead of sending emails initially - 1 hour
4. **Simple frontend** (1.4) - Bare HTML forms, no styling - 3 hours
5. **Basic telemetry** (1.5) - Accept any JSON, store it - 2 hours

**Result:** Working prototype in ~12 hours of focused work

Then iterate through Phases 2-4 before going live.

---

## Known Blockers to Address Immediately

| Issue | File | Line | Fix Phase |
|-------|------|------|-----------|
| Hardcoded JWT secret | bashcap_server.js | 17 | 1.2 |
| Hardcoded email creds | bashcap_server.js | 46-49 | 1.2 |
| Missing upload form | bashcap_server_webguiv2.js | 80 | 1.4 |
| In-memory storage | Both servers | All | 1.1 |
| No input validation | All endpoints | All | 2.1 |
| No rate limiting | /login, /register | All | 2.2 |
| Broken tests | test.js | 2 | 1.6 |
| No HTTPS | Deployment | N/A | 4.2 |

---

## Decision Points

Before starting, decide on:

1. **Database:** PostgreSQL (structured, reliable) vs MongoDB (flexible, faster to prototype)
2. **Deployment:** Heroku (easiest), AWS (scalable), DigitalOcean (balance), or self-host
3. **Email:** Gmail (free, limited), SendGrid (scalable), AWS SES (cheap, complex)
4. **Scope:** MVP only, or include advanced features?
5. **Timeline:** Rapid 2-week launch vs thorough 6-week development

**Recommendation:** PostgreSQL + Heroku + SendGrid + MVP scope + 3-week timeline
