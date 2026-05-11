import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Plus, Users, FolderOpen, Edit, UserPlus } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState({ id: null, name: '', description: '' });
  const [selectedUser, setSelectedUser] = useState('');
  
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const [projRes, usersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/projects`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/users`, { headers })
      ]);
      setProjects(projRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      if (isEditing) {
        await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/projects/${currentProject.id}`, currentProject, { headers });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/projects`, currentProject, { headers });
      }
      setShowModal(false);
      setCurrentProject({ id: null, name: '', description: '' });
      fetchData();
    } catch (err) {
      alert("Failed to save project");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/projects/${currentProject.id}/members/${selectedUser}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setShowMemberModal(false);
      setSelectedUser('');
      fetchData();
    } catch (err) {
      alert("Failed to add member. You might not have permission.");
    }
  };

  const openEditModal = (project) => {
    setCurrentProject({ id: project.id, name: project.name, description: project.description });
    setIsEditing(true);
    setShowModal(true);
  };

  const openCreateModal = () => {
    setCurrentProject({ id: null, name: '', description: '' });
    setIsEditing(false);
    setShowModal(true);
  };

  const openMemberModal = (project) => {
    setCurrentProject(project);
    setShowMemberModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-500">Manage and view your team projects.</p>
        </div>
        {(user.role === 'ADMIN' || true) && (
          <button onClick={openCreateModal} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm">
            <Plus size={20} /> New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p, i) => {
          const isAdminOrCreator = user.role === 'ADMIN' || (p.createdBy && p.createdBy.id === user.id);
          return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} key={p.id} className="bg-white border border-gray-200 p-6 rounded-2xl hover:shadow-md shadow-sm transition group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition">
                    <FolderOpen className="text-blue-600" size={24} />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-600">ID: {p.id}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{p.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{p.description}</p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users size={16} />
                  <span>{p.members?.length || 0} Members</span>
                </div>
                {isAdminOrCreator && (
                  <div className="flex gap-2">
                    <button onClick={() => openMemberModal(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Add Member">
                      <UserPlus size={18} />
                    </button>
                    <button onClick={() => openEditModal(p)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition" title="Edit Project">
                      <Edit size={18} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{isEditing ? 'Edit Project' : 'Create New Project'}</h2>
            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input type="text" value={currentProject.name} onChange={e=>setCurrentProject({...currentProject, name: e.target.value})} className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={currentProject.description} onChange={e=>setCurrentProject({...currentProject, description: e.target.value})} className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 h-24 focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-500 hover:text-gray-900 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-sm">{isEditing ? 'Save Changes' : 'Create Project'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Member</h2>
            <p className="text-gray-500 text-sm mb-6">Select a user to add to {currentProject.name}</p>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
                <select value={selectedUser} onChange={e=>setSelectedUser(e.target.value)} className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" required>
                  <option value="" disabled>Choose a user...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowMemberModal(false)} className="px-4 py-2 text-gray-500 hover:text-gray-900 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shadow-sm">Add to Project</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
export default Projects;
