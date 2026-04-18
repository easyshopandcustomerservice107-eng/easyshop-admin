import React, { useState, useEffect } from 'react';
import {
    Search,
    User as UserIcon,
    Shield,
    Mail,
    Activity,
    Loader2,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { userService } from '../../services/userService';
import { User } from '../../types';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load user directory');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user._id || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-accent-gold animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tighter uppercase">User Management</h1>
                    <p className="text-slate-400 text-sm font-medium">Manage user accounts and permissions.</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by Email or Name..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-accent-gold/100 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joined Date</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No users match your criteria.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((u) => (
                                    <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-slate-100 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-200">
                                                    {u.avatar ? (
                                                        <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <UserIcon className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 text-sm">{u.name}</span>
                                                    <div className="flex items-center space-x-1.5 text-slate-400">
                                                        <Mail className="w-3 h-3" />
                                                        <span className="text-[10px] font-medium">{u.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center space-x-2">
                                                <Shield className={`w-4 h-4 ${u.role === 'admin' ? 'text-accent-gold' : 'text-slate-400'}`} />
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${u.role === 'admin' ? 'text-accent-gold' : 'text-slate-500'}`}>
                                                    {u.role}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center space-x-2">
                                                {u.isVerified ? (
                                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-rose-500" />
                                                )}
                                                <span className="text-xs font-bold text-slate-600">
                                                    {u.isVerified ? 'Verified' : 'Pending'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-xs font-bold text-slate-500">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center justify-end">
                                                <button className="text-[10px] font-bold text-accent-gold uppercase tracking-widest hover:underline px-4 py-2">
                                                    Edit Permissions
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
