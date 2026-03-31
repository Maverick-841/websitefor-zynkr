import React, { useState, useMemo } from 'react';

const ResumeIntegration = ({
  resumeUrl,
  resumeFileName,
  isUploadingResume,
  resumeError,
  onResumeUpload,
  selectedRole = 'fullstack'
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState('');

  const scoreColor = useMemo(() => {
    const score = analysisResult?.atsScore || 0;
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  }, [analysisResult]);

  const handleResumeUploadAndAnalyze = async (e) => {
    // Call the parent's upload handler first
    await onResumeUpload(e);
    
    const file = e.target.files?.[0];
    if (!file) return;

    // Automatically analyze after upload
    setAnalyzing(true);
    setAnalysisError('');
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('role', selectedRole || 'fullstack');

      const response = await fetch('http://localhost:5000/api/resume/analyze', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Failed to analyze resume.');
      }

      setAnalysisResult(data);
    } catch (err) {
      setAnalysisError(err.message || 'Failed to analyze resume. Please retry.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Resume Upload Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Resume Upload <span className="text-red-500">*</span>
        </label>

        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleResumeUploadAndAnalyze}
          disabled={isUploadingResume || analyzing}
          className="hidden"
          id="resumeInputSeparated"
        />

        <label
          htmlFor="resumeInputSeparated"
          className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            isUploadingResume || analyzing
              ? 'bg-blue-50 border-blue-300'
              : resumeUrl
              ? 'bg-green-50 border-green-300'
              : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          } ${isUploadingResume || analyzing ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <span className="text-lg">📄</span>
          <div className="text-center">
            {isUploadingResume || analyzing ? (
              <p className="text-sm font-semibold text-blue-600">{isUploadingResume ? 'Uploading...' : 'Analyzing...'}</p>
            ) : resumeUrl ? (
              <div>
                <p className="text-sm font-semibold text-green-700">✓ {resumeFileName}</p>
                <p className="text-xs text-green-600">Click to replace</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-gray-700">Click to upload resume</p>
                <p className="text-xs text-gray-500">PDF only (Max 2MB) - Required</p>
              </div>
            )}
          </div>
        </label>

        {resumeError && (
          <p className="text-xs text-red-600 font-medium mt-2">
            {resumeError}
          </p>
        )}
      </div>

      {/* ATS Analysis Results - Shown after upload */}
      {analysisResult && (
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">ATS Score & Analysis</h3>
            <p className="text-sm text-gray-600">Your resume has been automatically analyzed.</p>
          </div>

          <div className="space-y-4 border-t border-blue-200 pt-5">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">ATS Score</p>
              <div className="flex items-center gap-3">
                <p className="text-4xl font-black text-gray-900">{analysisResult.atsScore}%</p>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-3 ${scoreColor} transition-all duration-500`} style={{ width: `${analysisResult.atsScore}%` }} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h4 className="font-bold text-green-800 mb-2">Strengths</h4>
                {analysisResult.strengths?.length ? (
                  <ul className="space-y-1">
                    {analysisResult.strengths.map((item, idx) => (
                      <li key={idx} className="text-sm text-green-800">• {item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-green-800">No strengths detected yet.</p>
                )}
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <h4 className="font-bold text-red-800 mb-2">Areas to Improve</h4>
                {analysisResult.weaknesses?.length ? (
                  <ul className="space-y-1">
                    {analysisResult.weaknesses.map((item, idx) => (
                      <li key={idx} className="text-sm text-red-800">• {item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-red-800">No major weaknesses found.</p>
                )}
              </div>
            </div>

            {analysisResult.missingKeywords?.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h4 className="font-bold text-gray-900 mb-2">Missing Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.missingKeywords.map((kw, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analysisResult.suggestions?.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h4 className="font-bold text-gray-900 mb-2">AI Suggestions</h4>
                <ul className="space-y-1">
                  {analysisResult.suggestions.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-700">• {item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {analysisError && (
        <div className="text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg p-3">
          {analysisError}
        </div>
      )}
    </div>
  );
};

export default ResumeIntegration;
