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

> The sample data bundled with the app uses Firestore collections `shops`, `shopImages`, `shopVideos`, `productImages`, `productReviews`, and `sellerReviews`. Apply the security rules in `firestore.rules` and deploy the indexes from `FIREBASE_INDEXES.md` before going live.

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
