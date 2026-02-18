"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Hide Navbar on Login page
    if (pathname === '/login') {
        return (<></>);
    }

    // Prevent scrolling when mobile menu is open

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const navItems = [
        { name: 'Profilo', path: '/profile' },
        { name: 'Home', path: '/' },
        { name: 'Calendario', path: '/calendar' },
        { name: 'Squadre', path: '/teams' },
    ];

    return (
        <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-screen-xl z-50 drop-shadow-md">
            <div className="flex flex-wrap items-center justify-between sm:justify-start mx-auto p-2 px-4 sm:gap-1">
                <button
                    data-collapse-toggle="navbar-default"
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 transition-colors duration-300 z-50 relative"
                    aria-controls="navbar-default"
                    aria-expanded={isMobileMenuOpen}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div className={`${isMobileMenuOpen ? 'fixed inset-0 z-40 bg-white/95 backdrop-blur-xl dark:bg-gray-900/95 flex flex-col justify-center items-center h-screen' : 'hidden'} w-full sm:block sm:w-auto sm:static sm:h-auto sm:bg-transparent sm:inset-auto sm:flex-row sm:backdrop-blur-none`} id="navbar-default">
                    <ul className="font-medium flex flex-col gap-6 p-4 sm:p-0 mt-4 rounded-lg bg-transparent sm:flex-row sm:space-x-1 rtl:space-x-reverse sm:mt-0 sm:bg-transparent dark:bg-transparent sm:dark:bg-transparent w-full items-center sm:w-auto">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <Link
                                        href={item.path}
                                        className={`block rounded-full transition-all duration-300 ease-in-out ${item.path === '/profile' ? 'p-1' : 'py-2 px-2'
                                            } ${isActive
                                                ? 'text-white bg-blue-700 shadow-md scale-105'
                                                : 'text-gray-900 bg-gray-100 hover:bg-gray-200 hover:shadow hover:scale-105 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700'
                                            }`}
                                        aria-current={isActive ? 'page' : undefined}
                                        onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                                    >
                                        {item.path === '/profile' ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                            </svg>
                                        ) : (
                                            item.name
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

        </nav>
    );
}
