// State Management
const state = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null // Not strictly used with cookie/session approach but good practice
};

// API Helper
async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (body) options.body = JSON.stringify(body);

    try {
        const res = await fetch(endpoint, options);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Something went wrong');
        return data;
    } catch (err) {
        showToast(err.message, 'error');
        throw err;
    }
}

// Router
const views = {
    home: () => `
        <div class="text-center py-20 fade-in">
            <h1 class="text-5xl font-bold text-gray-900 mb-6">Empower Change with <span class="text-primary">HopeConnect</span></h1>
            <p class="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">Join our community of changemakers. Register today to support causes that matter, or donate directly to make an immediate impact.</p>
            <div class="flex justify-center space-x-4">
                ${state.user ?
            `<button onclick="router('dashboard')" class="bg-primary hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full transition shadow-lg transform hover:-translate-y-1">Go to Dashboard</button>` :
            `<button onclick="router('register')" class="bg-primary hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full transition shadow-lg transform hover:-translate-y-1">Get Started</button>
                     <button onclick="router('login')" class="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 font-bold py-3 px-8 rounded-full transition shadow-sm">Login</button>`
        }
            </div>
            
            <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div class="p-6 bg-white rounded-xl shadow-md border border-gray-100">
                    <div class="text-green-500 mb-4">
                         <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Transparent</h3>
                    <p class="text-gray-600">Track every donation. See exactly where your money goes.</p>
                </div>
                <div class="p-6 bg-white rounded-xl shadow-md border border-gray-100">
                    <div class="text-blue-500 mb-4">
                         <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Secure</h3>
                    <p class="text-gray-600">Your data is safe with us. We prioritize privacy and security.</p>
                </div>
                <div class="p-6 bg-white rounded-xl shadow-md border border-gray-100">
                    <div class="text-purple-500 mb-4">
                         <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Community</h3>
                    <p class="text-gray-600">Join thousands of others making a difference today.</p>
                </div>
            </div>
        </div>
    `,

    login: () => `
        <div class="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg fade-in border border-gray-100">
            <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>
            <form onsubmit="handleLogin(event)" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" name="password" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none">
                </div>
                <button type="submit" class="w-full bg-primary text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition transform hover:scale-[1.02]">Login</button>
            </form>
            <p class="mt-4 text-center text-gray-600 text-sm">Don't have an account? <a href="#" onclick="router('register')" class="text-primary hover:underline">Register</a></p>
        </div>
    `,

    register: () => `
        <div class="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg fade-in border border-gray-100">
            <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
            <form onsubmit="handleRegister(event)" class="space-y-4">
                 <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" name="name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" name="password" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none">
                </div>
                <button type="submit" class="w-full bg-primary text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition transform hover:scale-[1.02]">Register</button>
            </form>
            <p class="mt-4 text-center text-gray-600 text-sm">Already have an account? <a href="#" onclick="router('login')" class="text-primary hover:underline">Login</a></p>
        </div>
    `,

    dashboard: () => `
        <div class="fade-in space-y-6">
            <div class="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Hello, ${state.user.name} 👋</h2>
                    <p class="text-gray-500">Welcome to your dashboard</p>
                </div>
                <button onclick="router('donate')" class="bg-secondary hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition shadow-md flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Make a Donation
                </button>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 class="font-bold text-lg text-gray-800">Donation History</h3>
                    <button onclick="loadHistory()" class="text-sm text-primary hover:underline">Refresh</button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                            </tr>
                        </thead>
                        <tbody id="history-table-body" class="divide-y divide-gray-100">
                            <tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">Loading...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,

    donate: () => `
        <div class="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg fade-in border border-gray-100">
             <div class="flex items-center mb-6">
                <button onclick="router('dashboard')" class="mr-4 text-gray-400 hover:text-gray-600 transition">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </button>
                <h2 class="text-2xl font-bold text-gray-800">Make a Donation</h2>
            </div>
            
            <form onsubmit="initiateDonation(event)" class="space-y-6">
                <div>
                     <label class="block text-sm font-medium text-gray-700 mb-2">Amount (INR)</label>
                     <div class="relative">
                        <span class="absolute left-4 top-2 text-gray-500 font-bold">₹</span>
                        <input type="number" id="donation-amount" required min="1" class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none text-lg font-semibold">
                     </div>
                </div>
                
                <div class="p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-sm text-yellow-800">
                    <strong>Note:</strong> This is a simulation. No real money will be deducted. You can choose the outcome in the next step.
                </div>

                <div class="flex space-x-4">
                    <button type="submit" class="flex-1 bg-primary text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition transform hover:scale-[1.02]">Proceed to Pay</button>
                </div>
            </form>
        </div>
    `,

    payment_simulation: (donationId, amount) => `
        <div class="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg fade-in border border-gray-100 text-center">
             <div class="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
             </div>
             <h2 class="text-2xl font-bold text-gray-900 mb-2">Payment Gateway</h2>
             <p class="text-gray-500 mb-6">Completing payment of <span class="font-bold text-gray-900">₹${amount}</span></p>
             
             <div class="space-y-3">
                <button onclick="confirmDonation(${donationId}, 'success')" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition transform hover:scale-[1.02]">Simulate Success</button>
                <button onclick="confirmDonation(${donationId}, 'failed')" class="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition transform hover:scale-[1.02]">Simulate Failure</button>
             </div>
             <button onclick="router('dashboard')" class="mt-6 text-sm text-gray-500 hover:underline">Cancel and Return</button>
        </div>
    `,

    admin: () => `
        <div class="fade-in space-y-8">
             <h2 class="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
             
             <!-- Stats Grid -->
             <div class="grid grid-cols-1 md:grid-cols-3 gap-6" id="admin-stats-container">
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse h-32"></div>
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse h-32"></div>
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse h-32"></div>
             </div>

             <!-- Recent Donations -->
             <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h3 class="font-bold text-lg text-gray-800">Recent Donations</h3>
                </div>
                 <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Txn ID</th>
                            </tr>
                        </thead>
                        <tbody id="admin-table-body" class="divide-y divide-gray-100">
                             <tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">Loading...</td></tr>
                        </tbody>
                    </table>
                </div>
             </div>
        </div>
    `
};

// Actions
async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        await apiCall('/api/register', 'POST', data);
        showToast('Registration successful! Please login.', 'success');
        router('login');
    } catch (err) {
        // error handled in apiCall
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const res = await apiCall('/api/login', 'POST', data);
        state.user = res.user;
        localStorage.setItem('user', JSON.stringify(res.user));
        showToast('Welcome back!', 'success');
        router(state.user.role === 'admin' ? 'admin' : 'dashboard');
    } catch (err) {
        // error handled in apiCall
    }
}

function handleLogout() {
    state.user = null;
    localStorage.removeItem('user');
    showToast('Logged out successfully', 'info');
    router('home');
}

async function loadHistory() {
    if (!state.user) return;
    try {
        const history = await apiCall(`/api/user/history?user_id=${state.user.id}`);
        const tbody = document.getElementById('history-table-body');

        if (history.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-gray-500">No donations yet. Make your first connection today!</td></tr>`;
            return;
        }

        tbody.innerHTML = history.map(d => `
            <tr class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 text-sm text-gray-600">#${d.id}</td>
                <td class="px-6 py-4 font-bold text-gray-800">₹${d.amount}</td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${d.status === 'success' ? 'bg-green-100 text-green-800' :
                d.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
            }">
                        ${d.status.toUpperCase()}
                    </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">${new Date(d.created_at).toLocaleDateString()}</td>
                <td class="px-6 py-4 text-xs font-mono text-gray-400">${d.transaction_id || '-'}</td>
            </tr>
        `).join('');
    } catch (err) {
        // handled
    }
}

