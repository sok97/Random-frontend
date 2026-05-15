export type TodoId = string

export type Todo = {
  id: TodoId
  text: string
  completed: boolean
  createdAt: number
  updatedAt: number
}

export type TodoFilter = 'all' | 'active' | 'completed'

