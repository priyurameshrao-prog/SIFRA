import { useState, useEffect } from 'react';
import api from '../api';

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchContacts = async () => {
    try {
      const res = await api.get('/contacts');
      setContacts(res.data);
    } catch (err) {
      console.error('Failed to fetch contacts', err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!name || !phone) return;

    setLoading(true);
    try {
      await api.post('/contacts', { name, phone, relation });
      setName('');
      setPhone('');
      setRelation('');
      fetchContacts();
    } catch (err) {
      console.error('Failed to add contact', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/contacts/${id}`);
      fetchContacts();
    } catch (err) {
      console.error('Failed to delete contact', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-10 flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold text-white">Trusted Contacts</h1>

      <form
        onSubmit={handleAddContact}
        className="bg-gray-800 p-6 rounded-xl w-full max-w-sm flex flex-col gap-3"
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-700 text-white outline-none"
        />
        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-700 text-white outline-none"
        />
        <input
          type="text"
          placeholder="Relation (e.g. Mother, Friend)"
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-700 text-white outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold disabled:opacity-60"
        >
          {loading ? 'Adding...' : 'Add Contact'}
        </button>
      </form>

      <div className="w-full max-w-sm flex flex-col gap-3">
        {contacts.length === 0 && (
          <p className="text-gray-400 text-center">No contacts added yet.</p>
        )}
        {contacts.map((c) => (
          <div
            key={c._id}
            className="bg-gray-800 px-4 py-3 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="text-white font-semibold">{c.name}</p>
              <p className="text-gray-400 text-sm">{c.phone} {c.relation && `· ${c.relation}`}</p>
            </div>
            <button
              onClick={() => handleDelete(c._id)}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Contacts;