async function initiateDonation(e) {
    e.preventDefault();
    const amount = document.getElementById('donation-amount').value;
    try {
        const res = await apiCall('/api/donate', 'POST', { user_id: state.user.id, amount });
        // Manually injecting the payment simulation view
        document.getElementById('main-content').innerHTML = views.payment_simulation(res.donation_id, amount);
    } catch (err) {
        // handled
    }
}

async function confirmDonation(id, status) {
    try {
        await apiCall('/api/donate/confirm', 'POST', { donation_id: id, status });
        const msg = status === 'success' ? 'Thank you for your generosity!' : 'Payment failed.';
        showToast(msg, status === 'success' ? 'success' : 'error');
        router('dashboard'); // Will reload history
    } catch (err) {
        // handled
    }
}

async function loadAdminStats() {
    if (!state.user || state.user.role !== 'admin') return router('home');
    try {
        const stats = await apiCall('/api/admin/stats');

        // Render Stats
        document.getElementById('admin-stats-container').innerHTML = `
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                <div class="p-3 bg-indigo-100 text-indigo-600 rounded-lg mr-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                </div>
                <div>
                    <p class="text-sm text-gray-500 font-medium">Total Users</p>
                    <p class="text-2xl font-bold text-gray-800">${stats.total_users}</p>
                </div>
            </div>
             <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                 <div class="p-3 bg-green-100 text-green-600 rounded-lg mr-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                    <p class="text-sm text-gray-500 font-medium">Total Funds</p>
                    <p class="text-2xl font-bold text-gray-800">₹${stats.total_amount_collected}</p>
                </div>
            </div>
             <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                 <div class="p-3 bg-yellow-100 text-yellow-600 rounded-lg mr-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                </div>
                <div>
                    <p class="text-sm text-gray-500 font-medium">Donations Count</p>
                    <p class="text-2xl font-bold text-gray-800">${stats.total_donations_count}</p>
                </div>
            </div>
        `;

        // Render Table
        const tbody = document.getElementById('admin-table-body');
        if (stats.recent_donations.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">No data found.</td></tr>`;
        } else {
            tbody.innerHTML = stats.recent_donations.map(d => `
                 <tr class="hover:bg-gray-50 transition">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${d.user_name}</td>
                    <td class="px-6 py-4 font-bold text-gray-800">₹${d.amount}</td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 text-xs font-semibold rounded-full ${d.status === 'success' ? 'bg-green-100 text-green-800' :
                    d.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                }">
                        ${d.status.toUpperCase()}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-xs font-mono text-gray-400">${d.transaction_id || '-'}</td>
                </tr>
            `).join('');
        }
    } catch (err) {
        // handled
    }
}

