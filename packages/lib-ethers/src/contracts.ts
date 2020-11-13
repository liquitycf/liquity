import { JsonFragment, LogDescription, Result } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
import { Signer } from "@ethersproject/abstract-signer";
import { Provider, Log } from "@ethersproject/abstract-provider";
import { Contract, ContractInterface } from "@ethersproject/contracts";

import activePoolAbi from "../abi/ActivePool.json";
import borrowerOperationsAbi from "../abi/BorrowerOperations.json";
import cdpManagerAbi from "../abi/CDPManager.json";
import clvTokenAbi from "../abi/CLVToken.json";
import defaultPoolAbi from "../abi/DefaultPool.json";
import hintHelpersAbi from "../abi/HintHelpers.json";
import multiCDPgetterAbi from "../abi/MultiCDPGetter.json";
import poolManagerAbi from "../abi/PoolManager.json";
import priceFeedAbi from "../abi/PriceFeed.json";
import sortedCDPsAbi from "../abi/SortedCDPs.json";
import stabilityPoolAbi from "../abi/StabilityPool.json";
import lqtyStakingAbi from "../abi/LQTYStaking.json";
import communityIssuanceAbi from "../abi/CommunityIssuance.json";

import dev from "../deployments/dev.json";
import goerli from "../deployments/goerli.json";
import kovan from "../deployments/kovan.json";
import rinkeby from "../deployments/rinkeby.json";
import ropsten from "../deployments/ropsten.json";

import {
  ActivePool,
  BorrowerOperations,
  CDPManager,
  CLVToken,
  DefaultPool,
  HintHelpers,
  MultiCDPGetter,
  PoolManager,
  PriceFeed,
  SortedCDPs,
  StabilityPool,
  LQTYStaking,
  CommunityIssuance
} from "../types";

export const abi: { [name: string]: JsonFragment[] } = {
  activePool: activePoolAbi,
  borrowerOperations: borrowerOperationsAbi,
  cdpManager: cdpManagerAbi,
  clvToken: clvTokenAbi,
  defaultPool: defaultPoolAbi,
  hintHelpers: hintHelpersAbi,
  multiCDPgetter: multiCDPgetterAbi,
  poolManager: poolManagerAbi,
  priceFeed: priceFeedAbi,
  sortedCDPs: sortedCDPsAbi,
  stabilityPool: stabilityPoolAbi,
  lqtyStaking: lqtyStakingAbi,
  communityIssuance: communityIssuanceAbi
};

export interface TypedLogDescription<T> extends LogDescription {
  args: Result & T;
}

type BucketOfFunctions = {
  [name: string]: (...args: Array<any>) => any;
};

// Removes unsafe index signatures from an Ethers contract type
type TypeSafeContract<T> = Pick<
  T,
  {
    [P in keyof T]: BucketOfFunctions extends T[P] ? never : P;
  } extends {
    [_ in keyof T]: infer U;
  }
    ? U
    : never
>;

export type TypedContract<T, U> = TypeSafeContract<T> &
  U & {
    estimateGas: {
      [P in keyof U]: (
        ...args: U[P] extends (...args: infer A) => unknown ? A : never
      ) => Promise<BigNumber>;
    };
  };

export class LiquityContract extends Contract {
  extractEvents(logs: Log[], name: string) {
    return logs
      .filter(log => log.address === this.address)
      .map(log => this.interface.parseLog(log))
      .filter(e => e.name === name);
  }
}

export interface LiquityContractAddresses {
  activePool: string;
  borrowerOperations: string;
  cdpManager: string;
  clvToken: string;
  defaultPool: string;
  hintHelpers: string;
  multiCDPgetter: string;
  poolManager: string;
  priceFeed: string;
  sortedCDPs: string;
  stabilityPool: string;
  lqtyStaking: string;
  communityIssuance: string;
}

export interface LiquityContracts {
  [name: string]: TypeSafeContract<LiquityContract>;

