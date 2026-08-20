import { useState, useEffect } from 'react';
import api from '../api';

function History() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const res = await api.get('/alerts');
      setAlerts(res.data);
    } catch (err) {
      console.error('Failed to fetch alerts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleResolve = async (id) => {
    try {
      await api.patch(`/alerts/${id}/resolve`);
      fetchAlerts();
    } catch (err) {
      console.error('Failed to resolve alert', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-10 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold text-white">Alert History</h1>

      {loading && <p className="text-gray-400">Loading...</p>}

      {!loading && alerts.length === 0 && (
        <p className="text-gray-400">No alerts triggered yet.</p>
      )}

      <div className="w-full max-w-md flex flex-col gap-3">
        {alerts.map((alert) => (
          <div
            key={alert._id}
            className="bg-gray-800 p-4 rounded-lg flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${
                  alert.status === 'active'
                    ? 'bg-red-600 text-white'
                    : 'bg-green-700 text-white'
                }`}
              >
                {alert.status.toUpperCase()}
              </span>
              <span className="text-gray-400 text-xs">
                {new Date(alert.createdAt).toLocaleString()}
              </span>
            </div>

            <p className="text-white text-sm">
              📍 {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)}
            </p>

            <p className="text-gray-400 text-xs">
              Notified: {alert.contactsNotified.map((c) => c.name).join(', ') || 'No contacts'}
            </p>

            {alert.status === 'active' && (
              <button
                onClick={() => handleResolve(alert._id)}
                className="mt-2 bg-green-700 hover:bg-green-800 text-white text-sm py-1.5 rounded-lg font-medium"
              >
                Mark as Resolved
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;