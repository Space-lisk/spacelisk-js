<h1>Space Lisk JS</h1>

Spacelisk-js is a simple javascript library for interfacing with ERC-4337 Smart Account and Paymaster on the lisk chain. it uses spacelisk rpc enpoint by default.

<h2>Table of content</h2>

- [Installation](#installation)
- [Usage](#usage)
- [Send user operation](#send-user-operation)
- [Send a user operation ( Smart Contract )](#send-a-user-operation--smart-contract-)
- [UserOp Receipt](#userop-receipt)

## Installation

```bash
npm i spacelisk-js
```

##  Usage

```typescript
import { AA } from "spacelisk-js"

const pk = "0xprivate_key";
const api_key = "abcd1234";

const account = new AA(api_key, pk).account();

const address = await account.getAddress();
console.log("address:", address);
```

The address gotten is calculated by a default salt "0". if you want to generate more addresses you will simply need to set a salt. The account() function accepts an optional.

```typescript
const account = new AA(api_key, pk).account("1"); // passed 1 as salt
```

## Send user operation

Sending a user operation. This is a simple user operation that sends 0.001 ETH to 0xc80B282Cc68BF8ee6f70fEc96d1D9f7ab5dc3b3c. Here the user is responsibe for paying for transaction gas.

```ts
import { AA } from "spacelisk-js"

const pk = "0xprivate_key";
const api_key = "abcd1234";

const account = new AA(api_key, pk).account();

const data = await account.sendUserOp({
    to: "0xc80B282Cc68BF8ee6f70fEc96d1D9f7ab5dc3b3c",
    value: parseEther("0.001")
});

console.log("hash:", data.hash)
```

If you want to would like to use a paymaster, you can pass the paymaster address as a second argument to sendUserOp.

```ts
const data = await account.sendUserOp(
    {
     to: "0xc80B282Cc68BF8ee6f70fEc96d1D9f7ab5dc3b3c",
     value: parseEther("0.001")
    },
    "0x596c1E3dE33C91c16ee96C7C3Ab7146b99f84717" // Paymaster address
);

console.log("hash:", data.hash)
```

## Send a user operation ( Smart Contract )

spacelisk-js ships with a helper function that builds a transaction by encoding the function data.

```ts
import { AA, encodeContractData } from "spacelisk-js"

const pk = "0xprivate_key";
const api_key = "abcd1234";

const account = new AA(api_key, pk).account();

const contractData = encodeContractData({
        address: "0x22441385da0f1c4bd08073b322303ae496fbb35c",
        functionName: "transfer",
        abi: ContractABI,
        args: [
                "0xc80B282Cc68BF8ee6f70fEc96d1D9f7ab5dc3b3c", 
                parseEther("0.001")
        ]
 })

const data = await account.sendUserOp(contractData);

console.log("hash:", data.hash)
```

If you want to would like to use a paymaster, you can pass the paymaster address as a second argument to sendUserOp.

```ts
const data = await account.sendUserOp(
    contractData,
    "0x596c1E3dE33C91c16ee96C7C3Ab7146b99f84717" // Paymaster address
);

console.log("hash:", data.hash)
```

## UserOp Receipt

Easily fetch the user operation receipt (including the transaction receipt) with the below endpoint.

```ts
import { AA } from "spacelisk-js"

const pk = "0xprivate_key";
const api_key = "abcd1234";

const account = new AA(api_key, pk).account();

const receipt = await account.getReceipt(
 "0xc5dde62f72990ee1afdeef095d9d0c57e468410e81498ca10ceb58cb31c61d37" //hash
);
console.log("Receipt:", receipt);
```