import type { Todo } from '../types/todo'

const STORAGE_KEY = 'todos.v1'

function isTodo(value: unknown): value is Todo {
  if (!value || typeof value !== 'object') return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.id === 'string' &&
    typeof obj.text === 'string' &&
    typeof obj.completed === 'boolean' &&
    typeof obj.createdAt === 'number' &&
    typeof obj.updatedAt === 'number'
  )
}

export function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isTodo)
  } catch {
    return []
  }
}

export function saveTodos(todos: Todo[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch {
    // ignore (quota/private mode)
  }
}

