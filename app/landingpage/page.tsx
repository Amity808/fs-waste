'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/ui/Navbar';

const WasteManagementLandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            <Navbar />

            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                                Transform Your Waste Management with{' '}
                                <span className="text-green-600">Smart Technology</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8">
                                Never miss a pickup again with AI-powered scheduling, real-time tracking,
                                and environmental impact monitoring. Join thousands of residents making a difference.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg">
                                    Start Free Trial
                                </button>
                                <button className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-50 transition-colors">
                                    Schedule Demo
                                </button>
                            </div>
                            <div className="mt-8 flex items-center space-x-8 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <span className="text-green-600 font-semibold">50,000+</span>
                                    <span className="ml-2">Active Users</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-green-600 font-semibold">200+</span>
                                    <span className="ml-2">Cities Served</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-green-600 font-semibold">2M+</span>
                                    <span className="ml-2">Tons Diverted</span>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="bg-white rounded-2xl shadow-2xl p-8">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">Smart Collection Schedule</h3>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                            <span className="text-sm">Recycling</span>
                                            <span className="text-sm font-medium">Tomorrow 8:00 AM</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                            <span className="text-sm">Compost</span>
                                            <span className="text-sm font-medium">Friday 7:30 AM</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm">Trash</span>
                                            <span className="text-sm font-medium">Next Tuesday 9:00 AM</span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">This Month&apos;s Impact</span>
                                            <span className="text-green-600 font-semibold">-15% Carbon Footprint</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Powerful Features for Modern Waste Management
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Our comprehensive platform combines AI, IoT, and mobile technology to revolutionize how communities manage waste.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Scheduling</h3>
                            <p className="text-gray-600">AI-powered scheduling adapts to your waste patterns and optimizes collection routes for maximum efficiency.</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Tracking</h3>
                            <p className="text-gray-600">Track your waste collection in real-time with GPS integration and get instant notifications about pickup status.</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Environmental Impact</h3>
                            <p className="text-gray-600">Monitor your contribution to sustainability goals with detailed analytics on waste diversion and carbon footprint.</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Mobile App</h3>
                            <p className="text-gray-600">Manage everything from your phone with our intuitive mobile app featuring push notifications and offline access.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Social Proof Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Trusted by Communities Worldwide
                        </h2>
                        <p className="text-xl text-gray-600">
                            See how cities and residents are transforming their waste management
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-600 font-bold text-lg">40%</span>
                                </div>
                                <div className="ml-4">
                                    <h4 className="font-semibold text-gray-900">Waste Reduction</h4>
                                    <p className="text-sm text-gray-600">San Francisco, CA</p>
                                </div>
                            </div>
                            <p className="text-gray-600 italic">
                                &ldquo;EcoWaste helped us reduce waste by 40% in just 6 months. The smart scheduling and community engagement features made all the difference.&rdquo;
                            </p>
                            <p className="text-sm text-gray-500 mt-4">- Sarah Johnson, City Manager</p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-bold text-lg">$2M</span>
                                </div>
                                <div className="ml-4">
                                    <h4 className="font-semibold text-gray-900">Cost Savings</h4>
                                    <p className="text-sm text-gray-600">Austin, TX</p>
                                </div>
                            </div>
                            <p className="text-gray-600 italic">
                                &ldquo;We saved over $2 million annually through optimized collection routes and reduced contamination rates.&rdquo;
                            </p>
                            <p className="text-sm text-gray-500 mt-4">- Michael Chen, Operations Director</p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <span className="text-emerald-600 font-bold text-lg">95%</span>
                                </div>
                                <div className="ml-4">
                                    <h4 className="font-semibold text-gray-900">Satisfaction Rate</h4>
                                    <p className="text-sm text-gray-600">Portland, OR</p>
                                </div>
                            </div>
                            <p className="text-gray-600 italic">
                                &ldquo;95% of our residents love the real-time tracking and environmental impact features. It&apos;s changed how they think about waste.&rdquo;
                            </p>
                            <p className="text-sm text-gray-500 mt-4">- Lisa Rodriguez, Sustainability Coordinator</p>
                        </div>
                    </div>

                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-8">Trusted by Leading Organizations</h3>
                        <div className="flex flex-wrap justify-center items-center space-x-8 space-y-4">
                            <div className="bg-white px-6 py-4 rounded-lg shadow-md">
                                <span className="text-gray-600 font-semibold">City of San Francisco</span>
                            </div>
                            <div className="bg-white px-6 py-4 rounded-lg shadow-md">
                                <span className="text-gray-600 font-semibold">Austin City Council</span>
                            </div>
                            <div className="bg-white px-6 py-4 rounded-lg shadow-md">
                                <span className="text-gray-600 font-semibold">Portland Metro</span>
                            </div>
                            <div className="bg-white px-6 py-4 rounded-lg shadow-md">
                                <span className="text-gray-600 font-semibold">Seattle Public Works</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600">
                            Get started in just three simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Sign Up</h3>
                            <p className="text-gray-600">Create your account in under 2 minutes. No credit card required for the free trial.</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Schedule</h3>
                            <p className="text-gray-600">Set your collection preferences and schedule. Our AI will optimize your pickup times.</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Track & Save</h3>
                            <p className="text-gray-600">Monitor your impact and save money through optimized waste management practices.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-xl text-gray-600">
                            Choose the plan that fits your needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Resident</h3>
                            <p className="text-gray-600 mb-6">Perfect for individual households</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-900">Free</span>
                                <span className="text-gray-600">/month</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Basic scheduling
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Mobile app access
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Basic tracking
                                </li>
                            </ul>
                            <button className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                                Get Started
                            </button>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-green-500 relative">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                            <p className="text-gray-600 mb-6">For environmentally conscious residents</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-900">$9.99</span>
                                <span className="text-gray-600">/month</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Everything in Resident
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Advanced analytics
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Environmental impact tracking
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Priority support
                                </li>
                            </ul>
                            <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                                Start Free Trial
                            </button>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                            <p className="text-gray-600 mb-6">For cities and municipalities</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-900">Custom</span>
                                <span className="text-gray-600">/month</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Everything in Premium
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Route optimization
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Advanced reporting
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Dedicated support
                                </li>
                            </ul>
                            <button className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xl text-gray-600">
                            Everything you need to know about EcoWaste
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">How does smart scheduling work?</h3>
                            <p className="text-gray-600">Our AI analyzes your waste generation patterns, weather conditions, and collection history to optimize pickup times. It learns from your behavior and automatically adjusts schedules for maximum efficiency.</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">What data do you collect and how is it used?</h3>
                            <p className="text-gray-600">We collect only essential data like collection schedules, waste types, and location information. This data is used solely to improve our services and is never sold to third parties. We&apos;re fully GDPR compliant.</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Is my personal information secure?</h3>
                            <p className="text-gray-600">Yes, we use enterprise-grade encryption and security measures to protect your data. All data is encrypted in transit and at rest, and we undergo regular security audits.</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">How much can I actually save?</h3>
                            <p className="text-gray-600">On average, our users save 20-30% on waste management costs through optimized scheduling and reduced contamination. Cities typically see even greater savings through route optimization.</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">What if I miss a collection day?</h3>
                            <p className="text-gray-600">No problem! Our system automatically reschedules missed pickups and sends you notifications. You can also manually reschedule through the mobile app or web interface.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-green-600">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to Transform Your Waste Management?
                    </h2>
                    <p className="text-xl text-green-100 mb-8">
                        Join thousands of residents and cities already making a difference. Start your free trial today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                            Start Free Trial
                        </button>
                        <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
                            Schedule Demo
                        </button>
                    </div>
                    <p className="text-green-100 text-sm mt-4">No credit card required • 30-day free trial • Cancel anytime</p>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="text-2xl font-bold text-green-400 mb-4">EcoWaste</h3>
                            <p className="text-gray-300 mb-6 max-w-md">
                                Transforming waste management through smart technology, AI optimization, and community engagement.
                                Join us in building a more sustainable future.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-4">Product</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Mobile App</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">API</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-4">Company</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Press</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-4">Support</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Security</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                        <p className="text-gray-400">&copy; 2024 EcoWaste. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default WasteManagementLandingPage;
