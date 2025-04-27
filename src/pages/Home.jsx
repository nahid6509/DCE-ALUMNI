import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { FaFlask, FaAtom, FaMicroscope, FaDna, FaSearch, FaVial, FaChartLine } from "react-icons/fa";
import { Link } from "react-router-dom";

const MoleculeAnimation = ({ delay = 0 }) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.7, 0],
        scale: [0.2, 1, 0.5],
        rotate: [0, 360],
      }}
      transition={{
        duration: Math.random() * 10 + 15,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="relative">
        <div className="absolute rounded-full bg-blue-500 w-4 h-4" />
        <div className="absolute rounded-full bg-red-500 w-3 h-3 -top-6 -left-2" />
        <div className="absolute rounded-full bg-green-500 w-3 h-3 -top-2 -left-6" />
        <div className="absolute rounded-full bg-purple-500 w-3 h-3 top-6 -left-2" />
        <div className="absolute rounded-full bg-yellow-500 w-3 h-3 -top-2 left-6" />
        <div className="absolute w-[1px] h-6 bg-gray-400 top-0 left-2 transform -rotate-45" />
        <div className="absolute w-[1px] h-6 bg-gray-400 top-0 left-2 transform rotate-45" />
        <div className="absolute w-[1px] h-6 bg-gray-400 -top-6 left-2 transform rotate-45" />
        <div className="absolute w-[1px] h-6 bg-gray-400 -top-6 left-2 transform -rotate-45" />
      </div>
    </motion.div>
  );
};

const ChemicalReaction = () => {
  const controls = useAnimation();
  
  useEffect(() => {
    controls.start({
      opacity: [0, 1, 1, 0],
      scale: [0.5, 1, 1, 0.5],
      x: [0, 100, 100, 200],
      transition: { 
        duration: 8,
        repeat: Infinity,
        times: [0, 0.3, 0.7, 1]
      }
    });
  }, [controls]);

  return (
    <div className="fixed bottom-20 left-20 flex items-center justify-center pointer-events-none opacity-50">
      <motion.div 
        className="h-12 w-12 bg-blue-400 rounded-full flex items-center justify-center relative"
        animate={controls}
      >
        <span className="text-white font-bold">A</span>
      </motion.div>
      <motion.div 
        className="h-12 w-12 bg-green-400 rounded-full flex items-center justify-center mx-6 relative"
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [0.5, 1, 1, 0.5],
          x: [0, 100, 100, 200],
          transition: { 
            duration: 8, 
            delay: 0.5,
            repeat: Infinity,
            times: [0, 0.3, 0.7, 1]
          }
        }}
      >
        <span className="text-white font-bold">B</span>
      </motion.div>
      <motion.div
        className="absolute left-64 font-bold text-2xl"
        animate={{
          opacity: [0, 1, 0],
          transition: {
            duration: 2,
            repeat: Infinity,
            repeatDelay: 6
          }
        }}
      >
        +
      </motion.div>
      <motion.div 
        className="h-14 w-14 bg-purple-500 rounded-full flex items-center justify-center absolute right-0"
        animate={{
          opacity: [0, 0, 1, 1],
          scale: [0.2, 0.2, 1, 1],
          x: [300, 300, 0, 0],
          transition: { 
            duration: 8, 
            repeat: Infinity,
            times: [0, 0.6, 0.8, 1]
          }
        }}
      >
        <span className="text-white font-bold">AB</span>
      </motion.div>
    </div>
  );
};

