
export type PlannerTask = {
  id: number
  title: string
  due: string
  effort: 'Light' | 'Medium' | 'High'
  completed: boolean
}

const STORAGE_KEY = 'endoease-planner-tasks'

const demoTasks: PlannerTask[] = [
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

export const plannerService = {
  async getTasks(): Promise<PlannerTask[]> {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved !== null) {
      return JSON.parse(saved) as PlannerTask[]
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoTasks))
    return demoTasks
  },

  async saveTasks(tasks: PlannerTask[]): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  },
}