import React, { useState } from 'react';

const Test = () => {
    const [formData, setFormData] = useState({
        concentration: '',
        pH: '',
        conductivity: '',
        temperature: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
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

                    <button
                        className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors'
                        onClick={() => console.log(formData)}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Test;