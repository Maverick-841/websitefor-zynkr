import { useState, useEffect } from 'react';

export const useGithubData = (gitHubUrl) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const extractUsername = (url) => {
    if (!url) return null;
    
    try {
      // Handle various GitHub URL formats
      // https://github.com/username
      // https://www.github.com/username
      // github.com/username
      const match = url.match(/github\.com\/([a-zA-Z0-9_-]+)/);
      return match ? match[1] : null;
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    if (!gitHubUrl || gitHubUrl.trim() === '') {
      setData(null);
      setError(null);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const username = extractUsername(gitHubUrl);

        if (!username) {
          setError('Invalid GitHub URL. Please use format: github.com/username');
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/github/${username}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch GitHub data');
        }

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        console.error('GitHub fetch error:', err);
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to avoid too many requests
    const timer = setTimeout(fetchData, 500);
    return () => clearTimeout(timer);
  }, [gitHubUrl]);

  return { data, loading, error };
};

export default useGithubData;
