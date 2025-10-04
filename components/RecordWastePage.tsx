'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useWasteContract } from '@/hooks/useWasteContract';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useWasteDataUpload } from '@/utils/wasteDataUpload';
import { getNetworkTroubleshootingTips } from '@/utils/networkCheck';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface WasteFormData {
    depositor: string;
    wasteType: string;
    collectionLocation: string;
    weight: number;
    wasteAmount: number;
    hospitalAddress: string;
}

interface Hospital {
    id: number;
    name: string;
    location: string;
    hospitalType: string;
    walletAddress: string;
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

export const RecordWastePage = () => {
    const { isConnected, address } = useAccount();
    const {
        recordWasteData,
        isLoading: contractLoading,
        error: contractError,
        hospitalCounter
    } = useWasteContract();
    const { uploadFileMutation, progress, status, uploadedInfo } = useFileUpload();
    const { uploadWasteData, isUploading, uploadProgress, uploadStatus } = useWasteDataUpload();

    const [formData, setFormData] = useState<WasteFormData>({
        depositor: '',
        wasteType: '',
        collectionLocation: '',
        weight: 0,
        wasteAmount: 0,
        hospitalAddress: ''
    });

    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [uploadedData, setUploadedData] = useState<any>(null);
    const [contractResult, setContractResult] = useState<any>(null);
    const [showTroubleshooting, setShowTroubleshooting] = useState(false);

    // Load hospitals with dummy data
    useEffect(() => {
        // Dummy hospital data for demonstration
        setHospitals([
            { id: 1, name: 'City General Hospital', location: 'Downtown', hospitalType: 'General', walletAddress: '0x1234567890abcdef1234567890abcdef12345678' },
            { id: 2, name: 'Green Valley Medical', location: 'Suburbs', hospitalType: 'Specialized', walletAddress: '0x2345678901bcdef1234567890abcdef1234567890' },
            { id: 3, name: 'Tech Medical Center', location: 'Tech District', hospitalType: 'Research', walletAddress: '0x3456789012cdef1234567890abcdef12345678901' },
            { id: 4, name: 'Metro Hospital', location: 'City Center', hospitalType: 'Emergency', walletAddress: '0x4567890123def1234567890abcdef123456789012' },
            { id: 5, name: 'Central Medical', location: 'Central', hospitalType: 'General', walletAddress: '0x5678901234ef1234567890abcdef1234567890123' },
            { id: 6, name: 'Safety Hospital', location: 'Industrial', hospitalType: 'Hazardous', walletAddress: '0x6789012345f1234567890abcdef12345678901234' },
            { id: 7, name: 'Eco Medical Center', location: 'Green Zone', hospitalType: 'Environmental', walletAddress: '0x78901234561234567890abcdef123456789012345' },
            { id: 8, name: 'Digital Health Center', location: 'Innovation Hub', hospitalType: 'Digital', walletAddress: '0x8901234567234567890abcdef1234567890123456' },
        ]);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'weight' || name === 'wasteAmount' ? (value === '' ? 0 : Number(value)) : value
        }));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setSelectedFiles(prev => [...prev, ...files]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isConnected) {
            toast.error('Please connect your wallet first');
            return;
        }

        if (!formData.depositor || !formData.wasteType || !formData.collectionLocation ||
            !formData.weight || !formData.wasteAmount || !formData.hospitalAddress) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Additional validation for numeric fields
        if (isNaN(formData.weight) || formData.weight <= 0) {
            toast.error('Please enter a valid weight greater than 0');
            return;
        }

        if (isNaN(formData.wasteAmount) || formData.wasteAmount <= 0) {
            toast.error('Please enter a valid waste amount greater than 0');
            return;
        }

        setIsSubmitting(true);
        setSuccess(false);