  activePool: ActivePool;
  borrowerOperations: BorrowerOperations;
  cdpManager: CDPManager;
  clvToken: CLVToken;
  defaultPool: DefaultPool;
  hintHelpers: HintHelpers;
  multiCDPgetter: MultiCDPGetter;
  poolManager: PoolManager;
  priceFeed: PriceFeed;
  sortedCDPs: SortedCDPs;
  stabilityPool: StabilityPool;
  lqtyStaking: LQTYStaking;
  communityIssuance: CommunityIssuance;
}

export const addressesOf = (contracts: LiquityContracts): LiquityContractAddresses => ({
  activePool: contracts.activePool.address,
  borrowerOperations: contracts.borrowerOperations.address,
  cdpManager: contracts.cdpManager.address,
  clvToken: contracts.clvToken.address,
  defaultPool: contracts.defaultPool.address,
  hintHelpers: contracts.hintHelpers.address,
  multiCDPgetter: contracts.multiCDPgetter.address,
  poolManager: contracts.poolManager.address,
  priceFeed: contracts.priceFeed.address,
  sortedCDPs: contracts.sortedCDPs.address,
  stabilityPool: contracts.stabilityPool.address,
  lqtyStaking: contracts.lqtyStaking.address,
  communityIssuance: contracts.communityIssuance.address
});

const create = <T extends TypedContract<LiquityContract, unknown>>(
  address: string,
  contractInterface: ContractInterface,
  signerOrProvider: Signer | Provider
) => (new LiquityContract(address, contractInterface, signerOrProvider) as unknown) as T;

export const connectToContracts = (
  addresses: LiquityContractAddresses,
  signerOrProvider: Signer | Provider
): LiquityContracts => ({
  activePool: create<ActivePool>(addresses.activePool, activePoolAbi, signerOrProvider),

  borrowerOperations: create<BorrowerOperations>(
    addresses.borrowerOperations,
    borrowerOperationsAbi,
    signerOrProvider
  ),

  cdpManager: create<CDPManager>(addresses.cdpManager, cdpManagerAbi, signerOrProvider),

  clvToken: create<CLVToken>(addresses.clvToken, clvTokenAbi, signerOrProvider),

  defaultPool: create<DefaultPool>(addresses.defaultPool, defaultPoolAbi, signerOrProvider),

  hintHelpers: create<HintHelpers>(addresses.hintHelpers, hintHelpersAbi, signerOrProvider),

  multiCDPgetter: create<MultiCDPGetter>(
    addresses.multiCDPgetter,
    multiCDPgetterAbi,
    signerOrProvider
  ),

  poolManager: create<PoolManager>(addresses.poolManager, poolManagerAbi, signerOrProvider),

  priceFeed: create<PriceFeed>(addresses.priceFeed, priceFeedAbi, signerOrProvider),

  sortedCDPs: create<SortedCDPs>(addresses.sortedCDPs, sortedCDPsAbi, signerOrProvider),

  stabilityPool: create<StabilityPool>(addresses.stabilityPool, stabilityPoolAbi, signerOrProvider),
  lqtyStaking: create<LQTYStaking>(addresses.lqtyStaking, lqtyStakingAbi, signerOrProvider),
  communityIssuance: create<CommunityIssuance>(addresses.communityIssuance, communityIssuanceAbi, signerOrProvider)
});

export type LiquityDeployment = {
  addresses: LiquityContractAddresses;
  version: string;
  deploymentDate: number;
  abiHash: string;
};

export const DEV_CHAIN_ID = 17;

type DevDeployment = {
  dev: LiquityDeployment;
  [DEV_CHAIN_ID]: LiquityDeployment;
};

const devDeployment: DevDeployment | {} =
  dev !== null
    ? {
        dev,
        [DEV_CHAIN_ID]: dev
      }
    : {};

export const deploymentOnNetwork: {
  [network: string]: LiquityDeployment;
  [chainId: number]: LiquityDeployment;
} = {
  goerli,
  kovan,
  rinkeby,
  ropsten,

  3: ropsten,
  4: rinkeby,
  5: goerli,
  42: kovan,

  ...devDeployment
};