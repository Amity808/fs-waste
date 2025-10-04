import { Synapse, TIME_CONSTANTS, SIZE_CONSTANTS } from "@filoz/synapse-sdk";
import { config } from "@/config";
import { StorageCalculationResult } from "@/types";
import { calculateRateAllowanceGB } from "@/utils/storageCostUtils";
import {
  calculateCurrentStorageUsage,
  fetchWarmStorageCosts,
  fetchWarmStorageBalanceData,
} from "@/utils/warmStorageUtils";

export const calculateStorageMetrics = async (
  synapse: Synapse,
  persistencePeriodDays: number = config.persistencePeriod,
  storageCapacityBytes: number = config.storageCapacity *
    Number(SIZE_CONSTANTS.GiB),
  minDaysThreshold: number = config.minDaysThreshold
): Promise<StorageCalculationResult> => {
  const storageCosts = await fetchWarmStorageCosts(synapse);
  const warmStorageBalance = await fetchWarmStorageBalanceData(
    synapse,
    storageCapacityBytes,
    persistencePeriodDays
  );

  const rateNeeded = warmStorageBalance.costs.perEpoch;

  const lockupPerDay = TIME_CONSTANTS.EPOCHS_PER_DAY * rateNeeded;
  const lockupPerDayAtCurrentRate =
    TIME_CONSTANTS.EPOCHS_PER_DAY * warmStorageBalance.currentRateUsed;

  const currentLockupRemaining =
    warmStorageBalance.currentLockupAllowance -
    warmStorageBalance.currentLockupUsed;
  const persistenceDaysLeft =
    Number(currentLockupRemaining) / Number(lockupPerDay);
  const persistenceDaysLeftAtCurrentRate =
    lockupPerDayAtCurrentRate > 0n
      ? Number(currentLockupRemaining) / Number(lockupPerDayAtCurrentRate)
      : currentLockupRemaining > 0n
        ? Infinity
        : 0;

  const { currentStorageBytes, currentStorageGB } =
    calculateCurrentStorageUsage(warmStorageBalance, storageCapacityBytes);

  const isRateSufficient =
    warmStorageBalance.currentRateAllowance >= rateNeeded;
  const isLockupSufficient = persistenceDaysLeft >= minDaysThreshold;
  const isSufficient = isRateSufficient && isLockupSufficient;

  const currentRateAllowanceGB = calculateRateAllowanceGB(
    warmStorageBalance.currentRateAllowance,
    storageCosts
  );

  const depositNeeded = warmStorageBalance.depositAmountNeeded;
  const rateUsed = warmStorageBalance.currentRateUsed;
  const totalLockupNeeded = warmStorageBalance.lockupAllowanceNeeded;
  const currentLockupAllowance = warmStorageBalance.currentLockupAllowance;
  return {
  };
};
