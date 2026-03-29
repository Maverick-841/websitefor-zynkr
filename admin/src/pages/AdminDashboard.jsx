import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiSearchLine, RiLogoutBoxRLine, RiUserLine, RiLineChartLine } from '@remixicon/react';

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('adminToken');
            navigate('/admin/login');
            return;
          }
          throw new Error('Failed to fetch user data');
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.skills.join(', ').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Z</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-800">Admin Dashboard</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-500 font-medium transition-colors">
            <RiLogoutBoxRLine size={20} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total Users</p>
              <h3 className="text-3xl font-black text-slate-800 mt-2">{users.length}</h3>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 text-blue-600">
               <RiUserLine size={28} />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Active Today</p>
              <h3 className="text-3xl font-black text-slate-800 mt-2">{users.filter(u => new Date(u.createdAt).toDateString() === new Date().toDateString()).length}</h3>
            </div>
            <div className="p-4 rounded-xl bg-green-50 text-green-600">
               <RiLineChartLine size={28} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6 flex items-center p-4">
          <div className="flex-1 relative">
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, email, or skill..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border-none outline-none py-3 pl-12 pr-4 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {error ? (
              <div className="p-8 text-center text-red-500 font-bold">{error}</div>
          ) : loading ? (
              <div className="p-16 text-center text-slate-500 font-medium animate-pulse">Loading profiles from database...</div>
          ) : filteredUsers.length === 0 ? (
              <div className="p-16 text-center text-slate-500 font-medium">No users found matching your search.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="p-5">CANDIDATE</th>
                    <th className="p-5">CONTACT</th>
                    <th className="p-5">EXPERIENCE</th>
                    <th className="p-5">SKILLS</th>
                    <th className="p-5">JOINED</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-5">
                        <div className="font-bold text-slate-800">{user.fullName}</div>
                        <div className="text-sm text-slate-400">{user.gender || "Not specified"}</div>
                      </td>
                      <td className="p-5 text-sm text-slate-600">
                        <div className="font-medium">{user.email}</div>
                        <div>{user.phone}</div>
                      </td>
                      <td className="p-5">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                          {user.experienceLevel}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {user.skills.slice(0, 3).map((s, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded border border-slate-200">
                              {s}
                            </span>
                          ))}
                          {user.skills.length > 3 && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-medium rounded border border-slate-200">
                              +{user.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-5 text-sm font-medium text-slate-500 whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
