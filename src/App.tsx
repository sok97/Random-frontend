

import { useEffect, useMemo, useReducer } from 'react'
import './App.css'
import FilterButtons from './components/FilterButtons'
import TodoForm from './components/TodoForm'
import TodoItem from './components/TodoItem'
import { loadTodos, saveTodos } from './lib/todosStorage'
import type { Todo, TodoFilter, TodoId } from './types/todo'

type State = {
  todos: Todo[]
  filter: TodoFilter
  editingId: TodoId | null
}

type Action =
  | { type: 'hydrate'; todos: Todo[] }
  | { type: 'add'; text: string }
  | { type: 'toggle'; id: TodoId }
  | { type: 'delete'; id: TodoId }
  | { type: 'setFilter'; filter: TodoFilter }
  | { type: 'clearCompleted' }
  | { type: 'startEdit'; id: TodoId }
  | { type: 'cancelEdit' }
  | { type: 'saveEdit'; id: TodoId; text: string }

function makeId() {
  return globalThis.crypto?.randomUUID?.() ?? `t_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

function normalizeText(text: string) {
  return text.trim().replace(/\s+/g, ' ')
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return { ...state, todos: action.todos }
    case 'add': {
      const text = normalizeText(action.text)
      if (!text) return state
      const now = Date.now()
      const todo: Todo = {
        id: makeId(),
        text,
        completed: false,
        createdAt: now,
        updatedAt: now,
      }
      return { ...state, todos: [todo, ...state.todos] }
    }
    case 'toggle': {
      const now = Date.now()
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.id ? { ...t, completed: !t.completed, updatedAt: now } : t,
        ),
      }
    }
    case 'delete':
      return {
        ...state,
        todos: state.todos.filter((t) => t.id !== action.id),
        editingId: state.editingId === action.id ? null : state.editingId,
      }
    case 'setFilter':
      return { ...state, filter: action.filter }
    case 'clearCompleted':
      return { ...state, todos: state.todos.filter((t) => !t.completed) }
    case 'startEdit':
      return { ...state, editingId: action.id }
    case 'cancelEdit':
      return { ...state, editingId: null }
    case 'saveEdit': {
      const text = normalizeText(action.text)
      if (!text) return state
      const now = Date.now()
      return {
        ...state,
        editingId: null,
        todos: state.todos.map((t) =>
          t.id === action.id ? { ...t, text, updatedAt: now } : t,
        ),
      }
    }
    default:
      return state
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, {
    todos: [],
    filter: 'all',
    editingId: null,
  })

  useEffect(() => {
    dispatch({ type: 'hydrate', todos: loadTodos() })
  }, [])

  useEffect(() => {
    saveTodos(state.todos)
  }, [state.todos])

  const visibleTodos = useMemo(() => {
    switch (state.filter) {
      case 'active':
        return state.todos.filter((t) => !t.completed)
      case 'completed':
        return state.todos.filter((t) => t.completed)
      default:
        return state.todos
    }
  }, [state.filter, state.todos])

  const activeCount = useMemo(
    () => state.todos.reduce((acc, t) => acc + (t.completed ? 0 : 1), 0),
    [state.todos],
  )
  const completedCount = state.todos.length - activeCount

  return (
    <div className="appShell">
      <header className="appHeader">
        <h1 className="appTitle">Todo</h1>
        <p className="appSubtitle">A small todo app with filters, editing, and local persistence.</p>
      </header>

      <main className="card">
        <TodoForm
          onAdd={(text) => dispatch({ type: 'add', text })}
          activeCount={activeCount}
          totalCount={state.todos.length}
        />

        <div className="toolbar">
          <FilterButtons
            value={state.filter}
            onChange={(filter) => dispatch({ type: 'setFilter', filter })}
          />

          <button
            className="btn btnGhost"
            type="button"
            onClick={() => dispatch({ type: 'clearCompleted' })}
            disabled={completedCount === 0}
          >
            Clear completed
          </button>
        </div>

        <section className="list" aria-label="Todo list">
          {visibleTodos.length === 0 ? (
            <p className="empty">
              {state.todos.length === 0
                ? 'No todos yet. Add one above.'
                : state.filter === 'completed'
                  ? 'No completed todos.'
                  : 'No active todos.'}
            </p>
          ) : (
            <ul className="items">
              {visibleTodos.map((todo) => (
                <li key={todo.id} className="row">
                  <TodoItem
                    todo={todo}
                    isEditing={state.editingId === todo.id}
                    onToggle={() => dispatch({ type: 'toggle', id: todo.id })}
                    onDelete={() => dispatch({ type: 'delete', id: todo.id })}
                    onStartEdit={() => dispatch({ type: 'startEdit', id: todo.id })}
                    onCancelEdit={() => dispatch({ type: 'cancelEdit' })}
                    onSaveEdit={(text) => dispatch({ type: 'saveEdit', id: todo.id, text })}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="appFooter" aria-label="Todo stats">
        <span>{activeCount} active</span>
        <span>•</span>
        <span>{completedCount} completed</span>
        <span>•</span>
        <span>{state.todos.length} total</span>
      </footer>
    </div>
  )
}

export default App
