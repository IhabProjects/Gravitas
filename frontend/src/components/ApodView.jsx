import React from 'react';
import { motion } from 'framer-motion';

const ApodView = ({ randomApod, handleRandomApod, apodLoading }) => {
  return (
    <motion.div
      key="apod"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full overflow-y-auto bg-gray-950/50 backdrop-blur-md p-3 sm:p-4 md:p-6"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900/70 backdrop-blur-md rounded-lg sm:rounded-xl overflow-hidden border border-gray-800">
          <div className="p-3 sm:p-4 md:p-6 border-b border-gray-800">
            <h2 className="text-xl sm:text-2xl font-bold text-white">{randomApod.title}</h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              {new Date(randomApod.date).toLocaleDateString()} - NASA Astronomy Picture of the Day
            </p>
          </div>

          <div className="border-b border-gray-800">
            {randomApod.media_type === 'video' ? (
              <div className="relative aspect-video">
                <iframe
                  src={randomApod.url}
                  title={randomApod.title}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            ) : (
              <img
                src={randomApod.url}
                alt={randomApod.title}
                className="w-full h-auto"
                loading="lazy"
                decoding="async"
              />
            )}
          </div>

          <div className="p-3 sm:p-4 md:p-6">
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">{randomApod.explanation}</p>

            <div className="mt-4 sm:mt-6 flex justify-end">
              <button
                onClick={handleRandomApod}
                disabled={apodLoading}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 text-white text-sm sm:text-base rounded-md hover:bg-indigo-700 transition"
              >
                {apodLoading ? 'Loading...' : 'New Random Photo'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ApodView;
