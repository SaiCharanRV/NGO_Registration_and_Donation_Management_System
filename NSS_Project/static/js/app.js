// State Management
const state = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null // Not strictly used with cookie/session approach but good practice
};

// Razorpay Configuration (Test Mode)
const RAZORPAY_KEY_ID = 'rzp_test_1DP5mmOlF5G5ag'; // Public test key for demo

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
        <div class="fade-in">
            <!-- Hero Section -->
            <div class="relative bg-gradient-to-r from-indigo-700 to-purple-800 text-white overflow-hidden">
                <div class="absolute inset-0">
                    <svg class="absolute bottom-0 left-0 transform scale-150 opacity-10" viewBox="0 0 500 500" fill="white">
                        <path d="M453.9,35.6C447.8,124.9,368.6,214.2,279.1,234.3C189.6,254.4,85.5,205.2,40.4,142.9C-4.7,80.7,13.2,1.4,7.9,-88.2C2.6,-177.8,-25.9,-277.6,35.7,-321.9C97.3,-366.3,249,-355.2,330.6,-301.6C412.2,-248.1,423.7,-152.1,453.9,35.6Z" />
                    </svg>
                </div>
                
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 relative z-10 text-center">
                    <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                        Connect. Contribute. <br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400">Change Lives.</span>
                    </h1>
                    <p class="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto mb-10 leading-relaxed">
                        HopeConnect bridges the gap between generous hearts and causes that matter. Join a global movement creating tangible impact every single day.
                    </p>
                    
                    <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        ${state.user ?
            (state.user.role === 'admin' ?
                `<button onclick="router('admin')" class="px-8 py-4 bg-white text-indigo-700 font-bold rounded-full shadow-lg hover:shadow-2xl hover:bg-gray-50 transition transform hover:-translate-y-1 text-lg">Go to Dashboard</button>` :
                `<button onclick="router('donate')" class="px-8 py-4 bg-white text-pink-600 font-bold rounded-full shadow-lg hover:shadow-2xl hover:bg-pink-50 transition transform hover:-translate-y-1 text-lg flex items-center animate-pulse">
                                    <svg class="w-6 h-6 mr-2 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                    Donate Now
                                 </button>`
            ) :
            `<button onclick="router('userAuth', 'register')" class="px-8 py-4 bg-white text-indigo-700 font-bold rounded-full shadow-lg hover:shadow-2xl hover:bg-gray-50 transition transform hover:-translate-y-1 text-lg">Join the Movement</button>
                             <button onclick="router('authChoice')" class="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:bg-opacity-10 transition transform hover:-translate-y-1 text-lg">Login</button>`
        }
                    </div>
                </div>
            </div>

            <!-- Impact Stats -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                <div class="bg-white rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    <div class="p-8 text-center hover:bg-gray-50 transition">
                        <div class="text-4xl font-bold text-indigo-600 mb-2" id="stat-donors">-</div>
                        <div class="text-gray-500 font-medium uppercase tracking-wide text-sm">Active Donors</div>
                    </div>
                    <div class="p-8 text-center hover:bg-gray-50 transition">
                        <div class="text-4xl font-bold text-green-500 mb-2" id="stat-raised">-</div>
                        <div class="text-gray-500 font-medium uppercase tracking-wide text-sm">Funds Raised</div>
                    </div>
                    <div class="p-8 text-center hover:bg-gray-50 transition">
                        <div class="text-4xl font-bold text-purple-600 mb-2" id="stat-total-donations">-</div>
                        <div class="text-gray-500 font-medium uppercase tracking-wide text-sm">Successful Donations</div>
                    </div>
                </div>
            </div>

            <!-- Features -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div class="text-center mb-16">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">Why Choose HopeConnect?</h2>
                    <div class="h-1 w-20 bg-indigo-600 mx-auto rounded-full"></div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div class="p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 group">
                        <div class="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                             <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">100% Transparent</h3>
                        <p class="text-gray-600 leading-relaxed">We believe in absolute transparency. Track every rupee you donate and see the direct impact of your contribution through real-time updates.</p>
                    </div>
                    
                    <div class="p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 group">
                        <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                             <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">Secure Payments</h3>
                        <p class="text-gray-600 leading-relaxed">Your security is our top priority. We use bank-grade encryption and trusted payment gateways to ensure your data and money are always safe.</p>
                    </div>
                    
                    <div class="p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 group">
                        <div class="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                             <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">Community Led</h3>
                        <p class="text-gray-600 leading-relaxed">Join a vibrant community of changemakers. Connect with like-minded individuals and participate in events that drive social change.</p>
                    </div>
                </div>
            </div>
            
            <!-- Simple Footer -->
            <footer class="bg-gray-900 text-gray-400 py-12 text-center">
                <p>&copy; 2024 HopeConnect. All rights reserved.</p>
                <div class="flex justify-center space-x-6 mt-4">
                    <a href="#" class="hover:text-white transition">Privacy Policy</a>
                    <a href="#" class="hover:text-white transition">Terms of Service</a>
                    <a href="#" class="hover:text-white transition">Contact Us</a>
                </div>
            </footer>
        </div>
    `,

    authChoice: () => `
        <div class="max-w-2xl mx-auto fade-in">
            <div class="text-center mb-10">
                <h1 class="text-4xl font-bold text-gray-900 mb-3">Welcome to HopeConnect</h1>
                <p class="text-gray-600">Please select how you'd like to continue</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- User Login Card -->
                <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1" onclick="router('userAuth', 'login')">
                    <div class="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900 text-center mb-2">Login as User</h2>
                    <p class="text-gray-500 text-center mb-6">Access your dashboard and make donations</p>
                    <div class="text-center">
                        <button class="bg-primary hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition w-full">Continue</button>
                    </div>
                </div>

                <!-- Admin Login Card -->
                <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1" onclick="router('adminAuth')">
                    <div class="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900 text-center mb-2">Login as Admin</h2>
                    <p class="text-gray-500 text-center mb-6">Access administrative dashboard</p>
                    <div class="text-center">
                        <button class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition w-full">Continue</button>
                    </div>
                </div>
            </div>
            
            <div class="text-center mt-8">
                <button onclick="router('home')" class="text-gray-500 hover:text-gray-700 text-sm">
                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Back to Home
                </button>
            </div>
        </div>
    `,

    userAuth: (initialMode = 'login') => `
        <div class="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden fade-in border border-gray-100">
            <!-- Toggle Header -->
            <div class="flex border-b border-gray-100">
                <button onclick="toggleUserAuth('login')" id="tab-login" class="flex-1 py-4 text-center font-bold border-b-2 transition-colors ${initialMode === 'login' ? 'text-primary border-primary' : 'text-gray-500 border-transparent'}">Login</button>
                <button onclick="toggleUserAuth('register')" id="tab-register" class="flex-1 py-4 text-center font-medium border-b-2 transition-colors ${initialMode === 'register' ? 'text-primary border-primary' : 'text-gray-500 border-transparent hover:text-gray-700'}">Register</button>
            </div>

            <div class="p-8">
                <!-- Login Form -->
                <form id="form-login" onsubmit="handleLogin(event)" class="space-y-4 ${initialMode === 'login' ? '' : 'hidden'}">
                    <div class="text-center mb-6">
                        <h2 class="text-2xl font-bold text-gray-800">User Login</h2>
                        <p class="text-sm text-gray-500 mt-1">Welcome back! Login to continue</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" name="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" name="password" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none">
                    </div>
                    <button type="submit" class="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition transform hover:scale-[1.02]">Login</button>
                    <div class="text-center pt-2">
                        <p class="text-sm text-gray-500">Don't have an account? <button type="button" onclick="toggleUserAuth('register')" class="text-primary hover:underline font-medium">Register here</button></p>
                    </div>
                </form>

                <!-- Register Form -->
                <form id="form-register" onsubmit="handleRegister(event)" class="space-y-4 ${initialMode === 'register' ? '' : 'hidden'}">
                    <div class="text-center mb-6">
                        <h2 class="text-2xl font-bold text-gray-800">Create Account</h2>
                        <p class="text-sm text-gray-500 mt-1">Join our community today</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
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
                    <button type="submit" class="w-full bg-secondary text-white font-bold py-3 rounded-lg hover:bg-green-600 transition transform hover:scale-[1.02]">Register New Account</button>
                    <div class="text-center pt-2">
                        <p class="text-sm text-gray-500">Already have an account? <button type="button" onclick="toggleUserAuth('login')" class="text-primary hover:underline font-medium">Login here</button></p>
                    </div>
                </form>
            </div>
            
            <div class="px-8 pb-6 text-center">
                <button onclick="router('authChoice')" class="text-gray-500 hover:text-gray-700 text-sm">
                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Back to login options
                </button>
            </div>
        </div>
    `,

    adminAuth: () => `
        <div class="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden fade-in border border-gray-100">
            <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white text-center">
                <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <h2 class="text-2xl font-bold">Admin Login</h2>
                <p class="text-purple-100 text-sm mt-1">Authorized personnel only</p>
            </div>

            <div class="p-8">
                <form onsubmit="handleLogin(event)" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" name="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" name="password" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition outline-none">
                    </div>
                    <button type="submit" class="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition transform hover:scale-[1.02]">Login as Admin</button>
                </form>
            </div>
            
            <div class="px-8 pb-6 text-center">
                <button onclick="router('authChoice')" class="text-gray-500 hover:text-gray-700 text-sm">
                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Back to login options
                </button>
            </div>
        </div>
    `,


    dashboard: () => `
        <div class="fade-in space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Registration Details Card -->
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <div class="absolute top-0 right-0 p-4 opacity-10">
                        <svg class="w-24 h-24 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                    </div>
                    <h2 class="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">My Registration Details</h2>
                    <div class="space-y-3 relative z-10">
                        <div>
                            <p class="text-xs text-gray-500 uppercase font-semibold">Full Name</p>
                            <p class="text-gray-900 font-medium">${state.user.name}</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 uppercase font-semibold">Email Address</p>
                            <p class="text-gray-900 font-medium">${state.user.email}</p>
                        </div>
                         <div class="flex justify-between">
                            <div>
                                <p class="text-xs text-gray-500 uppercase font-semibold">Account Role</p>
                                <span class="inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold uppercase ${state.user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}">${state.user.role}</span>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500 uppercase font-semibold text-right">Joined On</p>
                                <p class="text-gray-900 font-medium text-right">${state.user.created_at ? new Date(state.user.created_at).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Card -->
                <div class="bg-gradient-to-br from-primary to-indigo-700 p-6 rounded-xl shadow-md text-white flex flex-col justify-center items-start relative overflow-hidden">
                     <div class="absolute bottom-0 right-0 p-4 opacity-20">
                        <svg class="w-32 h-32 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </div>
                    <h2 class="text-2xl font-bold mb-2 relative z-10">Make a Difference</h2>
                    <p class="text-indigo-100 mb-6 relative z-10">Your support helps us change lives. functionality is live.</p>
                    <button onclick="router('donate')" class="bg-white text-primary hover:bg-gray-50 font-bold py-3 px-6 rounded-lg transition shadow-lg flex items-center relative z-10 transform hover:-translate-y-1 hover:shadow-xl">
                        <svg class="w-5 h-5 mr-2" fill="currentColor" stroke="none" viewBox="0 0 24 24"><text x="12" y="17" text-anchor="middle" font-size="20" font-weight="bold">₹</text></svg>
                        Donate Now
                    </button>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 class="font-bold text-lg text-gray-800">Donation History</h3>
                    <button onclick="loadHistory()" class="text-sm text-primary hover:underline flex items-center">
                        <svg id="refresh-spinner" class="animate-spin -ml-1 mr-2 h-4 w-4 text-primary hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Refresh
                    </button>
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
                
                <div class="p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800">
                    <div class="flex items-start">
                        <svg class="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <div>
                            <strong>Razorpay Test Mode</strong><br>
                            Use test card: <code class="bg-blue-100 px-1 rounded">4111 1111 1111 1111</code><br>
                            <span class="text-xs">CVV: Any 3 digits | Expiry: Any future date</span>
                        </div>
                    </div>
                </div>

                <div class="flex space-x-4">
                    <button type="submit" class="flex-1 bg-primary text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition transform hover:scale-[1.02] flex items-center justify-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        Proceed to Pay
                    </button>
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
             <div class="flex justify-between items-center">
                <h2 class="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
                <div class="space-x-2">
                     <button onclick="renderAdminTab('overview')" id="btn-tab-overview" class="px-4 py-2 rounded-lg font-medium transition text-primary bg-indigo-50">Overview</button>
                     <button onclick="renderAdminTab('users')" id="btn-tab-users" class="px-4 py-2 rounded-lg font-medium transition text-gray-500 hover:bg-gray-100">Users</button>
                     <button onclick="renderAdminTab('donations')" id="btn-tab-donations" class="px-4 py-2 rounded-lg font-medium transition text-gray-500 hover:bg-gray-100">All Donations</button>
                     <button onclick="renderAdminTab('createAdmin')" id="btn-tab-createAdmin" class="px-4 py-2 rounded-lg font-medium transition text-gray-500 hover:bg-gray-100">Create Admin</button>
                </div>
             </div>
             
             <div id="admin-content-area">
                <!-- Content injected via JS -->
             </div>
        </div>
    `
};

// UI Toggles
function toggleUserAuth(mode) {
    const loginForm = document.getElementById('form-login');
    const registerForm = document.getElementById('form-register');
    const loginTab = document.getElementById('tab-login');
    const registerTab = document.getElementById('tab-register');

    if (mode === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');

        loginTab.classList.add('text-primary', 'border-primary');
        loginTab.classList.remove('text-gray-500', 'border-transparent');

        registerTab.classList.remove('text-primary', 'border-primary');
        registerTab.classList.add('text-gray-500', 'border-transparent');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');

        registerTab.classList.add('text-primary', 'border-primary');
        registerTab.classList.remove('text-gray-500', 'border-transparent');

        loginTab.classList.remove('text-primary', 'border-primary');
        loginTab.classList.add('text-gray-500', 'border-transparent');
    }
}

// Actions
async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        await apiCall('/api/register', 'POST', data);
        showToast('Registration successful! Please login.', 'success');
        toggleUserAuth('login');
        e.target.reset();
    } catch (err) {
        // error handled in apiCall
    }
}

async function handleCreateAdmin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.admin_user_id = state.user.id;

    try {
        await apiCall('/api/admin/create-admin', 'POST', data);
        showToast('Admin user created successfully!', 'success');
        e.target.reset();
        // Optionally refresh users list if on that tab
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
        showToast(`Welcome back, ${state.user.name} !`, 'success');

        // --- ROLE BASED REDIRECTION ---
        if (state.user.role === 'admin') {
            router('admin');
        } else {
            router('dashboard');
        }
    } catch (err) {
        // error handled in apiCall
    }
}

function handleLogout() {
    showLogoutModal();
}

function showLogoutModal() {
    // Remove existing modal if any
    const existing = document.getElementById('logout-modal');
    if (existing) existing.remove();

    const modalHtml = `
        <div id="logout-modal" class="fixed inset-0 z-[100] flex items-center justify-center fade-in">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm transition-opacity" onclick="closeLogoutModal()"></div>
            
            <!-- Modal Card -->
            <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full relative z-10 transform transition-all scale-100 border border-gray-100">
                <div class="text-center">
                    <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-6 border border-red-100">
                        <svg class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                    </div>
                    
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Sign Out?</h3>
                    <p class="text-sm text-gray-500 mb-8 leading-relaxed">Are you sure you want to log out? You'll need to sign back in to access your dashboard.</p>
                    
                    <div class="flex space-x-3">
                        <button onclick="closeLogoutModal()" class="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200">
                            Cancel
                        </button>
                        <button onclick="performLogout()" class="flex-1 bg-red-600 border border-transparent text-white font-semibold py-3 px-4 rounded-xl hover:bg-red-700 transition shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform hover:scale-[1.02]">
                            Yes, Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeLogoutModal() {
    const modal = document.getElementById('logout-modal');
    if (modal) {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.remove(), 100);
    }
}

