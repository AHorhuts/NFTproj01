/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  VRFConsumerBaseV2,
  VRFConsumerBaseV2Interface,
} from "../../../../../@chainlink/contracts/src/v0.8/VRFConsumerBaseV2";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "have",
        type: "address",
      },
      {
        internalType: "address",
        name: "want",
        type: "address",
      },
    ],
    name: "OnlyCoordinatorCanFulfill",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "randomWords",
        type: "uint256[]",
      },
    ],
    name: "rawFulfillRandomWords",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class VRFConsumerBaseV2__factory {
  static readonly abi = _abi;
  static createInterface(): VRFConsumerBaseV2Interface {
    return new utils.Interface(_abi) as VRFConsumerBaseV2Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): VRFConsumerBaseV2 {
    return new Contract(address, _abi, signerOrProvider) as VRFConsumerBaseV2;
  }
}