// New DNA Animation Component
const DNAAnimation = () => {
  return (
    <div className="fixed top-40 right-40 h-64 w-20 opacity-40 pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-16 flex justify-between"
          style={{ top: i * 16 }}
          animate={{
            rotateY: [0, 180, 360],
            scaleX: [1, 0.5, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        >
          <div className={`h-3 w-3 rounded-full ${i % 2 === 0 ? 'bg-blue-500' : 'bg-red-500'}`}></div>
          <div className={`h-3 w-3 rounded-full ${i % 2 === 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
        </motion.div>
      ))}
      <div className="absolute h-full w-[1px] left-1/2 bg-gray-300"></div>
    </div>
  );
};

// New Test Tube Animation
const TestTubeAnimation = () => {
  return (
    <div className="fixed bottom-40 right-32 pointer-events-none opacity-60">
      <div className="relative w-10 h-32 bg-purple-100 rounded-b-full overflow-hidden">
        {/* Test tube content */}
        <motion.div 
          className="absolute bottom-0 w-full bg-purple-300"
          style={{ height: '70%' }}
          animate={{ 
            height: ['70%', '72%', '68%', '70%'] 
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        {/* Bubbles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-80"
            style={{ left: `${1 + (i % 3) * 3}px` }}
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: [-5, -30],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.4,
              repeat: Infinity,
              repeatDelay: i * 0.1 + 1,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// New Data Visualization Animation
const DataVisualizationAnimation = () => {
  return (
    <div className="fixed bottom-32 left-40 pointer-events-none opacity-60">
      <div className="flex items-end h-24 space-x-1">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t"
            initial={{ height: 0 }}
            animate={{ 
              height: Math.sin(i * 0.5) * 30 + 40
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="container mx-auto px-4 py-16 relative">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 relative z-10"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <FaAtom className="text-6xl text-blue-600 mx-auto mb-6" />
              <motion.div 
                className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-purple-400"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              />
            </motion.div>
            <motion.h1 
              className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              InstaChem
            </motion.h1>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Chemical Prediction Platform
            </h2>
            <motion.p 
              className="text-xl text-gray-600 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Predict unknown chemicals using advanced machine learning models
            </motion.p>
            <div className="space-x-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="inline-block"
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  to="/test"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                  <FaSearch className="mr-2" />
                  Start Prediction
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="inline-block"
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  to="/train"
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center"
                >
                  <FaDna className="mr-2" />
                  Train Model
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-6 rounded-xl shadow-lg cursor-pointer"
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
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-6 rounded-xl shadow-lg cursor-pointer"
            >
              <FaAtom className="text-4xl text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Model Training</h3>
              <p className="text-gray-600">
                Train custom models with your chemical dataset
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-6 rounded-xl shadow-lg cursor-pointer"
            >
              <FaMicroscope className="text-4xl text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Analysis Tools</h3>
              <p className="text-gray-600">
                Advanced tools for chemical analysis and visualization
              </p>
            </motion.div>
          </div>

          {/* Additional Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8 mt-10 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-6 rounded-xl shadow-lg cursor-pointer"
            >
              <FaVial className="text-4xl text-amber-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Compound Library</h3>
              <p className="text-gray-600">
                Access and manage an extensive library of chemical compounds
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-6 rounded-xl shadow-lg cursor-pointer"
            >
              <FaChartLine className="text-4xl text-indigo-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Predictive Analytics</h3>
              <p className="text-gray-600">
                Powerful statistics and trend analysis for chemical properties
              </p>
            </motion.div>
          </div>

          {/* Floating Molecule Animations */}
          <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <MoleculeAnimation key={i} delay={i * 3} />
            ))}
          </div>

          {/* Chemical Reaction Animation */}
          <ChemicalReaction />

          {/* Bubbling Flask Animation */}
          <div className="fixed top-20 right-20 pointer-events-none">
            <div className="relative w-16 h-24 bg-blue-100 rounded-b-full rounded-t-lg opacity-70">
              {/* Flask neck */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-blue-100 rounded-t-lg"></div>
              
              {/* Bubbles */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-white rounded-full"
                  style={{ left: `${3 + (i % 3) * 5}px` }}
                  animate={{
                    y: [20, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.5,
                    repeat: Infinity,
                    repeatDelay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>

          {/* DNA Animation */}
          <DNAAnimation />

          {/* Test Tube Animation */}
          <TestTubeAnimation />

          {/* Data Visualization Animation */}
          <DataVisualizationAnimation />
        </div>
      </div>
    </div>
  );
};

export default Home;
