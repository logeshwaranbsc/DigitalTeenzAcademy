import { useEffect, useState, useCallback } from 'react';
import { getUsers, deleteUser, updateUserStatus } from '../../api/users';
import type { Profile, UserFilters, PaginationMeta } from '../../types';
import UserFormModal from './UserFormModal';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Pencil,
  Trash2,
  UserCheck,
  UserX,
  Loader2,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function UsersPage() {
  const { profile: adminProfile } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: '',
    status: '',
    page: 1,
    per_page: 15,
  });

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [viewingUser, setViewingUser] = useState<Profile | null>(null);

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState<Profile | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Status toggle
  const [togglingStatus, setTogglingStatus] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUsers(filters);
      setUsers(response.data);
      setMeta(response.meta);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((f) => ({ ...f, search: searchInput, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteUser(deleteTarget.id);
      toast.success(`${deleteTarget.first_name} ${deleteTarget.last_name} has been deleted.`);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (user: Profile) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    setTogglingStatus(user.id);
    try {
      await updateUserStatus(user.id, newStatus);
      toast.success(`${user.first_name} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`);
      fetchUsers();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setTogglingStatus(null);
    }
  };

  const handleModalClose = (refresh?: boolean) => {
    setModalOpen(false);
    setEditingUser(null);
    if (refresh) fetchUsers();
  };

  const openCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const openEdit = (user: Profile) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage student and employee accounts
            {meta && <span className="ml-1">• {meta.total} total users</span>}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200 hover:from-indigo-500 hover:to-indigo-600 transition-all"
        >
          <Plus size={18} />
          <span>Add User</span>
        </button>
      </div>

      {/* Filters bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Role filter */}
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              className="pl-8 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 min-w-[130px]"
              value={filters.role}
              onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value as UserFilters['role'], page: 1 }))}
            >
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Status filter */}
          <select
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 min-w-[130px]"
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value as UserFilters['status'], page: 1 }))}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              <p className="text-sm text-slate-500">Loading users...</p>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-lg font-semibold text-slate-700 mb-1">No users found</p>
            <p className="text-sm text-slate-500 mb-4">
              {searchInput || filters.role || filters.status
                ? 'Try adjusting your search or filters.'
                : 'Get started by adding your first user.'}
            </p>
            {!searchInput && !filters.role && !filters.status && (
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 transition-colors"
              >
                <Plus size={16} />
                Add User
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Name</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Email</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Role</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Phone</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Created</th>
                    <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {user.first_name[0]}{user.last_name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {user.first_name} {user.last_name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{user.email}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : user.role === 'student'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600 hidden md:table-cell">
                        {user.phone || '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`} />
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-500 hidden lg:table-cell">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            title="View"
                            onClick={() => setViewingUser(user)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            title="Edit"
                            onClick={() => openEdit(user)}
                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                            onClick={() => handleToggleStatus(user)}
                            disabled={togglingStatus === user.id}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {togglingStatus === user.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : user.status === 'active' ? (
                              <UserX size={16} />
                            ) : (
                              <UserCheck size={16} />
                            )}
                          </button>
                          {/* Don't allow admin to delete themselves */}
                          {adminProfile?.id !== user.id && (
                            <button
                              title="Delete"
                              onClick={() => setDeleteTarget(user)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50/50">
                <p className="text-sm text-slate-500">
                  Showing {meta.from}–{meta.to} of {meta.total}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))}
                    disabled={meta.current_page <= 1}
                    className="p-2 text-slate-500 hover:text-slate-700 hover:bg-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: meta.last_page }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === meta.last_page || Math.abs(p - meta.current_page) <= 1)
                    .map((page, idx, arr) => (
                      <span key={page}>
                        {idx > 0 && arr[idx - 1] !== page - 1 && (
                          <span className="px-1 text-slate-400">…</span>
                        )}
                        <button
                          onClick={() => setFilters((f) => ({ ...f, page }))}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                            page === meta.current_page
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-600 hover:bg-white'
                          }`}
                        >
                          {page}
                        </button>
                      </span>
                    ))}
                  <button
                    onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}
                    disabled={meta.current_page >= meta.last_page}
                    className="p-2 text-slate-500 hover:text-slate-700 hover:bg-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* User Form Modal (Create / Edit) */}
      {modalOpen && (
        <UserFormModal
          user={editingUser}
          onClose={handleModalClose}
        />
      )}

      {/* Delete confirmation dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 text-center mb-2">
              Delete User
            </h3>
            <p className="text-sm text-slate-500 text-center mb-1">
              Are you sure you want to delete this user?
            </p>
            <p className="text-sm font-medium text-slate-700 text-center mb-6">
              {deleteTarget.first_name} {deleteTarget.last_name} ({deleteTarget.email})
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-500 transition-colors disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View user details modal */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-slate-800">User Details</h3>
              <button
                onClick={() => setViewingUser(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                {viewingUser.first_name[0]}{viewingUser.last_name[0]}
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800">
                  {viewingUser.first_name} {viewingUser.last_name}
                </p>
                <p className="text-sm text-slate-500">{viewingUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Role', value: viewingUser.role.charAt(0).toUpperCase() + viewingUser.role.slice(1) },
                { label: 'Status', value: viewingUser.status.charAt(0).toUpperCase() + viewingUser.status.slice(1) },
                { label: 'Phone', value: viewingUser.phone || '—' },
                { label: 'Created', value: new Date(viewingUser.created_at).toLocaleDateString() },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">{label}</p>
                  <p className="text-sm font-medium text-slate-800">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => { setViewingUser(null); openEdit(viewingUser); }}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-500 transition-colors"
              >
                Edit User
              </button>
              <button
                onClick={() => setViewingUser(null)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
