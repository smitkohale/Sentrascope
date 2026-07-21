function generateSessionId(): string {
  const arr = new Uint8Array(5);
  crypto.getRandomValues(arr);
  return 'SID-' + Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

export const AuthManager = {
  initSession(name: string | null | undefined, email: string, token: string) {
    const finalName = name || email.split('@')[0] || 'Operator';
    const sessionData = {
      user: { name: finalName, email: email },
      token: token,
      sessionId: generateSessionId(),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('sentra_session', JSON.stringify(sessionData));
    localStorage.setItem('sentraUserName', finalName);
    localStorage.setItem('sentra_auth_token', token);
  },

  getSession() {
    const data = localStorage.getItem('sentra_session');
    return data ? JSON.parse(data) : null;
  },

  getToken() {
    const session = this.getSession();
    return session?.token || localStorage.getItem('sentra_auth_token') || null;
  },

  isAuthenticated() {
    return !!this.getSession();
  },

  logout() {
    localStorage.removeItem('sentra_session');
    localStorage.removeItem('sentraUserName');
    localStorage.removeItem('sentra_auth_token');
    window.location.href = '/login';
  }
};
