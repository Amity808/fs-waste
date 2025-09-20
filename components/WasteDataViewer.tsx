'use client';

import React, { useState, useEffect } from 'react';
import { useSynapse } from '@/providers/SynapseProvider';

interface WasteDataViewerProps {
    ipfsHash: string;
    onClose: () => void;
}

interface WasteData {
    depositor: string;
    wasteType: string;
    collectionLocation: string;
    weight: number;
    wasteAmount: number;
    hospitalAddress: string;
    producer: string;
    timestamp: number;
    metadata?: {
        fileUploads?: {
            cid: string;
            filename: string;
            fileType: string;
        }[];
    };
}

export const WasteDataViewer: React.FC<WasteDataViewerProps> = ({ ipfsHash, onClose }) => {
    const [wasteData, setWasteData] = useState<WasteData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { synapse } = useSynapse();

    useEffect(() => {
        const fetchWasteData = async () => {
            try {
                setLoading(true);
                setError(null);

                // In a real implementation, you would fetch the JSON data from IPFS
                // For now, we'll simulate it with dummy data
                await new Promise(resolve => setTimeout(resolve, 1000));

                const mockData: WasteData = {
                    depositor: 'John Doe',
                    wasteType: 'Plastic',
                    collectionLocation: 'Downtown Hospital',
                    weight: 25.5,
                    wasteAmount: 50,
                    hospitalAddress: '0x1234567890abcdef1234567890abcdef12345678',
                    producer: '0xabcdef1234567890abcdef1234567890abcdef12',
                    timestamp: Date.now(),
                    metadata: {
                        fileUploads: [
                            {
                                cid: 'QmExample1',
                                filename: 'waste-photo-1.jpg',
                                fileType: 'image/jpeg'
                            },
                            {
                                cid: 'QmExample2',
                                filename: 'weight-certificate.pdf',
                                fileType: 'application/pdf'
                            }
                        ]
                    }
                };

                setWasteData(mockData);
            } catch (err) {
                setError('Failed to fetch waste data from IPFS');
                console.error('Error fetching waste data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (ipfsHash) {
            fetchWasteData();
        }
    }, [ipfsHash]);

    const handleDownloadFile = async (cid: string, filename: string) => {
        try {
            if (!synapse) {
                throw new Error('Synapse not available');
            }

            const uint8ArrayBytes = await synapse.storage.download(cid);
            const file = new File([uint8ArrayBytes as BlobPart], filename);

            // Download file to browser
            const url = URL.createObjectURL(file);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to download file');
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">Loading waste data from Filecoin...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="text-center py-8">
                            <div className="text-red-500 mb-4">
                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!wasteData) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">Waste Data from Filecoin</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* IPFS Hash */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-blue-900 mb-2">IPFS Hash</h4>
                            <code className="text-sm text-blue-800 break-all">{ipfsHash}</code>
                        </div>

                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Waste Information</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Depositor</label>
                                        <p className="text-gray-900">{wasteData.depositor}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Waste Type</label>
                                        <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                            {wasteData.wasteType}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Collection Location</label>
                                        <p className="text-gray-900">{wasteData.collectionLocation}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Measurements</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Weight</label>
                                        <p className="text-gray-900">{wasteData.weight} kg</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Waste Amount</label>
                                        <p className="text-gray-900">{wasteData.wasteAmount} USDFC</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Timestamp</label>
                                        <p className="text-gray-900">{new Date(wasteData.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Blockchain Information */}
                        <div className="pt-6 border-t">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Blockchain Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Producer Address</label>
                                    <p className="text-gray-900 font-mono text-sm break-all">{wasteData.producer}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Hospital Address</label>
                                    <p className="text-gray-900 font-mono text-sm break-all">{wasteData.hospitalAddress}</p>
                                </div>
                            </div>
                        </div>

                        {/* Evidence Files */}
                        {wasteData.metadata?.fileUploads && wasteData.metadata.fileUploads.length > 0 && (
                            <div className="pt-6 border-t">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Evidence Files</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {wasteData.metadata.fileUploads.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    {file.fileType.startsWith('image/') ? (
                                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    ) : file.fileType === 'application/pdf' ? (
                                                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{file.filename}</p>
                                                    <p className="text-xs text-gray-500">{file.fileType}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDownloadFile(file.cid, file.filename)}
                                                className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
                                            >
                                                Download
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="pt-6 border-t flex justify-end space-x-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    // Copy IPFS hash to clipboard
                                    navigator.clipboard.writeText(ipfsHash);
                                    alert('IPFS hash copied to clipboard!');
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Copy IPFS Hash
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
