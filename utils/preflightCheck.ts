import { checkAllowances } from "./warmStorageUtils";
import { config } from "@/config";
import { Synapse, TIME_CONSTANTS } from "@filoz/synapse-sdk";
import { WarmStorageService } from "@filoz/synapse-sdk/warm-storage";
import { ethers } from "ethers";

export const preflightCheck = async (
  file: File,
  synapse: Synapse,
  includeDataSetCreationFee: boolean,
  updateStatus: (status: string) => void,
  updateProgress: (progress: number) => void
) => {
  const warmStorageService = await WarmStorageService.create(
    synapse.getProvider(),
    synapse.getWarmStorageAddress()
  );

  const warmStorageBalance = await warmStorageService.checkAllowanceForStorage(
    file.size,
    config.withCDN,
    synapse.payments,
    config.persistencePeriod
  );

  // Validate warmStorageBalance properties
  if (!warmStorageBalance || typeof warmStorageBalance.costs?.perEpoch !== 'bigint') {
    throw new Error('Invalid warm storage balance data received');
  }

  const {
    isSufficient,
    rateAllowanceNeeded,
    lockupAllowanceNeeded,
    depositAmountNeeded,
  } = await checkAllowances(
    warmStorageBalance,
    config.minDaysThreshold,
    includeDataSetCreationFee
  );

  // Validate returned values
  if (typeof rateAllowanceNeeded !== 'bigint' || typeof lockupAllowanceNeeded !== 'bigint' || typeof depositAmountNeeded !== 'bigint') {
    throw new Error('Invalid allowance values received from checkAllowances');
  }

  if (!isSufficient) {
    updateStatus("💰 Insufficient USDFC allowance...");

    updateStatus("💰 Depositing USDFC to cover storage costs...");
    const depositTx = await synapse.payments.deposit(
      depositAmountNeeded,
      "USDFC",
      {
        onDepositStarting: () => updateStatus("💰 Depositing USDFC..."),
        onAllowanceCheck: (current: bigint, required: bigint) =>
          updateStatus(
            `💰 Allowance check ${current > required ? "sufficient" : "insufficient"
            }`
          ),
        onApprovalTransaction: async (tx: ethers.TransactionResponse) => {
          updateStatus(`💰 Approving USDFC... ${tx.hash}`);
          const receipt = await tx.wait();
          updateStatus(`💰 USDFC approved ${receipt?.hash}`);
        },
      }
    );
    await depositTx.wait();
    updateStatus("💰 USDFC deposited successfully");
    updateProgress(10);

    updateStatus(
      "💰 Approving Filecoin Warm Storage service USDFC spending rates..."
    );
    const approvalTx = await synapse.payments.approveService(
      synapse.getWarmStorageAddress(),
      rateAllowanceNeeded,
      lockupAllowanceNeeded,
      TIME_CONSTANTS.EPOCHS_PER_DAY * BigInt(config.persistencePeriod)
    );
    await approvalTx.wait();
    updateStatus("💰 Filecoin Warm Storage service approved to spend USDFC");
    updateProgress(20);
  }
};
