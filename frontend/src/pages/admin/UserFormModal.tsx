import { useState, type FormEvent } from 'react';
import { createUser, updateUser } from '../../api/users';
import type { Profile, UserFormData } from '../../types';
import { X, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserFormModalProps {
  user: Profile | null; // null = create mode
  onClose: (refresh?: boolean) => void;
}

export default function UserFormModal({ user, onClose }: UserFormModalProps) {
  const isEdit = !!user;

  const [formData, setFormData] = useState<UserFormData>({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: (user?.role === 'admin' ? 'student' : user?.role) || 'student',
    status: user?.status || 'active',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState('');

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string[]> = {};

    if (!formData.first_name.trim()) newErrors.first_name = ['First name is required'];
    if (!formData.last_name.trim()) newErrors.last_name = ['Last name is required'];
    if (!formData.email.trim()) {
      newErrors.email = ['Email is required'];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = ['Invalid email address'];
    }
    if (!isEdit && !formData.password) {
      newErrors.password = ['Password is required for new users'];
    } else if (!isEdit && formData.password && formData.password.length < 6) {
      newErrors.password = ['Password must be at least 6 characters'];
    }
    if (formData.phone && !/^[+\d\s()-]{7,20}$/.test(formData.phone)) {
      newErrors.phone = ['Invalid phone number'];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (isEdit) {
        // Don't send password if empty during edit
        const updateData: Partial<UserFormData> = { ...formData };
        if (!updateData.password) delete updateData.password;
        await updateUser(user.id, updateData);
        toast.success('User updated successfully');
      } else {
        await createUser(formData);
        toast.success('User created successfully');
      }
      onClose(true); // refresh the list
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
        if (axiosErr.response?.data?.errors) {
          setErrors(axiosErr.response.data.errors);
        }
        if (axiosErr.response?.data?.message) {
          setGeneralError(axiosErr.response.data.message);
        }
      } else {
        setGeneralError(err instanceof Error ? err.message : 'An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass = (field: string) =>
    `w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all ${
      errors[field] ? 'border-red-300 bg-red-50/50' : 'border-slate-200'
    }`;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">
            {isEdit ? 'Edit User' : 'Create New User'}
          </h3>
          <button
            onClick={() => onClose()}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {generalError && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{generalError}</span>
            </div>
          )}

          {/* First Name + Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-slate-700 mb-1.5">
                First Name *
              </label>
              <input
                id="first_name"
                type="text"
                className={fieldClass('first_name')}
                placeholder="John"
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                disabled={isSubmitting}
              />
              {errors.first_name && <p className="text-xs text-red-500 mt-1">{errors.first_name[0]}</p>}
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-slate-700 mb-1.5">
                Last Name *
              </label>
              <input
                id="last_name"
                type="text"
                className={fieldClass('last_name')}
                placeholder="Doe"
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                disabled={isSubmitting}
              />
              {errors.last_name && <p className="text-xs text-red-500 mt-1">{errors.last_name[0]}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="user_email" className="block text-sm font-medium text-slate-700 mb-1.5">
              Email Address *
            </label>
            <input
              id="user_email"
              type="email"
              className={fieldClass('email')}
              placeholder="user@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email[0]}</p>}
          </div>

          {/* Password (only for create, optional for edit) */}
          <div>
            <label htmlFor="user_password" className="block text-sm font-medium text-slate-700 mb-1.5">
              Password {!isEdit && '*'}
              {isEdit && <span className="text-xs text-slate-400 ml-1">(leave blank to keep current)</span>}
            </label>
            <input
              id="user_password"
              type="password"
              className={fieldClass('password')}
              placeholder={isEdit ? '••••••••' : 'Minimum 6 characters'}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              disabled={isSubmitting}
              autoComplete="new-password"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password[0]}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="user_phone" className="block text-sm font-medium text-slate-700 mb-1.5">
              Phone
            </label>
            <input
              id="user_phone"
              type="tel"
              className={fieldClass('phone')}
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              disabled={isSubmitting}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone[0]}</p>}
          </div>

          {/* Role + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="user_role" className="block text-sm font-medium text-slate-700 mb-1.5">
                Role *
              </label>
              <select
                id="user_role"
                className={fieldClass('role')}
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                disabled={isSubmitting}
              >
                <option value="student">Student</option>
                <option value="employee">Employee</option>
              </select>
            </div>
            <div>
              <label htmlFor="user_status" className="block text-sm font-medium text-slate-700 mb-1.5">
                Status
              </label>
              <select
                id="user_status"
                className={fieldClass('status')}
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                disabled={isSubmitting}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => onClose()}
              disabled={isSubmitting}
              className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {isEdit ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                isEdit ? 'Save Changes' : 'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
