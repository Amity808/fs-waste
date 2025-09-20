'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useWasteContract } from '@/hooks/useWasteContract';
import { motion } from 'framer-motion';

interface WasteRecord {
    id: number;
    depositor: string;
    wasteType: string;
    collectionLocation: string;
    weight: number;
    isRecorded: boolean;
    isValidated: boolean;
    isPaid: boolean;
    wasteAmount: number;
    hospitalAddress: string;
}

interface DashboardStats {
    totalWaste: number;
    totalWeight: number;
    totalAmount: number;
    pendingValidation: number;
    validated: number;
    paid: number;
    wasteByType: Record<string, number>;
}

export const DashboardPage = () => {
    const { isConnected, address } = useAccount();
    const {
        wasteCounter,
        hospitalCounter,
        isLoading: contractLoading
    } = useWasteContract();

    const [recentWaste, setRecentWaste] = useState<WasteRecord[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        totalWaste: 0,
        totalWeight: 0,
        totalAmount: 0,
        pendingValidation: 0,
        validated: 0,
        paid: 0,
        wasteByType: {}
    });
    const [isLoading, setIsLoading] = useState(true);

    // Dummy data for demonstration
    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // Dummy data with more records for better demonstration
            const mockWaste: WasteRecord[] = [
                {
                    id: 1,
                    depositor: 'John Doe',
                    wasteType: 'Plastic',
                    collectionLocation: 'Downtown Hospital',
                    weight: 25.5,
                    isRecorded: true,
                    isValidated: true,
                    isPaid: true,
                    wasteAmount: 50,
                    hospitalAddress: '0x123...'
                },
                {
                    id: 2,
                    depositor: 'Jane Smith',
                    wasteType: 'Metal',
                    collectionLocation: 'Green Valley Medical',
                    weight: 15.2,
                    isRecorded: true,
                    isValidated: false,
                    isPaid: false,
                    wasteAmount: 30,
                    hospitalAddress: '0x456...'
                },
                {
                    id: 3,
                    depositor: 'Bob Johnson',
                    wasteType: 'Organic',
                    collectionLocation: 'City General',
                    weight: 40.0,
                    isRecorded: true,
                    isValidated: true,
                    isPaid: false,
                    wasteAmount: 75,
                    hospitalAddress: '0x789...'
                },
                {
                    id: 4,
                    depositor: 'Alice Brown',
                    wasteType: 'Electronic',
                    collectionLocation: 'Tech Medical Center',
                    weight: 8.7,
                    isRecorded: true,
                    isValidated: false,
                    isPaid: false,
                    wasteAmount: 120,
                    hospitalAddress: '0xabc...'
                },
                {
                    id: 5,
                    depositor: 'Charlie Wilson',
                    wasteType: 'Glass',
                    collectionLocation: 'Metro Hospital',
                    weight: 32.1,
                    isRecorded: true,
                    isValidated: true,
                    isPaid: true,
                    wasteAmount: 45,
                    hospitalAddress: '0xdef...'
                },
                {
                    id: 6,
                    depositor: 'Diana Prince',
                    wasteType: 'Plastic',
                    collectionLocation: 'Central Medical',
                    weight: 18.3,
                    isRecorded: true,
                    isValidated: true,
                    isPaid: true,
                    wasteAmount: 35,
                    hospitalAddress: '0xghi...'
                },
                {
                    id: 7,
                    depositor: 'Eva Martinez',
                    wasteType: 'Hazardous',
                    collectionLocation: 'Safety Hospital',
                    weight: 12.5,
                    isRecorded: true,
                    isValidated: false,
                    isPaid: false,
                    wasteAmount: 200,
                    hospitalAddress: '0xjkl...'
                },
                {
                    id: 8,
                    depositor: 'Frank Miller',
                    wasteType: 'Paper',
                    collectionLocation: 'Green Valley Medical',
                    weight: 22.8,
                    isRecorded: true,
                    isValidated: true,
                    isPaid: false,
                    wasteAmount: 28,
                    hospitalAddress: '0x456...'
                }
            ];

            setRecentWaste(mockWaste);

            // Calculate stats
            const totalWaste = mockWaste.length;
            const totalWeight = mockWaste.reduce((sum, waste) => sum + waste.weight, 0);
            const totalAmount = mockWaste.reduce((sum, waste) => sum + waste.wasteAmount, 0);
            const pendingValidation = mockWaste.filter(w => w.isRecorded && !w.isValidated).length;
            const validated = mockWaste.filter(w => w.isValidated).length;
            const paid = mockWaste.filter(w => w.isPaid).length;

            const wasteByType = mockWaste.reduce((acc, waste) => {
                acc[waste.wasteType] = (acc[waste.wasteType] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            setStats({
                totalWaste,
                totalWeight,
                totalAmount,
                pendingValidation,
                validated,
                paid,
                wasteByType
            });

            setIsLoading(false);
        };

        fetchDashboardData();
    }, []);

    if (!isConnected) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Not Connected</h2>
                    <p className="text-gray-600 mb-6">Please connect your MetaMask wallet to view the dashboard.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Connect Wallet
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
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Waste Management Dashboard</h1>
                    <p className="text-gray-600">Monitor and manage waste records across the network</p>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Connected as: {address?.slice(0, 6)}...{address?.slice(-4)}
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Waste Records</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalWaste}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Weight (kg)</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalWeight.toFixed(1)}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Amount (USDFC)</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalAmount}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Validated Records</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.validated}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Waste Records */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Recent Waste Records</h2>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                View All
                            </button>
                        </div>

                        <div className="space-y-4">
                            {recentWaste.slice(0, 5).map((waste) => (
                                <div key={waste.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-3 h-3 rounded-full ${waste.isPaid ? 'bg-green-500' :
                                                waste.isValidated ? 'bg-yellow-500' :
                                                    'bg-gray-400'
                                                }`}></div>
                                            <div>
                                                <p className="font-medium text-gray-900">{waste.depositor}</p>
                                                <p className="text-sm text-gray-600">{waste.wasteType} • {waste.weight}kg</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">{waste.wasteAmount} USDFC</p>
                                        <p className="text-xs text-gray-500">
                                            {waste.isPaid ? 'Paid' : waste.isValidated ? 'Validated' : 'Pending'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Waste Type Distribution */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Waste Type Distribution</h2>

                        <div className="space-y-4">
                            {Object.entries(stats.wasteByType).map(([type, count]) => (
                                <div key={type} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-4 h-4 rounded-full ${type === 'Plastic' ? 'bg-blue-500' :
                                            type === 'Metal' ? 'bg-gray-500' :
                                                type === 'Organic' ? 'bg-green-500' :
                                                    type === 'Electronic' ? 'bg-purple-500' :
                                                        'bg-yellow-500'
                                            }`}></div>
                                        <span className="text-sm font-medium text-gray-700">{type}</span>
                                    </div>
                                    <span className="text-sm text-gray-600">{count} records</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="mt-8 bg-white rounded-xl shadow-lg p-6"
                >
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="flex items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span className="text-blue-700 font-medium">Record New Waste</span>
                        </button>

                        <button className="flex items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-green-700 font-medium">Validate Records</span>
                        </button>

                        <button className="flex items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                            <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="text-purple-700 font-medium">View Analytics</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