function performLogout() {
    closeLogoutModal();
    setTimeout(() => {
        state.user = null;
        localStorage.removeItem('user');
        showToast('Logged out successfully', 'info');
        router('authChoice');
    }, 150);
}

async function loadHistory() {
    if (!state.user) return;

    // Show spinner
    const spinner = document.getElementById('refresh-spinner');
    if (spinner) spinner.classList.remove('hidden');

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
    } finally {
        // Hide spinner
        if (spinner) spinner.classList.add('hidden');
    }
}

async function initiateDonation(e) {
    e.preventDefault();
    const amount = document.getElementById('donation-amount').value;

    if (!amount || amount < 1) {
        showToast('Please enter a valid amount', 'error');
        return;
    }

    try {
        // Create donation record with pending status
        const res = await apiCall('/api/donate', 'POST', { user_id: state.user.id, amount });
        const donationId = res.donation_id;

        // Configure Razorpay options
        const options = {
            key: RAZORPAY_KEY_ID,
            amount: amount * 100, // Razorpay expects amount in paise
            currency: 'INR',
            name: 'HopeConnect',
            description: 'Donation to support our cause',
            image: 'https://cdn-icons-png.flaticon.com/512/1076/1076984.png', // Heart icon
            handler: function (response) {
                // Payment successful
                handlePaymentSuccess(donationId, response.razorpay_payment_id, amount);
            },
            prefill: {
                name: state.user.name,
                email: state.user.email
            },
            notes: {
                donation_id: donationId,
                user_id: state.user.id
            },
            theme: {
                color: '#4f46e5' // Primary color
            },
            modal: {
                ondismiss: function () {
                    // User closed the payment modal
                    showToast('Payment cancelled', 'info');
                }
            }
        };

        // Create Razorpay instance and open
        const razorpay = new Razorpay(options);

        razorpay.on('payment.failed', function (response) {
            // Payment failed
            handlePaymentFailure(donationId, response.error);
        });

        razorpay.open();

    } catch (err) {
        showToast('Failed to initiate payment. Please try again.', 'error');
    }
}

