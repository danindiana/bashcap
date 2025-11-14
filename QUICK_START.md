# Bashcap Quick Start Guide

**TL;DR: What to do RIGHT NOW to get this working**

## The Absolute Essentials (Do These First)

### 1. Set Up Environment (30 minutes)

```bash
# Install dependencies
npm install dotenv

# Create .env file
cat > .env << 'EOF'
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-key-change-this
DATABASE_URL=postgresql://localhost/bashcap
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
BASE_URL=http://localhost:3000
EOF

# Add to .gitignore
echo ".env" >> .gitignore
```

### 2. Choose Your Database (Pick ONE)

**Option A: SQLite (Fastest to start)**
```bash
npm install sqlite3 sequelize
```

**Option B: PostgreSQL (Production-ready)**
```bash
npm install pg
# Then install PostgreSQL locally or use cloud service
```

**Option C: MongoDB (Most flexible)**
```bash
npm install mongoose
# Then install MongoDB locally or use MongoDB Atlas
```

### 3. Fix Email (15 minutes)

**Quick option:** Just log to console instead of sending emails:

```javascript
// Replace nodemailer.sendMail() calls with:
console.log('Email would be sent to:', user.email);
console.log('Verification link:', 'http://localhost:3000/verify-email/' + token);
```

**Better option:** Set up Gmail App Password:
1. Go to Google Account settings
2. Enable 2FA
3. Generate App Password
4. Put it in `.env` as `EMAIL_PASS`

### 4. Run the Server

```bash
# Update bashcap_server.js first line:
# require('dotenv').config();

node bashcap_server.js
```

---

## The Missing Pieces (What's Broken)

| Problem | Quick Fix | Time |
|---------|-----------|------|
| No database | Use SQLite with Sequelize ORM | 2h |
| Missing upload-telemetry.html | Copy/paste template below | 15m |
| Hardcoded secrets | Use .env (see above) | 30m |
| Data lost on restart | Implement database (above) | 2h |
| No validation | Add express-validator | 1h |

### Missing File: upload-telemetry.html

Create this file:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Upload Telemetry</title>
</head>
<body>
  <h2>Upload Bash Telemetry Data</h2>
  <form action="/upload-telemetry" method="POST">
    <label>Telemetry Data (JSON):</label><br>
    <textarea name="telemetryData" rows="10" cols="50" placeholder='{"command": "ls -la", "timestamp": "2024-01-11T12:00:00Z"}'></textarea><br>
    <button type="submit">Upload</button>
  </form>
</body>
</html>
```

---

## 3 Paths Forward

### Path A: "Just Make It Work" (1 day)
Good for: Testing the concept, demo, learning

1. Use in-memory storage (keep as-is)
2. Console.log emails (no real sending)
3. Create upload-telemetry.html (15 min)
4. Test manually (no automated tests)

**Result:** Working demo, but data lost on restart

### Path B: "MVP Launch" (1 week)
Good for: Small personal project, 10-100 users

1. SQLite database (persistent storage) - 2h
2. Gmail for emails (free tier) - 30m
3. Basic validation - 1h
4. Deploy to Heroku - 2h
5. Add rate limiting - 1h
6. Write basic tests - 2h

**Result:** Can actually use it, handle real users

### Path C: "Production Ready" (3-4 weeks)
Good for: Real business, 1000+ users, monetization

1. PostgreSQL database - 4h
2. SendGrid for emails - 1h
3. Full input validation - 3h
4. JWT refresh tokens - 2h
5. Rate limiting + security - 4h
6. Comprehensive tests - 8h
7. Docker deployment - 4h
8. Monitoring setup - 4h
9. Documentation - 4h

**Result:** Can handle scale, secure, maintainable

---

## My Recommendation

**Do this in order:**

**Day 1: Foundation**
1. Environment variables (.env) ← Start here
2. SQLite database
3. Fix email (console.log is fine for now)

**Day 2: Core Features**
4. Create upload-telemetry.html
5. Implement telemetry storage
6. Test end-to-end flow

**Day 3: Security Basics**
7. Add input validation
8. Add rate limiting to login/register
9. Fix deprecated express-jwt

**Day 4: Testing & Docs**
10. Write tests for critical paths
11. Update README with setup instructions
12. Fix package.json scripts

**Day 5+: Deploy**
13. Choose hosting platform
14. Set up production database
15. Configure HTTPS
16. Launch!

---

## Need Help? Common Questions

**Q: Which database should I use?**
- Learning/prototype → SQLite
- Small project (<1000 users) → SQLite or PostgreSQL
- Production/scaling → PostgreSQL
- Complex querying → PostgreSQL
- Flexible schema → MongoDB

**Q: How do I know it's working?**
Test this flow:
1. Visit http://localhost:3000
2. Click "Register"
3. Create account
4. Check console for verification link
5. Visit link to verify
6. Login
7. Upload telemetry
8. Check database to see data stored

**Q: What should telemetry data look like?**
Example JSON structure:
```json
{
  "session_id": "abc123",
  "commands": [
    {
      "command": "ls -la",
      "timestamp": "2024-01-11T12:00:00Z",
      "exit_code": 0,
      "duration_ms": 45
    }
  ],
  "metadata": {
    "shell": "bash",
    "os": "Linux",
    "user": "john"
  }
}
```

**Q: This is overwhelming, what's the ONE thing I should do first?**
Create the `.env` file and stop hardcoding secrets. Everything else builds from there.

---

## Cheat Sheet: Common Commands

```bash
# Install everything
npm install

# Run server
node bashcap_server.js

# Run with auto-reload (install nodemon first)
npm install -g nodemon
nodemon bashcap_server.js

# Run tests
npm test

# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Create database (PostgreSQL example)
createdb bashcap
```

---

## Files You Need to Create/Modify

### Must Create:
- [ ] `.env` - Environment variables
- [ ] `upload-telemetry.html` - Missing upload form
- [ ] Database models (User, Telemetry)

### Must Modify:
- [ ] `bashcap_server.js` - Add `require('dotenv').config()` at top
- [ ] `bashcap_server.js` - Replace hardcoded values with `process.env.*`
- [ ] `.gitignore` - Add `.env`

### Nice to Have:
- [ ] `config/database.js` - Database connection
- [ ] `README.md` - Update with actual instructions
- [ ] `test.js` - Fix and expand tests

---

**Bottom Line:** Start with the `.env` file and database choice. Everything else follows naturally from there. The app is 70% complete - you mainly need persistence (database) and security (env vars, validation).
