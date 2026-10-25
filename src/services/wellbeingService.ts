
export type WellbeingCheckin = {
  id: string
  createdAt: string
  painLevel: number
  energyLevel: 'Low' | 'Okay' | 'Good'
  mood: 'Low' | 'Okay' | 'Good'
}

export type SymptomEntry = {
  id: string
  createdAt: string
  painLevel: number
  painLocation: string[]
  painType: string
  fatigue: number
  symptoms: string[]
  studyImpact: 'None' | 'A little' | 'Moderate' | 'A lot'
  notes: string
}

const CHECKINS_KEY = 'endoease-demo-checkins'
const SYMPTOMS_KEY = 'endoease-demo-symptoms'

function readRecords<T>(key: string): T[] {
  try {
    const stored = localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T[]) : []
  } catch (error) {
    console.error('Could not read demo records:', error)
    throw new Error('Could not read saved records from browser storage.')
  }
}

function writeRecords<T>(key: string, records: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(records))
  } catch (error) {
    console.error('Could not write demo records:', error)
    throw new Error('Could not write records to browser storage.')
  }
}

export const wellbeingService = {
  async getCheckins(): Promise<WellbeingCheckin[]> {
    return readRecords<WellbeingCheckin>(CHECKINS_KEY)
  },

  async saveCheckin(
    checkin: Omit<WellbeingCheckin, 'id' | 'createdAt'>
  ): Promise<WellbeingCheckin> {
    const records = readRecords<WellbeingCheckin>(CHECKINS_KEY)

    const record: WellbeingCheckin = {
      ...checkin,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }

    writeRecords(CHECKINS_KEY, [...records, record])
    return record
  },

  async deleteCheckin(id: string): Promise<void> {
    const records = readRecords<WellbeingCheckin>(CHECKINS_KEY)
    writeRecords(
      CHECKINS_KEY,
      records.filter((item) => item.id !== id)
    )
  },

  async getSymptoms(): Promise<SymptomEntry[]> {
    return readRecords<SymptomEntry>(SYMPTOMS_KEY)
  },

  async saveSymptom(
    entry: Omit<SymptomEntry, 'id' | 'createdAt'>
  ): Promise<SymptomEntry> {
    const records = readRecords<SymptomEntry>(SYMPTOMS_KEY)

    const record: SymptomEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }

    writeRecords(SYMPTOMS_KEY, [...records, record])
    return record
  },

  async deleteSymptom(id: string): Promise<void> {
    const records = readRecords<SymptomEntry>(SYMPTOMS_KEY)

    writeRecords(
      SYMPTOMS_KEY,
      records.filter((item) => item.id !== id)
    )
  },
}