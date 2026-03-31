import React, { useEffect, useMemo, useState } from 'react';

const levelStyles = {
  Beginner: 'bg-blue-100 text-blue-700 border-blue-200',
  Intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Advanced: 'bg-green-100 text-green-700 border-green-200'
};

const barColors = {
  easy: 'bg-green-500',
  medium: 'bg-yellow-500',
  hard: 'bg-red-500'
};

const LeetCodeAnalysis = ({ leetcodeUrl = '', showUrlInput = true }) => {
  const [url, setUrl] = useState(leetcodeUrl || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [lastAnalyzedUrl, setLastAnalyzedUrl] = useState('');

  useEffect(() => {
    setUrl(leetcodeUrl || '');
  }, [leetcodeUrl]);

  const percentages = useMemo(() => {
    const total = result?.stats?.total || 0;
    if (!total) return { easy: 0, medium: 0, hard: 0 };

    return {
      easy: Math.round(((result.stats.easy || 0) / total) * 100),
      medium: Math.round(((result.stats.medium || 0) / total) * 100),
      hard: Math.round(((result.stats.hard || 0) / total) * 100)
    };
  }, [result]);

  const analyze = async (inputUrl = url, clearPrevious = true) => {
    const normalizedUrl = (inputUrl || '').trim();

    setError('');
    if (clearPrevious) setResult(null);

    if (!normalizedUrl) {
      setError('Please enter a valid LeetCode profile URL.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/leetcode/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leetcodeUrl: normalizedUrl })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to analyze LeetCode profile.');
      }

      setResult(data);
      setLastAnalyzedUrl(normalizedUrl);
    } catch (err) {
      setError(err.message || 'Failed to analyze profile. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const normalizedUrl = (url || '').trim();
    if (!normalizedUrl || loading || normalizedUrl === lastAnalyzedUrl) {
      return;
    }

    if (!/leetcode\.com\//i.test(normalizedUrl)) {
      return;
    }

    const timer = setTimeout(() => {
      analyze(normalizedUrl, false);
    }, 800);

    return () => clearTimeout(timer);
  }, [url, loading, lastAnalyzedUrl]);

  const progressText = result?.progress?.deltaTotal === null || result?.progress?.deltaTotal === undefined
    ? 'No previous snapshot yet.'
    : result.progress.deltaTotal > 0
      ? `Great! You improved by ${result.progress.deltaTotal} solved problems since last snapshot.`
      : result.progress.deltaTotal < 0
        ? `Current solved count is ${Math.abs(result.progress.deltaTotal)} lower than previous snapshot.`
        : 'No change from the last snapshot yet.';

  return (
    <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
      <div>
        <h3 className="text-xl font-bold text-gray-900">LeetCode Analysis</h3>
        <p className="text-sm text-gray-500">Actionable DSA insights from your LeetCode profile</p>
      </div>

      {showUrlInput && (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://leetcode.com/u/username/"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={analyze}
            disabled={loading}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-60"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      )}

      {error && (
        <div className="text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg p-3">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4 border-t pt-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-500">Total Solved</p>
              <p className="text-2xl font-bold text-gray-900">{result.stats.total}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-xs text-green-700">Easy</p>
              <p className="text-2xl font-bold text-green-700">{result.stats.easy}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <p className="text-xs text-yellow-700">Medium</p>
              <p className="text-2xl font-bold text-yellow-700">{result.stats.medium}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <p className="text-xs text-red-700">Hard</p>
              <p className="text-2xl font-bold text-red-700">{result.stats.hard}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${levelStyles[result.level] || levelStyles.Beginner}`}>
              {result.level}
            </span>
            {result.ranking ? (
              <span className="text-xs px-2.5 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-700 font-semibold">
                Ranking: {result.ranking}
              </span>
            ) : null}
          </div>

          <div className="space-y-2">
            {['easy', 'medium', 'hard'].map((key) => (
              <div key={key}>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span className="capitalize">{key}</span>
                  <span>{percentages[key]}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-2 ${barColors[key]}`} style={{ width: `${percentages[key]}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="font-bold text-gray-800 mb-2">Weak Areas</h4>
              {result.weakAreas?.length ? (
                <ul className="space-y-1">
                  {result.weakAreas.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-600">- {item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">No major weak areas detected.</p>
              )}
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="font-bold text-gray-800 mb-2">Strengths</h4>
              {result.strengths?.length ? (
                <ul className="space-y-1">
                  {result.strengths.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-600">- {item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">Keep solving consistently to build strengths.</p>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-bold text-blue-900 mb-2">AI Action Plan</h4>
            <ul className="space-y-1 mb-3">
              {(result.suggestions || []).map((item, idx) => (
                <li key={idx} className="text-sm text-blue-800">- {item}</li>
              ))}
            </ul>
            <p className="text-sm font-semibold text-blue-900">
              Daily Plan: {result.dailyPlan.easy} Easy + {result.dailyPlan.medium} Medium + {result.dailyPlan.hard} Hard
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <h4 className="font-bold text-purple-900 mb-2">Custom Challenge</h4>
            <p className="text-sm text-purple-800">{result.challenge}</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h4 className="font-bold text-gray-900 mb-2">Progress Tracker</h4>
            <p className="text-sm text-gray-700">{progressText}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeetCodeAnalysis;
