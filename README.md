This project now stores media assets in Amazon S3. Configure the following environment variables in your `.env.local` (and hosting provider variables) before running the app:

```
AWS_REGION=your-aws-region
AWS_S3_BUCKET=your-bucket-name
# Optional – required when not using an IAM role:
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
# Optional – set a CloudFront or custom domain for public URLs:
AWS_S3_PUBLIC_URL=https://cdn.example.com
# Optional – override ACL or cache behaviour:
# AWS_S3_ACL=public-read
# AWS_S3_CACHE_CONTROL=public, max-age=31536000, immutable
```

> Tip: when deploying to AWS (e.g. on Lambda/Vercel with IAM roles) you can omit the access key and secret. The SDK will use the execution role automatically.

Firebase powers seller authentication, Firestore storage, and Storage fallbacks. Add the following public keys (for client-side SDK usage) to `.env.local` as well:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
# Optional if Analytics is enabled:
# NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXX
```

### Payments & Courier Integrations

Activate checkout flows for EasyPaisa, JazzCash, and Stripe alongside courier quotes for TCS, Leopards, and M&P by supplying the following secrets:

```
# Stripe Checkout (required for Stripe payments)
STRIPE_SECRET_KEY=sk_live_xxx
# Optional: override post-checkout redirects
# STRIPE_SUCCESS_URL=https://your-app.com/payment/success
# STRIPE_CANCEL_URL=https://your-app.com/payment/cancel

# EasyPaisa
EASYPAISA_API_URL=https://easypaisa.example.com/api
EASYPAISA_USERNAME=merchant-username
EASYPAISA_PASSWORD=merchant-password

# JazzCash
JAZZCASH_API_URL=https://jazzcash.example.com/api
JAZZCASH_MERCHANT_ID=your-merchant-id
JAZZCASH_PASSWORD=merchant-password
# Optional: use if JazzCash issues an API key
# JAZZCASH_API_KEY=your-api-key

# Courier Quotes
TCS_API_URL=https://tcs.example.com/api
TCS_API_KEY=your-api-key
LEOPARDS_API_URL=https://leopards.example.com/api
LEOPARDS_API_KEY=your-api-key
MNP_API_URL=https://mnpcourier.example.com/api
MNP_API_KEY=your-api-key
```

Each endpoint is expected to accept JSON payloads for quick configuration during onboarding. Replace the sample URLs with the production endpoints provided by your account managers.

> The sample data bundled with the app uses Firestore collections `shops`, `shopImages`, `shopVideos`, `productImages`, `productReviews`, and `sellerReviews`. Apply the security rules in `firestore.rules` and deploy the indexes from `FIREBASE_INDEXES.md` before going live.

### Bilingual Interface

The interface ships with an English ↔ Urdu toggle available from the main navigation bar. Text strings that power the core buyer and seller journeys are translated via `src/lib/i18n.js`; extend the dictionaries whenever you add new UI copy.

### Styling & Theming

Tailwind CSS drives the visual system. The configuration in `tailwind.config.mjs` extends the palette with E-Bazar brand colors, gradient helpers, bespoke shadows, and Urdu/English font families (Poppins + Noto Nastaliq). Always run `npm install` after pulling to ensure `tailwindcss`, `postcss`, and `autoprefixer` are available, then use the existing `npm run dev` script—Next.js will compile Tailwind automatically. Dark mode is enabled via the standard `class="dark"` strategy if you want to preview the optional midnight theme.

Run the development server after installing dependencies:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Sample data

The marketplace ships with a curated set of seeded cities and verified sellers so the home page, city bazaars, and top-rated sections render meaningful content on first load. All imagery references the existing files in `public/images/`; replace these assets with your own photography when you launch in production.

### Deployment

- Vercel configuration is provided in `vercel.json` with placeholders for Firebase/AWS secrets.
- Use the detailed checklist in `VERCEL_DEPLOYMENT.md` to add environment variables and deploy.
