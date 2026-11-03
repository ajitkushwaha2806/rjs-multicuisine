import React, { useState } from 'react';
import { Building2, Phone, Lock, Eye, EyeOff, ShieldCheck, Users, ArrowRight } from 'lucide-react';

export const AdminAuthPage = () => {
  const [activeTab, setActiveTab] = useState('admin'); // 'admin' | 'staff'
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    phone: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `${activeTab === 'admin' ? 'Admin' : 'Staff'} ${isSignUp ? 'Registration' : 'Login'
      } submitted:\n\nCompany: ${formData.companyName}\nPhone: ${formData.phone}`
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200/80 p-6 sm:p-8 space-y-6">

        {/* Top Role Selector Tabs */}
        <div className="bg-stone-100 p-1.5 rounded-2xl flex items-center gap-2 border border-stone-200/70">
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${activeTab === 'admin'
                ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80'
                : 'text-stone-500 hover:text-stone-800'
              }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Admin</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('staff')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${activeTab === 'staff'
                ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80'
                : 'text-stone-500 hover:text-stone-800'
              }`}
          >
            <Users className="w-4 h-4 text-stone-600" />
            <span>Staff Portal</span>
          </button>
        </div>

        {/* Form Header */}
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            {isSignUp
              ? activeTab === 'admin'
                ? 'Create Admin Account'
                : 'Create Staff Account'
              : activeTab === 'admin'
                ? 'Admin Login'
                : 'Staff Portal Login'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            {isSignUp
              ? 'Enter your company name, phone and password to get started.'
              : 'Enter your credentials to access the workspace.'}
          </p>
        </div>

        {/* Form with strictly Company Name, Phone, and Password */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* 1. Company / Business Name */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Company / Business Name <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-stone-600">Default Workspace</span>
            </div>
            <div className="relative">
              <Building2 className="w-4 h-4 text-stone-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="e.g. RJ's Multicuisine, Vadodara"
                required
                className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm bg-stone-50/50"
              />
            </div>
          </div>

          {/* 2. Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Phone / Mobile Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g. 6352188727"
                required
                className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm bg-stone-50/50"
              />
            </div>
          </div>

          {/* 3. Password */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter a secure password"
                required
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm bg-stone-50/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-800 p-0.5"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all text-sm sm:text-base mt-2"
          >
            <span>
              {isSignUp
                ? activeTab === 'admin'
                  ? 'Create Admin Account'
                  : 'Create Staff Account'
                : 'Sign In to Workspace'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Toggle (Sign Up vs Sign In) */}
        <div className="text-center pt-2 border-t border-stone-100 text-xs sm:text-sm text-stone-500">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="font-semibold text-emerald-800 hover:text-emerald-900 underline ml-1"
              >
                Sign in here
              </button>
            </p>
          ) : (
            <p>
              Need a new workspace?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="font-semibold text-emerald-800 hover:text-emerald-900 underline ml-1"
              >
                Create account here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAuthPage;

