import React, { useState, useEffect } from 'react';
import { AlertCircle, ChevronRight, Loader, Beaker } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';

const Test = () => {
    const [model, setModel] = useState(null);
    const [formData, setFormData] = useState({
        concentration: '',
        pH: '',
        conductivity: '',
        temperature: ''
    });
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load model when component mounts
    useEffect(() => {
        loadModel();
    }, []);

    const loadModel = async () => {
        try {
            const models = await tf.io.listModels();
            if (Object.keys(models).length === 0) {
                setError('No model trained for prediction. Please train a model first.');
                return;
            }
            
            const loadedModel = await tf.loadLayersModel('indexeddb://chemical-model');
            setModel(loadedModel);
        } catch (err) {
            setError('No model trained for prediction. Please train a model first.');
            console.error('Model loading error:', err);
        }
    };

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

            // Get feature stats and model from localStorage
            const featureStats = JSON.parse(localStorage.getItem('featureStats'));
            if (!featureStats) {
                throw new Error('Model parameters not found. Please train the model first.');
            }

            // Create features array with all 7 features matching the training input
            const inputFeatures = [
                // Basic normalized features
                (parseFloat(formData.concentration) - featureStats.concentration.min) / 
                    (featureStats.concentration.max - featureStats.concentration.min),
                (parseFloat(formData.pH) - featureStats.pH.min) / 
                    (featureStats.pH.max - featureStats.pH.min),
                (parseFloat(formData.conductivity) - featureStats.conductivity.min) / 
                    (featureStats.conductivity.max - featureStats.conductivity.min),
                (parseFloat(formData.temperature) - featureStats.temperature.min) / 
                    (featureStats.temperature.max - featureStats.temperature.min),
                
                // Engineered features matching training data
                (formData.pH < 3 ? -2 : 
                 formData.pH < 7 ? -1 : 
                 formData.pH === 7 ? 0 : 
                 formData.pH < 11 ? 1 : 2) / 2, // pHCategory normalized
                
                (formData.conductivity < 5 ? 0 : 
                 formData.conductivity < 10 ? 1 : 
                 formData.conductivity < 13 ? 2 :
                 formData.conductivity < 15 ? 3 : 4) / 4, // conductivityRange normalized
                 
                (formData.concentration < 0.5 ? 0 :
                 formData.concentration < 0.8 ? 1 :
                 formData.concentration < 1.0 ? 2 : 3) / 3 // concentrationCategory normalized
            ];

            // Load model and make prediction
            const model = await tf.loadLayersModel('indexeddb://chemical-model');
            const inputTensor = tf.tensor2d([inputFeatures]);
            const prediction = model.predict(inputTensor);
            const predictionArray = await prediction.array();

            // Get chemical classes from localStorage
            const chemicalClasses = JSON.parse(localStorage.getItem('chemicalClasses'));
            if (!chemicalClasses) {
                throw new Error('Chemical classes not found. Please train the model first.');
            }

            // Find predicted class
            const predictedIndex = predictionArray[0].indexOf(Math.max(...predictionArray[0]));
            const confidence = predictionArray[0][predictedIndex] * 100;

            setPrediction({
                chemical: chemicalClasses[predictedIndex],
                confidence: confidence.toFixed(2)
            });

            // Cleanup tensors
            inputTensor.dispose();
            prediction.dispose();
            model.dispose();

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
                                <span className='font-bold ml-2'>{prediction.chemical}</span>
                                <span className='text-green-500 text-sm ml-2'>
                                    (Confidence: {prediction.confidence}%)
                                </span>
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !model || !formData.concentration || !formData.pH || 
                                !formData.conductivity || !formData.temperature}
                        className={`w-full mt-8 py-4 px-6 rounded-lg transition-all duration-200
                            flex items-center justify-center gap-3 text-lg font-medium
                            ${(isLoading || !model)
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] text-white shadow-sm hover:shadow-md'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <Loader className='h-5 w-5 animate-spin' />
                                <span>Processing...</span>
                            </>
                        ) : !model ? (
                            <>
                                <AlertCircle className='h-5 w-5' />
                                <span>Train Model First</span>
                            </>
                        ) : (
                            <>
                                <Beaker className='h-5 w-5' />
                                <span>Predict Chemical</span>
                            </>
                        )}
                    </button>
                    <div className='mt-6 flex justify-center gap-4'>
                        <button
                            onClick={() => window.location.href = '/'}
                            className='inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-600 
                                      bg-gray-50 rounded-lg transition-all duration-200 
                                      hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98]'
                        >
                            <ChevronRight className='h-4 w-4' />
                            Back to Home
                        </button>
                        <button
                            onClick={() => window.location.href = '/train'}
                            className='inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-blue-600 
                                      bg-blue-50 rounded-lg transition-all duration-200 
                                      hover:bg-blue-100 hover:scale-[1.02] active:scale-[0.98]'
                        >
                            <ChevronRight className='h-4 w-4' />
                            Go to Train Page
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Test;