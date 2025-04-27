import React, { useState } from 'react';
import { AlertCircle, ChevronRight, Loader, Beaker } from 'lucide-react';

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
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8'>
            <div className='max-w-2xl mx-auto'>
                <div className='text-center mb-12'>
                    <h2 className='text-3xl font-bold text-gray-800 mb-3'>
                        Chemical Prediction
                    </h2>
                    <p className='text-gray-600 text-lg'>
                        Enter the measurements below to predict the chemical compound
                    </p>
                </div>

                <div className='bg-white rounded-xl shadow-lg p-10'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        {[
                            {
                                id: 'concentration',
                                label: 'Concentration',
                                unit: 'mol/L',
                                step: '0.01',
                                icon: <Beaker className='h-5 w-5 text-gray-400' />
                            },
                            {
                                id: 'pH',
                                label: 'pH Level',
                                min: '0',
                                max: '14',
                                step: '0.1',
                                icon: <ChevronRight className='h-5 w-5 text-gray-400' />
                            },
                            {
                                id: 'conductivity',
                                label: 'Conductivity',
                                unit: 'μS/cm',
                                step: '0.1',
                                icon: <ChevronRight className='h-5 w-5 text-gray-400' />
                            },
                            {
                                id: 'temperature',
                                label: 'Temperature',
                                unit: '°C',
                                step: '0.1',
                                icon: <ChevronRight className='h-5 w-5 text-gray-400' />
                            }
                        ].map((field) => (
                            <div key={field.id} className='relative group'>
                                <label 
                                    htmlFor={field.id}
                                    className='block text-sm font-medium text-gray-700 mb-2'
                                >
                                    {field.label} {field.unit && <span className='text-gray-500'>({field.unit})</span>}
                                </label>
                                <div className='relative flex items-center'>
                                    <div className='absolute left-3 z-10'>
                                        {field.icon}
                                    </div>
                                    <input
                                        type='number'
                                        id={field.id}
                                        name={field.id}
                                        value={formData[field.id]}
                                        onChange={handleChange}
                                        min={field.min}
                                        max={field.max}
                                        step={field.step}
                                        className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg
                                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                            transition-all duration-200
                                            group-hover:border-blue-400'
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className='mt-8 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3'>
                            <AlertCircle className='h-5 w-5 text-red-400 flex-shrink-0' />
                            <p className='text-red-700'>{error}</p>
                        </div>
                    )}

                    {prediction && (
                        <div className='mt-8 p-6 rounded-lg bg-green-50 border border-green-200'>
                            <h3 className='text-lg font-semibold text-green-700 mb-2'>
                                Prediction Result
                            </h3>
                            <p className='text-green-600 text-lg'>
                                The predicted chemical compound is: 
                                <span className='font-bold ml-2'>{prediction}</span>
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !formData.concentration || !formData.pH || 
                                !formData.conductivity || !formData.temperature}
                        className={`w-full mt-8 py-4 px-6 rounded-lg transition-all duration-200
                            flex items-center justify-center gap-3 text-lg font-medium
                            ${isLoading 
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] text-white shadow-sm hover:shadow-md'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <Loader className='h-5 w-5 animate-spin' />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <Beaker className='h-5 w-5' />
                                <span>Predict Chemical</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Test;