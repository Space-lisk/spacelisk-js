import { parseEther } from "ethers";
import { AA, encodeContractData } from "../dist/index"

async function main() {
    const pk = "0xprivate_key";
    const api_key = "T5hCVBfbxC6CbkcCzgHvTxfeD8AQ7e"

    const account = new AA(api_key, pk).account();

    const address = await account.getAddress();
    console.log("address:", address);

    const data = await account.sendUserOp({
        to: "0xc80B282Cc68BF8ee6f70fEc96d1D9f7ab5dc3b3c",
        value: parseEther("0.001")
    }, "0x596c1E3dE33C91c16ee96C7C3Ab7146b99f84717");

    console.log("hash:", data.hash);

    // const contractData = encodeContractData({
    //     address: "0x22441385da0f1c4bd08073b322303ae496fbb35c",
    //     functionName: "execute",
    //     abi: [],
    //     args: []
    // })

    // const data = await account.sendUserOpBatch(
    //     [
    //         {
    //             to: "0xc80B282Cc68BF8ee6f70fEc96d1D9f7ab5dc3b3c",
    //             value: parseEther("0.001"),
    //             data: "0x"
    //         },
    //         {
    //             to: "0xc80B282Cc68BF8ee6f70fEc96d1D9f7ab5dc3b3c",
    //             value: parseEther("0.001"),
    //             data: "0x"
    //         }
    //     ]
    // );

    // console.log("hash:", data.hash);

    // const receipt = await account.getReceipt("0xc5dde62f72990ee1afdeef095d9d0c57e468410e81498ca10ceb58cb31c61d37");
    // console.log(receipt)
}

main().catch((e) => {
    console.log("err: ", e);
    process.exit(1);
})

