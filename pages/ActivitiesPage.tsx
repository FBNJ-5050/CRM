import React from 'react';
import NavBar from '../components/NavBar';

const ActivitiesPage: React.FC = () => {
    return (
        <div className="h-screen bg-[#fdfdfd] dark:bg-[#000000] text-[#1a1a1a] dark:text-gray-100 flex flex-col overflow-hidden">
            <NavBar />
            <main className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-black tracking-tight text-gray-400 dark:text-gray-600 uppercase">
                        Activities
                    </h2>
                    <p className="mt-2 text-sm text-gray-300 dark:text-gray-700">Coming soon</p>
                </div>
            </main>
        </div>
    );
};

export default ActivitiesPage;