// Handle successful payment
async function handlePaymentSuccess(donationId, paymentId, amount) {
    try {
        await apiCall('/api/donate/confirm', 'POST', {
            donation_id: donationId,
            status: 'success',
            transaction_id: paymentId
        });
        showToast(`Thank you for your generous donation of ₹${amount}!`, 'success');
        router('dashboard');
    } catch (err) {
        showToast('Payment successful but failed to update record', 'error');
    }
}

// Handle payment failure
async function handlePaymentFailure(donationId, error) {
    try {
        await apiCall('/api/donate/confirm', 'POST', {
            donation_id: donationId,
            status: 'failed',
            transaction_id: error.metadata?.payment_id || 'FAILED'
        });
        showToast(`Payment failed: ${error.description || 'Unknown error'}`, 'error');
    } catch (err) {
        showToast('Payment failed', 'error');
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


// Admin UI Logic
async function renderAdminTab(tab) {
    const container = document.getElementById('admin-content-area');

    // Update Active Tab
    ['overview', 'users', 'donations', 'createAdmin'].forEach(t => {
        const btn = document.getElementById(`btn-tab-${t}`);
        if (t === tab) {
            btn.classList.add('text-primary', 'bg-indigo-50');
            btn.classList.remove('text-gray-500', 'hover:bg-gray-100');
        } else {
            btn.classList.remove('text-primary', 'bg-indigo-50');
            btn.classList.add('text-gray-500', 'hover:bg-gray-100');
        }
    });

    if (tab === 'overview') await loadAdminStats(container);
    if (tab === 'users') await loadAdminUsers(container);
    if (tab === 'donations') await loadAdminDonations(container);
    if (tab === 'createAdmin') loadCreateAdminForm(container);
}

function loadCreateAdminForm(container) {
    container.innerHTML = `
        <div class="max-w-2xl mx-auto">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                    <div class="flex items-center">
                        <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold">Create New Admin</h2>
                            <p class="text-purple-100 text-sm">Add a new administrator account</p>
                        </div>
                    </div>
                </div>
                
                <div class="p-8">
                    <form onsubmit="handleCreateAdmin(event)" class="space-y-5">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input type="text" name="name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition outline-none" placeholder="Enter admin's full name">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input type="email" name="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition outline-none" placeholder="admin@example.com">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input type="password" name="password" required minlength="6" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition outline-none" placeholder="Minimum 6 characters">
                            <p class="text-xs text-gray-500 mt-1">The admin will be able to change this password after first login</p>
                        </div>
                        
                        <div class="pt-4 border-t border-gray-200">
                            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                <div class="flex items-start">
                                    <svg class="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                    <div>
                                        <h4 class="text-sm font-bold text-yellow-800 mb-1">Administrator Access</h4>
                                        <p class="text-xs text-yellow-700">This user will have full administrative privileges including user management, donation oversight, and the ability to create other admins.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <button type="submit" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-[1.02] flex items-center justify-center">
                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                                Create Admin Account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

async function loadAdminStats(container) {
    container.innerHTML = `<div class="animate-pulse h-64 bg-gray-100 rounded-xl"></div>`; // Skeleton
    try {
        const stats = await apiCall('/api/admin/stats');
        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                         <svg class="w-8 h-8" fill="currentColor" stroke="none" viewBox="0 0 24 24"><text x="12" y="17" text-anchor="middle" font-size="20" font-weight="bold">₹</text></svg>
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
            </div>

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
                        <tbody class="divide-y divide-gray-100">
                            ${stats.recent_donations.length ? stats.recent_donations.map(d => `
                                <tr class="hover:bg-gray-50 transition">
                                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${d.user_name}</td>
                                    <td class="px-6 py-4 font-bold text-gray-800">₹${d.amount}</td>
                                    <td class="px-6 py-4">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full ${d.status === 'success' ? 'bg-green-100 text-green-800' : d.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}">
                                            ${d.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-xs font-mono text-gray-400">${d.transaction_id || '-'}</td>
                                </tr>
                            `).join('') : '<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">No data found.</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (err) {
        container.innerHTML = `<p class="text-red-500 text-center py-10">Failed to load stats</p>`;
    }
}

async function loadAdminUsers(container, sortBy = 'date_desc', search = '') {
    // Preserve search value if re-rendering due to sort
    const currentSearch = search || (document.getElementById('user-search-input') ? document.getElementById('user-search-input').value : '');

    container.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center bg-gray-50 space-y-4 md:space-y-0">
                <div class="flex space-x-2 w-full md:w-auto">
                    <input type="text" id="user-search-input" value="${currentSearch}" placeholder="Search by name or email..." class="px-4 py-2 border rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary" 
                        onkeyup="if(event.key==='Enter') loadAdminUsers(document.getElementById('admin-content-area'), '${sortBy}', this.value)">
                    <button onclick="loadAdminUsers(document.getElementById('admin-content-area'), '${sortBy}', document.getElementById('user-search-input').value)" class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Search</button>
                </div>
                
                <div class="flex space-x-2 items-center">
                    <span class="text-sm text-gray-500 font-medium">Sort by:</span>
                    <select onchange="loadAdminUsers(document.getElementById('admin-content-area'), this.value, document.getElementById('user-search-input').value)" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-700">
                        <option value="date_desc" ${sortBy === 'date_desc' ? 'selected' : ''}>Joined: Newest</option>
                        <option value="date_asc" ${sortBy === 'date_asc' ? 'selected' : ''}>Joined: Oldest</option>
                        <option value="name_asc" ${sortBy === 'name_asc' ? 'selected' : ''}>Name: A-Z</option>
                        <option value="name_desc" ${sortBy === 'name_desc' ? 'selected' : ''}>Name: Z-A</option>
                    </select>
                    
                    <a href="/api/admin/export/users" target="_blank" class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center whitespace-nowrap">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        CSV
                    </a>
                </div>
            </div>
            <div id="users-table-container" class="overflow-x-auto">
                <div class="p-8 text-center text-gray-500">Loading users...</div>
            </div>
        </div>
    `;

    try {
        const users = await apiCall(`/api/admin/users?search=${currentSearch}&sort_by=${sortBy}`);

        if (users.length === 0) {
            document.getElementById('users-table-container').innerHTML = `<div class="p-8 text-center text-gray-500">No users found matching your criteria.</div>`;
            return;
        }

        const table = `
            <table class="w-full text-left">
                <thead class="bg-gray-50">
                    <tr>
                         <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
                         <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                         <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                         <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                         <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Joined</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    ${users.map(u => `
                        <tr class="hover:bg-gray-50 transition">
                            <td class="px-6 py-4 text-xs font-mono text-gray-400">#${u.id}</td>
                             <td class="px-6 py-4 text-sm font-medium text-gray-900">${u.name}</td>
                             <td class="px-6 py-4 text-sm text-gray-500">${u.email}</td>
                             <td class="px-6 py-4 text-sm"><span class="px-2 py-1 bg-gray-100 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'text-indigo-600' : 'text-gray-600'}">${u.role}</span></td>
                             <td class="px-6 py-4 text-sm text-gray-500">${new Date(u.created_at).toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        document.getElementById('users-table-container').innerHTML = table;

        // Restore focus to input if it was active
        const input = document.getElementById('user-search-input');
        if (input && document.activeElement !== input) {
            // only focus if not already focused (though here we just recreated the DOM so it lost focus)
            input.focus();
            // move cursor to end
            const val = input.value;
            input.value = '';
            input.value = val;
        }

    } catch (err) {
        document.getElementById('users-table-container').innerHTML = `<p class="p-4 text-red-500">Error loading users</p>`;
    }
}

async function loadAdminDonations(container, sortBy = 'date_desc') {
    container.innerHTML = `<div class="p-8 text-center text-gray-500">Loading all donations...</div>`;
    try {
        const donations = await apiCall(`/api/admin/donations?sort_by=${sortBy}`);
        container.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 class="font-bold text-lg text-gray-800">All Transactions</h3>
                    <select onchange="loadAdminDonations(document.getElementById('admin-content-area'), this.value)" class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-700">
                        <option value="date_desc" ${sortBy === 'date_desc' ? 'selected' : ''}>Newest First</option>
                        <option value="date_asc" ${sortBy === 'date_asc' ? 'selected' : ''}>Oldest First</option>
                        <option value="amount_desc" ${sortBy === 'amount_desc' ? 'selected' : ''}>Highest Amount</option>
                        <option value="amount_asc" ${sortBy === 'amount_asc' ? 'selected' : ''}>Lowest Amount</option>
                        <option value="status" ${sortBy === 'status' ? 'selected' : ''}>Group by Status</option>
                    </select>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                             ${donations.map(d => `
                                <tr class="hover:bg-gray-50 transition">
                                    <td class="px-6 py-4 text-xs font-mono text-gray-400">#${d.id}</td>
                                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${d.user_name}<br><span class="text-xs text-gray-400 font-normal">${d.user_email}</span></td>
                                    <td class="px-6 py-4 font-bold text-gray-800">₹${d.amount}</td>
                                     <td class="px-6 py-4">
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full ${d.status === 'success' ? 'bg-green-100 text-green-800' : d.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}">
                                            ${d.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-xs text-gray-500">${new Date(d.created_at).toLocaleDateString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
    `;
    } catch (err) {
        container.innerHTML = `<p class="text-red-500 text-center">Error loading donations</p>`;
    }
}

// Router Function
function router(viewName, ...args) {
    const main = document.getElementById('main-content');
    main.innerHTML = views[viewName] ? views[viewName](...args) : '<h1>404 Not Found</h1>';
    updateNav();

    // Lifecycle hooks
    if (viewName === 'dashboard') loadHistory();
    if (viewName === 'admin') renderAdminTab('overview');
    if (viewName === 'home') loadHomeStats();

    // Auto-scroll to top
    window.scrollTo(0, 0);
}

// UI Helpers

function updateNav() {
    const links = document.getElementById('nav-links');

    // Common box style for nav buttons
    const btnClass = "flex items-center px-4 py-2 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 text-gray-700 hover:text-primary transition-all duration-200 transform hover:-translate-y-0.5 space-x-2";

    const homeBtn = `
        <button onclick="router('home')" class="${btnClass}">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span class="font-medium">Home</span>
        </button>
    `;

    if (state.user) {
        links.innerHTML = `
            <div class="flex items-center space-x-4">
                ${homeBtn}
                
                <button onclick="router('${state.user.role === 'admin' ? 'admin' : 'dashboard'}')" class="${btnClass}">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    <span class="font-medium">${state.user.name}</span>
                </button>
                
                <button onclick="handleLogout()" class="${btnClass} hover:text-red-600 hover:border-red-100">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    <span class="font-medium">Logout</span>
                </button>
            </div>
        `;
    } else {
        links.innerHTML = `
            <div class="flex items-center space-x-4">
                ${homeBtn}
                <div class="h-6 w-px bg-gray-200 mx-2"></div>
                <button onclick="router('authChoice')" class="text-gray-600 hover:text-primary font-medium transition">Login</button>
                <button onclick="router('userAuth', 'register')" class="bg-primary hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-full transition shadow-lg transform hover:-translate-y-0.5">Register</button>
            </div>
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
        router('authChoice');
    }
});

async function loadHomeStats() {
    try {
        const stats = await apiCall('/api/public/stats');

        // Helper to animate numbers
        const animateValue = (id, end, duration) => {
            const obj = document.getElementById(id);
            if (!obj) return;
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                obj.innerHTML = Math.floor(progress * end);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    obj.innerHTML = end; // Ensure final value
                }
            };
            window.requestAnimationFrame(step);
        };

        if (document.getElementById('stat-donors')) {
            document.getElementById('stat-donors').innerHTML = stats.donors;
            document.getElementById('stat-raised').innerHTML = '₹' + stats.raised;
            document.getElementById('stat-total-donations').innerHTML = stats.total_donations;
        }

    } catch (err) {
        if (document.getElementById('stat-donors')) {
            ['stat-donors', 'stat-raised', 'stat-total-donations'].forEach(id => {
                document.getElementById(id).innerHTML = '0';
            });
        }
    }
}