        try {
            const wasteData = {
                depositor: formData.depositor,
                wasteType: formData.wasteType,
                collectionLocation: formData.collectionLocation,
                weight: formData.weight,
                wasteAmount: formData.wasteAmount,
                hospitalAddress: formData.hospitalAddress,
                producer: address || '',
                timestamp: Date.now()
            };

            const uploadResult = await uploadWasteData(wasteData, selectedFiles);
            setUploadedData(uploadResult);

            const selectedHospital = hospitals.find(h => h.walletAddress === formData.hospitalAddress);
            const contractResult = await recordWasteData({
                ipfsHash: uploadResult.ipfsHash,  // All detailed data stored in IPFS
                weight: formData.weight,
                wasteAmount: formData.wasteAmount,
                hospitalAddress: selectedHospital?.walletAddress || ''
            });

            console.log('Smart contract transaction:', contractResult);
            setContractResult(contractResult);

            setSuccess(true);
            toast.success('Waste data recorded successfully!');
            setFormData({
                depositor: '',
                wasteType: '',
                collectionLocation: '',
                weight: 0,
                wasteAmount: 0,
                hospitalAddress: ''
            });
            setSelectedFiles([]);

            // Auto-hide success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000);

        } catch (error: any) {
            console.error('Error recording waste:', error);

            // Check if it's a network error and show troubleshooting
            if (error.message?.includes('Failed to fetch') || error.message?.includes('addPieces failed')) {
                setShowTroubleshooting(true);
            }

            toast.error(`Error: ${error.message || 'Failed to record waste'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <p className="text-gray-600 mb-6">Please connect your MetaMask wallet to record waste data.</p>
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

    return (
        <>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-xl shadow-lg p-8"
                    >
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Record Waste Data</h1>
                            <p className="text-gray-600">Fill in the details below to record waste information on the blockchain.</p>
                        </div>

                        {success && uploadedData && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-green-800 font-medium">Waste data uploaded to Filecoin successfully!</span>
                                    </div>

                                    <div className="text-sm text-green-700">
                                        <p><strong>IPFS Hash:</strong> <code className="bg-green-100 px-1 rounded">{uploadedData.ipfsHash}</code></p>
                                        <p><strong>Evidence Files:</strong> {uploadedData.evidenceFiles.length} files uploaded</p>
                                        <p><strong>Data Size:</strong> {uploadedData.wasteDataFile.size} bytes</p>
                                        <p><strong>Transaction Hash:</strong> <code className="bg-green-100 px-1 rounded">{contractResult?.hash || 'Pending...'}</code></p>
                                        <p><strong>View on Filecoin:</strong> <a href={`https://0x416f7ae46d370a0dea72156aa9ae27de48dcd8d2.calibration.filcdn.io/${uploadedData.ipfsHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Open in browser</a></p>
                                    </div>

                                    <div className="text-xs text-green-600">
                                        <p>✅ Waste data stored on Filecoin blockchain</p>
                                        <p>✅ Evidence files uploaded and verified</p>
                                        <p>✅ Smart contract record created</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Depositor Name */}
                                <div>
                                    <label htmlFor="depositor" className="block text-sm font-medium text-gray-700 mb-2">
                                        Depositor Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="depositor"
                                        name="depositor"
                                        value={formData.depositor}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                        placeholder="Enter depositor name"
                                    />
                                </div>

                                {/* Waste Type */}
                                <div>
                                    <label htmlFor="wasteType" className="block text-sm font-medium text-gray-700 mb-2">
                                        Waste Type *
                                    </label>
                                    <select
                                        id="wasteType"
                                        name="wasteType"
                                        value={formData.wasteType}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                    >
                                        <option value="">Select waste type</option>
                                        {WASTE_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Collection Location */}
                                <div>
                                    <label htmlFor="collectionLocation" className="block text-sm font-medium text-gray-700 mb-2">
                                        Collection Location *
                                    </label>
                                    <input
                                        type="text"
                                        id="collectionLocation"
                                        name="collectionLocation"
                                        value={formData.collectionLocation}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                        placeholder="Enter collection location"
                                    />
                                </div>

                                {/* Hospital Selection */}
                                <div>
                                    <label htmlFor="hospitalAddress" className="block text-sm font-medium text-gray-700 mb-2">
                                        Hospital *
                                    </label>
                                    <select
                                        id="hospitalAddress"
                                        name="hospitalAddress"
                                        value={formData.hospitalAddress}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                    >
                                        <option value="">Select hospital</option>
                                        {hospitals.map(hospital => (
                                            <option key={hospital.id} value={hospital.walletAddress}>
                                                {hospital.name} - {hospital.location}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Weight */}
                                <div>
                                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                                        Weight (kg) *
                                    </label>
                                    <input
                                        type="number"
                                        id="weight"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        step="0.1"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                                        placeholder="Enter weight in kg"
                                    />
                                </div>

                                {/* Waste Amount */}
                                <div>
                                    <label htmlFor="wasteAmount" className="block text-sm font-medium text-gray-700 mb-2">
                                        Waste Amount (USDFC) *
                                    </label>
                                    <input
                                        type="number"
                                        id="wasteAmount"
                                        name="wasteAmount"
                                        value={formData.wasteAmount}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter waste amount in USDFC"
                                    />
                                </div>
                            </div>

                            {/* File Upload */}
                            <div>
                                <label htmlFor="files" className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Evidence Files (Optional)
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                                    <div className="space-y-1 text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-gray-600">
                                            <label htmlFor="files" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                <span>Upload files</span>
                                                <input
                                                    id="files"
                                                    name="files"
                                                    type="file"
                                                    multiple
                                                    className="sr-only"
                                                    onChange={handleFileSelect}
                                                    accept="image/*,.pdf,.doc,.docx,.mp4,.mov"
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">Images, PDFs, Videos up to 10MB each</p>
                                    </div>
                                </div>

                                {/* Selected Files List */}
                                {selectedFiles.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
                                        {selectedFiles.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <span className="text-sm text-gray-700">{file.name}</span>
                                                    <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                                </div>
                                                <button
                                                    onClick={() => removeFile(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Upload Progress */}
                            {(isUploading || uploadFileMutation.isPending) && (
                                <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                                    <h4 className="text-sm font-medium text-blue-900">Uploading to Filecoin...</h4>

                                    {/* Waste Data Upload Progress */}
                                    {isUploading && (
                                        <div className="space-y-2">
                                            <p className="text-sm text-blue-700">Uploading waste data and evidence files...</p>
                                            <div className="w-full bg-blue-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-blue-600">{uploadStatus}</p>
                                        </div>
                                    )}

                                    {/* Individual File Upload Progress */}
                                    {uploadFileMutation.isPending && (
                                        <div className="space-y-2">
                                            <p className="text-sm text-blue-700">Uploading evidence files...</p>
                                            <div className="w-full bg-blue-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-blue-600">{status}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Error Messages */}
                            {(contractError || uploadFileMutation.error) && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-800 text-sm">
                                        {contractError || uploadFileMutation.error?.message || 'An error occurred'}
                                    </p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({
                                            depositor: '',
                                            wasteType: '',
                                            collectionLocation: '',
                                            weight: 0,
                                            wasteAmount: 0,
                                            hospitalAddress: ''
                                        });
                                        setSelectedFiles([]);
                                        setUploadedData(null);
                                    }}
                                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Clear Form
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || contractLoading || isUploading || uploadFileMutation.isPending}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {isUploading ? 'Uploading to Filecoin...' : 'Recording...'}
                                        </>
                                    ) : (
                                        'Record Waste & Upload to Filecoin'
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    {/* Troubleshooting Modal */}
                    {showTroubleshooting && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-2xl font-bold text-gray-900">Network Error Troubleshooting</h3>
                                        <button
                                            onClick={() => setShowTroubleshooting(false)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <div className="flex">
                                                <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                <div>
                                                    <h4 className="text-yellow-800 font-medium">Upload Failed</h4>
                                                    <p className="text-yellow-700 text-sm mt-1">
                                                        The file upload to Filecoin failed due to a network error. This is common and usually temporary.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Try these solutions:</h4>
                                            <ul className="space-y-2">
                                                {getNetworkTroubleshootingTips().map((tip, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <span className="text-blue-600 mr-2">•</span>
                                                        <span className="text-gray-700">{tip}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <h4 className="text-blue-900 font-medium mb-2">Fallback Mode</h4>
                                            <p className="text-blue-800 text-sm">
                                                If the upload continues to fail, the system will use a fallback mode to save your data locally
                                                and generate a mock IPFS hash for demonstration purposes.
                                            </p>
                                        </div>

                                        <div className="flex justify-end space-x-3 pt-4">
                                            <button
                                                onClick={() => setShowTroubleshooting(false)}
                                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                Close
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowTroubleshooting(false);
                                                    window.location.reload();
                                                }}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Refresh & Retry
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
