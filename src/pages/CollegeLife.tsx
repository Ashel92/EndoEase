import { useEffect, useState, type FormEvent } from 'react'

type Task = {
  id: number
  title: string
  due: string
  done: boolean
}

type Essential = {
  id: number
  label: string
  checked: boolean
}

type SubjectAttendance = {
  id: number
  subject: string
  attended: number
  total: number
  required: number
}

const defaultEssentials: Essential[] = [
  { id: 1, label: 'Water bottle', checked: false },
  { id: 2, label: 'Pain relief essentials', checked: false },
  { id: 3, label: 'Snacks', checked: false },
  { id: 4, label: 'Notebook and stationery', checked: false },
  { id: 5, label: 'Phone and charger', checked: false },
  { id: 6, label: 'Period products, if needed', checked: false },
]

const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Review lecture notes',
    due: '',
    done: false,
  },
  {
    id: 2,
    title: 'Work on assignment',
    due: '',
    done: false,
  },
]

function readStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key)
    return saved ? (JSON.parse(saved) as T) : fallback
  } catch {
    return fallback
  }
}

function CollegeLife() {
  const [tasks, setTasks] = useState<Task[]>(() =>
    readStorage('endoease-college-tasks', initialTasks),
  )

  const [essentials, setEssentials] = useState<Essential[]>(() =>
    readStorage('endoease-college-essentials', defaultEssentials),
  )

  const [newEssential, setNewEssential] = useState('')

  const [subjects, setSubjects] = useState<SubjectAttendance[]>(() =>
    readStorage('endoease-subject-attendance', []),
  )

  const [newSubject, setNewSubject] = useState('')
  const [newTask, setNewTask] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    localStorage.setItem('endoease-college-tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem(
      'endoease-college-essentials',
      JSON.stringify(essentials),
    )
  }, [essentials])

  useEffect(() => {
    localStorage.setItem(
      'endoease-subject-attendance',
      JSON.stringify(subjects),
    )
  }, [subjects])

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const title = newTask.trim()
    if (!title) return

    const task: Task = {
      id: Date.now(),
      title,
      due: dueDate,
      done: false,
    }

    setTasks((current) => [...current, task])
    setNewTask('')
    setDueDate('')
    setShowForm(false)
  }

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    )
  }

  function deleteTask(id: number) {
    setTasks((current) => current.filter((task) => task.id !== id))
  }

  function addEssential(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const label = newEssential.trim()
    if (!label) return

    setEssentials((current) => [
      ...current,
      { id: Date.now(), label, checked: false },
    ])

    setNewEssential('')
  }

  function deleteEssential(id: number) {
    setEssentials((current) =>
      current.filter((item) => item.id !== id),
    )
  }

  function toggleEssential(id: number) {
    setEssentials((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, checked: !item.checked }
          : item,
      ),
    )
  }

  function addSubject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const subjectName = newSubject.trim()
    if (!subjectName) return

    const subject: SubjectAttendance = {
      id: Date.now(),
      subject: subjectName,
      attended: 0,
      total: 0,
      required: 75,
    }

    setSubjects((current) => [...current, subject])
    setNewSubject('')
  }

  function updateSubject(
    id: number,
    field: 'attended' | 'total' | 'required',
    value: number,
  ) {
    setSubjects((current) =>
      current.map((subject) => {
        if (subject.id !== id) return subject

        const updated = { ...subject, [field]: value }

        if (field === 'total') {
          updated.attended = Math.min(updated.attended, value)
        }

        if (field === 'attended') {
          updated.total = Math.max(updated.total, value)
        }

        return updated
      }),
    )
  }

  function deleteSubject(id: number) {
    setSubjects((current) =>
      current.filter((subject) => subject.id !== id),
    )
  }

  const completedTasks = tasks.filter((task) => task.done).length

  const checkedEssentials = essentials.filter(
    (item) => item.checked,
  ).length

  const totalAttended = subjects.reduce(
    (sum, subject) => sum + subject.attended,
    0,
  )

  const totalHeld = subjects.reduce(
    (sum, subject) => sum + subject.total,
    0,
  )

  const overallAttendance =
    totalHeld > 0
      ? Math.round((totalAttended / totalHeld) * 100)
      : 0

  const formattedDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <main className="college-page">
      <header className="college-header">
        <div>
          <p className="college-eyebrow">
            YOUR CAMPUS COMPANION 🌸
          </p>

          <h1>College Life</h1>

          <p className="college-subtitle">
            Your education matters, and so does your well-being.
            Let’s make campus life a little gentler.
          </p>
        </div>

        <div className="college-date-card">
          <span className="college-date-icon">🌷</span>
          <span>{formattedDate}</span>
        </div>
      </header>

      <section className="college-welcome">
        <div className="college-welcome-text">
          <span className="college-welcome-label">
            A LITTLE REMINDER
          </span>

          <h2>You don’t have to do everything today.</h2>

          <p>
            Some days will be productive. Some days will be about
            getting through. Both are valid. Choose what feels
            manageable for you today.
          </p>
        </div>

        <div
          className="college-welcome-illustration"
          aria-hidden="true"
        >
          🌼
        </div>
      </section>

      <section className="college-stats" aria-label="Your progress">
        <article className="college-stat-card">
          <div className="college-stat-icon stat-pink">📝</div>

          <div>
            <p className="college-stat-label">Tasks completed</p>

            <p className="college-stat-number">
              {completedTasks}
              <span> / {tasks.length}</span>
            </p>
          </div>
        </article>

        <article className="college-stat-card">
          <div className="college-stat-icon stat-purple">🎒</div>

          <div>
            <p className="college-stat-label">Bag essentials</p>

            <p className="college-stat-number">
              {checkedEssentials}
              <span> / {essentials.length}</span>
            </p>
          </div>
        </article>

        <article className="college-stat-card">
          <div className="college-stat-icon stat-green">📚</div>

          <div>
            <p className="college-stat-label">Overall attendance</p>

            <p className="college-stat-number">
              {overallAttendance}
              <span>%</span>
            </p>
          </div>
        </article>
      </section>

      <div className="college-main-grid">
        {/* STUDY TASKS */}

        <section className="college-card college-tasks-card">
          <div className="college-section-header">
            <div>
              <span className="college-section-kicker">
                STAY ORGANIZED
              </span>

              <h2>My study tasks</h2>

              <p className="college-section-description">
                One step at a time. You’ve got this.
              </p>
            </div>

            <button
              type="button"
              className="college-primary-button"
              onClick={() => setShowForm((current) => !current)}
            >
              {showForm ? 'Cancel' : '+ Add task'}
            </button>
          </div>

          {showForm && (
            <form className="college-task-form" onSubmit={addTask}>
              <label htmlFor="college-task-title">
                Task name
              </label>

              <input
                id="college-task-title"
                type="text"
                placeholder="e.g. Finish biology assignment"
                value={newTask}
                onChange={(event) => setNewTask(event.target.value)}
                maxLength={120}
                required
              />

              <label htmlFor="college-task-date">
                Due date <span>(optional)</span>
              </label>

              <input
                id="college-task-date"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />

              <button
                type="submit"
                className="college-primary-button"
              >
                Save task
              </button>
            </form>
          )}

          <div className="college-task-progress">
            <div className="college-progress-heading">
              <span>Today's progress</span>

              <span>
                {tasks.length > 0
                  ? Math.round(
                      (completedTasks / tasks.length) * 100,
                    )
                  : 0}
                %
              </span>
            </div>

            <div
              className="college-progress-track"
              role="progressbar"
              aria-label="Study tasks completed"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={
                tasks.length > 0
                  ? Math.round(
                      (completedTasks / tasks.length) * 100,
                    )
                  : 0
              }
            >
              <div
                className="college-progress-fill"
                style={{
                  width: `${
                    tasks.length > 0
                      ? (completedTasks / tasks.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="college-empty-state">
              <span>🌸</span>
              <h3>A fresh start!</h3>

              <p>
                You have no tasks yet. Add one small goal to get
                started.
              </p>
            </div>
          ) : (
            <div className="college-task-list">
              {tasks.map((task) => (
                <article
                  className={`college-task-item ${
                    task.done ? 'task-completed' : ''
                  }`}
                  key={task.id}
                >
                  <button
                    type="button"
                    className={`college-task-checkbox ${
                      task.done ? 'checked' : ''
                    }`}
                    onClick={() => toggleTask(task.id)}
                    aria-label={
                      task.done
                        ? `Mark ${task.title} as incomplete`
                        : `Mark ${task.title} as complete`
                    }
                  >
                    {task.done ? '✓' : ''}
                  </button>

                  <div className="college-task-content">
                    <p className="college-task-title">
                      {task.title}
                    </p>

                    {task.due && (
                      <p className="college-task-due">
                        📅 Due{' '}
                        {new Date(
                          `${task.due}T00:00:00`,
                        ).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    )}

                    {task.done && (
                      <span className="college-completed-label">
                        Completed ✓
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="college-delete-button"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Delete ${task.title}`}
                    title="Delete task"
                  >
                    ×
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* CAMPUS ESSENTIALS */}

        <section className="college-card college-essentials-card">
          <div className="college-section-header">
            <div>
              <span className="college-section-kicker">
                BE PREPARED
              </span>

              <h2>Campus essentials</h2>

              <p className="college-section-description">
                Your little checklist before heading out.
              </p>
            </div>

            <span className="college-heading-emoji">🎒</span>
          </div>

          <div className="college-essentials-progress">
            <span>
              {checkedEssentials} of {essentials.length} packed
            </span>

            <span>
              {essentials.length > 0
                ? Math.round(
                    (checkedEssentials / essentials.length) * 100,
                  )
                : 0}
              %
            </span>
          </div>

          <div
            className="college-progress-track"
            role="progressbar"
            aria-label="Campus essentials packed"
            aria-valuenow={checkedEssentials}
            aria-valuemin={0}
            aria-valuemax={essentials.length}
          >
            <div
              className="college-progress-fill"
              style={{
                width: `${
                  essentials.length > 0
                    ? (checkedEssentials / essentials.length) * 100
                    : 0
                }%`,
              }}
            />
          </div>

          <form
            className="college-add-essential"
            onSubmit={addEssential}
          >
            <input
              type="text"
              value={newEssential}
              onChange={(event) =>
                setNewEssential(event.target.value)
              }
              placeholder="Add your own essential..."
              aria-label="New campus essential"
              maxLength={100}
              required
            />

            <button type="submit">+ Add item</button>
          </form>

          <ul className="college-essentials-list">
            {essentials.map((item) => (
              <li
                key={item.id}
                className={`college-essential-item ${
                  item.checked ? 'is-checked' : ''
                }`}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleEssential(item.id)}
                  />

                  <span>{item.label}</span>
                </label>

                <button
                  type="button"
                  className="college-delete-essential"
                  onClick={() => deleteEssential(item.id)}
                  aria-label={`Delete ${item.label}`}
                  title="Remove item"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>

          {essentials.length === 0 && (
            <p className="college-empty-essentials">
              Your list is empty. Add something you need for
              campus! 💗
            </p>
          )}
        </section>

        {/* SUBJECT ATTENDANCE CALCULATOR */}

        <section className="college-card college-attendance-card">
          <div className="college-section-header">
            <div>
              <span className="college-section-kicker">
                KNOW YOUR NUMBERS
              </span>

              <h2>Subject attendance calculator</h2>

              <p className="college-section-description">
                Check your attendance and find out how many more
                classes you need to attend.
              </p>
            </div>

            <span className="college-heading-emoji">📚</span>
          </div>

          <form
            className="college-add-essential"
            onSubmit={addSubject}
          >
            <input
              type="text"
              value={newSubject}
              onChange={(event) =>
                setNewSubject(event.target.value)
              }
              placeholder="Enter subject name..."
              aria-label="Subject name"
              maxLength={100}
              required
            />

            <button type="submit">+ Add subject</button>
          </form>

          {subjects.length === 0 ? (
            <div className="college-empty-state">
              <span>📖</span>

              <h3>Start with your first subject</h3>

              <p>
                Add a subject above to calculate your attendance
                and plan your upcoming classes.
              </p>
            </div>
          ) : (
            <div className="college-subject-list">
              {subjects.map((subject) => {
                const percentage =
                  subject.total > 0
                    ? (subject.attended / subject.total) * 100
                    : 0

                const classesNeeded =
                  subject.total === 0 ||
                  percentage >= subject.required
                    ? 0
                    : subject.required === 100
                      ? null
                      : Math.ceil(
                          (
                            subject.required * subject.total -
                            100 * subject.attended
                          ) /
                            (100 - subject.required),
                        )

                const projectedPercentage =
                  classesNeeded !== null &&
                  classesNeeded > 0 &&
                  subject.total > 0
                    ? ((subject.attended + classesNeeded) /
                        (subject.total + classesNeeded)) *
                      100
                    : percentage

                return (
                  <article
                    className="college-task-item college-subject-item"
                    key={subject.id}
                  >
                    <div className="college-subject-heading">
                      <h3>{subject.subject}</h3>

                      <button
                        type="button"
                        className="college-delete-button"
                        onClick={() => deleteSubject(subject.id)}
                        aria-label={`Delete ${subject.subject}`}
                        title="Delete subject"
                      >
                        ×
                      </button>
                    </div>

                    <div className="college-subject-inputs">
                      <label>
                        Classes attended

                        <input
                          type="number"
                          min={0}
                          max={subject.total}
                          value={subject.attended}
                          onChange={(event) =>
                            updateSubject(
                              subject.id,
                              'attended',
                              Math.max(
                                0,
                                Math.floor(
                                  Number(event.target.value) || 0,
                                ),
                              ),
                            )
                          }
                        />
                      </label>

                      <label>
                        Total classes held

                        <input
                          type="number"
                          min={0}
                          value={subject.total}
                          onChange={(event) =>
                            updateSubject(
                              subject.id,
                              'total',
                              Math.max(
                                0,
                                Math.floor(
                                  Number(event.target.value) || 0,
                                ),
                              ),
                            )
                          }
                        />
                      </label>

                      <label>
                        Required attendance (%)

                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={subject.required}
                          onChange={(event) =>
                            updateSubject(
                              subject.id,
                              'required',
                              Math.min(
                                100,
                                Math.max(
                                  1,
                                  Number(event.target.value) || 1,
                                ),
                              ),
                            )
                          }
                        />
                      </label>
                    </div>

                    <div className="college-subject-result">
                      <p>
                        <span>Current attendance</span>

                        <strong>
                          {subject.total > 0
                            ? `${percentage.toFixed(1)}%`
                            : 'Not calculated'}
                        </strong>
                      </p>

                      <div
                        className="college-progress-track"
                        role="progressbar"
                        aria-label={`${subject.subject} attendance`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.min(100, percentage)}
                      >
                        <div
                          className="college-progress-fill"
                          style={{
                            width: `${Math.min(100, percentage)}%`,
                          }}
                        />
                      </div>

                      {subject.total > 0 &&
                        percentage >= subject.required && (
                          <p className="college-subject-success">
                            ✓ You have reached your required
                            attendance!
                          </p>
                        )}

                      {subject.total > 0 &&
                        percentage < subject.required && (
                          <p className="college-subject-warning">
                            {classesNeeded === null
                              ? 'You must attend every future class to reach 100% attendance.'
                              : `Attend the next ${classesNeeded} ${
                                  classesNeeded === 1 ? 'class' : 'classes'
                                } without missing any to reach ${subject.required}%.`}
                          </p>
                        )}

                      {classesNeeded !== null &&
                        classesNeeded > 0 &&
                        subject.total > 0 && (
                          <p>
                            <span>Projected attendance</span>

                            <strong>
                              {projectedPercentage.toFixed(1)}%
                            </strong>
                          </p>
                        )}

                      {subject.total === 0 && (
                        <p className="college-subject-note">
                          Enter your classes attended and total
                          classes held to calculate your attendance.
                        </p>
                      )}

                      {subject.total > 0 &&
                        subject.attended === subject.total &&
                        percentage >= subject.required && (
                          <p className="college-subject-note">
                            You have attended every class held so far.
                          </p>
                        )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          <p className="college-attendance-note">
            The calculation assumes you attend every upcoming
            class without missing any. Your college may have
            additional attendance rules, so check the official
            requirements for each subject.
          </p>
        </section>
      </div>

      <footer className="college-footer">
        <span>🌸</span>

        <p>
          You are a student, but you are also a person who deserves
          care, comfort, and rest.
        </p>

        <span>🌸</span>
      </footer>
    </main>
  )
}

export default CollegeLife