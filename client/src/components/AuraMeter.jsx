import React from 'react';

const AuraMeter = ({ score }) => {
  // Calculate percentage for the meter
  const percentage = Math.min(100, Math.max(0, (score / 50) * 100));
  
  // Determine color based on score
  const getScoreColor = (score) => {
    if (score >= 40) return 'from-green-400 to-green-600';
    if (score >= 30) return 'from-blue-400 to-blue-600';
    if (score >= 20) return 'from-yellow-400 to-yellow-600';
    if (score >= 10) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  // Determine label based on score
  const getScoreLabel = (score) => {
    if (score >= 40) return 'Exceptional Vibe!';
    if (score >= 30) return 'Great Vibe!';
    if (score >= 20) return 'Good Vibe';
    if (score >= 10) return 'Average Vibe';
    return 'Needs Work';
  };

  return (
    <div className="w-full transition-all">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-3 sm:mb-4 gap-2">
        <span className="text-sm sm:text-base font-semibold text-gray-700">Aura Score</span>
        <span className="text-lg sm:text-xl font-bold text-gradient-purple-pink">{score}/50</span>
      </div>
      
      {/* Circular progress bar */}
      <div className="flex justify-center mb-3 sm:mb-4">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="6"
              className="sm:stroke-8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="6"
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
              className="transition-all duration-1000 ease-out sm:stroke-8"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg sm:text-2xl font-bold text-gray-800">{score}</span>
          </div>
        </div>
      </div>
      

      

    </div>
  );
};

export default AuraMeter;