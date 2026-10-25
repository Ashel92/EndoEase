import Auth, { type DemoUser } from './Auth';
import Planner from './pages/Planner'
import LearnSupport from './pages/LearnSupport'
import Profile from './pages/Profile'
import CollegeLife from './pages/CollegeLife'
import Insights from './pages/Insights'
import Symptoms from './pages/Symptoms'
import { useState } from 'react'
import './App.css'


const navigation = [
  { icon: '⌂', label: 'Dashboard' },
  { icon: '♡', label: 'My Symptoms' },
  { icon: '✳', label: 'My Insights' },
  { icon: '☼', label: 'Gentle Planner' },
  { icon: '▦', label: 'College Life' },
  { icon: '✿', label: 'Learn & Support' },
  { icon: '🌷', label: 'Profile & Settings' },
]


export default function App() {
const [activePage, setActivePage] = useState('Dashboard')
const [currentUser, setCurrentUser] = useState<DemoUser | null>(() => {
  try {
    const savedSession = localStorage.getItem('endoease_demo_session');
    return savedSession ? (JSON.parse(savedSession) as DemoUser) : null;
  } catch {
    return null;
  }
});

function handleLogin(user: DemoUser) {
  // Save the session, not the password.
  localStorage.setItem('endoease_demo_session', JSON.stringify(user));
  setCurrentUser(user);
}

function handleLogout() {
  localStorage.removeItem('endoease_demo_session');
  setCurrentUser(null);
  setActivePage('Dashboard');
}
const [showCheckin, setShowCheckin] = useState(false)
const [painLevel, setPainLevel] = useState(0)
const [energyLevel, setEnergyLevel] = useState('Okay')
const [mood, setMood] = useState('Okay')
const [savedCheckin, setSavedCheckin] = useState(false)
if (!currentUser) {
  return <Auth onLogin={handleLogin} />;
}
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={() => setActivePage('Dashboard')}>
          <span className="brand-flower">✿</span>
          <span>endo<span className="brand-accent">ease</span></span>
        </a>

        <p className="nav-heading">YOUR SPACE</p>

        <nav className="navigation">
          {navigation.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${activePage === item.label ? 'active' : ''}`}
              onClick={() => setActivePage(item.label)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
<button
  type="button"
  className="logout-button"
  onClick={handleLogout}
>
  <span>🚪</span>
  <span>Log out</span>
</button>
        <div className="sidebar-note">
          <span className="note-flower">✿</span>
          <p>Rest is productive, too.</p>
          <span>You deserve gentleness.</span>
        </div>

        <button
          className="profile-button"
          onClick={() => setActivePage('Profile & Settings')}
        >
          <span className="avatar">🌷</span>
          <span className="profile-copy">
            <strong>Your profile</strong>
            <small>My little space</small>
          </span>
          <span className="profile-dots">···</span>
        </button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <span className="eyebrow">YOUR PERSONAL WELLBEING SPACE</span>
          <button
             className="today-button"
            onClick={() => setActivePage('Dashboard')}
          >
            <span>♡</span> A little space for you
          </button>
        </header>

        <section className="welcome-section">
          <div>
            <p className="date-label">YOUR JOURNEY, YOUR PACE</p>
            <h1>
              A little care goes
              <br />
              <span>a long way.</span>
            </h1>
            <p className="welcome-copy">
              This is your space to check in with yourself,
              <br className="desktop-break" />
              understand your body and take things gently.
            </p>
          </div>

          <div className="companion" aria-label="Decorative flower companion">
            <span className="companion-sparkle sparkle-one">✦</span>
            <span className="companion-flower">✿</span>
            <span className="companion-face">•ᴗ•</span>
            <span className="companion-sparkle sparkle-two">✧</span>
            <span className="companion-caption">here for you ♡</span>
          </div>
        </section>

{activePage === 'My Insights' ? (
  <Insights />
) : activePage === 'My Symptoms' ? (
  <Symptoms />
) : activePage === 'College Life' ? (
  <CollegeLife />
) : activePage === 'Gentle Planner' ? (
  <Planner />
) : activePage === 'Learn & Support' ? (
  <LearnSupport />
) : activePage === 'Profile & Settings' ? (
  <Profile />  
) : activePage === 'Dashboard' ? (
          <>
            <section className="section-heading">
              <div>
                <p className="eyebrow">START WHERE YOU ARE</p>
                <h2>Your wellbeing corner</h2>
              </div>
              <span className="soft-tag">No pressure, ever ♡</span>
            </section>

            <section className="feature-grid">
              <article className="feature-card checkin-card">
                <div className="card-topline">
                  <span className="card-icon pink-icon">♡</span>
                  <span className="card-label">DAILY CHECK-IN</span>
                </div>
                <h3>How are you feeling today?</h3>
                <p>
                  Every feeling is welcome here. Take a moment just for you.
                </p>
                
                <span className="card-decoration">♡</span>
              </article>

{showCheckin ? (
  <form
    className="checkin-form"
    onSubmit={(event) => {
      event.preventDefault()
      setSavedCheckin(true)
      setShowCheckin(false)
    }}
  >
    <label htmlFor="pain">Pain intensity: {painLevel}/10</label>
    <input
      id="pain"
      type="range"
      min="0"
      max="10"
      value={painLevel}
      onChange={(event) => setPainLevel(Number(event.target.value))}
    />

    <label htmlFor="energy">Energy level</label>
    <select
      id="energy"
      value={energyLevel}
      onChange={(event) => setEnergyLevel(event.target.value)}
    >
      <option>Low</option>
      <option>Okay</option>
      <option>Good</option>
    </select>

    <label htmlFor="mood">Mood</label>
    <select
      id="mood"
      value={mood}
      onChange={(event) => setMood(event.target.value)}
    >
      <option>Low</option>
      <option>Okay</option>
      <option>Good</option>
    </select>

    <button className="primary-button" type="submit">
      Save my check-in →
    </button>

    <button
      className="text-button"
      type="button"
      onClick={() => setShowCheckin(false)}
    >
      Maybe later
    </button>
  </form>
) : savedCheckin ? (
  <div className="success-message">
    <span>♡</span>
    Check-in saved for this session. Thank you for checking in.
    <button
      className="text-button"
      type="button"
      onClick={() => setShowCheckin(true)}
    >
      Edit check-in
    </button>
  </div>
) : (
  <button
    className="primary-button"
    type="button"
    onClick={() => setShowCheckin(true)}
  >
    I'm ready to check in <span>→</span>
  </button>
)}
              <article className="feature-card symptom-card">
                <div className="card-topline">
                  <span className="card-icon teal-icon">✿</span>
                  <span className="card-label">SYMPTOM JOURNAL</span>
                </div>
                <h3>Listen to your body</h3>
                <p>
                  Make space for your symptoms, energy and feelings.
                  Your experience matters.
                </p>
                <button
                  className="secondary-button"
                  onClick={() => setActivePage('My Symptoms')}
                >
                  Explore my journal <span>→</span>
                </button>
                <span className="card-decoration">✿</span>
              </article>
            </section>

            <section className="lower-grid">
              <article className="panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">GENTLE REMINDER</p>
                    <h3>A note for you</h3>
                  </div>
                  <span className="reminder-icon">☁</span>
                </div>
                <blockquote>
                  You don't have to earn your rest.
                  <br />
                  You are allowed to take up space,
                  <br />
                  even on the difficult days.
                </blockquote>
                <span className="quote-credit">A little reminder, just for you ♡</span>
              </article>

              <article className="panel planner-preview">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">LIFE, AT YOUR PACE</p>
                    <h3>Your gentle planner</h3>
                  </div>
                  <span className="planner-icon">✧</span>
                </div>
                <p className="panel-copy">
                  College and life can wait a moment while you decide what
                  feels manageable today.
                </p>
                <button
                  className="text-button"
                  onClick={() => setActivePage('Gentle Planner')}
                >
                  Make a gentle plan <span>→</span>
                </button>
              </article>
            </section>

            <footer className="dashboard-footer">
              <span>Made with care, for you ♡</span>
              <span>Your body. Your pace. Your space.</span>
            </footer>
          </>
        ) : (
          <section className="coming-soon">
            <span className="coming-flower">✿</span>
            <p className="eyebrow">YOUR PERSONAL SPACE</p>
            <h2>{activePage}</h2>
            <p>
              This part of EndoEase is on our building list.
              We'll bring it to life one step at a time.
            </p>
            <button
              className="primary-button"
              onClick={() => setActivePage('Dashboard')}
            >
              Back to dashboard <span>→</span>
            </button>
          </section>
        )}
      </main>
    </div>
  )
}
