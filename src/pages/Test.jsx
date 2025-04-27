import React, { useState } from 'react';

const Test = () => {
    const [formData, setFormData] = useState({
        concentration: '',
        pH: '',
        conductivity: '',
        temperature: ''
    });
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            setError(null);
            setPrediction(null);

            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to get prediction');
            }

            const data = await response.json();
            setPrediction(data.chemical);
        } catch (err) {
            setError(err.message);
            console.error('Prediction error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-gray-50 p-8'>
            <div className='max-w-md mx-auto bg-white rounded-lg shadow-md p-6'>
                <h2 className='text-2xl font-semibold text-gray-800 mb-6 text-center'>
                    Chemical Measurements
                </h2>
                
                <div className='space-y-4'>
                    <div>
                        <label htmlFor='concentration' className='block text-sm font-medium text-gray-700 mb-1'>
                            Concentration (mol/L)
                        </label>
                        <input
                            type='number'
                            id='concentration'
                            name='concentration'
                            value={formData.concentration}
                            onChange={handleChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            step='0.01'
                        />
                    </div>

                    <div>
                        <label htmlFor='pH' className='block text-sm font-medium text-gray-700 mb-1'>
                            pH
                        </label>
                        <input
                            type='number'
                            id='pH'
                            name='pH'
                            value={formData.pH}
                            onChange={handleChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            min='0'
                            max='14'
                            step='0.1'
                        />
                    </div>

                    <div>
                        <label htmlFor='conductivity' className='block text-sm font-medium text-gray-700 mb-1'>
                            Conductivity (μS/cm)
                        </label>
                        <input
                            type='number'
                            id='conductivity'
                            name='conductivity'
                            value={formData.conductivity}
                            onChange={handleChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            step='0.1'
                        />
                    </div>

                    <div>
                        <label htmlFor='temperature' className='block text-sm font-medium text-gray-700 mb-1'>
                            Temperature (°C)
                        </label>
                        <input
                            type='number'
                            id='temperature'
                            name='temperature'
                            value={formData.temperature}
                            onChange={handleChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            step='0.1'
                        />
                    </div>

                    {error && (
                        <div className='p-3 text-red-700 bg-red-100 rounded-md'>
                            {error}
                        </div>
                    )}

                    {prediction && (
                        <div className='p-3 text-green-700 bg-green-100 rounded-md'>
                            Predicted Chemical: {prediction}
                        </div>
                    )}

                    <button
                        className={`w-full py-2 px-4 rounded-md transition-colors ${
                            isLoading 
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                        onClick={handleSubmit}
                        disabled={isLoading || !formData.concentration || !formData.pH || 
                                !formData.conductivity || !formData.temperature}
                    >
                        {isLoading ? 'Predicting...' : 'Predict Chemical'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Test;