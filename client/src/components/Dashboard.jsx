import { useState } from 'react';
import api from '../api';

function Dashboard() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSOS = () => {
    setLoading(true);
    setStatus('');

    if (!navigator.geolocation) {
      setStatus('Geolocation not supported on this device.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          await api.post('/alerts', {
            lat: latitude,
            lng: longitude,
          });
          setStatus('🚨 SOS sent! Your trusted contacts have been notified.');
        } catch (err) {
          setStatus('Something went wrong sending the alert.');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setStatus('Could not get your location. Please allow location access.');
        setLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-6 px-4">
      <h1 className="text-3xl font-bold text-white text-center">
        Women Safety App
      </h1>

      <button
        onClick={handleSOS}
        disabled={loading}
        className="w-56 h-56 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 transition-all duration-150 shadow-2xl shadow-red-900/50 text-white text-2xl font-bold flex items-center justify-center disabled:opacity-60"
      >
        {loading ? 'Sending...' : 'SOS'}
      </button>

      {status && (
        <p className="text-white text-center max-w-sm">{status}</p>
      )}
    </div>
  );
}

export default Dashboard;