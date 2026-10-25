import { useEffect, useState } from 'react'

type ProfileData = {
  name: string
  age: string
  pronouns: string
  bio: string
  goal: string
  reminders: boolean
}

const defaultProfile: ProfileData = {
  name: '',
  age: '',
  pronouns: '',
  bio: '',
  goal: 'Understand my symptoms',
  reminders: true,
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData>(() => {
    try {
      const saved = localStorage.getItem('endoease-profile')
      return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile
    } catch {
      return defaultProfile
    }
  })

  const [editing, setEditing] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')

  useEffect(() => {
    localStorage.setItem('endoease-profile', JSON.stringify(profile))
  }, [profile])

  function updateField<K extends keyof ProfileData>(
    field: K,
    value: ProfileData[K],
  ) {
    setProfile((previous) => ({ ...previous, [field]: value }))
    setSavedMessage('')
  }

  function resetProfile() {
    const confirmed = window.confirm(
      'Are you sure you want to reset your profile?',
    )

    if (confirmed) {
      setProfile(defaultProfile)
      setEditing(false)
      setSavedMessage('Your profile has been reset.')
    }
  }

  function saveProfile() {
    localStorage.setItem('endoease-profile', JSON.stringify(profile))
    setEditing(false)
    setSavedMessage('Your profile has been saved! 💗')
  }

  return (
    <div className="profile-page">
      <style>{`
        .profile-page {
          color: #493443;
          max-width: 1050px;
          margin: 0 auto;
          padding: 10px 0 40px;
        }

        .profile-hero {
          background: linear-gradient(135deg, #ffe8f0, #fff3f6, #f5eaff);
          border: 1px solid #f5dce7;
          border-radius: 26px;
          padding: 32px;
          margin-bottom: 24px;
        }

        .profile-eyebrow {
          color: #a64d79;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .profile-hero h1 {
          font-size: clamp(27px, 4vw, 36px);
          margin: 12px 0 8px;
          color: #58364c;
        }

        .profile-hero p {
          color: #795c70;
          line-height: 1.7;
          margin: 0;
          max-width: 600px;
        }

        .profile-card {
          background: #fff;
          border: 1px solid #f0e3eb;
          border-radius: 22px;
          padding: 25px;
          margin-bottom: 20px;
          box-shadow: 0 5px 22px rgba(99, 49, 76, 0.04);
        }

        .profile-card h2 {
          font-size: 19px;
          margin: 0 0 7px;
          color: #593b50;
        }

        .profile-description {
          font-size: 13px;
          color: #927b8b;
          margin: 0 0 22px;
          line-height: 1.6;
        }

        .profile-avatar-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 26px;
        }

        .profile-avatar {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f9c6da, #ead6fa);
          display: grid;
          place-items: center;
          font-size: 32px;
          flex-shrink: 0;
        }

        .profile-avatar-row strong {
          font-size: 17px;
        }

        .profile-avatar-row p {
          color: #927b8b;
          font-size: 13px;
          margin: 5px 0 0;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .profile-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }

        .profile-field.full-width {
          grid-column: 1 / -1;
        }

        .profile-field label {
          font-size: 13px;
          font-weight: 700;
          color: #68485d;
        }

        .profile-field input,
        .profile-field textarea,
        .profile-field select {
          box-sizing: border-box;
          width: 100%;
          border: 1px solid #ead8e3;
          border-radius: 12px;
          background: #fffafd;
          padding: 12px 14px;
          color: #493443;
          font: inherit;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .profile-field input:focus,
        .profile-field textarea:focus,
        .profile-field select:focus {
          border-color: #d783ab;
        }

        .profile-field textarea {
          resize: vertical;
          min-height: 95px;
        }

        .profile-field input:disabled,
        .profile-field textarea:disabled,
        .profile-field select:disabled {
          opacity: 1;
          color: #795c70;
          background: #fff;
          border-color: #f3eaf0;
        }

        .profile-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 22px;
        }

        .profile-button {
          border: none;
          border-radius: 12px;
          padding: 12px 19px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: transform 0.2s, opacity 0.2s;
        }

        .profile-button:hover {
          transform: translateY(-1px);
        }

        .profile-button.primary {
          color: white;
          background: #c66d98;
        }

        .profile-button.secondary {
          color: #86536f;
          background: #faeaf1;
        }

        .profile-button.danger {
          color: #a34455;
          background: #fff0f1;
        }

        .profile-toggle-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          padding: 15px 0;
        }

        .profile-toggle-row + .profile-toggle-row {
          border-top: 1px solid #f3eaf0;
        }

        .profile-toggle-row strong {
          font-size: 14px;
        }

        .profile-toggle-row p {
          font-size: 12px;
          color: #927b8b;
          margin: 5px 0 0;
          line-height: 1.5;
        }

        .profile-toggle-row input {
          width: 19px;
          height: 19px;
          accent-color: #c66d98;
          flex-shrink: 0;
          cursor: pointer;
        }

        .profile-message {
          color: #8a4c70;
          font-size: 13px;
          margin-top: 15px;
          font-weight: 600;
        }

        .profile-privacy-note {
          background: #fff6fa;
          border-radius: 13px;
          padding: 14px;
          color: #896a7d;
          font-size: 12px;
          line-height: 1.7;
          margin-top: 15px;
        }

        @media (max-width: 600px) {
          .profile-hero {
            padding: 23px;
          }

          .profile-card {
            padding: 19px;
          }

          .profile-grid {
            grid-template-columns: 1fr;
          }

          .profile-field.full-width {
            grid-column: auto;
          }
        }
      `}</style>

      <section className="profile-hero">
        <span className="profile-eyebrow">🌸 YOUR PERSONAL SPACE</span>
        <h1>My Profile & Settings</h1>
        <p>
          This is your space to make EndoEase feel more like you.
          Take your time, share only what you feel comfortable sharing,
          and remember that your well-being matters.
        </p>
      </section>

      <section className="profile-card">
        <div className="profile-avatar-row">
          <div className="profile-avatar" aria-hidden="true">
            🌷
          </div>
          <div>
            <strong>{profile.name.trim() || 'Your Name Here'}</strong>
            <p>Your EndoEase profile</p>
          </div>
        </div>

        <h2>👤 Personal information</h2>
        <p className="profile-description">
          Add a few details to personalize your experience. Everything here
          is optional.
        </p>

        <div className="profile-grid">
          <div className="profile-field">
            <label htmlFor="profile-name">Name</label>
            <input
              id="profile-name"
              type="text"
              placeholder="What should we call you?"
              value={profile.name}
              disabled={!editing}
              onChange={(event) => updateField('name', event.target.value)}
            />
          </div>

          <div className="profile-field">
            <label htmlFor="profile-age">Age (optional)</label>
            <input
              id="profile-age"
              type="number"
              min="1"
              max="120"
              placeholder="Your age"
              value={profile.age}
              disabled={!editing}
              onChange={(event) => updateField('age', event.target.value)}
            />
          </div>

          <div className="profile-field">
            <label htmlFor="profile-pronouns">Pronouns (optional)</label>
            <select
              id="profile-pronouns"
              value={profile.pronouns}
              disabled={!editing}
              onChange={(event) => updateField('pronouns', event.target.value)}
            >
              <option value="">Prefer not to say</option>
              <option value="She/her">She/her</option>
              <option value="He/him">He/him</option>
              <option value="They/them">They/them</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="profile-field">
            <label htmlFor="profile-goal">My personal goal</label>
            <select
              id="profile-goal"
              value={profile.goal}
              disabled={!editing}
              onChange={(event) => updateField('goal', event.target.value)}
            >
              <option>Understand my symptoms</option>
              <option>Build a gentle routine</option>
              <option>Balance college and wellness</option>
              <option>Prepare for doctor appointments</option>
              <option>Learn more about endometriosis</option>
              <option>Focus on emotional well-being</option>
            </select>
          </div>

          <div className="profile-field full-width">
            <label htmlFor="profile-bio">A little about me (optional)</label>
            <textarea
              id="profile-bio"
              placeholder="Write something about yourself..."
              value={profile.bio}
              disabled={!editing}
              onChange={(event) => updateField('bio', event.target.value)}
            />
          </div>
        </div>

        <div className="profile-actions">
          {editing ? (
            <>
              <button
                className="profile-button primary"
                onClick={saveProfile}
              >
                💗 Save Changes
              </button>
              <button
                className="profile-button secondary"
                onClick={() => {
                  setEditing(false)
                  setSavedMessage('')
                  try {
                    const saved = localStorage.getItem('endoease-profile')
                    setProfile(
                      saved
                        ? { ...defaultProfile, ...JSON.parse(saved) }
                        : defaultProfile,
                    )
                  } catch {
                    setProfile(defaultProfile)
                  }
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="profile-button primary"
              onClick={() => {
                setEditing(true)
                setSavedMessage('')
              }}
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {savedMessage && (
          <p className="profile-message" role="status">
            {savedMessage}
          </p>
        )}
      </section>

      <section className="profile-card">
        <h2>🌷 Wellness preferences</h2>
        <p className="profile-description">
          Choose how you would like your EndoEase experience to feel.
        </p>

        <div className="profile-toggle-row">
          <div>
            <strong>Gentle reminders</strong>
            <p>
              Preference for supportive reminders and wellness prompts.
              This setting does not send notifications yet.
            </p>
          </div>
          <input
            type="checkbox"
            aria-label="Enable gentle reminders preference"
            checked={profile.reminders}
            onChange={(event) => updateField('reminders', event.target.checked)}
          />
        </div>

        <div className="profile-privacy-note">
          💕 You can change these preferences whenever you like.
          Reminder scheduling and browser notifications are not enabled yet.
        </div>
      </section>

      <section className="profile-card">
        <h2>🔒 Privacy & data</h2>
        <p className="profile-description">
          Your profile is saved in this browser on this device.
          It is not an online account and will not automatically sync
          to another device.
        </p>

        <div className="profile-privacy-note">
          Please avoid adding passwords or highly sensitive medical details.
          Anyone with access to this browser profile may be able to view
          information saved here.
        </div>

        <div className="profile-actions">
          <button
            className="profile-button danger"
            onClick={resetProfile}
          >
            Reset Profile Data
          </button>
        </div>
      </section>
    </div>
  )
}
