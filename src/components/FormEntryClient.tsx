'use client';

import { useState } from 'react';

interface FormEntryData {
  formId: string;
  data?: Record<string, any>;
}

const FormEntryClient = () => {
  const [formId, setFormId] = useState('');
  const [formData, setFormData] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const data: FormEntryData = { formId };
      
      // Parse form data if provided
      if (formData.trim()) {
        try {
          data.data = JSON.parse(formData);
        } catch (parseError) {
          setResult({ success: false, error: 'Invalid JSON in form data' });
          setLoading(false);
          return;
        }
      }

      // Send request to the ad-blocker-friendly endpoint
      const response = await fetch('/api/form-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const resultData = await response.json();
      
      if (response.ok) {
        setResult({ success: true, message: resultData.message });
      } else {
        setResult({ success: false, error: resultData.error || 'Failed to submit form' });
      }
    } catch (error) {
      setResult({ success: false, error: 'Network error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Form Entry Example</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="formId" className="block text-sm font-medium text-gray-700 mb-1">
            Form ID
          </label>
          <input
            type="text"
            id="formId"
            value={formId}
            onChange={(e) => setFormId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter form ID"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="formData" className="block text-sm font-medium text-gray-700 mb-1">
            Form Data (JSON, optional)
          </label>
          <textarea
            id="formData"
            value={formData}
            onChange={(e) => setFormData(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder='{"name": "John", "email": "john@example.com"}'
            rows={3}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Form Entry'}
        </button>
      </form>
      
      {result && (
        <div className={`mt-4 p-3 rounded-md ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {result.success ? '✓ ' : '✗ '}
          {result.message || result.error}
        </div>
      )}
      
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="font-medium text-gray-900 mb-2">How this works:</h3>
        <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
          <li>Sends minimal JSON data to avoid ad blocker detection</li>
          <li>Uses harmless endpoint name (/api/form-entry)</li>
          <li>Proper CORS headers to prevent cross-origin issues</li>
          <li>Server-side Supabase write (no client-side DB access)</li>
          <li>No tracking identifiers or cookies sent</li>
        </ul>
      </div>
    </div>
  );
};

export default FormEntryClient;