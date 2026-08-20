import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Contacts from './components/Contacts';
import History from './components/History';
import ShareLocation from './components/ShareLocation';
import Track from './components/Track';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/history" element={<History />} />
        <Route path="/share" element={<ShareLocation />} />
        <Route path="/track/:shareId" element={<Track />} />
      </Routes>
    </>
  );
}

export default App;