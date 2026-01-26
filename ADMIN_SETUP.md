# MongoDB Admin Portal Setup

## Quick Setup (5 minutes)

### 1. Install Dependencies (Already Done)
```bash
npm install mongoose bcryptjs jose
```

### 2. Create Admin User
```bash
node scripts/create-admin.js
```

**Output:**
```
✅ Connected to MongoDB Atlas
🗑️  Cleared existing admin users
✅ Admin user created successfully!

📧 Email: admin@polymarketwallet.com
🔑 Password: Admin_Poly_2026!

⚠️  IMPORTANT: Change this password after first login!
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access the Portal
1. Open http://localhost:3000
2. You'll be redirected to `/admin/login`
3. Enter credentials:
   - **Email:** `admin@polymarketwallet.com`
   - **Password:** `Admin_Poly_2026!`
4. After login, you'll have access to the full application

---

## How It Works

### Authentication Flow
```
User visits any page
    ↓
Middleware checks for admin_token cookie
    ↓
No token? → Redirect to /admin/login
    ↓
User logs in → JWT token created
    ↓
Token stored in HTTP-only cookie
    ↓
Access granted to all routes
```

### Security Features
- ✅ **HTTP-only cookies** (prevents XSS)
- ✅ **bcrypt password hashing** (12 rounds)
- ✅ **JWT tokens** (24h expiration)
- ✅ **MongoDB Atlas** (encrypted connection)
- ✅ **Middleware protection** (all routes protected)

---

## Files Created

| File | Purpose |
|------|---------|
| `lib/mongodb.ts` | MongoDB connection with caching |
| `models/AdminUser.ts` | Mongoose model for admin users |
| `app/api/admin/login/route.ts` | Login API endpoint |
| `app/api/admin/logout/route.ts` | Logout API endpoint |
| `app/admin/login/page.tsx` | Beautiful login UI with void effect |
| `middleware.ts` | Modified to add auth check |
| `scripts/create-admin.js` | Admin user initialization |

---

## Environment Variables

Add to `.env.local`:
```bash
MONGODB_URI="mongodb+srv://poly_server:edq9pWI7xnQZQHob@cluster0.7kewabv.mongodb.net/polymarket?retryWrites=true&w=majority&appName=Cluster0"
JWT_SECRET="VOID_SECRET_99_POLY"
```

⚠️ **IMPORTANT:** Change `JWT_SECRET` in production!

---

## Deployment to Railway

1. Add environment variables in Railway dashboard:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your_secret_here
   ```

2. Run admin creation script on Railway:
   ```bash
   railway run node scripts/create-admin.js
   ```

3. Deploy and access your Railway URL

---

## Changing Admin Password

Currently, password change must be done manually in MongoDB Atlas:

1. Go to MongoDB Atlas dashboard
2. Browse Collections → `polymarket` → `adminusers`
3. Edit the document
4. Generate new hash:
   ```javascript
   const bcrypt = require('bcryptjs');
   const hash = await bcrypt.hash('NewPassword123!', 12);
   console.log(hash);
   ```
5. Replace password field with new hash

---

## Troubleshooting

### "Cannot connect to MongoDB"
- Check `MONGODB_URI` is correct
- Verify IP whitelist in MongoDB Atlas (allow all: `0.0.0.0/0`)

### "Invalid credentials"
- Run `node scripts/create-admin.js` again
- Check email is lowercase

### "Redirect loop"
- Clear cookies
- Check middleware.ts is not conflicting

---

## Next Steps

- [ ] Add password change functionality
- [ ] Add user management UI
- [ ] Add 2FA (optional)
- [ ] Add activity logging

---

**Status:** ✅ Admin portal fully functional and integrated
