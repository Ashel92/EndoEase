import { useState } from 'react'

type Resource = {
  id: number
  title: string
  category: string
  emoji: string
  description: string
  details: string[]
}

const resources: Resource[] = [
  {
    id: 1,
    title: 'What is endometriosis?',
    category: 'Basics',
    emoji: '🌸',
    description:
      'Understand the condition, why it happens, and how it can affect everyday life.',
    details: [
      'Endometriosis is a condition in which tissue similar to the lining of the uterus grows outside the uterus.',
      'It can cause inflammation, pain, and scar tissue. Symptoms differ from person to person.',
      'There is currently no definitive cure, but treatments can help manage symptoms.',
    ],
  },
  {
    id: 2,
    title: 'Understanding the symptoms',
    category: 'Symptoms',
    emoji: '🩷',
    description:
      'Learn about common symptoms and why experiences can differ.',
    details: [
      'Symptoms can include painful periods, pelvic pain, fatigue, and pain during bowel movements or urination.',
      'Some people experience symptoms that affect studying, working, relationships, or sleep.',
      'Symptoms alone cannot confirm endometriosis. A healthcare professional can help assess them.',
    ],
  },
  {
    id: 3,
    title: 'Understanding diagnosis',
    category: 'Diagnosis',
    emoji: '🩺',
    description:
      'Explore what to discuss with a healthcare professional.',
    details: [
      'A clinician may ask about your symptoms, periods, medical history, and family history.',
      'Ultrasound or MRI may help investigate suspected endometriosis. A normal scan does not always rule it out.',
      'You can ask about the available options, what each test involves, and what happens next.',
    ],
  },
  {
    id: 4,
    title: 'Exploring treatment options',
    category: 'Treatment',
    emoji: '🌷',
    description:
      'Get familiar with common approaches to managing endometriosis.',
    details: [
      'Treatment may include pain-relieving medicines, hormonal treatments, or surgery in selected cases.',
      'The most appropriate approach depends on symptoms, individual circumstances, preferences, and treatment risks.',
      'Discuss benefits, side effects, costs, and future pregnancy plans with your healthcare professional.',
    ],
  },
  {
    id: 5,
    title: 'Managing college life',
    category: 'Daily Life',
    emoji: '🎒',
    description:
      'Explore practical ways to make studying and campus life more manageable.',
    details: [
      'Consider keeping track of deadlines, appointments, and symptoms so you can plan ahead.',
      'If symptoms affect attendance, ask your college about available accommodations or support.',
      'You do not need to be productive every moment. Rest and asking for help are valid choices.',
    ],
  },
  {
    id: 6,
    title: 'Emotional wellbeing',
    category: 'Emotional Support',
    emoji: '🫶',
    description:
      'Make space for your feelings and discover gentle ways to seek support.',
    details: [
      'Living with ongoing symptoms can be emotionally difficult. Your feelings deserve attention.',
      'Talking to someone you trust or seeking professional mental health support may help.',
      'You do not have to explain everything perfectly to deserve kindness and understanding.',
    ],
  },
]

const categories = [
  'All',
  'Basics',
  'Symptoms',
  'Diagnosis',
  'Treatment',
  'Daily Life',
  'Emotional Support',
]

const myths = [
  {
    myth: 'Severe period pain is always normal.',
    fact: 'Pain that disrupts daily activities deserves medical attention. Severe period pain can have several causes, including endometriosis.',
  },
  {
    myth: 'A normal ultrasound always rules out endometriosis.',
    fact: 'Endometriosis may not be visible on imaging. A clinician can discuss your symptoms and whether further evaluation is appropriate.',
  },
  {
    myth: 'Everyone with endometriosis has the same symptoms.',
    fact: 'Symptoms vary widely. Some people have severe symptoms, while others have few or none.',
  },
  {
    myth: 'You have to manage everything alone.',
    fact: 'Support from trusted people, healthcare professionals, and appropriate support groups can make a difference.',
  },
]

const journalPrompts = [
  'What has been the hardest part of today?',
  'What is one thing I wish others understood about my experience?',
  'What would make tomorrow feel a little easier?',
  'What is one small thing I did today that I am proud of?',
]

