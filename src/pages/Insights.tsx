
import { useEffect, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  wellbeingService,
  type SymptomEntry,
} from '../services/wellbeingService'

export default function Insights() {
  const [entries, setEntries] = useState<SymptomEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [days, setDays] = useState('all')

  useEffect(() => {
    wellbeingService
      .getSymptoms()
      .then(setEntries)
      .catch(() => setError('Could not load your symptom entries. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <main className="insights-page">Loading your insights…</main>

  if (error) {
    return <main className="insights-page"><p role="alert">{error}</p></main>
  }

  const cutoff = new Date()
  if (days !== 'all') cutoff.setDate(cutoff.getDate() - Number(days))

  const filteredEntries = entries.filter(
    (entry) => days === 'all' || new Date(entry.createdAt) >= cutoff
  )

  const average = (values: number[]) =>
    values.length
      ? values.reduce((sum, value) => sum + value, 0) / values.length
      : null

  const averagePain = average(filteredEntries.map((e) => e.painLevel))
  const averageFatigue = average(filteredEntries.map((e) => e.fatigue))

  const symptomCounts = filteredEntries
    .flatMap((entry) => entry.symptoms)
    .reduce<Record<string, number>>((counts, symptom) => {
      counts[symptom] = (counts[symptom] ?? 0) + 1
      return counts
    }, {})

  const commonSymptoms = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const chartData = [...filteredEntries]
    .sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    .map((entry) => ({
      date: new Date(entry.createdAt).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
      }),
      pain: entry.painLevel,
    }))

  const impactCounts = filteredEntries.reduce<Record<string, number>>(
    (counts, entry) => {
      counts[entry.studyImpact] = (counts[entry.studyImpact] ?? 0) + 1
      return counts
    },
    {}
  )

  const appointmentSummary = [
    `Symptom journal entries: ${filteredEntries.length}`,
    `Average recorded pain: ${averagePain === null ? 'No data' : `${averagePain.toFixed(1)}/10`}`,
    `Average recorded fatigue: ${averageFatigue === null ? 'No data' : `${averageFatigue.toFixed(1)}/10`}`,
    `Frequently recorded symptoms: ${commonSymptoms.length ? commonSymptoms.map(([name, count]) => `${name} (${count})`).join(', ') : 'None recorded'}`,
    `Impact on studying: ${Object.entries(impactCounts).map(([name, count]) => `${name}: ${count}`).join(', ') || 'No data'}`,
  ].join('\n')

  return (
    <main className="insights-page">
      <p className="eyebrow">YOUR PERSONAL WELLBEING</p>
      <h1 className="insights-title">My insights ♡</h1>
      <p className="insights-intro">
        A gentle look at the patterns in your own symptom journal.
        These summaries describe your entries; they do not predict medical conditions.
      </p>

      <label className="insights-filter">
        View period{' '}
        <select value={days} onChange={(event) => setDays(event.target.value)}>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="all">All entries</option>
        </select>
      </label>

      <section className="insights-stats">
        <article className="insight-card">
          <span>Average pain</span>
          <strong>{averagePain === null ? '—' : averagePain.toFixed(1)}<small>/10</small></strong>
          <p>Based on {filteredEntries.length} entries</p>
        </article>

        <article className="insight-card">
          <span>Average fatigue</span>
          <strong>{averageFatigue === null ? '—' : averageFatigue.toFixed(1)}<small>/10</small></strong>
          <p>Based on recorded fatigue</p>
        </article>

        <article className="insight-card">
          <span>Journal entries</span>
          <strong>{filteredEntries.length}</strong>
          <p>In this period</p>
        </article>
      </section>

      <section className="insights-panel">
        <h2>Pain over time</h2>
        <p>Your recorded pain intensity, from 0 to 10.</p>
        {chartData.length === 0 ? (
          <p>No entries for this period yet. Your chart will appear when you log symptoms.</p>
        ) : (
          <div className="insights-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E2DF" />
                <XAxis dataKey="date" tick={{ fill: '#806F77', fontSize: 12 }} />
                <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="pain"
                  name="Pain intensity"
                  stroke="#BD8196"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="insights-panel">
        <h2>Frequently recorded symptoms</h2>
        {commonSymptoms.length === 0 ? (
          <p>No additional symptoms recorded in this period.</p>
        ) : (
          <ul className="symptom-frequency">
            {commonSymptoms.map(([symptom, count]) => (
              <li key={symptom}>
                <span>{symptom}</span>
                <strong>{count} {count === 1 ? 'entry' : 'entries'}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="insights-panel">
        <h2>Impact on studying</h2>
        {Object.keys(impactCounts).length === 0 ? (
          <p>No study-impact information recorded in this period.</p>
        ) : (
          <ul className="symptom-frequency">
            {Object.entries(impactCounts).map(([impact, count]) => (
              <li key={impact}>
                <span>{impact}</span>
                <strong>{count} {count === 1 ? 'entry' : 'entries'}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="insights-panel appointment-panel">
        <h2>Appointment summary ♡</h2>
        <p>
          Create a summary of your recorded entries to review or discuss
          with your healthcare professional.
        </p>
        <textarea
          className="appointment-summary"
          readOnly
          value={appointmentSummary}
          aria-label="Summary of recorded symptoms"
        />
        <button
          type="button"
          className="insights-button"
          onClick={() => {
            const blob = new Blob([appointmentSummary], { type: 'text/plain' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'endoease-appointment-summary.txt'
            link.click()
            URL.revokeObjectURL(url)
          }}
        >
          Download appointment summary
        </button>
      </section>

      <p className="insights-disclaimer">
        These summaries reflect what you recorded. They are not a diagnosis
        or a prediction. Share only what you feel comfortable sharing.
      </p>
    </main>
  )
}