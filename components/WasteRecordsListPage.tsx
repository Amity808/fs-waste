'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useWasteContract } from '@/hooks/useWasteContract';
import { WasteDataViewer } from './WasteDataViewer';
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
    producer: string;
    wasteAdmin: string;
}

const WASTE_TYPES = [
    'Plastic',
    'Metal',
    'Paper',
    'Glass',
    'Organic',
    'Electronic',
    'Hazardous',
    'Other'
];

const STATUS_FILTERS = [
    { value: 'all', label: 'All Records' },
    { value: 'pending', label: 'Pending Validation' },
    { value: 'validated', label: 'Validated' },
    { value: 'paid', label: 'Paid' }
];

export const WasteRecordsListPage = () => {
    const { isConnected, address } = useAccount();
    const {
        wasteCounter,
        isLoading: contractLoading,
        validateWasteRecord,
        processPayment
    } = useWasteContract();

    const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>([]);
    const [filteredRecords, setFilteredRecords] = useState<WasteRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [wasteTypeFilter, setWasteTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);
    const [selectedRecord, setSelectedRecord] = useState<WasteRecord | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showFilecoinData, setShowFilecoinData] = useState(false);
    const [selectedIpfsHash, setSelectedIpfsHash] = useState<string>('');

    // Dummy data for demonstration
    useEffect(() => {
        const fetchWasteRecords = async () => {
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
                    hospitalAddress: '0x123...',
                    producer: '0xabc...',
                    wasteAdmin: '0xdef...'
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
                    hospitalAddress: '0x456...',
                    producer: '0xghi...',
                    wasteAdmin: '0xdef...'
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
                    hospitalAddress: '0x789...',
                    producer: '0xjkl...',
                    wasteAdmin: '0xdef...'
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
                    hospitalAddress: '0xabc...',
                    producer: '0xmno...',
                    wasteAdmin: '0xdef...'
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
                    hospitalAddress: '0xdef...',
                    producer: '0xpqr...',
                    wasteAdmin: '0xdef...'
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
                    hospitalAddress: '0xghi...',
                    producer: '0xstu...',
                    wasteAdmin: '0xdef...'
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
                    hospitalAddress: '0xjkl...',
                    producer: '0xvwx...',
                    wasteAdmin: '0xdef...'
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
                    hospitalAddress: '0x456...',
                    producer: '0xyza...',
                    wasteAdmin: '0xdef...'
                },
                {
                    id: 9,
                    depositor: 'Grace Lee',
                    wasteType: 'Metal',
                    collectionLocation: 'Industrial Medical',
                    weight: 35.7,
                    isRecorded: true,
                    isValidated: true,
                    isPaid: true,
                    wasteAmount: 65,
                    hospitalAddress: '0xbcd...',
                    producer: '0xefg...',
                    wasteAdmin: '0xdef...'
                },
                {
                    id: 10,
                    depositor: 'Henry Davis',
                    wasteType: 'Organic',
                    collectionLocation: 'Eco Medical Center',
                    weight: 28.9,
                    isRecorded: true,
                    isValidated: false,
                    isPaid: false,
                    wasteAmount: 42,
                    hospitalAddress: '0xefg...',
                    producer: '0xhij...',
                    wasteAdmin: '0xdef...'
                },
                {
                    id: 11,
                    depositor: 'Ivy Chen',
                    wasteType: 'Electronic',
                    collectionLocation: 'Digital Health Center',
                    weight: 15.3,
                    isRecorded: true,
                    isValidated: true,
                    isPaid: false,
                    wasteAmount: 180,
                    hospitalAddress: '0xfgh...',
                    producer: '0xklm...',
                    wasteAdmin: '0xdef...'
                },
                {
                    id: 12,
                    depositor: 'Jack Wilson',
                    wasteType: 'Glass',
                    collectionLocation: 'Crystal Medical',
                    weight: 19.6,
                    isRecorded: true,
                    isValidated: true,
                    isPaid: true,
                    wasteAmount: 38,
                    hospitalAddress: '0xghi...',
                    producer: '0xnop...',
                    wasteAdmin: '0xdef...'
                }
            ];

            setWasteRecords(mockWaste);
            setFilteredRecords(mockWaste);
            setIsLoading(false);
        };

        fetchWasteRecords();
    }, []);

    // Filter and search logic
    useEffect(() => {
        let filtered = wasteRecords;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(record =>
                record.depositor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.collectionLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.wasteType.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Waste type filter
        if (wasteTypeFilter !== 'all') {
            filtered = filtered.filter(record => record.wasteType === wasteTypeFilter);
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(record => {
                if (statusFilter === 'pending') return record.isRecorded && !record.isValidated;
                if (statusFilter === 'validated') return record.isValidated && !record.isPaid;
                if (statusFilter === 'paid') return record.isPaid;
                return true;
            });
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return b.id - a.id;
                case 'oldest':
                    return a.id - b.id;
                case 'weight-high':
                    return b.weight - a.weight;
                case 'weight-low':
                    return a.weight - b.weight;
                case 'amount-high':
                    return b.wasteAmount - a.wasteAmount;
                case 'amount-low':
                    return a.wasteAmount - b.wasteAmount;
                default:
                    return 0;
            }
        });

        setFilteredRecords(filtered);
        setCurrentPage(1);
    }, [wasteRecords, searchTerm, wasteTypeFilter, statusFilter, sortBy]);

    const handleValidate = async (wasteId: number) => {
        try {
            // Simulate validation process
            await new Promise(resolve => setTimeout(resolve, 1500));

            // In a real implementation, you would call:
            // await validateWasteRecord(wasteId);

            // Update local state
            setWasteRecords(prev => prev.map(record =>
                record.id === wasteId ? { ...record, isValidated: true } : record
            ));

            alert('Waste record validated successfully!');
        } catch (error) {
            console.error('Error validating waste:', error);
            alert('Failed to validate waste record');
        }
    };

    const handlePayment = async (wasteId: number) => {
        try {
            // Simulate payment process
            await new Promise(resolve => setTimeout(resolve, 2000));

            // In a real implementation, you would call:
            // const tokenAddress = '0x...'; // Replace with actual token address
            // await processPayment(wasteId, tokenAddress);

            // Update local state
            setWasteRecords(prev => prev.map(record =>
                record.id === wasteId ? { ...record, isPaid: true } : record
            ));

            alert('Payment processed successfully!');
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Failed to process payment');
        }
    };

    const handleView = (record: WasteRecord) => {
        setSelectedRecord(record);
        setShowModal(true);
    };

    const handleViewFilecoinData = (record: WasteRecord) => {
        // In a real implementation, you would get the IPFS hash from the record
        // For now, we'll use a mock IPFS hash
        const mockIpfsHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        setSelectedIpfsHash(mockIpfsHash);
        setShowFilecoinData(true);
    };

    const getStatusBadge = (record: WasteRecord) => {
        if (record.isPaid) {
            return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Paid</span>;
        }
        if (record.isValidated) {
            return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Validated</span>;
        }
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Pending</span>;
    };

    const getWasteTypeColor = (wasteType: string) => {
        const colors: Record<string, string> = {
            'Plastic': 'bg-blue-100 text-blue-800',
            'Metal': 'bg-gray-100 text-gray-800',
            'Paper': 'bg-yellow-100 text-yellow-800',
            'Glass': 'bg-green-100 text-green-800',
            'Organic': 'bg-emerald-100 text-emerald-800',
            'Electronic': 'bg-purple-100 text-purple-800',
            'Hazardous': 'bg-red-100 text-red-800',
            'Other': 'bg-indigo-100 text-indigo-800'
        };
        return colors[wasteType] || 'bg-gray-100 text-gray-800';
    };

    // Pagination
    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const currentRecords = filteredRecords.slice(startIndex, endIndex);

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
                    <p className="text-gray-600 mb-6">Please connect your MetaMask wallet to view waste records.</p>
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
                    <p className="text-gray-600">Loading waste records...</p>
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Waste Records</h1>
                    <p className="text-gray-600">View and manage all waste records in the system</p>
                </motion.div>

                {/* Filters and Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6 mb-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <input
                                type="text"
                                placeholder="Search by depositor, location, or type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Waste Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Waste Type</label>
                            <select
                                value={wasteTypeFilter}
                                onChange={(e) => setWasteTypeFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Types</option>
                                {WASTE_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {STATUS_FILTERS.map(filter => (
                                    <option key={filter.value} value={filter.value}>{filter.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="weight-high">Weight (High to Low)</option>
                                <option value="weight-low">Weight (Low to High)</option>
                                <option value="amount-high">Amount (High to Low)</option>
                                <option value="amount-low">Amount (Low to High)</option>
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Results Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-6"
                >
                    <p className="text-gray-600">
                        Showing {currentRecords.length} of {filteredRecords.length} records
                    </p>
                </motion.div>

                {/* Records Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Depositor
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Waste Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Weight (kg)
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Filecoin Data
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentRecords.map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{record.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {record.depositor}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getWasteTypeColor(record.wasteType)}`}>
                                                {record.wasteType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {record.collectionLocation}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {record.weight}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {record.wasteAmount} USDFC
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(record)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                {!record.isValidated && (
                                                    <button
                                                        onClick={() => handleValidate(record.id)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Validate
                                                    </button>
                                                )}
                                                {record.isValidated && !record.isPaid && (
                                                    <button
                                                        onClick={() => handlePayment(record.id)}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Pay
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleView(record)}
                                                    className="text-gray-600 hover:text-gray-900"
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleViewFilecoinData(record)}
                                                className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
                                            >
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                View Data
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                                        <span className="font-medium">{Math.min(endIndex, filteredRecords.length)}</span> of{' '}
                                        <span className="font-medium">{filteredRecords.length}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        <button
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === currentPage
                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Record Details Modal */}
                {showModal && selectedRecord && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">Waste Record Details</h3>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Record ID</label>
                                                <p className="text-gray-900">#{selectedRecord.id}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Depositor</label>
                                                <p className="text-gray-900">{selectedRecord.depositor}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Waste Type</label>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getWasteTypeColor(selectedRecord.wasteType)}`}>
                                                    {selectedRecord.wasteType}
                                                </span>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Collection Location</label>
                                                <p className="text-gray-900">{selectedRecord.collectionLocation}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Measurements</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Weight</label>
                                                <p className="text-gray-900">{selectedRecord.weight} kg</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Waste Amount</label>
                                                <p className="text-gray-900">{selectedRecord.wasteAmount} USDFC</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Status</label>
                                                <div className="mt-1">{getStatusBadge(selectedRecord)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Blockchain Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Producer Address</label>
                                            <p className="text-gray-900 font-mono text-sm">{selectedRecord.producer}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Hospital Address</label>
                                            <p className="text-gray-900 font-mono text-sm">{selectedRecord.hospitalAddress}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Admin Address</label>
                                            <p className="text-gray-900 font-mono text-sm">{selectedRecord.wasteAdmin}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Close
                                    </button>
                                    {!selectedRecord.isValidated && (
                                        <button
                                            onClick={() => {
                                                handleValidate(selectedRecord.id);
                                                setShowModal(false);
                                            }}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Validate
                                        </button>
                                    )}
                                    {selectedRecord.isValidated && !selectedRecord.isPaid && (
                                        <button
                                            onClick={() => {
                                                handlePayment(selectedRecord.id);
                                                setShowModal(false);
                                            }}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            Process Payment
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filecoin Data Viewer */}
                {showFilecoinData && (
                    <WasteDataViewer
                        ipfsHash={selectedIpfsHash}
                        onClose={() => setShowFilecoinData(false)}
                    />
                )}
            </div>
        </div>
    );
};
