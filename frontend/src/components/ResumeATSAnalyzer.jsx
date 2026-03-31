import React, { useEffect, useMemo, useState } from 'react';

const ResumeATSAnalyzer = ({ selectedRole = 'fullstack' }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const scoreColor = useMemo(() => {
    const score = result?.atsScore || 0;
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  }, [result]);

  const onFileChange = (e) => {
    const picked = e.target.files?.[0] || null;
    setFile(picked);
    setError('');
    setResult(null);
  };

  const analyze = async (fileToAnalyze) => {
    setError('');
    setResult(null);

    if (!fileToAnalyze) {
      setError('Please upload a resume file (PDF or DOCX).');
      return;
    }

    const lower = fileToAnalyze.name.toLowerCase();
    if (!(lower.endsWith('.pdf') || lower.endsWith('.docx'))) {
      setError('Only PDF and DOCX files are supported for ATS analysis.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('resume', fileToAnalyze);
      formData.append('role', selectedRole || 'fullstack');

      const response = await fetch('http://localhost:5000/api/resume/analyze', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Failed to analyze resume.');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to analyze resume. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!file) return;
    analyze(file);
  }, [file, selectedRole]);

  return (
    <div className="mt-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm space-y-4">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Resume ATS Analyzer</h3>
        <p className="text-sm text-gray-600">Upload PDF/DOCX and get ATS score, keyword gaps, and improvement plan.</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <input
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={onFileChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
        />
        <p className="text-xs text-gray-500">
          Resume will be analyzed automatically after file selection.
        </p>
      </div>

      {error && (
        <div className="text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg p-3">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4 border-t border-blue-200 pt-5">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">ATS Score</p>
            <div className="flex items-center gap-3">
              <p className="text-4xl font-black text-gray-900">{result.atsScore}%</p>
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-3 ${scoreColor} transition-all duration-500`} style={{ width: `${result.atsScore}%` }} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h4 className="font-bold text-green-800 mb-2">Strengths</h4>
              {result.strengths?.length ? (
                <ul className="space-y-1">
                  {result.strengths.map((item, idx) => (
                    <li key={idx} className="text-sm text-green-800">• {item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-green-800">No strengths detected yet.</p>
              )}
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h4 className="font-bold text-red-800 mb-2">Weaknesses</h4>
              {result.weaknesses?.length ? (
                <ul className="space-y-1">
                  {result.weaknesses.map((item, idx) => (
                    <li key={idx} className="text-sm text-red-800">• {item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-red-800">No major weaknesses found.</p>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h4 className="font-bold text-gray-900 mb-2">Missing Keywords</h4>
            {result.missingKeywords?.length ? (
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((kw, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    {kw}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">Great keyword coverage.</p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h4 className="font-bold text-gray-900 mb-2">AI Suggestions</h4>
            <ul className="space-y-1">
              {(result.suggestions || []).map((item, idx) => (
                <li key={idx} className="text-sm text-gray-700">• {item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
            <h4 className="font-bold text-indigo-900 mb-2">Improvement Plan</h4>
            <p className="text-sm text-indigo-900">{result.plan}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeATSAnalyzer;
