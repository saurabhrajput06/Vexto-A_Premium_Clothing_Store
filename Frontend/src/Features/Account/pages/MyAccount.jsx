import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useAuth } from '../../Auth/Hook/UseAuth';
import Navbar from '../../shared/Navbar';
import Footer from '../../shared/Footer';
import { useAddress } from '../../Address/Hook/useAddress';
import AddressForm from '../../Address/pages/AddressForm'; 

/* ── Icons ── */
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const OrderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);
const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);
const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const SecurityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const BagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

/* ── Dummy Orders Data ── */
const DUMMY_ORDERS = [
  {
    id: 'VXT-48291',
    date: 'April 25, 2026',
    status: 'Delivered',
    statusColor: 'text-emerald-600 bg-emerald-50',
    total: 3499,
    items: 2,
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=80&h=80&fit=crop',
  },
  {
    id: 'VXT-37104',
    date: 'April 18, 2026',
    status: 'In Transit',
    statusColor: 'text-blue-600 bg-blue-50',
    total: 1999,
    items: 1,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=80&h=80&fit=crop',
  },
  {
    id: 'VXT-29853',
    date: 'March 30, 2026',
    status: 'Delivered',
    statusColor: 'text-emerald-600 bg-emerald-50',
    total: 5998,
    items: 3,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=80&h=80&fit=crop',
  },
];

/* ── Sidebar Tab ── */
const SideTab = ({ icon, label, active, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200
      ${active
        ? 'bg-neutral-900 text-white shadow-lg'
        : danger
          ? 'text-red-500 hover:bg-red-50 hover:text-red-600'
          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
      }
    `}
  >
    <span className={active ? 'text-white' : danger ? 'text-red-400' : 'text-neutral-400'}>
      {icon}
    </span>
    <span className="tracking-wide">{label}</span>
    {!danger && (
      <span className={`ml-auto transition-opacity ${active ? 'opacity-0' : 'opacity-30 group-hover:opacity-60'}`}>
        <ChevronRightIcon />
      </span>
    )}
  </button>
);

/* ── Profile Tab ── */
const ProfileTab = ({ user }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    contact: user?.contact || '',
  });

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="space-y-8">
      {/* Avatar + Name */}
      <div className="flex items-center gap-6 pb-8 border-b border-neutral-100">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-neutral-900 flex items-center justify-center text-white text-2xl font-serif tracking-widest select-none shadow-xl">
            {(user?.fullname || user?.email || 'U')[0].toUpperCase()}
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-neutral-200 rounded-full flex items-center justify-center shadow-sm hover:bg-neutral-50 transition-colors">
            <EditIcon />
          </button>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 tracking-tight">{user?.fullname || 'Your Name'}</h2>
          <p className="text-sm text-neutral-400 mt-0.5">{user?.email}</p>
          {user?.role === 'seller' && (
            <span className="mt-1.5 inline-block bg-[#d4af8a]/15 border border-[#d4af8a]/30 text-[#a6825c] text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-md">
              Seller Account
            </span>
          )}
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-900 px-3 py-2 rounded-lg transition-all"
        >
          <EditIcon />
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {[
          { label: 'Full Name', name: 'fullname', type: 'text', value: form.fullname },
          { label: 'Email Address', name: 'email', type: 'email', value: form.email },
          { label: 'Phone Number', name: 'contact', type: 'tel', value: form.contact },
        ].map(field => (
          <div key={field.name} className={field.name === 'email' && !editing ? 'col-span-2' : ''}>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-2">
              {field.label}
            </label>
            {editing ? (
              <input
                type={field.type}
                name={field.name}
                value={field.value}
                onChange={handleChange}
                className="w-full bg-neutral-50 border border-neutral-200 focus:border-neutral-900 focus:bg-white text-neutral-900 text-sm px-4 py-3 rounded-lg outline-none transition-colors"
              />
            ) : (
              <p className="text-sm text-neutral-800 font-medium py-3 px-4 bg-neutral-50 rounded-lg border border-neutral-100">
                {field.value || <span className="text-neutral-300">Not set</span>}
              </p>
            )}
          </div>
        ))}
      </div>

      {editing && (
        <button
          onClick={() => setEditing(false)}
          className="relative overflow-hidden group w-full sm:w-auto bg-neutral-900 text-white text-xs font-semibold uppercase tracking-[0.2em] px-10 py-3.5 rounded-xl hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all duration-300"
        >
          <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          Save Changes
        </button>
      )}
    </div>
  );
};

/* ── Orders Tab ── */
const OrdersTab = ({ navigate }) => (
  <div className="space-y-4">
    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400 mb-6">Recent Orders</p>
    {DUMMY_ORDERS.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-neutral-200 mb-5"><BagIcon /></div>
        <p className="text-neutral-400 text-sm">No orders yet. Start shopping!</p>
        <button
          onClick={() => navigate('/home')}
          className="mt-6 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-widest px-8 py-3 rounded-xl hover:-translate-y-0.5 transition-all"
        >
          Explore Collection
        </button>
      </div>
    ) : (
      DUMMY_ORDERS.map((order) => (
        <div
          key={order.id}
          className="group flex items-center gap-5 p-4 sm:p-5 rounded-2xl border border-transparent hover:border-neutral-200 hover:bg-neutral-50/60 hover:shadow-sm transition-all duration-300 cursor-pointer"
        >
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-neutral-100 shadow-sm">
            <img src={order.image} alt={order.id} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1">
              <span className="text-sm font-semibold text-neutral-900 tracking-tight">{order.id}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${order.statusColor}`}>
                {order.status}
              </span>
            </div>
            <p className="text-xs text-neutral-400">{order.date} · {order.items} item{order.items > 1 ? 's' : ''}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-bold text-neutral-900">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(order.total)}
            </p>
            <button className="text-[10px] text-neutral-400 hover:text-neutral-900 uppercase tracking-wider font-semibold mt-1 transition-colors">
              Details
            </button>
          </div>
        </div>
      ))
    )}
  </div>
);

