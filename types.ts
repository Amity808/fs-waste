import {
  ProviderInfo,
  DataSetData,
  EnhancedDataSetInfo,
} from "@filoz/synapse-sdk";

export interface DataSet extends EnhancedDataSetInfo {
  data: DataSetData | null;
  provider: ProviderInfo | null;
}

export interface DatasetsResponse {
  datasets: DataSet[];
}

export interface UseBalancesResponse {
  filBalance: bigint;
  usdfcBalance: bigint;
  warmStorageBalance: bigint;
  filBalanceFormatted: number;
  usdfcBalanceFormatted: number;
  warmStorageBalanceFormatted: number;
  persistenceDaysLeft: number;
  persistenceDaysLeftAtCurrentRate: number;
  isSufficient: boolean;
  isRateSufficient: boolean;
  isLockupSufficient: boolean;
  rateNeeded: bigint;
  totalLockupNeeded: bigint;
  depositNeeded: bigint;
  currentRateAllowanceGB: number;
  currentStorageGB: number;
  currentLockupAllowance: bigint;
}

export const defaultBalances: UseBalancesResponse = {
  filBalance: 0n,
  usdfcBalance: 0n,
  warmStorageBalance: 0n,
  filBalanceFormatted: 0,
  usdfcBalanceFormatted: 0,
  warmStorageBalanceFormatted: 0,
  persistenceDaysLeft: 0,
  persistenceDaysLeftAtCurrentRate: 0,
  isSufficient: false,
  isRateSufficient: false,
  isLockupSufficient: false,
  rateNeeded: 0n,
  totalLockupNeeded: 0n,
  depositNeeded: 0n,
  currentRateAllowanceGB: 0,
  currentStorageGB: 0,
  currentLockupAllowance: 0n,
};

export interface WarmStorageBalance {
  rateAllowanceNeeded: bigint;
  lockupAllowanceNeeded: bigint;
  currentRateAllowance: bigint;
  currentLockupAllowance: bigint;
  currentRateUsed: bigint;
  currentLockupUsed: bigint;
  sufficient: boolean;
  message?: string;
  costs: {
    perEpoch: bigint;
    perDay: bigint;
    perMonth: bigint;
  };
  depositAmountNeeded: bigint;
}

export interface StorageCalculationResult {
  rateNeeded: bigint;
  rateUsed: bigint;
  currentStorageBytes: bigint;
  currentStorageGB: number;
  totalLockupNeeded: bigint;
  depositNeeded: bigint;
  persistenceDaysLeft: number;
  persistenceDaysLeftAtCurrentRate: number;
  isRateSufficient: boolean;
  isLockupSufficient: boolean;
  isSufficient: boolean;
  currentRateAllowanceGB: number;
  currentLockupAllowance: bigint;
}

export interface PaymentActionProps extends SectionProps {
  totalLockupNeeded?: bigint;
  currentLockupAllowance?: bigint;
  rateNeeded?: bigint;
  depositNeeded?: bigint;
  isProcessingPayment: boolean;
  onPayment: (params: {
    lockupAllowance: bigint;
    epochRateAllowance: bigint;
    depositAmount: bigint;
  }) => Promise<void>;
  handleRefetchBalances: () => Promise<void>;
}

export interface StatusMessageProps {
  status?: string;
}

export interface SectionProps {
  balances?: UseBalancesResponse;
  isLoading?: boolean;
}

export interface AllowanceItemProps {
  label: string;
  isSufficient?: boolean;
  isLoading?: boolean;
}

export interface StorageCosts {
  pricePerTiBPerMonthNoCDN: bigint;
  pricePerTiBPerMonthWithCDN: bigint;
}
