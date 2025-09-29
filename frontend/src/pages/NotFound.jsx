import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-green-500">404</h1>
                <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">Page Not Found</h2>
                <p className="text-gray-600 mb-8 text-bangla">
                    দুঃখিত, আপনি যে পেজটি খুঁজছেন তা পাওয়া যায়নি
                </p>
                <Link to="/" className="btn-primary inline-flex items-center gap-2">
                    <Home size={20} />
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;