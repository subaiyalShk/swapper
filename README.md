## Client Side Rendring Architecture

### Root file AKA Layout.tsx

<img width="551" alt="Screenshot 2024-07-12 at 7 35 59 PM" src="https://github.com/user-attachments/assets/3b13decf-f631-4db5-a183-a6df7ee15652">

This is the root file and the top most component in our render tree. Here we mount all the required providers. These providers basically supply the entire app on the client side with data and communication with external sources. Often you can also choose to make api calls or store data locally or each component but in some cases you need to pass data to child nodes that are nested very deep in the render tree or move data from on sibling to another.

#### Web3 provider: communicates with external services and Global State. 
<img width="493" alt="Screenshot 2024-07-12 at 7 42 11 PM" src="https://github.com/user-attachments/assets/bf3060f3-df2b-4c9b-9c86-6839277dcca6">

here we are using a couple different libraries that takes care of the heavy lifting when it comes to the following:
- communication with external wallets -> ConnectKit (docs: https://docs.family.co/connectkit)
- Reading and Writing to blockchain -> Wagmi (docs: https://wagmi.sh/react/getting-started)
- Handeling Async communication -> TanStack (docs: https://tanstack.com/)

#### Global State Provider: Stores data and CRUD operations that can be leveraged by child components throughout the render tree. We import Web3Provider hooks here. 
<img width="492" alt="Screenshot 2024-07-12 at 8 06 23 PM" src="https://github.com/user-attachments/assets/cb7229a6-460c-4248-9295-b24f7d5d0f34">

We can neatly abstract and manage all datastorage CRUD operations from this file as it acts like a controller file which communicates with Web3 providers and also with the entire DOM tree. 
to add a new data of function follow these steps:
1. create a state hook or import a state hook from Web3 provider file
```
//example
// -------- User account variables ----------
  const {
    address: userAddress, 
    address, 
    chain, 
    chainId, 
    isConnected 
  } = useAccount();
```

2. create a type
```
//example
export interface AppContextType {
  chainId: any; 
  chain: any;
  userAddress: any;
  ensName: any;
  ensAvatar: any;
  accountBalance: any;
  isConnected: any;
  refetchNativeBalance: any;
}
```

3. set inital state
```
//example
export const AppContext = createContext({
    chainId: 0,
    chain: null,
    userAddress: '',
    ensName: '',
    ensAvatar: '',
    accountBalance: null,
    isConnected: false
} as AppContextType);
```

4. make the data available to the entire DOM tree
```
//example
  return (
    <AppContext.Provider value={{ 
        chainId, 
        chain,
        userAddress,
        ensName,
        ensAvatar,
        accountBalance,
        isConnected,
        refetchNativeBalance
    }}>
      {children}
    </AppContext.Provider>
  );
```
5. listen for data in the child components 
```
//example
import {AppContext} from '@/providers/globalStateProvider';

export default function SendEthModal() {
  // we trigger this function to get the updated balance after the transaction is confirmed
  const {refetchNativeBalance, accountBalance} = useContext(AppContext);
```

#### Theme Provider: provides radix-ui theme variables to the entire render tree. 
we will not go indepth on radix-ui as we are also using shadcn in our app and we might need to refactor since this is causing some styling conlficts.


### Page.tsx
<img width="483" alt="Screenshot 2024-07-12 at 8 18 00 PM" src="https://github.com/user-attachments/assets/5cb65b68-e015-46ff-a458-d4885a6157d3">

This component is the first child of Layout and it conditionally renders either the connectkit button or the dashboard.
state variable we access in this component are :
```
const {
    chainId, 
    chain,
    userAddress,
    ensName,
    ensAvatar,
    accountBalance,
    isConnected
  } = useContext(AppContext);
```
The dashboard is nothing but two siblings: networkcard and contractcard
- NetworkCard -> lets users read their native balance, their connected chain, address, ens, and lets them send native currency to another wallet.
<img width="744" alt="Screenshot 2024-07-12 at 8 43 59 PM" src="https://github.com/user-attachments/assets/7bac13b7-fd32-4180-936a-733c687a3b20">

- ContractCard -> lets users read balance associated to a smart contract, can see address of the smart contract and allows them to claim tokens. If a user has already claimed their tokens then the claim button is hidden and instead Send ERC20 button or Swap ERC 20 button is rendered. 
<img width="616" alt="Screenshot 2024-07-12 at 9 29 28 PM" src="https://github.com/user-attachments/assets/4945f433-c8de-4571-8bb2-a4e345eaa98d">


## Running App on Local Machine 

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
