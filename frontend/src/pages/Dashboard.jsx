import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, LayoutList } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="p-6 rounded-2xl bg-white border border-gray-200 hover:shadow-md transition duration-300 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-4 rounded-xl ${colorClass}`}>
        <Icon size={24} />
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ totalTasks: 0, todoTasks: 0, inProgressTasks: 0, doneTasks: 0, overdueTasks: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's an overview of your tasks.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={stats.totalTasks} icon={LayoutList} colorClass="bg-blue-50 text-blue-600" delay={0.1} />
        <StatCard title="In Progress" value={stats.inProgressTasks} icon={Clock} colorClass="bg-purple-50 text-purple-600" delay={0.2} />
        <StatCard title="Completed" value={stats.doneTasks} icon={CheckCircle2} colorClass="bg-emerald-50 text-emerald-600" delay={0.3} />
        <StatCard title="Overdue" value={stats.overdueTasks} icon={AlertCircle} colorClass="bg-red-50 text-red-600" delay={0.4} />
      </div>
    </div>
  );
};
export default Dashboard;
