# Nimbus — Expense Tracker

A full-stack expense tracker with a glassmorphic ("glossy transparent") UI:
React + TypeScript + Tailwind on the frontend, Node/Express + Prisma + SQLite
on the backend, with JWT auth, categories, budgets, and monthly summaries.

## What was fixed / built

- **Bug fix:** the original `auth.service.js` didn't actually contain login/register
  logic (it was accidentally filled with category code), so sign up and sign in
  never worked. That's rewritten with bcrypt password hashing + JWT.
- **New backend:** full CRUD for **categories**, **expenses**, and **budgets**,
  plus a `/api/expenses/summary` endpoint that powers the dashboard, and
  `/api/auth/me` for viewing/editing your profile and changing your password.
- **Database:** switched from Postgres (which needs a separate server) to
  **SQLite** — a single file, zero setup. You can switch back to Postgres/MySQL
  later by editing `server/prisma/schema.prisma` and `server/.env` (Prisma
  supports both with minimal changes).
- **New frontend:** a redesigned glass UI (frosted-glass cards, glossy button
  sheen, animated gradient background) for Login, Register, a real Dashboard
  (add/edit/delete expenses, manage categories, set a monthly budget, see a
  category breakdown), and a Profile page (edit info, change password).

## Project structure

```
ExpenseTracker/
├── client/   React + Vite + Tailwind frontend
└── server/   Express + Prisma + SQLite backend
```

## 1. Backend setup

```bash
cd server
npm install
npx prisma migrate dev --name init   # creates prisma/dev.db and all tables
npm run dev                          # starts on http://localhost:5000
```

`server/.env` already contains a working config:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET=my_super_secret_key_12345
PORT=5000
```

Change `JWT_SECRET` to your own random string before deploying anywhere real.

## 2. Frontend setup

In a second terminal:

```bash
cd client
npm install
npm run dev     # starts on http://localhost:5173
```

Open the printed URL in your browser. Register an account, log in, and you're in.

## 3. Deployment

Ready to deploy? See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions for:
- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Railway

Both platforms offer free tiers and handle everything automatically.

## Notes

- When you register, six starter categories (Food, Transport, Shopping, Bills,
  Entertainment, Other) are created automatically for your account — you can
  rename, recolor, or delete them from the "Manage" link on the dashboard.
- The frontend talks to the backend at `http://localhost:5000/api`
  (see `client/src/api/axios.ts`) — update that if you deploy the API elsewhere.
- To reset your data, stop the server and delete `server/prisma/dev.db`, then
  run `npx prisma migrate dev` again.
- To switch to Postgres/MySQL instead of SQLite: change `provider` in
  `server/prisma/schema.prisma` to `"postgresql"` (or `"mysql"`), point
  `DATABASE_URL` in `server/.env` at your database, then run
  `npx prisma migrate dev` again.
