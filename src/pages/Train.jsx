import React, { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';

const Train = () => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
        } else {
            alert('Please select a valid CSV file');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === 'text/csv') {
            setFile(droppedFile);
        } else {
            alert('Please drop a valid CSV file');
        }
    };

    return (
        <div className='min-h-screen bg-gray-50 p-8'>
            <div className='max-w-4xl mx-auto'>
                <h2 className='text-3xl font-bold text-gray-800 mb-8'>Train Model</h2>
                
                <div className='bg-white rounded-lg shadow-md p-6'>
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all
                            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                            ${file ? 'bg-green-50 border-green-500' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className='hidden'
                            id="fileInput"
                        />
                        <label
                            htmlFor="fileInput"
                            className='cursor-pointer'
                        >
                            {!file ? (
                                <>
                                    <Upload className='mx-auto h-12 w-12 text-gray-400 mb-4' />
                                    <p className='text-lg font-medium text-gray-700'>
                                        Drag and drop your CSV file here, or click to browse
                                    </p>
                                    <p className='text-sm text-gray-500 mt-2'>
                                        Only CSV files are accepted
                                    </p>
                                </>
                            ) : (
                                <>
                                    <CheckCircle className='mx-auto h-12 w-12 text-green-500 mb-4' />
                                    <p className='text-lg font-medium text-green-700'>
                                        {file.name}
                                    </p>
                                    <p className='text-sm text-green-600 mt-2'>
                                        File selected successfully
                                    </p>
                                </>
                            )}
                        </label>
                    </div>

                    {file && (
                        <div className='mt-6 flex justify-end'>
                            <button
                                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                                        transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'
                            >
                                Start Training
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Train;