
import { useEffect, useState, type FormEvent } from 'react'
import { wellbeingService, type SymptomEntry } from '../services/wellbeingService'
import '../App.css'

const painLocations = ['Pelvis', 'Lower abdomen', 'Lower back', 'Legs', 'Other']
const symptomOptions = ['Fatigue', 'Bloating', 'Nausea', 'Brain fog', 'Bowel symptoms', 'Bladder symptoms']

export default function Symptoms() {
  const [painLevel, setPainLevel] = useState(0)
  const [painLocation, setPainLocation] = useState<string[]>([])
  const [painType, setPainType] = useState('Cramping')
  const [fatigue, setFatigue] = useState(0)
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [studyImpact, setStudyImpact] = useState<SymptomEntry['studyImpact']>('None')
  const [notes, setNotes] = useState('')
  const [entries, setEntries] = useState<SymptomEntry[]>([])
  const [message, setMessage] = useState('')

  async function loadEntries() {
    setEntries(await wellbeingService.getSymptoms())
  }
  useEffect(() => {
  loadEntries()
}, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      await wellbeingService.saveSymptom({
        painLevel,
        painLocation,
        painType,
        fatigue,
        symptoms,
        studyImpact,
        notes,
      })

      setMessage('Your entry has been saved for this session.')
      setPainLevel(0)
      setPainLocation([])
      setPainType('Cramping')
      setFatigue(0)
      setSymptoms([])
      setStudyImpact('None')
      setNotes('')
      await loadEntries()
    } catch (error) {
  console.error('Failed to save symptom entry:', error)

  setMessage(
    error instanceof Error
      ? `Save failed: ${error.message}`
      : 'Save failed. Please try again.'
  )
}
  }

  async function deleteEntry(id: string) {
    await wellbeingService.deleteSymptom(id)
    await loadEntries()
  }

  function toggleItem(
    item: string,
    selected: string[],
    update: (value: string[]) => void,
  ) {
    update(
      selected.includes(item)
        ? selected.filter((value) => value !== item)
        : [...selected, item],
    )
  }

  return (
    <section className="symptoms-page">
      <p className="eyebrow">YOUR BODY, YOUR EXPERIENCE</p>
      <h1 className="symptoms-title">My symptom journal</h1>
      <p className="symptoms-intro">
        A gentle space to notice what you are experiencing.
        You can skip anything you do not want to answer.
      </p>

      <form className="symptom-form" onSubmit={handleSubmit}>
        <label htmlFor="symptom-pain">Pain intensity: {painLevel}/10</label>
        <input
          id="symptom-pain"
          type="range"
          min="0"
          max="10"
          value={painLevel}
          onChange={(event) => setPainLevel(Number(event.target.value))}
        />

        <fieldset>
          <legend>Where do you feel pain?</legend>
          {painLocations.map((location) => (
            <label className="choice-label" key={location}>
              <input
                type="checkbox"
                checked={painLocation.includes(location)}
                onChange={() => toggleItem(location, painLocation, setPainLocation)}
              />
              {location}
            </label>
          ))}
        </fieldset>

        <label htmlFor="pain-type">What does the pain feel like?</label>
        <select id="pain-type" value={painType} onChange={(event) => setPainType(event.target.value)}>
          <option>Cramping</option>
          <option>Sharp</option>
          <option>Dull ache</option>
          <option>Burning</option>
          <option>Pressure</option>
          <option>Other</option>
        </select>

        <label htmlFor="fatigue">Fatigue: {fatigue}/10</label>
        <input
          id="fatigue"
          type="range"
          min="0"
          max="10"
          value={fatigue}
          onChange={(event) => setFatigue(Number(event.target.value))}
        />

        <fieldset>
          <legend>Other symptoms (optional)</legend>
          {symptomOptions.map((symptom) => (
            <label className="choice-label" key={symptom}>
              <input
                type="checkbox"
                checked={symptoms.includes(symptom)}
                onChange={() => toggleItem(symptom, symptoms, setSymptoms)}
              />
              {symptom}
            </label>
          ))}
        </fieldset>

        <label htmlFor="study-impact">How much did symptoms affect your studies?</label>
        <select
          id="study-impact"
          value={studyImpact}
          onChange={(event) => setStudyImpact(event.target.value as SymptomEntry['studyImpact'])}
        >
          <option>None</option>
          <option>A little</option>
          <option>Moderate</option>
          <option>A lot</option>
        </select>

        <label htmlFor="symptom-notes">Personal notes (optional)</label>
        <textarea
          id="symptom-notes"
          rows={4}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Anything you would like to remember..."
        />

        <button className="primary-button" type="submit">
          Save symptom entry →
        </button>

        {message && <p role="status">{message}</p>}
      </form>

      <section className="symptom-history">
        <div className="symptom-history-heading">
          <div>
            <p className="eyebrow">YOUR RECORDS</p>
            <h2>Previous entries</h2>
          </div>
          <button className="secondary-button" type="button" onClick={loadEntries}>
            Refresh entries
          </button>
        </div>

        {entries.length === 0 ? (
          <p className="empty-message">
            No entries loaded yet. Your first entry can start whenever you are ready.
          </p>
        ) : (
          entries.map((entry) => (
            <article className="history-entry" key={entry.id}>
              <div>
                <strong>Pain: {entry.painLevel}/10</strong>
                <p>{new Date(entry.createdAt).toLocaleString()}</p>
                <p>Fatigue: {entry.fatigue}/10</p>
                <p>{entry.symptoms.join(', ') || 'No additional symptoms selected'}</p>
              </div>
              <button
                className="text-button"
                type="button"
                onClick={() => deleteEntry(entry.id)}
              >
                Delete
              </button>
            </article>
          ))
        )}
      </section>
    </section>
  )
}