import React, { useState, useEffect } from 'react';
import { AlertCircle, ChevronRight, Loader, Beaker } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';

const Test = () => {
    const [model, setModel] = useState(null);
    const [formData, setFormData] = useState({
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

            // After loading the model
            loadedModel.summary();
            console.log("Input shape:", loadedModel.inputs[0].shape);
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

            // Get training data samples from localStorage
            const trainingData = JSON.parse(localStorage.getItem('trainingData'));
            if (!trainingData || !trainingData.length) {
                console.warn('Training data not found in localStorage. Using model prediction only.');
            }

            // Create more advanced features that better separate chemicals
            const pH = parseFloat(formData.pH);
            const conductivity = parseFloat(formData.conductivity);
            const temperature = parseFloat(formData.temperature);

            // Calculate more discriminative features
            const pHCategory = pH < 2 ? -2 :  // Strong acid
                            pH < 7 ? -1 :    // Weak acid
                            pH === 7 ? 0 :   // Neutral
                            pH < 11 ? 1 :    // Weak base
                            2;               // Strong base
            
            // Enhanced conductivity categorization
            const conductivityCategory = conductivity < 5 ? 0 : 
                                       conductivity < 8 ? 1 : 
                                       conductivity < 13 ? 2 :
                                       conductivity < 15 ? 3 : 4;

            // Create the input features array with normalized values
            const inputFeatures = [
                (pH - featureStats.pH.min) / 
                    (featureStats.pH.max - featureStats.pH.min),
                (conductivity - featureStats.conductivity.min) / 
                    (featureStats.conductivity.max - featureStats.conductivity.min),
                (temperature - featureStats.temperature.min) / 
                    (featureStats.temperature.max - featureStats.temperature.min),
                pHCategory / 2, // Normalize to [-1, 1]
                conductivityCategory / 4  // Normalize to [0, 1]
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

            // Apply domain knowledge rules for specific chemicals
            let finalPredictions = [...predictionArray[0]];
            
            // If we have training data, use similarity-based prediction enhancement
            if (trainingData && trainingData.length) {
                console.log("Enhancing prediction with training data comparison");
                
                // Calculate similarity to each training sample
                const similarities = trainingData.map(sample => {
                    // Calculate normalized Euclidean distance for each feature
                    const pHDiff = Math.abs(pH - sample.pH) / (featureStats.pH.max - featureStats.pH.min);
                    const condDiff = Math.abs(conductivity - sample.Conductivity) / 
                        (featureStats.conductivity.max - featureStats.conductivity.min);
                    const tempDiff = Math.abs(temperature - sample.Temperature) / 
                        (featureStats.temperature.max - featureStats.temperature.min);
                    
                    // Equal weighting for all three parameters
                    const distance = Math.sqrt((pHDiff * pHDiff + condDiff * condDiff + tempDiff * tempDiff) / 3);
                    const similarity = 1 / (1 + distance); // Convert distance to similarity score (0-1)
                    
                    return {
                        chemical: sample.Chemical,
                        similarity,
                        distance,
                        sample
                    };
                });
                
                // Sort by similarity (most similar first)
                similarities.sort((a, b) => b.similarity - a.similarity);
                
                // Log the closest matches
                console.log("Closest training samples:");
                similarities.slice(0, 5).forEach((match, i) => {
                    console.log(`${i+1}. ${match.chemical} - Similarity: ${(match.similarity * 100).toFixed(2)}% - ` +
                               `pH: ${match.sample.pH}, Conductivity: ${match.sample.Conductivity}, ` +
                               `Temperature: ${match.sample.Temperature}`);
                });
                
                // Get the 3 most similar samples
                const topMatches = similarities.slice(0, 3);
                
                // Count chemical occurrences in top matches
                const chemicalCounts = {};
                topMatches.forEach(match => {
                    chemicalCounts[match.chemical] = (chemicalCounts[match.chemical] || 0) + match.similarity;
                });
                
                // Find the chemical with highest weighted count
                const topChemical = Object.entries(chemicalCounts)
                    .sort((a, b) => b[1] - a[1])[0][0];
                    
                console.log(`Top chemical based on similarity: ${topChemical}`);
                
                // Check if top chemical is different from model prediction
                const topModelChemical = chemicalClasses[finalPredictions.indexOf(Math.max(...finalPredictions))];
                const topModelConfidence = Math.max(...finalPredictions);
                
                // Calculate similarity confidence
                const totalSim = topMatches.reduce((sum, match) => sum + match.similarity, 0);
                const topChemicalConfidence = chemicalCounts[topChemical] / totalSim;
                
                console.log(`Model prediction: ${topModelChemical} (${(topModelConfidence * 100).toFixed(2)}%)`);
                console.log(`Similarity prediction: ${topChemical} (${(topChemicalConfidence * 100).toFixed(2)}%)`);
                
                // If the top match is very similar (>80%), and different from model prediction,
                // or if model confidence is low (<60%), boost the similar chemical
                if (topChemical !== topModelChemical && 
                    (topMatches[0].similarity > 0.8 || topModelConfidence < 0.6)) {
                    
                    const matchIndex = chemicalClasses.findIndex(c => c.includes(topChemical));
                    if (matchIndex !== -1) {
                        // Boost the confidence based on similarity
                        const boostFactor = Math.min(2.0, 1.0 + topMatches[0].similarity);
                        finalPredictions[matchIndex] *= boostFactor;
                        
                        // Normalize probabilities
                        const sum = finalPredictions.reduce((a, b) => a + b, 0);
                        finalPredictions = finalPredictions.map(p => p / sum);
                        
                        console.log(`Boosted ${topChemical} confidence by factor: ${boostFactor.toFixed(2)}`);
                    }
                }
                
                // Special case: If best match is extremely similar (>0.95), override prediction
                if (topMatches[0].similarity > 0.95) {
                    const exactMatch = topMatches[0];
                    console.log(`Found extremely close match: ${exactMatch.chemical} with ${(exactMatch.similarity * 100).toFixed(2)}% similarity`);
                    
                    const matchIndex = chemicalClasses.findIndex(c => c.includes(exactMatch.chemical));
                    if (matchIndex !== -1) {
                        finalPredictions = finalPredictions.map((v, i) => 
                            i === matchIndex ? 0.95 : 0.05 / (finalPredictions.length - 1)
                        );
                        console.log(`Overriding prediction with exact match: ${exactMatch.chemical}`);
                    }
                }
                
                // Special case for NaCl vs KCl which can be similar
                if (pH > 7.0 && pH < 7.4) {
                    // Find the closest matches in this pH range
                    const closeMatches = similarities.filter(match => 
                        Math.abs(match.sample.pH - pH) < 0.1 &&
                        Math.abs(match.sample.Conductivity - conductivity) < 0.3
                    );
                    
                    if (closeMatches.length > 0) {
                        // Use the closest match in this specific range
                        const bestMatch = closeMatches[0];
                        const matchIndex = chemicalClasses.findIndex(c => c.includes(bestMatch.chemical));
                        
                        if (matchIndex !== -1) {
                            // Boost this chemical's confidence
                            finalPredictions[matchIndex] *= 1.3;
                            
                            // Normalize probabilities
                            const sum = finalPredictions.reduce((a, b) => a + b, 0);
                            finalPredictions = finalPredictions.map(p => p / sum);
                            
                            console.log(`Applied special case for pH ~7.2 range, boosting ${bestMatch.chemical}`);
                        }
                    }
                }
            }
            
            // Keep the NaOH rule for high pH, which is generally reliable
            if (pH > 12.4 && conductivity < 7) {
                const naohIndex = chemicalClasses.findIndex(c => c.includes('NaOH'));
                if (naohIndex !== -1) {
                    // Apply strong NaOH rule - make NaOH the clear winner
                    finalPredictions = finalPredictions.map((v, i) => 
                        i === naohIndex ? 0.95 : 0.05 / (finalPredictions.length - 1)
                    );
                    console.log("Applied NaOH rule based on high pH and low conductivity");
                }
            }
            
            // Find predicted class
            const predictedIndex = finalPredictions.indexOf(Math.max(...finalPredictions));
            const confidence = finalPredictions[predictedIndex] * 100;

            setPrediction({
                chemical: chemicalClasses[predictedIndex],
                confidence: confidence.toFixed(2)
            });

            // Debug information - log top 3 predictions
            console.log("Final predictions:");
            const topPredictions = [...finalPredictions]
                .map((prob, idx) => ({ prob, chemical: chemicalClasses[idx] }))
                .sort((a, b) => b.prob - a.prob)
                .slice(0, 3);
                
            topPredictions.forEach(p => {
                console.log(`${p.chemical}: ${(p.prob * 100).toFixed(2)}%`);
            });

            // Clean up tensors
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
                        disabled={isLoading || !model || !formData.pH || 
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