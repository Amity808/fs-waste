import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState } from 'react';
import { WasteInsuredABI } from '../utils/WasteInsuredABI';

// Contract address - deployed on Filecoin Calibration testnet
const WASTE_CONTRACT_ADDRESS = '0xaE31760921F58e37C79aCbBB0f4D06fe3E47907b';

export const useWasteContract = () => {
    const { address, isConnected } = useAccount();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { writeContractAsync } = useWriteContract();

    // Read contract data
    const { data: wasteCounter } = useReadContract({
        address: WASTE_CONTRACT_ADDRESS as `0x${string}`,
        abi: WasteInsuredABI,
        functionName: 'getWasteLength',
    });

    const { data: hospitalCounter } = useReadContract({
        address: WASTE_CONTRACT_ADDRESS as `0x${string}`,
        abi: WasteInsuredABI,
        functionName: 'getHospitalCount',
    });

    const recordWasteData = async (wasteData: {
        ipfsHash: string;
        weight: number;
        wasteAmount: number;
        hospitalAddress: string;
    }) => {
        if (!isConnected || !address) {
            throw new Error('Please connect your wallet');
        }

        setIsLoading(true);
        setError(null);

        try {
            const hash = await writeContractAsync({
                address: WASTE_CONTRACT_ADDRESS as `0x${string}`,
                abi: WasteInsuredABI,
                functionName: 'recordWaste',
                args: [
                    wasteData.ipfsHash,
                    BigInt(wasteData.weight),
                    BigInt(wasteData.wasteAmount),
                    wasteData.hospitalAddress as `0x${string}`,
                ],
            });

            return { hash };
        } catch (err: any) {
            setError(err.message || 'Failed to record waste');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const validateWasteRecord = async (wasteId: number) => {
        if (!isConnected || !address) {
            throw new Error('Please connect your wallet');
        }

        setIsLoading(true);
        setError(null);

        try {
            const hash = await writeContractAsync({
                address: WASTE_CONTRACT_ADDRESS as `0x${string}`,
                abi: WasteInsuredABI,
                functionName: 'validateWaste',
                args: [BigInt(wasteId)],
            });

            return { hash };
        } catch (err: any) {
            setError(err.message || 'Failed to validate waste');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const processPayment = async (wasteId: number, tokenAddress: string) => {
        if (!isConnected || !address) {
            throw new Error('Please connect your wallet');
        }

        setIsLoading(true);
        setError(null);

        try {
            const hash = await writeContractAsync({
                address: WASTE_CONTRACT_ADDRESS as `0x${string}`,
                abi: WasteInsuredABI,
                functionName: 'wastePayment',
                args: [BigInt(wasteId), tokenAddress as `0x${string}`],
            });

            return { hash };
        } catch (err: any) {
            setError(err.message || 'Failed to process payment');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const getWasteInfo = (wasteId: number) => {
        return useReadContract({
            address: WASTE_CONTRACT_ADDRESS as `0x${string}`,
            abi: WasteInsuredABI,
            functionName: 'getWasteInfo',
            args: [BigInt(wasteId)],
        });
    };

    return {
        isConnected,
        address,
        isLoading,
        error,
        wasteCounter: wasteCounter ? Number(wasteCounter) : 0,
        hospitalCounter: hospitalCounter ? Number(hospitalCounter) : 0,
        recordWasteData,
        validateWasteRecord,
        processPayment,
        getWasteInfo,
    };
};
