'use client';

import { useState, useRef, useEffect } from 'react';
import { RecurrenceRule } from './components/RecurringDatePicker/types';
import { motion, AnimatePresence } from 'framer-motion';
import { RecurringDatePicker } from './components/RecurringDatePicker';
import { CheckCircleIcon, DocumentDuplicateIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Head from 'next/head';

export default function Home() {
  const [recurrence, setRecurrence] = useState<Partial<RecurrenceRule> & {
    startDate?: Date | string;
    endDate?: Date | string | null;
  }>();
  const [copied, setCopied] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const copyToClipboard = () => {
    if (!recurrence) return;
    navigator.clipboard.writeText(JSON.stringify(recurrence, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Head>
        <title>Recurring Date Picker | Beautiful & Accessible Date Selection</title>
        <meta name="description" content="An elegant, accessible, and highly customizable date picker for managing recurring events, schedules, and reminders" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Animated header */}
      <motion.header 
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Recurring Date Picker
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <a 
                href="https://github.com/yourusername/recurring-date-picker"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300"
                aria-label="View on GitHub"
              >
                <span>GitHub</span>
                <ArrowTopRightOnSquareIcon className="ml-1.5 h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
            Now with improved UI/UX
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Recurring Date Picker
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
            An elegant, accessible, and highly customizable date picker for managing recurring events, 
            schedules, and reminders with a beautiful, intuitive interface.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a 
              href="#demo" 
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-blue-200"
            >
              Try the Demo
            </a>
            <a 
              href="#features" 
              className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200"
            >
              Learn More
            </a>
          </div>
        </motion.div>

        <motion.div 
          id="demo"
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.005 }}
        >
          <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          <div className="p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Configure Recurrence</h2>
              <p className="text-gray-500 mb-6">Set up your recurring event pattern below</p>
              <RecurringDatePicker 
                value={recurrence}
                onChange={setRecurrence}
              />
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {recurrence && (
            <motion.div 
              className="mt-8 pt-6 border-t border-gray-100"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recurrence Rule</h3>
                  <p className="text-sm text-gray-500">Generated based on your selection</p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:shadow-sm whitespace-nowrap"
                  aria-label="Copy to clipboard"
                >
                  {copied ? (
                    <>
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1.5 flex-shrink-0" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <DocumentDuplicateIcon className="h-4 w-4 text-gray-400 mr-1.5 flex-shrink-0" />
                      <span>Copy to Clipboard</span>
                    </>
                  )}
                </button>
              </div>
              <motion.div 
                className="bg-gray-50 p-4 rounded-lg overflow-auto border border-gray-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <pre className="text-sm text-gray-800 font-mono">
                  {JSON.stringify(recurrence, null, 2)}
                </pre>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Section */}
        <motion.section 
          id="features"
          className="py-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Powerful Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Everything you need to manage recurring events with ease</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '📅',
                title: 'Flexible Recurrence',
                description: 'Supports daily, weekly, monthly, and yearly patterns with custom intervals.'
              },
              {
                icon: '🎨',
                title: 'Customizable UI',
                description: 'Fully themeable components that match your application\'s design system.'
              },
              {
                icon: '🔍',
                title: 'Interactive Preview',
                description: 'Visual calendar preview shows exactly which dates will be included.'
              },
              {
                icon: '♿',
                title: 'Accessible',
                description: 'Built with accessibility in mind, following WAI-ARIA guidelines.'
              },
              {
                icon: '⚡',
                title: 'Lightweight',
                description: 'Optimized for performance with minimal bundle size impact.'
              },
              {
                icon: '🔌',
                title: 'Easy Integration',
                description: 'Simple props-based API that works with any React application.'
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-lg font-medium text-gray-800">Recurring Date Picker</span>
            </div>
            <p className="text-sm text-gray-500">
              Made with ❤️ by Your Name • {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
