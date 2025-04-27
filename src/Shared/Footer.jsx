import React from 'react';
import { Beaker } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="py-4 px-8 border-t bg-white">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo and Name */}
                <div className="flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">InstaChem</span>
                </div>

                {/* Links */}
                <div className="flex gap-6">
                    <a href="/about" className="text-sm text-gray-600 hover:text-blue-600">
                        About
                    </a>
                    <a href="/contact" className="text-sm text-gray-600 hover:text-blue-600">
                        Contact
                    </a>
                </div>

                {/* Copyright */}
                <div className="text-sm text-gray-500">
                    © {new Date().getFullYear()} InstaChem
                </div>
            </div>
        </footer>
    );
};

export default Footer;