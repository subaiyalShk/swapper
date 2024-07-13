## Client Side Rendring Architecture
### Root file AKA Layout.tsx

<img width="551" alt="Screenshot 2024-07-12 at 7 35 59 PM" src="https://github.com/user-attachments/assets/3b13decf-f631-4db5-a183-a6df7ee15652">

This is the root file and the top most component in our render tree. Here we mount all the required providers.
#### Web3 provider: communicates with external services and Global State. 
<img width="493" alt="Screenshot 2024-07-12 at 7 42 11 PM" src="https://github.com/user-attachments/assets/bf3060f3-df2b-4c9b-9c86-6839277dcca6">

#### Global State Provider: Stores data and CRUD operations that can be leveraged by child components throughout the render tree. We import Web3Provider hooks here. 
<img width="493" alt="Screenshot 2024-07-12 at 7 42 11 PM" src="https://github.com/user-attachments/assets/bf3060f3-df2b-4c9b-9c86-6839277dcca6">

###Theme provider: provides radix ui theme variables to the entire render tree. 







## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