// Router Function
function router(viewName) {
    const main = document.getElementById('main-content');
    main.innerHTML = views[viewName] ? views[viewName]() : '<h1>404 Not Found</h1>';
    updateNav();

    // Lifecycle hooks
    if (viewName === 'dashboard') loadHistory();
    if (viewName === 'admin') loadAdminStats();

    // Auto-scroll to top
    window.scrollTo(0, 0);
}

// UI Helpers
function updateNav() {
    const links = document.getElementById('nav-links');
    if (state.user) {
        links.innerHTML = `
            <span class="text-sm text-gray-500 mr-2">Hello, ${state.user.name}</span>
            <button onclick="handleLogout()" class="text-gray-600 hover:text-red-600 font-medium transition text-sm">Logout</button>
        `;
    } else {
        links.innerHTML = `
            <button onclick="router('login')" class="text-gray-600 hover:text-primary font-medium transition">Login</button>
            <button onclick="router('register')" class="bg-primary hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-full transition shadow-sm">Register</button>
        `;
    }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-gray-800'
    };

    toast.className = `${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg mb-2 fade-in flex items-center`;
    toast.innerHTML = `
        <span class="font-medium">${message}</span>
        <button onclick="this.parentElement.remove()" class="ml-4 text-white opacity-75 hover:opacity-100">&times;</button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    // Basic route protection
    if (state.user) {
        router(state.user.role === 'admin' ? 'admin' : 'dashboard');
    } else {
        router('home');
    }
});
