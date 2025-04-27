import React, { useState } from 'react';
import { Upload, CheckCircle, Loader } from 'lucide-react';

const Train = () => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isTraining, setIsTraining] = useState(false);
    const [trainingStatus, setTrainingStatus] = useState(null);

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

    const handleTraining = async () => {
        try {
            setIsTraining(true);
            setTrainingStatus('Uploading file and training model...');

            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('http://localhost:5000/train', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            setTrainingStatus(data.message);
        } catch (error) {
            console.error('Training error:', error);
            setTrainingStatus('Error: Failed to train model');
        } finally {
            setIsTraining(false);
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
                        <div className='mt-6'>
                            {trainingStatus && (
                                <div className={`mb-4 p-4 rounded-md ${
                                    trainingStatus.includes('Error') 
                                    ? 'bg-red-50 text-red-700' 
                                    : 'bg-blue-50 text-blue-700'
                                }`}>
                                    {isTraining && (
                                        <Loader className="inline-block mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {trainingStatus}
                                </div>
                            )}
                            <div className='flex justify-end'>
                                <button
                                    onClick={handleTraining}
                                    disabled={isTraining}
                                    className={`px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                                        ${isTraining 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                >
                                    {isTraining ? 'Training...' : 'Start Training'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Train;