const appointmentQuestions = [
  'Could my symptoms be related to endometriosis or another condition?',
  'What tests or examinations might be appropriate for me?',
  'What treatment options are available, and what are their risks?',
  'What should I do if my symptoms become worse?',
  'Are there options to help with fatigue, pain, or missed classes?',
]

function LearnSupport() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [expandedResource, setExpandedResource] = useState<number | null>(
    null,
  )
  const [expandedMyth, setExpandedMyth] = useState<number | null>(null)
  const [journalEntry, setJournalEntry] = useState('')
  const [savedJournal, setSavedJournal] = useState('')
  const [copiedQuestions, setCopiedQuestions] = useState(false)

  const filteredResources = resources.filter((resource) => {
    const matchesCategory =
      activeCategory === 'All' ||
      resource.category === activeCategory

    const searchText = search.trim().toLowerCase()

    const matchesSearch =
      !searchText ||
      resource.title.toLowerCase().includes(searchText) ||
      resource.description.toLowerCase().includes(searchText) ||
      resource.category.toLowerCase().includes(searchText)

    return matchesCategory && matchesSearch
  })

  function saveJournal() {
    const entry = journalEntry.trim()

    if (!entry) return

    try {
      localStorage.setItem('endoease-support-journal', entry)
      setSavedJournal(entry)
    } catch {
      setSavedJournal('')
    }
  }

  async function copyQuestions() {
    const text = appointmentQuestions
      .map((question, index) => `${index + 1}. ${question}`)
      .join('\n')

    try {
      await navigator.clipboard.writeText(text)
      setCopiedQuestions(true)
    } catch {
      setCopiedQuestions(false)
    }
  }

  return (
    <main className="learn-page">
      <style>{`
        .learn-page {
          --learn-pink: #d76b91;
          --learn-dark: #513b4b;
          --learn-muted: #887482;
          --learn-border: #f1dce7;
          color: var(--learn-dark);
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 22px 50px;
          font-family: inherit;
        }

        .learn-page * {
          box-sizing: border-box;
        }

        .learn-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 38px;
          border-radius: 26px;
          background: linear-gradient(135deg, #fff0f5, #f8efff);
          margin-bottom: 26px;
        }

        .learn-eyebrow {
          color: var(--learn-pink);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          margin: 0 0 12px;
        }

        .learn-hero h1 {
          font-size: clamp(30px, 5vw, 46px);
          line-height: 1.15;
          margin: 0 0 14px;
          color: var(--learn-dark);
        }

        .learn-hero p {
          max-width: 620px;
          color: #786477;
          line-height: 1.8;
          margin: 0;
        }

        .learn-hero-flower {
          font-size: clamp(65px, 10vw, 110px);
          flex-shrink: 0;
        }

        .learn-notice {
          padding: 15px 18px;
          border: 1px solid #f1d9e4;
          border-radius: 14px;
          background: #fff9fc;
          color: #76566a;
          font-size: 13px;
          line-height: 1.7;
          margin-bottom: 32px;
        }

        .learn-section {
          margin-top: 36px;
        }

        .learn-section-heading {
          margin-bottom: 20px;
        }

        .learn-section-heading h2 {
          font-size: clamp(23px, 3vw, 30px);
          margin: 0 0 8px;
        }

        .learn-section-heading p {
          color: var(--learn-muted);
          margin: 0;
          line-height: 1.7;
        }

        .learn-search {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid var(--learn-border);
          border-radius: 12px;
          background: white;
          color: var(--learn-dark);
          font: inherit;
          margin-bottom: 16px;
        }

        .learn-search:focus,
        .learn-journal textarea:focus {
          outline: 2px solid #e6a6c1;
          outline-offset: 2px;
        }

        .learn-categories {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-bottom: 20px;
        }

        .learn-category {
          border: 1px solid var(--learn-border);
          border-radius: 30px;
          background: white;
          color: #76566a;
          padding: 9px 14px;
          cursor: pointer;
          font: inherit;
          font-size: 13px;
        }

        .learn-category.active {
          background: #d76b91;
          border-color: #d76b91;
          color: white;
        }

        .learn-resource-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .learn-resource-card {
          padding: 22px;
          border: 1px solid var(--learn-border);
          border-radius: 18px;
          background: white;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: 0;
        }

        .learn-resource-emoji {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: #fff0f6;
          font-size: 24px;
          margin-bottom: 14px;
        }

        .learn-resource-category {
          color: var(--learn-pink);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 9px;
        }

        .learn-resource-card h3 {
          font-size: 18px;
          line-height: 1.4;
          margin: 0 0 9px;
        }

        .learn-resource-card > p {
          color: var(--learn-muted);
          font-size: 14px;
          line-height: 1.7;
          margin: 0 0 18px;
        }

        .learn-button {
          padding: 10px 14px;
          border: 0;
          border-radius: 10px;
          background: #fbe8f0;
          color: #984b6b;
          cursor: pointer;
          font: inherit;
          font-size: 13px;
          font-weight: 700;
          margin-top: auto;
        }

        .learn-details {
          width: 100%;
          padding: 14px 0 0;
          margin-top: 14px;
          border-top: 1px solid var(--learn-border);
        }

        .learn-details ul {
          padding-left: 20px;
          margin: 0;
        }

        .learn-details li {
          color: #715e6d;
          font-size: 13px;
          line-height: 1.8;
          margin-bottom: 10px;
        }

        .learn-empty {
          grid-column: 1 / -1;
          padding: 30px;
          text-align: center;
          color: var(--learn-muted);
          background: #fff9fc;
          border-radius: 16px;
        }

        .learn-myth-list {
          display: grid;
          gap: 12px;
        }

        .learn-myth-item {
          border: 1px solid var(--learn-border);
          border-radius: 14px;
          background: white;
          overflow: hidden;
        }

        .learn-myth-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 17px 19px;
          border: 0;
          background: transparent;
          text-align: left;
          color: var(--learn-dark);
          font: inherit;
          font-weight: 700;
          cursor: pointer;
        }

        .learn-myth-answer {
          padding: 0 19px 18px;
          color: var(--learn-muted);
          font-size: 14px;
          line-height: 1.8;
        }

        .learn-support-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .learn-support-card {
          padding: 24px;
          border: 1px solid var(--learn-border);
          border-radius: 18px;
          background: #fffafd;
          min-width: 0;
        }

        .learn-support-card h3 {
          margin: 0 0 10px;
          font-size: 20px;
        }

        .learn-support-card > p {
          color: var(--learn-muted);
          font-size: 14px;
          line-height: 1.8;
        }

        .learn-question-list {
          padding-left: 20px;
        }

        .learn-question-list li {
          color: #715e6d;
          font-size: 14px;
          line-height: 1.7;
          margin-bottom: 10px;
        }

        .learn-link {
          display: block;
          padding: 12px 0;
          border-bottom: 1px solid var(--learn-border);
          color: #a44f73;
          text-decoration: none;
          font-weight: 700;
          line-height: 1.5;
        }

        .learn-link:last-child {
          border-bottom: 0;
        }

        .learn-link:hover {
          text-decoration: underline;
        }

        .learn-journal textarea {
          width: 100%;
          min-height: 135px;
          padding: 13px;
          border: 1px solid var(--learn-border);
          border-radius: 12px;
          font: inherit;
          line-height: 1.7;
          resize: vertical;
          color: var(--learn-dark);
          background: white;
        }

        .learn-action {
          margin-top: 12px;
          padding: 11px 16px;
          border: 0;
          border-radius: 10px;
          background: #d76b91;
          color: white;
          font: inherit;
          font-weight: 700;
          cursor: pointer;
        }

        .learn-small-note {
          color: var(--learn-muted);
          font-size: 12px;
          line-height: 1.7;
        }

        .learn-footer {
          text-align: center;
          margin-top: 42px;
          padding: 25px;
          border-radius: 18px;
          background: #fff2f7;
          color: #80566e;
          line-height: 1.8;
        }

        @media (max-width: 850px) {
          .learn-resource-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .learn-page {
            padding: 20px 14px 35px;
          }

          .learn-hero {
            padding: 25px 20px;
          }

          .learn-hero-flower {
            display: none;
          }

          .learn-resource-grid,
          .learn-support-grid {
            grid-template-columns: 1fr;
          }

          .learn-resource-card,
          .learn-support-card {
            padding: 19px;
          }
        }
      `}</style>

      {/* HERO */}

      <section className="learn-hero">
        <div>
          <p className="learn-eyebrow">
            KNOWLEDGE · UNDERSTANDING · SUPPORT
          </p>

          <h1>Learn &amp; Support 🌷</h1>

          <p>
            A gentle space to understand endometriosis, explore
            reliable information, prepare for appointments, and
            remember that you deserve care and support.
          </p>
        </div>

        <div className="learn-hero-flower" aria-hidden="true">
          🌸
        </div>
      </section>

      <div className="learn-notice">
        <strong>A little note 💗</strong>
        <br />
        This page provides general educational information, not
        a diagnosis or personalised medical advice. Talk with a
        qualified healthcare professional about your symptoms
        and treatment options.
      </div>

      {/* LEARNING LIBRARY */}

      <section className="learn-section">
        <div className="learn-section-heading">
          <h2>Your learning corner 📚</h2>
          <p>
            Explore topics at your own pace. Start wherever feels
            right for you.
          </p>
        </div>

        <input
          className="learn-search"
          type="search"
          placeholder="🔎 Search topics, symptoms, treatment..."
          aria-label="Search educational resources"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="learn-categories">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`learn-category ${
                activeCategory === category ? 'active' : ''
              }`}
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="learn-resource-grid">
          {filteredResources.map((resource) => {
            const expanded = expandedResource === resource.id

            return (
              <article
                className="learn-resource-card"
                key={resource.id}
              >
                <div className="learn-resource-emoji">
                  {resource.emoji}
                </div>

                <span className="learn-resource-category">
                  {resource.category}
                </span>

                <h3>{resource.title}</h3>

                <p>{resource.description}</p>

                <button
                  type="button"
                  className="learn-button"
                  onClick={() =>
                    setExpandedResource(
                      expanded ? null : resource.id,
                    )
                  }
                  aria-expanded={expanded}
                >
                  {expanded ? 'Read less ↑' : 'Explore topic →'}
                </button>

                {expanded && (
                  <div className="learn-details">
                    <ul>
                      {resource.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            )
          })}

          {filteredResources.length === 0 && (
            <div className="learn-empty">
              <h3>No matching topics found 🌷</h3>
              <p>
                Try another search term or select a different
                category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* MYTHS AND FACTS */}

      <section className="learn-section">
        <div className="learn-section-heading">
          <h2>Myths vs. facts 💡</h2>
          <p>
            Let's replace common misconceptions with better
            information.
          </p>
        </div>

        <div className="learn-myth-list">
          {myths.map((item, index) => {
            const expanded = expandedMyth === index

            return (
              <article className="learn-myth-item" key={item.myth}>
                <button
                  type="button"
                  className="learn-myth-question"
                  onClick={() =>
                    setExpandedMyth(expanded ? null : index)
                  }
                  aria-expanded={expanded}
                >
                  <span>
                    <span aria-hidden="true">🌷 </span>
                    {item.myth}
                  </span>

                  <span aria-hidden="true">
                    {expanded ? '−' : '+'}
                  </span>
                </button>

                {expanded && (
                  <div className="learn-myth-answer">
                    <strong>Fact:</strong> {item.fact}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>

      {/* EMOTIONAL SUPPORT AND JOURNAL */}

      <section className="learn-section">
        <div className="learn-section-heading">
          <h2>A little emotional support 🫶</h2>
          <p>
            You don't have to have everything figured out today.
          </p>
        </div>

        <div className="learn-support-grid">
          <article className="learn-support-card">
            <h3>A reminder for you 💗</h3>

            <p>
              Your pain does not need to be visible to be real.
              Your experiences matter, even when other people
              don't fully understand them.
            </p>

            <p>
              You are allowed to ask for help, take breaks,
              change your plans, and advocate for your needs.
            </p>

            <p>
              <strong>
                You deserve to be heard, believed, and cared for.
              </strong>
            </p>
          </article>

          <article className="learn-support-card learn-journal">
            <h3>Your private reflection space 🌸</h3>

            <p>
              Choose a prompt and write whatever is on your mind.
              There is no right or wrong answer.
            </p>

            <label htmlFor="learn-journal-prompt">
              Reflection prompt
            </label>

            <select
              id="learn-journal-prompt"
              className="learn-search"
              defaultValue={journalPrompts[0]}
              onChange={(event) => {
                setJournalEntry(
                  `${event.target.value}\n\n`,
                )
              }}
            >
              {journalPrompts.map((prompt) => (
                <option key={prompt} value={prompt}>
                  {prompt}
                </option>
              ))}
            </select>

            <label htmlFor="learn-journal-entry">
              Your thoughts
            </label>

            <textarea
              id="learn-journal-entry"
              placeholder="Write a little about how you're feeling..."
              value={journalEntry}
              onChange={(event) =>
                setJournalEntry(event.target.value)
              }
            />

            <button
              type="button"
              className="learn-action"
              onClick={saveJournal}
            >
              Save reflection
            </button>

            {savedJournal && (
              <p role="status">
                Your reflection was saved in this browser. 💗
              </p>
            )}

            <p className="learn-small-note">
              Your reflection is stored locally in this browser,
              not in an online account. Anyone with access to this
              browser profile may be able to access it. Saving a
              new reflection replaces the previous saved entry.
            </p>
          </article>
        </div>
      </section>

      {/* DOCTOR VISIT PREPARATION */}

      <section className="learn-section">
        <div className="learn-section-heading">
          <h2>Getting ready for your appointment 🩺</h2>

          <p>
            You can take these questions with you and choose
            whichever ones are useful.
          </p>
        </div>

        <article className="learn-support-card">
          <ol className="learn-question-list">
            {appointmentQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ol>

          <button
            type="button"
            className="learn-action"
            onClick={copyQuestions}
          >
            {copiedQuestions
              ? 'Questions copied ✓'
              : 'Copy questions'}
          </button>

          <p className="learn-small-note">
            If copying isn't supported by your browser, you can
            select and copy the questions manually.
          </p>
        </article>
      </section>

      {/* TRUSTED RESOURCES */}

      <section className="learn-section">
        <div className="learn-section-heading">
          <h2>Explore trusted resources 🌍</h2>

          <p>
            Learn more from established health organisations.
            These links open external websites.
          </p>
        </div>

        <div className="learn-support-grid">
          <article className="learn-support-card">
            <h3>Medical information</h3>

            <a
              className="learn-link"
              href="https://www.who.int/news-room/fact-sheets/detail/endometriosis"
              target="_blank"
              rel="noreferrer"
            >
              World Health Organization — Endometriosis ↗
            </a>

            <a
              className="learn-link"
              href="https://www.nhs.uk/conditions/endometriosis/"
              target="_blank"
              rel="noreferrer"
            >
              NHS — Symptoms, diagnosis and treatment ↗
            </a>

            <a
              className="learn-link"
              href="https://www.rcog.org.uk/for-the-public/browse-our-patient-information/endometriosis/"
              target="_blank"
              rel="noreferrer"
            >
              Royal College of Obstetricians and Gynaecologists ↗
            </a>
          </article>

          <article className="learn-support-card">
            <h3>Further guidance and support</h3>

            <a
              className="learn-link"
              href="https://www.nice.org.uk/guidance/ng73"
              target="_blank"
              rel="noreferrer"
            >
              NICE — Endometriosis guidance ↗
            </a>

            <a
              className="learn-link"
              href="https://www.endometriosis-uk.org/"
              target="_blank"
              rel="noreferrer"
            >
              Endometriosis UK — Information and support ↗
            </a>

            <a
              className="learn-link"
              href="https://www.nichd.nih.gov/health/topics/endometri/more_information/resources"
              target="_blank"
              rel="noreferrer"
            >
              NIH — Endometriosis resources ↗
            </a>
          </article>
        </div>
      </section>

      <footer className="learn-footer">
        <span aria-hidden="true">🌸 💗 🌸</span>

        <p>
          Keep learning at your own pace. Keep asking questions.
          You deserve compassionate care and reliable information.
        </p>
      </footer>
    </main>
  )
}

export default LearnSupport