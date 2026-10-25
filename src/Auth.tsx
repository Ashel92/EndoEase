import { useState } from 'react';

export type DemoUser = {
  name: string;
  email: string;
};

type AuthProps = {
  onLogin: (user: DemoUser) => void;
};

const ACCOUNT_KEY = 'endoease_demo_account';

export default function Auth({ onLogin }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError('Please enter your email and password.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your name.');
        return;
      }

      if (password.length < 6) {
        setError('For this demo, use at least 6 characters for your password.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Your passwords do not match.');
        return;
      }

      const user: DemoUser = {
        name: name.trim(),
        email: cleanEmail,
      };

      // Save only the demo account's name and email — never its password.
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(user));
      onLogin(user);
      return;
    }

    const savedAccount = localStorage.getItem(ACCOUNT_KEY);

    if (!savedAccount) {
      setError('No demo account found. Please sign up first.');
      return;
    }

    try {
      const account = JSON.parse(savedAccount) as DemoUser;

      if (account.email !== cleanEmail) {
        setError('That email does not match the demo account. Please try again.');
        return;
      }

      // This demo only checks that a password was entered.
      // It cannot verify the original password because passwords are not saved.
      onLogin(account);
    } catch {
      setError('We could not read the demo account. Please sign up again.');
      localStorage.removeItem(ACCOUNT_KEY);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-flower">🌷</div>
        <p className="auth-eyebrow">YOUR GENTLE SPACE</p>
        <h1>Welcome to EndoEase</h1>
        <p className="auth-subtitle">
          A little space to understand your body, find your rhythm,
          and take things one day at a time.
        </p>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === 'signup' ? 'auth-tab active' : 'auth-tab'}
            onClick={() => {
              setMode('signup');
              setError('');
            }}
          >
            Sign up
          </button>
          <button
            type="button"
            className={mode === 'login' ? 'auth-tab active' : 'auth-tab'}
            onClick={() => {
              setMode('login');
              setError('');
            }}
          >
            Log in
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label className="auth-label">
              Your name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="What should we call you?"
                autoComplete="name"
              />
            </label>
          )}

          <label className="auth-label">
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="auth-label">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter a password"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              required
            />
          </label>

          {mode === 'signup' && (
            <label className="auth-label">
              Confirm password
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Enter it again"
                autoComplete="new-password"
                required
              />
            </label>
          )}

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button type="submit" className="auth-submit">
            {mode === 'signup' ? 'Create my account →' : 'Enter EndoEase →'}
          </button>
        </form>

        <p className="auth-privacy">
          Made for gentle days, at your own pace. 💗
        </p>
        <p className="auth-demo-note">
          Demo only: your password is not saved or securely verified.
        </p>
      </section>
    </main>
  );
}