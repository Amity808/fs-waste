import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { readContract } from '@wagmi/core';
import { filecoinCalibration } from 'wagmi/chains';
import { http, createConfig } from '@wagmi/core';
import { useState } from 'react';
// import { WasteInsuredABI } from '../utils/WasteInsuredABI';
import toast from 'react-hot-toast';
import WasteInsuredABI from '../utils/abi.json';

// Contract address - deployed on Filecoin Calibration testnet
const WASTE_CONTRACT_ADDRESS = '0xE577E8E2283c847fBFe08A09f84Ae65dFBAA218F';

// Create wagmi config for readContract
const config = createConfig({
    chains: [filecoinCalibration],
    connectors: [],
    transports: {
        [filecoinCalibration.id]: http(),
    },
});

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

    const assignProducer = async () => {
        if (!isConnected || !address) {
            throw new Error('Please connect your wallet');
        }

        setIsLoading(true);
        setError(null);

        try {
            const hash = await writeContractAsync({
                address: WASTE_CONTRACT_ADDRESS as `0x${string}`,
                abi: WasteInsuredABI,
                functionName: 'assignProducer',
                args: [address as `0x${string}`],
            });

            return { hash };
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to assign producer';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

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
            // First, try to assign the user as a producer
            try {
                await assignProducer();
            } catch (assignError) {
                console.log('Producer assignment failed or already assigned:', assignError);
                // Continue anyway, as the user might already be assigned
            }

            // Convert waste amount to wei (multiply by 10^18)
            const wasteAmountWei = BigInt(Math.floor(wasteData.wasteAmount * 1e18));

            const hash = await writeContractAsync({
                address: WASTE_CONTRACT_ADDRESS as `0x${string}`,
                abi: WasteInsuredABI,
                functionName: 'recordWaste',
                args: [
                    wasteData.ipfsHash,
                    BigInt(Math.floor(wasteData.weight)),
                    wasteAmountWei,
                    wasteData.hospitalAddress as `0x${string}`,
                ],
            });

            return { hash };
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to record waste';
            setError(errorMessage);
            toast.error(errorMessage);
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
            const errorMessage = err.message || 'Failed to validate waste';
            setError(errorMessage);
            toast.error(errorMessage);
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
            const errorMessage = err.message || 'Failed to process payment';
            setError(errorMessage);
            toast.error(errorMessage);
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

    const getAllWasteRecords = async () => {
        if (!isConnected || !address) {
            throw new Error('Please connect your wallet');
        }

        try {
            const records = [];
            const totalRecords = Number(wasteCounter) || 0;

            for (let i = 0; i < totalRecords; i++) {
                try {
                    const wasteInfo = await readContract(config, {
                        address: WASTE_CONTRACT_ADDRESS as `0x${string}`,
                        abi: WasteInsuredABI,
                        functionName: 'getWasteInfo',
                        args: [BigInt(i)],
                    });

                    if (wasteInfo && Array.isArray(wasteInfo) && wasteInfo.length >= 10) {
                        const wasteData = wasteInfo as any[];
                        records.push({
                            id: i,
                            wasteAdmin: wasteData[0],
                            producer: wasteData[1],
                            ipfsHash: wasteData[2],
                            weight: Number(wasteData[3]),
                            wasteAmount: Number(wasteData[4]) / 1e18, // Convert from wei
                            hospitalAddress: wasteData[5],
                            timestamp: Number(wasteData[6]) * 1000, // Convert to milliseconds
                            isRecorded: wasteData[7],
                            isValidated: wasteData[8],
                            isPaid: wasteData[9],
                            // These will be filled from IPFS data
                            depositor: 'Loading...',
                            wasteType: 'Loading...',
                            collectionLocation: 'Loading...'
                        });
                    }
                } catch (err) {
                    console.warn(`Failed to fetch waste record ${i}:`, err);
                }
            }

            return records;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch waste records';
            setError(errorMessage);
            throw err;
        }
    };

    return {
        isConnected,
        address,
        isLoading,
        error,
        wasteCounter: wasteCounter ? Number(wasteCounter) : 0,
        hospitalCounter: hospitalCounter ? Number(hospitalCounter) : 0,
        assignProducer,
        recordWasteData,
        validateWasteRecord,
        processPayment,
        getWasteInfo,
        getAllWasteRecords,
    };
};
