
import { useState } from 'react'

type Task = {
  id: number
  title: string
  due: string
  effort: 'Light' | 'Medium' | 'High'
  completed: boolean
}

const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Review lecture notes',
    due: 'Today',
    effort: 'Light',
    completed: false,
  },
  {
    id: 2,
    title: 'Work on assignment',
    due: 'Tomorrow',
    effort: 'High',
    completed: false,
  },
  {
    id: 3,
    title: 'Prepare questions for class',
    due: 'Tomorrow',
    effort: 'Medium',
    completed: true,
  },
]

export default function Planner() {
  const [energy, setEnergy] = useState(3)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [newTask, setNewTask] = useState('')
  const [newEffort, setNewEffort] =
    useState<'Light' | 'Medium' | 'High'>('Medium')
  const [message, setMessage] = useState('')

  const addTask = () => {
    if (!newTask.trim()) {
      setMessage('Please enter a task first.')
      return
    }

    setTasks((current) => [
      ...current,
      {
        id: Date.now(),
        title: newTask.trim(),
        due: 'Today',
        effort: newEffort,
        completed: false,
      },
    ])

    setNewTask('')
    setMessage('Your task has been added ♡')
  }

  const toggleTask = (id: number) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  const suggestedTasks = [...tasks]
    .filter((task) => !task.completed)
    .sort((a, b) => {
      const effortScore = (effort: Task['effort']) =>
        effort === 'Light' ? 1 : effort === 'Medium' ? 2 : 3

      if (energy <= 2) {
        return effortScore(a.effort) - effortScore(b.effort)
      }

      return a.due === 'Today' ? -1 : b.due === 'Today' ? 1 : 0
    })

  return (
    <main className="planner-page">
      <p className="eyebrow">YOUR DAY, YOUR PACE</p>
      <h1 className="insights-title">The Gentle Planner ♡</h1>
      <p className="insights-intro">
        Your wellbeing matters just as much as your to-do list.
        Make space for what you need today.
      </p>

      <section className="planner-energy">
        <h2>How is your energy today?</h2>
        <p>Choose what feels right. You can change this any time.</p>

        <div className="energy-options">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              aria-pressed={energy === level}
              className={energy === level ? 'energy-button selected' : 'energy-button'}
              onClick={() => setEnergy(level)}
            >
              {['Very low', 'Low', 'Okay', 'Good', 'High'][level - 1]}
            </button>
          ))}
        </div>

        <p className="planner-note">
          {energy <= 2
            ? 'A gentler pace may help today. Smaller tasks and breaks are options, not obligations.'
            : energy === 3
              ? 'Try a balanced plan with a little room to rest.'
              : 'You can take on more if you want to, while still making room for breaks.'}
        </p>
      </section>

      <section className="planner-panel">
        <h2>Add a task</h2>
        <form
          className="planner-add-form"
          onSubmit={(event) => {
            event.preventDefault()
            addTask()
          }}
        >
          <input
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
            placeholder="e.g. biology notes"
            aria-label="New task"
          />
          
<select
  value={newEffort}
  onChange={(event) =>
    setNewEffort(
      event.target.value as 'Light' | 'Medium' | 'High'
    )
  }
  aria-label="Task effort"
>
  <option value="Light">Low effort</option>
  <option value="Medium">Medium effort</option>
  <option value="High">High effort</option>
</select>
          <button className="insights-button" type="submit">
            Add task +
          </button>
        </form>
        {message && <p role="status">{message}</p>}
      </section>

      <section className="planner-panel">
        <h2>A manageable plan for today</h2>
        <p>
          Suggestions use your chosen energy level and task effort.
          You are always in control.
        </p>

        {suggestedTasks.length === 0 ? (
          <p>Nothing pending right now. Rest, celebrate, or add a task when you're ready ♡</p>
        ) : (
          <ul className="planner-task-list">
            {suggestedTasks.map((task) => (
              <li key={task.id}>
                <div>
                  <strong>{task.title}</strong>
                  <p>{task.due} · {task.effort} effort</p>
                </div>
                <button
                  className="planner-complete-button"
                  type="button"
                  onClick={() => toggleTask(task.id)}
                >
                  Mark done
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="planner-panel planner-rest">
        <h2>A little reminder ♡</h2>
        <p>
          You do not have to earn your rest. Adjust your plans to fit your
          day, and remember that changing a plan is not failing.
        </p>
      </section>
    </main>
  )
}