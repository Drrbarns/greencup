# Green Cup

Public storefront for Green Cup (Shapes Pro Ltd) — FDA-registered Ghanaian teas and botanical infusions.

Live domain: [https://greencup4u.com](https://greencup4u.com)

WhatsApp shop / inbox: [https://ai.greencup4u.com](https://ai.greencup4u.com)  
Staff dashboard (AI app): [https://admin.greencup4u.com](https://admin.greencup4u.com)

Storefront design matches Upscale Vintage; branding, copy, and catalogue are Green Cup.

## Local

```bash
npm install
cp .env.example .env.local
npm run db:migrate
npm run create-admin -- admin@greencup.local 'your-password'
npm run dev
```

## Deploy

Coolify on big-vps, app `greencup-web`. Migrations: `npm run db:migrate` against `DATABASE_URL`.
