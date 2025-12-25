import React, { useState } from 'react';
import AuraMeter from '../components/AuraMeter';

const Home = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      
      // Reset previous results
      setResult(null);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file first');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('media', file);
    
    try {
      const response = await fetch('/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {      
      console.error('Error:', err);
      if (err instanceof SyntaxError) {
        setError('Invalid response from server. Please try again later.');
      } else {
        setError(err.message || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-6 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient-purple-pink mb-2 sm:mb-3 text-display-md">AuraMeter</h1>
          <p className="text-gray-600 text-base sm:text-lg">Upload your vibe and get your aura score instantly</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-purple-100 card-hover">
          <form onSubmit={handleSubmit}>
            <div className="mb-5 sm:mb-6">
              <label className="block text-gray-700 text-sm sm:text-base font-medium mb-2 sm:mb-3 text-center">
                Upload Photo or Video
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-48 sm:h-64 border-2 border-dashed border-purple-300 rounded-xl sm:rounded-2xl cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 group glow-effect">
                  {previewUrl ? (
                    <div className="flex flex-col items-center justify-center pt-4 pb-4 sm:pt-5 sm:pb-6 p-2 sm:p-4">
                      <div className="relative rounded-lg sm:rounded-xl overflow-hidden border-2 sm:border-4 border-white shadow-lg max-w-[90%] max-h-24 sm:max-h-40">
                        {file?.type.startsWith('video/') ? (
                          <video 
                            src={previewUrl} 
                            className="max-h-20 sm:max-h-32 max-w-full object-cover rounded"
                            controls={false}
                          />
                        ) : (
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="max-h-20 sm:max-h-32 max-w-full object-cover rounded"
                          />
                        )}
                      </div>
                      <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600 text-center">Click to change</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-6 pb-6 sm:pt-10 sm:pb-10 px-2 sm:px-4">
                      <div className="w-12 sm:w-16 h-12 sm:h-16 mb-2 sm:mb-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300 float-animation">
                        <svg className="w-6 sm:w-8 h-6 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                      </div>
                      <p className="text-base sm:text-lg font-medium text-gray-700 mb-0.5 sm:mb-1 text-center">
                        <span className="font-semibold text-purple-600">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 text-center">
                        JPG, PNG, MP4 (max 10MB)
                      </p>
                      <p className="text-xs text-gray-400 mt-1 sm:mt-2 text-center">
                        Show your vibe for instant aura analysis
                      </p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*,video/*" 
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl text-white font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-[1.02] btn-gradient ${loading ? 'opacity-75 cursor-not-allowed' : 'pulse-animation'}`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner mr-2"></div>
                  <span className="text-sm sm:text-base">Checking Your Aura...</span>
                </div>
              ) : (
                <span className="text-sm sm:text-base">✨ Check My Aura ✨</span>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {result && !loading && (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-7 border border-purple-100 mb-6 sm:mb-8 card-hover">
            {result.action === 'do_not_upload' ? (
              <div className="text-center animate-fadeIn">
                <div className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 sm:w-8 h-6 sm:h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">Content Blocked</h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-base sm:text-lg">{result.reason}</p>
                <div className="bg-red-50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-red-700 border border-red-200">
                  Category: <span className="font-semibold">{result.category}</span>
                </div>
              </div>
            ) : result.contentType ? (
              <div className="text-center animate-fadeIn">
                <div className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
                  <svg className="w-6 sm:w-8 h-6 sm:h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">Text Content Detected</h3>
                <p className="text-gray-600 mb-3 sm:mb-4 text-base sm:text-lg">Text-based content is not suitable for aura scoring</p>
                <div className="bg-yellow-50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-yellow-700 border border-yellow-200">
                  {result.improvementTips[0]}
                </div>
              </div>
            ) : (
              <div className="animate-fadeIn">
                <div className="text-center mb-5 sm:mb-7">
                  <div className="inline-flex items-center justify-center w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-gradient-to-r from-green-400 to-blue-500 mb-3 sm:mb-4 float-animation">
                    <svg className="w-5 sm:w-6 h-5 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Your Aura Result</h2>
                  <p className="text-gray-600 text-base sm:text-lg">Here's what we found in your vibe</p>
                </div>
                
                <div className="mb-5 sm:mb-7">
                  <AuraMeter score={result.auraPoints} />
                </div>
                
                <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-lg border-2 border-white glow-effect">
                  <div className="text-white text-base sm:text-xl font-medium italic mb-1">"{result.compliment}"</div>
                  <div className="flex justify-center mt-2 sm:mt-3">
                    <svg className="w-5 sm:w-6 h-5 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl p-4 mt-4 sm:mt-6 animate-fadeIn card-hover">
            <div className="flex items-center">
              <svg className="w-4 sm:w-5 h-4 sm:h-5 text-red-500 mr-1 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-red-700 font-medium text-sm sm:text-base break-words">{error}</p>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 text-gray-500 text-xs sm:text-sm">
          <p>Made  for Indian Gen-Z vibes</p>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Home;