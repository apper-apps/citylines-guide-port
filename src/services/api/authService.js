import mockUsers from '@/services/mockData/users.json';

// Simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Local storage keys
const AUTH_STORAGE_KEY = 'citylines_auth_user';
const USERS_STORAGE_KEY = 'citylines_users';

// Initialize users in localStorage if not exists
const initializeUsers = () => {
  const existingUsers = localStorage.getItem(USERS_STORAGE_KEY);
  if (!existingUsers) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(mockUsers));
  }
};

// Get users from localStorage
const getUsers = () => {
  initializeUsers();
  return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
};

// Save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// Get next available ID
const getNextId = () => {
  const users = getUsers();
  const maxId = users.reduce((max, user) => Math.max(max, user.Id), 0);
  return maxId + 1;
};

export const authService = {
  // Get current authenticated user
  async getCurrentUser() {
    await delay(200);
    const userData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!userData) {
      throw new Error('No authenticated user');
    }
    return JSON.parse(userData);
  },

  // Login user
  async login(email, password) {
    await delay(300);
    
    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    if (user.password !== password) {
      throw new Error('Invalid email or password');
    }
    
    if (!user.emailVerified) {
      throw new Error('Please verify your email address before signing in');
    }
    
    // Update last login
    user.lastLogin = new Date().toISOString();
    saveUsers(users);
    
    // Store auth user (without password)
    const authUser = { ...user };
    delete authUser.password;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    
    return authUser;
  },

  // Signup user
  async signup(email, password, name) {
    await delay(400);
    
    const users = getUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      throw new Error('An account with this email already exists');
    }
    
    // Create new user
    const newUser = {
      Id: getNextId(),
      name: name.trim(),
      email: email.toLowerCase(),
      password: password,
      emailVerified: false,
      subscriptionTier: 'starter',
      createdAt: new Date().toISOString(),
      lastLogin: null,
      verificationToken: this.generateToken()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    // Simulate sending verification email
    console.log(`Verification email sent to ${email} with token: ${newUser.verificationToken}`);
    
    return {
      Id: newUser.Id,
      name: newUser.name,
      email: newUser.email,
      emailVerified: newUser.emailVerified
    };
  },

  // Logout user
  async logout() {
    await delay(200);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  // Forgot password
  async forgotPassword(email) {
    await delay(300);
    
    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      // Don't reveal if email exists for security
      return { message: 'If an account with this email exists, a reset link has been sent' };
    }
    
    // Generate reset token
    user.resetToken = this.generateToken();
    user.resetTokenExpires = new Date(Date.now() + 3600000).toISOString(); // 1 hour
    saveUsers(users);
    
    // Simulate sending reset email
    console.log(`Reset email sent to ${email} with token: ${user.resetToken}`);
    
    return { message: 'Password reset email sent' };
  },

  // Reset password
  async resetPassword(token, newPassword) {
    await delay(300);
    
    const users = getUsers();
    const user = users.find(u => u.resetToken === token);
    
    if (!user || !user.resetTokenExpires) {
      throw new Error('Invalid or expired reset token');
    }
    
    if (new Date(user.resetTokenExpires) < new Date()) {
      throw new Error('Reset token has expired');
    }
    
    // Update password and clear reset token
    user.password = newPassword;
    delete user.resetToken;
    delete user.resetTokenExpires;
    saveUsers(users);
    
    return { message: 'Password reset successful' };
  },

  // Verify email
  async verifyEmail(token) {
    await delay(300);
    
    const users = getUsers();
    const user = users.find(u => u.verificationToken === token);
    
    if (!user) {
      throw new Error('Invalid verification token');
    }
    
    // Mark email as verified
    user.emailVerified = true;
    delete user.verificationToken;
    saveUsers(users);
    
    // Auto-login after verification
    const authUser = { ...user };
    delete authUser.password;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    
    return authUser;
  },

  // Resend verification email
  async resendVerificationEmail(email) {
    await delay(300);
    
    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    if (user.emailVerified) {
      throw new Error('Email is already verified');
    }
    
    // Generate new verification token
    user.verificationToken = this.generateToken();
    saveUsers(users);
    
    // Simulate sending verification email
    console.log(`Verification email resent to ${email} with token: ${user.verificationToken}`);
    
    return { message: 'Verification email sent' };
  },

  // Generate random token
  generateToken() {
    return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
  }
};