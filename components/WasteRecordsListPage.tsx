'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useWasteContract } from '@/hooks/useWasteContract';
import { WasteRecordCard } from './WasteRecordCard';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import WasteInsuredABI from '@/utils/abi.json';

// Contract address - deployed on Filecoin Calibration testnet
const WASTE_CONTRACT_ADDRESS = '0xE577E8E2283c847fBFe08A09f84Ae65dFBAA218F';

export const WasteRecordsListPage = () => {
    const { isConnected, address } = useAccount();
    const {
        wasteCounter,
        isLoading: contractLoading,
        validateWasteRecord,
        processPayment,
        getAllWasteRecords
    } = useWasteContract();

    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [wasteRecordIds, setWasteRecordIds] = useState<Map<string, string>>(new Map());

    // Get waste records count from blockchain
    const { data: wasteCount } = useReadContract({
        address: WASTE_CONTRACT_ADDRESS as `0x${string}`,
        abi: WasteInsuredABI,
        functionName: 'wasteCounter',
    });


    console.log("wasteCount", wasteCount);
    console.log("isLoading", isLoading);
    console.log("wasteRecordIds.size", wasteRecordIds.size);

    // Create map of waste record IDs
    const getWasteRecordIds = useCallback(() => {
        try {
            if (!wasteCount) {
                console.log("wasteCount is undefined or null");
                return;
            }

            const newMap = new Map<string, string>();
            if (typeof wasteCount === 'bigint' && wasteCount > 0) {
                for (let i = 0; i < wasteCount; i++) {
                    newMap.set(i.toString(), i.toString());
                }
                setWasteRecordIds(new Map(newMap));
            } else {
                console.log("wasteCount is not a valid bigint:", wasteCount);
            }
        } catch (error) {
            console.error("Error setting waste record IDs:", error);
        }
    }, [wasteCount]);

    useEffect(() => {
        getWasteRecordIds();
    }, [getWasteRecordIds]);

    // Set loading to false when waste count is loaded
    useEffect(() => {
        if (wasteCount !== undefined) {
            setIsLoading(false);
        }
    }, [wasteCount]);

    if (!isConnected) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Wallet Not Connected</h3>
                    <p className="text-gray-600 mb-6">Please connect your wallet to view waste records</p>
                    <button
                        onClick={() => window.location.href = '/waste-management'}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go to Waste Management
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading waste records from blockchain...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header with Refresh Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Waste Records</h1>
                            <p className="text-gray-600">View and manage all waste records in the system</p>
                        </div>
                        <button
                            onClick={() => {
                                const refreshRecords = async () => {
                                    if (!isConnected) return;
                                    try {
                                        setIsLoading(true);
                                        // Refresh the IDs - this will trigger the useEffect that sets loading to false
                                        getWasteRecordIds();
                                    } catch (error: any) {
                                        toast.error('Failed to refresh waste records');
                                        setIsLoading(false);
                                    }
                                };
                                refreshRecords();
                            }}
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                </motion.div>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6 mb-8"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                        <input
                            type="text"
                            placeholder="Search waste records..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </motion.div>

                {/* Empty State */}
                {!isLoading && wasteRecordIds.size === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white rounded-xl shadow-lg p-12 text-center"
                    >
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Waste Records Found</h3>
                        <p className="text-gray-600 mb-6">
                            No waste records have been recorded on the blockchain yet.
                        </p>
                        <button
                            onClick={() => window.location.href = '/waste-management'}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Record New Waste
                        </button>
                    </motion.div>
                )}

                {/* Records Grid */}
                {wasteRecordIds.size > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {[...wasteRecordIds.entries()].map(([key, value]) => (
                            <WasteRecordCard
                                id={value}
                                key={key}
                                searchQuery={searchTerm}
                            />
                        ))}
                    </motion.div>
                )}

            </div>
        </div>
    );
}