/* ── Wishlist Tab ── */
const WishlistTab = ({ navigate }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-300 mb-5">
      <HeartIcon />
    </div>
    <h3 className="text-lg font-semibold text-neutral-800 mb-2">Your wishlist is empty</h3>
    <p className="text-sm text-neutral-400 max-w-xs leading-relaxed mb-8">
      Save your favorite pieces and come back to them anytime.
    </p>
    <button
      onClick={() => navigate('/home')}
      className="bg-neutral-900 text-white text-xs font-semibold uppercase tracking-[0.2em] px-10 py-3.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
    >
      Browse Collection
    </button>
  </div>
);

/* ── Address Tab ── */
const AddressTab = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // 1. DUMMY_ADDRESSES array hata kar hook se actual data lein
  const { 
    addresses, 
    loading, 
    removeAddress, 
    setDefault, 
    createAddress, 
    modifyAddress 
  } = useAddress(true); // true se automatically API se fetch ho jayega

  // Form submit handler (Add / Edit dono ke liye)
  const handleSaveAddress = async (formData) => {
    try {
      if (editingAddress) {
        await modifyAddress(editingAddress._id, formData);
      } else {
        await createAddress(formData);
      }
      setShowForm(false);
      setEditingAddress(null);
    } catch (error) {
      alert("Failed to save address");
    }
  };

  const handleEdit = (addr) => {
    setEditingAddress(addr);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      await removeAddress(id);
    }
  };

  if (loading && (!addresses || addresses.length === 0)) {
    return <div className="p-8 text-sm text-neutral-400">Loading addresses...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
            Addresses
          </p>
          <h2 className="text-lg font-serif text-neutral-900 mt-1">Saved Addresses</h2>
        </div>
        <button
          onClick={() => {
            setEditingAddress(null);
            setShowForm(true);
          }}
          className="px-4 py-2 border border-neutral-900 text-neutral-900 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-neutral-900 hover:text-white transition-colors"
        >
          + Add New
        </button>
      </div>

      {/* Add / Edit Form Modal */}
      {showForm && (
        <AddressForm
          initialData={editingAddress}
          onSubmit={handleSaveAddress}
          onClose={() => {
            setShowForm(false);
            setEditingAddress(null);
          }}
        />
      )}

      {/* Address Cards List */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="p-8 border border-dashed border-neutral-200 rounded-xl text-center">
            <p className="text-sm text-neutral-400 mb-3">No addresses saved yet.</p>
            <button
              onClick={() => {
                setEditingAddress(null);
                setShowForm(true);
              }}
              className="text-xs font-bold text-neutral-900 underline uppercase tracking-wider"
            >
              Add your first address
            </button>
          </div>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr._id}
              className={`p-5 rounded-xl border transition-all flex flex-col sm:flex-row justify-between items-start gap-4 ${
                addr.isDefault
                  ? "border-neutral-900 bg-neutral-50/40 ring-1 ring-neutral-900"
                  : "border-neutral-200 hover:border-neutral-400"
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded">
                    {addr.addressType || "Home"}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-900 text-white px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="font-semibold text-neutral-900 text-sm">{addr.name}</p>
                <p className="text-xs text-neutral-600 leading-relaxed mt-0.5">
                  {addr.houseName}, {addr.area}
                </p>
                <p className="text-xs text-neutral-600">
                  {addr.city}, {addr.state} – {addr.pincode}
                </p>
                <p className="text-xs text-neutral-500 mt-1.5 font-medium">Mobile: {addr.mobile}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 self-end sm:self-start">
                <button
                  onClick={() => handleEdit(addr)}
                  className="text-xs font-medium text-neutral-600 hover:text-neutral-900 uppercase tracking-wider"
                >
                  Edit
                </button>
                {!addr.isDefault && (
                  <button
                    onClick={() => setDefault(addr._id)}
                    className="text-xs font-medium text-neutral-900 underline uppercase tracking-wider"
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(addr._id)}
                  className="text-xs font-medium text-red-500 hover:text-red-700 uppercase tracking-wider"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* ── Security Tab ── */
const SecurityTab = () => {
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  return (
    <div className="space-y-8 max-w-md">
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400 mb-6">Change Password</p>
      {[
        { label: 'Current Password', key: 'current' },
        { label: 'New Password', key: 'newPw' },
        { label: 'Confirm New Password', key: 'confirm' },
      ].map(({ label, key }) => (
        <div key={key}>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-2">{label}</label>
          <input
            type="password"
            value={pwForm[key]}
            onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))}
            className="w-full bg-neutral-50 border border-neutral-200 focus:border-neutral-900 focus:bg-white text-neutral-900 text-sm px-4 py-3 rounded-lg outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>
      ))}
      <button className="relative overflow-hidden group bg-neutral-900 text-white text-xs font-semibold uppercase tracking-[0.2em] px-10 py-3.5 rounded-xl hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all duration-300">
        <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        Update Password
      </button>

      <div className="pt-8 border-t border-neutral-100">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400 mb-4">Danger Zone</p>
        <div className="p-5 rounded-2xl border border-dashed border-red-200 bg-red-50/30">
          <p className="text-sm font-medium text-neutral-800 mb-1">Delete Account</p>
          <p className="text-xs text-neutral-400 mb-4 leading-relaxed">This action is irreversible. All your orders, wishlist, and data will be permanently removed.</p>
          <button className="text-xs font-semibold text-red-500 border border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500 px-5 py-2.5 rounded-lg transition-all duration-300 uppercase tracking-widest">
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
};


/* ── Main Page ── */
const TABS = [
  { id: 'profile', label: 'Profile', icon: <UserIcon /> },
  { id: 'orders', label: 'My Orders', icon: <OrderIcon /> },
  { id: 'wishlist', label: 'Wishlist', icon: <HeartIcon /> },
  { id: 'addresses', label: 'Addresses', icon: <LocationIcon /> },
  { id: 'security', label: 'Security', icon: <SecurityIcon /> },
];

const MyAccount = () => {
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const onLogout = async () => {
    await handleLogout();
    navigate('/login');
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab user={user} />;
      case 'orders': return <OrdersTab navigate={navigate} />;
      case 'wishlist': return <WishlistTab navigate={navigate} />;
      case 'addresses': return <AddressTab />;
      case 'security': return <SecurityTab />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 selection:bg-neutral-200">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 sm:px-10 pt-12 pb-24">

        {/* Page Header */}
        <div className="mb-10">
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-neutral-400 mb-3">Account</p>
          <h1 className="font-serif text-3xl sm:text-[2.5rem] text-neutral-900 leading-tight tracking-[-0.02em]">
            My Account
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">

          {/* Sidebar */}
          <aside className="w-full lg:w-64 xl:w-72 shrink-0">
            {/* User Card */}
            <div className="bg-neutral-50 rounded-2xl p-5 mb-4 border border-neutral-100">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-neutral-900 flex items-center justify-center text-white font-serif text-lg tracking-widest shrink-0 select-none">
                  {(user?.fullname || user?.email || 'U')[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{user?.fullname || 'Your Name'}</p>
                  <p className="text-[11px] text-neutral-400 truncate">{user?.email}</p>
                </div>
              </div>
              {user?.role === 'seller' && (
                <div className="mt-3 flex">
                  <span className="inline-block bg-[#d4af8a]/15 border border-[#d4af8a]/30 text-[#a6825c] text-[9px] font-bold uppercase tracking-[0.18em] px-2.5 py-0.5 rounded-md">
                    Seller Account
                  </span>
                </div>
              )}
            </div>

            {/* Nav Tabs */}
            <nav className="space-y-1">
              {TABS.map(tab => (
                <SideTab
                  key={tab.id}
                  icon={tab.icon}
                  label={tab.label}
                  active={activeTab === tab.id}
                  onClick={() => {
                    if (tab.id === 'wishlist') {
                      navigate('/wishlist');
                    } else {
                      setActiveTab(tab.id);
                    }
                  }}
                />
              ))}
              <div className="pt-3 border-t border-neutral-100 mt-3">
                <SideTab
                  icon={<LogoutIcon />}
                  label="Log Out"
                  active={false}
                  danger={true}
                  onClick={onLogout}
                />
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 sm:p-8 min-h-[500px]">
              {/* Tab Title */}
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-neutral-100">
                <span className="text-neutral-400">
                  {TABS.find(t => t.id === activeTab)?.icon}
                </span>
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-900">
                  {TABS.find(t => t.id === activeTab)?.label}
                </h2>
              </div>
              {renderTab()}
            </div>
          </main>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyAccount;
