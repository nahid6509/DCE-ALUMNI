import React, { useState } from 'react';
import { Upload, CheckCircle, Loader, AlertCircle } from 'lucide-react';

// Add these styles to your CSS or use a style tag in your HTML
const styles = {
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' }
  },
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' }
  },
  '@keyframes scaleIn': {
    from: { transform: 'scale(0.9)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 }
  }
};

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
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8'>
            <div className='max-w-4xl mx-auto'>
                <div className='mb-8'>
                    <h2 className='text-3xl font-bold text-gray-800'>Train Model</h2>
                    <p className='text-gray-600 mt-2'>Upload your CSV file to train the chemical prediction model</p>
                </div>
                
                <div className='bg-white rounded-xl shadow-lg p-8 transition-all hover:shadow-xl'>
                    <div
                        className={`border-3 border-dashed rounded-xl p-12 text-center transition-all
                            ${isDragging ? 'border-blue-500 bg-blue-50 scale-[0.99]' : 'border-gray-300'}
                            ${file ? 'bg-green-50 border-green-500' : 'hover:border-gray-400'}
                            transform duration-200 ease-in-out`}
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
                            className='cursor-pointer block'
                        >
                            {!file ? (
                                <div className='space-y-4'>
                                    <div className='bg-gray-50 p-4 rounded-full w-20 h-20 mx-auto'>
                                        <Upload className='h-12 w-12 text-blue-500 mx-auto mt-1' />
                                    </div>
                                    <p className='text-xl font-medium text-gray-700'>
                                        Drag and drop your CSV file here
                                    </p>
                                    <p className='text-gray-500'>
                                        or <span className='text-blue-500 hover:text-blue-600'>browse files</span>
                                    </p>
                                    <p className='text-sm text-gray-400 flex items-center justify-center gap-2'>
                                        <AlertCircle className='h-4 w-4' />
                                        Only CSV files are accepted
                                    </p>
                                </div>
                            ) : (
                                <div className='space-y-4'>
                                    <div className='bg-green-50 p-4 rounded-full w-20 h-20 mx-auto'>
                                        <CheckCircle className='h-12 w-12 text-green-500 mx-auto mt-1' />
                                    </div>
                                    <p className='text-xl font-medium text-green-700'>
                                        {file.name}
                                    </p>
                                    <p className='text-sm text-green-600 flex items-center justify-center gap-2'>
                                        <CheckCircle className='h-4 w-4' />
                                        File selected successfully
                                    </p>
                                </div>
                            )}
                        </label>
                    </div>

                    {file && (
                        <div className='mt-8 space-y-6'>
                            {trainingStatus && (
                                <div className={`p-4 rounded-lg flex items-center gap-3 ${
                                    trainingStatus.includes('Error') 
                                    ? 'bg-red-50 text-red-700 border border-red-200' 
                                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                                }`}>
                                    {isTraining ? (
                                        <Loader className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <AlertCircle className="h-5 w-5" />
                                    )}
                                    <p className="font-medium">{trainingStatus}</p>
                                </div>
                            )}
                            <div className='flex justify-end'>
                                <button
                                    onClick={handleTraining}
                                    disabled={isTraining}
                                    className={`px-6 py-3 rounded-lg transition-all duration-200 font-medium
                                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                        ${isTraining 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                                        }`}
                                >
                                    {isTraining ? (
                                        <span className="flex items-center gap-2">
                                            <Loader className="h-4 w-4 animate-spin" />
                                            Training...
                                        </span>
                                    ) : (
                                        'Start Training'
                                    )}
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