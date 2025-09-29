import React from 'react';

const Loading = ({ fullScreen = false, size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    const Spinner = () => (
        <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-green-500 rounded-full animate-spin`}></div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
                <div className="text-center">
                    <Spinner />
                    <p className="mt-4 text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center py-8">
            <Spinner />
        </div>
    );
};

export default Loading;