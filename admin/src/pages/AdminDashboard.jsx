import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiSearchLine, RiLogoutBoxRLine, RiUserLine, RiLineChartLine, RiCloseLine, RiExternalLinkLine } from '@remixicon/react';

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/login');
        return;
      }
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      console.log('Fetched users:', data);
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchUsers();

    // Real-time polling every 5 seconds
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const filteredUsers = users.filter(user => {
    const nameMatch = (user.fullName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const skillsMatch = (user.skills || []).join(', ').toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || emailMatch || skillsMatch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Z</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-800">Zynkr Admin Dashboard</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-500 hover:text-red-500 font-medium transition-colors">
            <RiLogoutBoxRLine size={20} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
              <h3 className="text-3xl font-black text-slate-800 mt-2">
                {users.filter(u => u.createdAt && new Date(u.createdAt).toDateString() === new Date().toDateString()).length}
              </h3>
            </div>
            <div className="p-4 rounded-xl bg-green-50 text-green-600">
              <RiLineChartLine size={28} />
            </div>
          </div>
        </div>

        {/* Search */}
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
            <div className="p-16 text-center text-slate-500 font-medium">
              {users.length === 0 ? 'No users in database yet. Submit your first profile!' : 'No users match your search.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="p-5 whitespace-nowrap">NAME</th>
                    <th className="p-5 whitespace-nowrap">EMAIL</th>
                    <th className="p-5 whitespace-nowrap">PHONE</th>
                    <th className="p-5 whitespace-nowrap">EXPERIENCE</th>
                    <th className="p-5 whitespace-nowrap">SKILLS</th>
                    <th className="p-5 whitespace-nowrap">ROLES</th>
                    <th className="p-5 whitespace-nowrap">JOINED DATE</th>
                    <th className="p-5 whitespace-nowrap">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-5">
                        <div className="font-bold text-slate-800">{user.fullName || '—'}</div>
                        <div className="text-xs text-slate-400">{user.gender || 'Not specified'}</div>
                      </td>
                      <td className="p-5 text-sm font-medium text-slate-600">
                        {user.email || '—'}
                      </td>
                      <td className="p-5 text-sm text-slate-500">
                        {user.phone || '—'}
                      </td>
                      <td className="p-5">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                          {user.experienceLevel || '—'}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {(user.skills || []).slice(0, 2).map((s, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded border border-slate-200">
                              {s}
                            </span>
                          ))}
                          {(user.skills || []).length > 2 && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-medium rounded border border-slate-200">
                              +{(user.skills || []).length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-wrap gap-1 max-w-[100px]">
                          {(user.roles || []).map((role, i) => (
                            <span key={i} className="px-2 py-1 bg-purple-50 text-purple-600 text-xs font-medium rounded border border-purple-200">
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-5 text-sm font-medium text-slate-500 whitespace-nowrap">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="p-5">
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">User Profile Details</h2>
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <RiCloseLine size={24} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                {/* Basic Info */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedUser.fullName || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Gender</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedUser.gender || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedUser.email || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedUser.phone || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Date of Birth</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedUser.dob || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">College</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedUser.college || '—'}</p>
                </div>

                {/* Experience & Skills */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Experience Level</p>
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                    {selectedUser.experienceLevel || '—'}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Profile Completion</p>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${selectedUser.profileCompletion || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{selectedUser.profileCompletion || 0}%</p>
                </div>

                {/* Roles */}
                {selectedUser.roles && selectedUser.roles.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Roles</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.roles.map((role, i) => (
                        <span key={i} className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-semibold rounded-lg border border-purple-200">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interested Roles */}
                {selectedUser.interestRoles && selectedUser.interestRoles.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Interested Roles</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.interestRoles.map((role, i) => (
                        <span key={i} className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-lg border border-orange-200">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {selectedUser.skills && selectedUser.skills.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg border border-blue-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {selectedUser.languages && selectedUser.languages.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.languages.map((lang, i) => (
                        <span key={i} className="px-3 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-lg border border-green-200">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* URLs */}
                <div className="col-span-2 border-t border-slate-200 pt-4">
                  <p className="text-sm font-bold text-slate-700 mb-3">Social & Web Profiles</p>
                  <div className="space-y-2">
                    {selectedUser.githubUrl && (
                      <a href={selectedUser.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                        <span>GitHub:</span>
                        <span className="truncate">{selectedUser.githubUrl}</span>
                        <RiExternalLinkLine size={16} />
                      </a>
                    )}
                    {selectedUser.linkedinUrl && (
                      <a href={selectedUser.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                        <span>LinkedIn:</span>
                        <span className="truncate">{selectedUser.linkedinUrl}</span>
                        <RiExternalLinkLine size={16} />
                      </a>
                    )}
                    {selectedUser.leetcodeUrl && (
                      <a href={selectedUser.leetcodeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                        <span>LeetCode:</span>
                        <span className="truncate">{selectedUser.leetcodeUrl}</span>
                        <RiExternalLinkLine size={16} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Timestamps */}
                <div className="col-span-2 border-t border-slate-200 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Joined Date</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Last Updated</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
