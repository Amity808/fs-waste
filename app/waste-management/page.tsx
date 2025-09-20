'use client';

import React, { useState } from 'react';
import { DashboardPage } from '@/components/DashboardPage';
import { RecordWastePage } from '@/components/RecordWastePage';
import { WasteRecordsListPage } from '@/components/WasteRecordsListPage';
import { ConnectButton } from '@rainbow-me/rainbowkit';

type Tab = 'dashboard' | 'record' | 'records';

export default function WasteManagementPage() {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'record', label: 'Record Waste', icon: '➕' },
        { id: 'records', label: 'View Records', icon: '📋' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardPage />;
            case 'record':
                return <RecordWastePage />;
            case 'records':
                return <WasteRecordsListPage />;
            default:
                return <DashboardPage />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">WasteInsured</h1>
                            <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                dApp
                            </span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <ConnectButton />
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>
                {renderContent()}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-gray-500 text-sm">
                        <p>WasteInsured dApp - Decentralized Waste Management on Filecoin</p>
                        <p className="mt-2">
                            Built with Next.js, RainbowKit, and Filecoin Synapse SDK
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
