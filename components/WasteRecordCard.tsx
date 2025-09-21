'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { useWasteContract } from '@/hooks/useWasteContract';
import { WasteDataViewer } from './WasteDataViewer';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import WasteInsuredABI from '@/utils/abi.json';

// Contract address - deployed on Filecoin Calibration testnet
const WASTE_CONTRACT_ADDRESS = '0xE577E8E2283c847fBFe08A09f84Ae65dFBAA218F';

interface WasteRecordData {
    wasteAdmin: string;
    producer: string;
    ipfsHash: string;
    weight: number;
    wasteAmount: number;
    hospitalAddress: string;
    timestamp: number;
    isRecorded: boolean;
    isValidated: boolean;
    isPaid: boolean;
}

interface WasteRecordCardProps {
    id: string;
    searchQuery: string;
}

export function WasteRecordCard({ id, searchQuery }: WasteRecordCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [wasteRecord, setWasteRecord] = useState<WasteRecordData | null>(null);
    const [showFilecoinData, setShowFilecoinData] = useState(false);
    const [selectedIpfsHash, setSelectedIpfsHash] = useState<string>('');
    const [selectedWasteId, setSelectedWasteId] = useState<number | undefined>(undefined);

    const { validateWasteRecord, processPayment } = useWasteContract();

    // Fetch individual waste record from blockchain
    const { data: wasteInfo } = useReadContract({
        address: WASTE_CONTRACT_ADDRESS as `0x${string}`,
        abi: WasteInsuredABI,
        functionName: 'getWasteInfo',
        args: [BigInt(id)],
    });

    // Format the waste record data
    const formatWasteRecord = useCallback(async () => {
        if (!wasteInfo || !Array.isArray(wasteInfo)) {
            console.error("wasteInfo is empty or invalid:", wasteInfo);
            return;
        }

        const wasteData = wasteInfo as any[];
        if (wasteData.length >= 10) {
            setWasteRecord({
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
            });
        }
    }, [wasteInfo]);

    useEffect(() => {
        formatWasteRecord();
    }, [formatWasteRecord]);

    const handleValidate = async () => {
        try {
            setIsLoading(true);
            const result = await validateWasteRecord(Number(id));
            toast.success('Waste record validated successfully!');
            console.log('Validation transaction hash:', result.hash);
        } catch (error: any) {
            console.error('Error validating waste:', error);
            toast.error(`Failed to validate waste record: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayment = async () => {
        try {
            setIsLoading(true);
            const tokenAddress = '0x0000000000000000000000000000000000000000'; // Replace with actual token address
            const result = await processPayment(Number(id), tokenAddress);
            toast.success('Payment processed successfully!');
            console.log('Payment transaction hash:', result.hash);
        } catch (error: any) {
            console.error('Error processing payment:', error);
            toast.error(`Failed to process payment: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewFilecoinData = () => {
        if (wasteRecord?.ipfsHash && wasteRecord.ipfsHash !== 'Loading...') {
            setSelectedIpfsHash(wasteRecord.ipfsHash);
            setSelectedWasteId(Number(id));
            setShowFilecoinData(true);
        } else {
            toast.error('IPFS hash not available for this record');
        }
    };

    // Filter based on search query (you can expand this logic)
    if (
        searchQuery !== "" &&
        !wasteRecord?.ipfsHash?.toLowerCase().includes(searchQuery.toLowerCase().trim())
    ) {
        return null;
    }

    if (!wasteRecord) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
        );
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Waste Record #{id}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {new Date(wasteRecord.timestamp).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${wasteRecord.isValidated
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {wasteRecord.isValidated ? 'Validated' : 'Pending'}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${wasteRecord.isPaid
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                {wasteRecord.isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Weight:</span>
                            <span className="text-sm font-medium">{wasteRecord.weight} kg</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Amount:</span>
                            <span className="text-sm font-medium">{wasteRecord.wasteAmount.toFixed(2)} FIL</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Producer:</span>
                            <span className="text-sm font-medium font-mono">
                                {wasteRecord.producer.slice(0, 6)}...{wasteRecord.producer.slice(-4)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">IPFS Hash:</span>
                            <span className="text-sm font-medium font-mono">
                                {wasteRecord.ipfsHash.slice(0, 8)}...{wasteRecord.ipfsHash.slice(-8)}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleViewFilecoinData}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                            View Details
                        </button>

                        {!wasteRecord.isValidated && (
                            <button
                                onClick={handleValidate}
                                disabled={isLoading}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
                            >
                                {isLoading ? 'Validating...' : 'Validate'}
                            </button>
                        )}

                        {wasteRecord.isValidated && !wasteRecord.isPaid && (
                            <button
                                onClick={handlePayment}
                                disabled={isLoading}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm"
                            >
                                {isLoading ? 'Processing...' : 'Pay'}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Filecoin Data Viewer Modal */}
            {showFilecoinData && (
                <WasteDataViewer
                    ipfsHash={selectedIpfsHash}
                    wasteId={selectedWasteId}
                    onClose={() => setShowFilecoinData(false)}
                />
            )}
        </>
    );
}
