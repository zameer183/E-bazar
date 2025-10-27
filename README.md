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

Run the development server after installing dependencies:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
