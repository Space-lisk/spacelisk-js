import { parseEther } from "ethers";
import { AA, encodeContractData } from "../src/index"

async function main() {
    const pk = "0xPrivatekey";
    const api_key = "abcd1234"

    const account = new AA(api_key, pk).account();

    const address = await account.getAddress();
    console.log("address:", address);    
}

main().catch((e) => {
    console.log("err: ", e);
    process.exit(1);
})

