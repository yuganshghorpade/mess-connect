'use client';
import Header from "../header/page";
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Clock, CheckCircle, AlertCircle, Calendar, ArrowRight } from 'lucide-react';

const ExtendSubscriptionForm = () => {
  const params = useParams();
  const [days, setDays] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Get subscription ID from URL params
  const subscriptionId = params.exe;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!days || !subscriptionId) {
      setError('Please enter the number of days');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await fetch(`/api/subscriptions/extend-subscription?subscriptionId=${subscriptionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ days: parseInt(days) }),
      });
      
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Received non-JSON response: ${text.substring(0, 100)}...`);
      }
      
      if (response.ok) {
        setMessage(data.message || 'Subscription extended successfully');
        setDays('');
      } else {
        setError(data.message || `Error: ${response.status}`);
      }
    } catch (err) {
      console.error('Error details:', err);
      setError(`Failed to extend subscription: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
        <Header/>
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          
          {/* Header */}
          <div className="bg-indigo-600 px-6 py-8 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Subscription Extension</h2>
              <Clock className="h-8 w-8 text-indigo-200" />
            </div>
            <p className="mt-2 text-indigo-200">Extend  access period</p>
          </div>
          
          {/* Form Content */}
          <div className="p-6">
            {/* Status Messages */}
            {message && (
              <div className="mb-6 flex items-center bg-green-50 p-4 rounded-lg border-l-4 border-green-500 animate-fadeIn">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <p className="text-green-700">{message}</p>
              </div>
            )}
            
            {error && (
              <div className="mb-6 flex items-center bg-red-50 p-4 rounded-lg border-l-4 border-red-500 animate-fadeIn">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            {/* Subscription ID Display */}
            <div className="bg-slate-50 px-4 py-3 rounded-lg mb-6 border border-slate-200">
              <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Subscription ID</p>
              <p className="font-mono text-slate-700 break-all">{subscriptionId || 'Not specified'}</p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="days" className="block text-sm font-medium text-slate-700 mb-2">
                  Extension Period (Days)
                </label>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-slate-400" />
                  </div>
                  
                  <input
                    type="number"
                    id="days"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    min="1"
                    required
                    placeholder="Enter number of days"
                    className="pl-10 w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400 transition-all duration-200"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">Enter the number of days you wish to extend your subscription</p>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || !days}
                  className={`w-full flex items-center justify-center rounded-lg py-3 px-4 text-white font-medium transition-all duration-200 ${
                    loading || !days
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Extend Subscription
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-4">
          Need help? Contact our support team for assistance.
        </p>
      </div>
    </div>
    </div>
  );
};

export default ExtendSubscriptionForm;