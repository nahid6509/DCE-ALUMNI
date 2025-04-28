import React, { useState } from 'react';
import { Upload, CheckCircle, Loader, AlertCircle, ChevronRight } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as Papa from 'papaparse'; // Add this for CSV parsing

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
            setTrainingStatus('Processing data and training model...');

            // Read and parse CSV file
            const text = await file.text();
            const results = Papa.parse(text, { header: true, dynamicTyping: true });
            
            // Validate CSV structure
            const requiredColumns = ['Concentration', 'pH', 'Conductivity', 'Temperature', 'Chemical'];
            const headers = Object.keys(results.data[0] || {});
            if (!requiredColumns.every(col => headers.includes(col))) {
                throw new Error('CSV must include: Concentration, pH, Conductivity, Temperature, Chemical');
            }

            // Filter out invalid rows
            const data = results.data.filter(row => 
                row.Concentration != null && 
                row.pH != null && 
                row.Conductivity != null && 
                row.Temperature != null && 
                row.Chemical != null
            );

            if (data.length === 0) {
                throw new Error('No valid data found in CSV file');
            }

            // Standardize the data ordering by chemical type
            data.sort((a, b) => a.Chemical.localeCompare(b.Chemical));

            // Improve feature engineering
            data.forEach(row => {
                // Enhanced pH categorization (more granular)
                row.pHCategory = row.pH < 3 ? -2 :  // Strong acid
                                row.pH < 7 ? -1 :    // Weak acid
                                row.pH === 7 ? 0 :   // Neutral
                                row.pH < 11 ? 1 :    // Weak base
                                2;                    // Strong base
                
                // Enhanced conductivity categorization
                row.conductivityRange = row.Conductivity < 5 ? 0 : 
                                      row.Conductivity < 10 ? 1 : 
                                      row.Conductivity < 13 ? 2 :
                                      row.Conductivity < 15 ? 3 : 4;
                                      
                // Add concentration category
                row.concentrationCategory = row.Concentration < 0.5 ? 0 :
                                          row.Concentration < 0.8 ? 1 :
                                          row.Concentration < 1.0 ? 2 : 3;
            });

            // Add feature normalization
            const featureStats = {
                concentration: { min: Infinity, max: -Infinity },
                pH: { min: Infinity, max: -Infinity },
                conductivity: { min: Infinity, max: -Infinity },
                temperature: { min: Infinity, max: -Infinity }
            };

            // Calculate min-max values
            data.forEach(row => {
                featureStats.concentration.min = Math.min(featureStats.concentration.min, row.Concentration);
                featureStats.concentration.max = Math.max(featureStats.concentration.max, row.Concentration);
                featureStats.pH.min = Math.min(featureStats.pH.min, row.pH);
                featureStats.pH.max = Math.max(featureStats.pH.max, row.pH);
                featureStats.conductivity.min = Math.min(featureStats.conductivity.min, row.Conductivity);
                featureStats.conductivity.max = Math.max(featureStats.conductivity.max, row.Conductivity);
                featureStats.temperature.min = Math.min(featureStats.temperature.min, row.Temperature);
                featureStats.temperature.max = Math.max(featureStats.temperature.max, row.Temperature);
            });

            // Save normalization parameters for prediction
            localStorage.setItem('featureStats', JSON.stringify(featureStats));

            // Update features array to include new engineered features
            const features = data.map(row => [
                (row.Concentration - featureStats.concentration.min) / (featureStats.concentration.max - featureStats.concentration.min),
                (row.pH - featureStats.pH.min) / (featureStats.pH.max - featureStats.pH.min),
                (row.Conductivity - featureStats.conductivity.min) / (featureStats.conductivity.max - featureStats.conductivity.min),
                (row.Temperature - featureStats.temperature.min) / (featureStats.temperature.max - featureStats.temperature.min),
                row.pHCategory / 2, // Normalize to [-1, 1]
                row.conductivityRange / 4, // Normalize to [0, 1]
                row.concentrationCategory / 3 // Normalize to [0, 1]
            ]);
            
            // Get unique chemical classes
            const uniqueClasses = [...new Set(data.map(row => row.Chemical))];
            console.log('Chemical classes:', uniqueClasses);
            
            // Save classes to localStorage for prediction
            localStorage.setItem('chemicalClasses', JSON.stringify(uniqueClasses));
            
            // One-hot encode labels
            const labels = data.map(row => {
                const oneHot = new Array(uniqueClasses.length).fill(0);
                const index = uniqueClasses.indexOf(row.Chemical);
                oneHot[index] = 1;
                return oneHot;
            });

            // Augment training data with small variations
            const augmentedFeatures = [];
            const augmentedLabels = [];

            features.forEach((feature, idx) => {
                // Add original data
                augmentedFeatures.push(feature);
                augmentedLabels.push(labels[idx]);
                
                // Add variations with small noise
                for (let i = 0; i < 2; i++) {
                    const noisyFeature = feature.map(val => 
                        val + (Math.random() - 0.5) * 0.05
                    );
                    augmentedFeatures.push(noisyFeature);
                    augmentedLabels.push(labels[idx]);
                }
            });

            // Update model architecture with more capacity
            const model = tf.sequential();
            model.add(tf.layers.dense({
                units: 256,
                activation: 'relu',
                inputShape: [7], // Updated for new feature count
                kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
            }));
            model.add(tf.layers.batchNormalization());
            model.add(tf.layers.dropout(0.3));

            model.add(tf.layers.dense({
                units: 128,
                activation: 'relu',
                kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
            }));
            model.add(tf.layers.batchNormalization());
            model.add(tf.layers.dropout(0.2));

            model.add(tf.layers.dense({
                units: 64,
                activation: 'relu',
                kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
            }));
            model.add(tf.layers.batchNormalization());
            model.add(tf.layers.dropout(0.1));

            model.add(tf.layers.dense({
                units: uniqueClasses.length,
                activation: 'softmax'
            }));

            // Update training configuration
            model.compile({
                optimizer: tf.train.adam(0.0001),
                loss: 'categoricalCrossentropy',
                metrics: ['accuracy']
            });

            // Update training parameters
            await model.fit(
                tf.tensor2d(augmentedFeatures), 
                tf.tensor2d(augmentedLabels), 
                {
                    epochs: 300,
                    batchSize: 16,
                    validationSplit: 0.2,
                    shuffle: true,
                    callbacks: {
                        onEpochEnd: (epoch, logs) => {
                            if (epoch % 10 === 0) {
                                setTrainingStatus(
                                    `Training... Epoch ${epoch + 1}/300 - ` +
                                    `Loss: ${logs.loss.toFixed(4)} - ` +
                                    `Accuracy: ${(logs.acc * 100).toFixed(2)}% - ` +
                                    `Val Accuracy: ${(logs.val_acc * 100).toFixed(2)}%`
                                );
                            }
                        }
                    }
                }
            );

            // Save model
            await model.save('indexeddb://chemical-model');
            setTrainingStatus('Training completed! Model saved successfully.');

            // Cleanup
            model.dispose();

        } catch (error) {
            console.error('Training error:', error);
            setTrainingStatus('Error: ' + error.message);
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
                                <div lassName='space-y-4'>
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

                    <div className='mt-8 flex justify-center gap-4'>
                        <button
                            onClick={() => window.location.href = '/'}
                            className='inline-flex items-center gap-2 px-6 py-4 text-base font-medium
                                    bg-gray-50 text-gray-600 rounded-lg transition-all duration-200
                                    hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98]
                                    shadow-sm hover:shadow-md'
                        >
                            <ChevronRight className='h-5 w-5' />
                            Back to Home
                        </button>
                        <button
                            onClick={() => window.location.href = '/test'}
                            className='inline-flex items-center gap-2 px-8 py-4 text-base font-medium
                                    bg-blue-600 text-white rounded-lg transition-all duration-200
                                    hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]
                                    shadow-sm hover:shadow-md'
                        >
                            <CheckCircle className='h-5 w-5' />
                            Predict Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Train;