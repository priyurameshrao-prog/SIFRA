import { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import api from '../api';
import socket from '../socket';

function ShareLocation() {
  const [sharing, setSharing] = useState(false);
  const [shareId, setShareId] = useState(null);
  const [position, setPosition] = useState(null);
  const watchIdRef = useRef(null);

  const startSharing = async () => {
    try {
      const res = await api.post('/location/start', { durationMinutes: 30 });
      const newShareId = res.data.shareId;
      setShareId(newShareId);
      setSharing(true);

      socket.emit('join-share', newShareId);

      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          socket.emit('send-location', {
            shareId: newShareId,
            lat: latitude,
            lng: longitude,
          });
        },
        (err) => console.error('Location watch error', err),
        { enableHighAccuracy: true }
      );
    } catch (err) {
      console.error('Failed to start sharing', err);
    }
  };

  const stopSharing = async () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    if (shareId) {
      await api.patch(`/location/${shareId}/stop`);
    }
    setSharing(false);
    setShareId(null);
    setPosition(null);
  };

  const shareLink = shareId ? `${window.location.origin}/track/${shareId}` : '';

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-10 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold text-white">Live Location Share</h1>

      {!sharing ? (
        <button
          onClick={startSharing}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold"
        >
          Start Sharing (30 min)
        </button>
      ) : (
        <>
          <button
            onClick={stopSharing}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Stop Sharing
          </button>

          <div className="bg-gray-800 p-4 rounded-lg w-full max-w-md text-center">
            <p className="text-gray-400 text-sm mb-1">Share this link with your contact:</p>
            <p className="text-white text-sm break-all">{shareLink}</p>
          </div>

          {position && (
            <div className="w-full max-w-md h-72 rounded-xl overflow-hidden">
              <MapContainer center={position} zoom={16} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={position} />
              </MapContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ShareLocation;
