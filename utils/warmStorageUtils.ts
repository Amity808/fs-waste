import { config } from "@/config";
import { WarmStorageBalance, StorageCosts } from "@/types";
import { DATA_SET_CREATION_FEE } from "@/utils/constants";
import {
  SIZE_CONSTANTS,
  Synapse,
  TIME_CONSTANTS,
  WarmStorageService,
} from "@filoz/synapse-sdk";

export const fetchWarmStorageCosts = async (
  synapse: Synapse
): Promise<StorageCosts> => {
  const warmStorageService = await WarmStorageService.create(
    synapse.getProvider(),
    synapse.getWarmStorageAddress()
  );
  return warmStorageService.getServicePrice();
};

export const fetchWarmStorageBalanceData = async (
  synapse: Synapse,
  storageCapacityBytes: number,
  persistencePeriodDays: number
): Promise<WarmStorageBalance> => {
  const warmStorageService = await WarmStorageService.create(
    synapse.getProvider(),
    synapse.getWarmStorageAddress()
  );
  return warmStorageService.checkAllowanceForStorage(
    storageCapacityBytes,
    config.withCDN,
    synapse.payments,
    persistencePeriodDays
  );
};

export const calculateCurrentStorageUsage = (
  warmStorageBalance: WarmStorageBalance,
  storageCapacityBytes: number
): { currentStorageBytes: bigint; currentStorageGB: number } => {
  let currentStorageBytes = 0n;
  let currentStorageGB = 0;

  if (
    warmStorageBalance.currentRateUsed > 0n &&
    warmStorageBalance.rateAllowanceNeeded > 0n
  ) {
    try {
      // Proportionally calculate storage usage based on rate used
      currentStorageBytes =
        (warmStorageBalance.currentRateUsed * BigInt(storageCapacityBytes)) /
        warmStorageBalance.rateAllowanceNeeded;
      // Convert bytes to GB
      currentStorageGB =
        Number(currentStorageBytes) / Number(SIZE_CONSTANTS.GiB);
      console.log("currentStorageGB", currentStorageGB);
    } catch (error) {
      console.warn("Failed to calculate current storage usage:", error);
    }
  }

  return { currentStorageBytes, currentStorageGB };
};

export const checkAllowances = async (
  warmStorageBalance: WarmStorageBalance,
  minDaysThreshold: number,
  includeDataSetCreationFee: boolean
) => {
  // Validate warmStorageBalance properties
  if (!warmStorageBalance ||
    typeof warmStorageBalance.costs?.perEpoch !== 'bigint' ||
    typeof warmStorageBalance.currentLockupAllowance !== 'bigint' ||
    typeof warmStorageBalance.currentLockupUsed !== 'bigint' ||
    typeof warmStorageBalance.lockupAllowanceNeeded !== 'bigint' ||
    typeof warmStorageBalance.depositAmountNeeded !== 'bigint' ||
    typeof warmStorageBalance.currentRateAllowance !== 'bigint' ||
    typeof warmStorageBalance.rateAllowanceNeeded !== 'bigint') {
    throw new Error('Invalid warmStorageBalance: missing required BigInt properties');
  }

  // Calculate the rate needed per epoch
  const rateNeeded = warmStorageBalance.costs.perEpoch;

  // Calculate daily lockup requirements
  const lockupPerDay = TIME_CONSTANTS.EPOCHS_PER_DAY * rateNeeded;

  // Calculate remaining lockup and persistence days
  const currentLockupRemaining =
    warmStorageBalance.currentLockupAllowance -
    warmStorageBalance.currentLockupUsed;

  const dataSetCreationFee = includeDataSetCreationFee
    ? DATA_SET_CREATION_FEE
    : BigInt(0);

  // Use available properties for lockup and deposit
  const totalLockupNeeded = warmStorageBalance.lockupAllowanceNeeded;
  const depositNeeded = warmStorageBalance.depositAmountNeeded;

  const rateAllowanceNeeded =
    warmStorageBalance.currentRateAllowance >
      warmStorageBalance.rateAllowanceNeeded
      ? warmStorageBalance.currentRateAllowance
      : warmStorageBalance.rateAllowanceNeeded;

  // Add dataset creation fee to lockup and deposit if needed
  const lockupAllowanceNeeded = totalLockupNeeded + dataSetCreationFee;
  const depositAmountNeeded = depositNeeded + dataSetCreationFee;

  // Check if lockup balance is sufficient for dataset creation
  const isLockupBalanceSufficientForDataSetCreation =
    currentLockupRemaining >= lockupAllowanceNeeded;

  // Calculate how many days of persistence are left
  const persistenceDaysLeft =
    Number(currentLockupRemaining) / Number(lockupPerDay);

  // Determine sufficiency of allowances
  const isRateSufficient =
    warmStorageBalance.currentRateAllowance >= rateAllowanceNeeded;
  // Lockup is sufficient if enough days remain and enough for dataset creation
  const isLockupSufficient =
    persistenceDaysLeft >= Number(minDaysThreshold) &&
    isLockupBalanceSufficientForDataSetCreation;
  // Both must be sufficient
  const isSufficient = isRateSufficient && isLockupSufficient;

  // Return detailed sufficiency and allowance info
  return {
    isSufficient, // true if both rate and lockup are sufficient
    isLockupSufficient, // true if lockup is sufficient
    isRateSufficient, // true if rate is sufficient
    rateAllowanceNeeded, // rate allowance required
    lockupAllowanceNeeded, // lockup allowance required
    depositAmountNeeded, // deposit required
    currentLockupRemaining, // current lockup remaining
    lockupPerDay, // lockup needed per day
    persistenceDaysLeft, // days of persistence left
  };
};
