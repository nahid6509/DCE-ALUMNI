import React from "react";
import { motion } from "framer-motion";
import { FaFlask, FaAtom, FaMicroscope } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Chemical Prediction Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Predict unknown chemicals using advanced machine learning models
            </p>
            <div className="space-x-4">
              <Link
                to="/test"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Prediction
              </Link>
              <Link
                to="/train"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Train Model
              </Link>
            </div>
          </motion.div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <FaFlask className="text-4xl text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Chemical Prediction
              </h3>
              <p className="text-gray-600">
                Predict unknown chemical properties using our trained models
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <FaAtom className="text-4xl text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Model Training</h3>
              <p className="text-gray-600">
                Train custom models with your chemical dataset
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <FaMicroscope className="text-4xl text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Analysis Tools</h3>
              <p className="text-gray-600">
                Advanced tools for chemical analysis and visualization
              </p>
            </motion.div>
          </div>

          {/* Floating Animation Background */}
          <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-blue-200 rounded-full opacity-20"
                style={{
                  width: Math.random() * 100 + 50,
                  height: Math.random() * 100 + 50,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, Math.random() * 100 - 50],
                  x: [0, Math.random() * 100 - 50],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
