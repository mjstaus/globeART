import { ethers } from "ethers";
import loadContracts from "./loadContracts";
import { Error, Marker } from "../interfaces";
import errorMap from "./errorMap";

export default async function buyShopItem(item: Marker) {
  let receipt = null;

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const price = ethers.utils.parseEther(item.price);

    const contracts = await loadContracts();
    const shop = contracts.shop;
    const purchaseTx = await shop.purchaseItem(item.itemId, {
      value: price,
    });

    const tx = await provider.waitForTransaction(purchaseTx.hash);

    while (receipt === null) {
      receipt = await provider.getTransactionReceipt(tx.transactionHash);

      if (receipt === null) {
        continue;
      }
    }
  } catch (error: Error | any) {
    return errorMap[error.code as keyof typeof errorMap] ?? error;
  }

  return receipt;
}
