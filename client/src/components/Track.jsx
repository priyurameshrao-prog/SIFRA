import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../api';
import socket from '../socket';

function Track() {
  const { shareId } = useParams();
  const [position, setPosition] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const res = await api.get(`/location/${shareId}`);
        const share = res.data;

        if (!share.active) {
          setStatus('ended');
          return;
        }

        if (share.currentLocation && share.currentLocation.lat) {
          setPosition([share.currentLocation.lat, share.currentLocation.lng]);
        }
        setStatus('active');
      } catch (err) {
        setStatus('not-found');
      }
    };

    fetchInitial();

    socket.emit('join-share', shareId);

    socket.on('location-update', ({ lat, lng }) => {
      setPosition([lat, lng]);
      setStatus('active');
    });

    return () => {
      socket.off('location-update');
    };
  }, [shareId]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">Loading location...</p>
      </div>
    );
  }

  if (status === 'not-found') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">This share link is invalid.</p>
      </div>
    );
  }

  if (status === 'ended') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">This location share has ended.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-10 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold text-white">Live Location</h1>

      {!position && (
        <p className="text-gray-400">Waiting for location updates...</p>
      )}

      {position && (
        <div className="w-full max-w-md h-96 rounded-xl overflow-hidden">
          <MapContainer center={position} zoom={16} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position}>
              <Popup>Current location</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
}

export default Track;