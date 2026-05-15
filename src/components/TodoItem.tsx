import { useEffect, useId, useRef, useState } from 'react'
import type { Todo } from '../types/todo'

type Props = {
  todo: Todo
  isEditing: boolean
  onToggle: () => void
  onDelete: () => void
  onStartEdit: () => void
  onCancelEdit: () => void
  onSaveEdit: (text: string) => void
}

const TodoItem = ({
  todo,
  isEditing,
  onToggle,
  onDelete,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
}: Props) => {
  const checkboxId = useId()
  const [draft, setDraft] = useState(todo.text)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!isEditing) return
    queueMicrotask(() => inputRef.current?.focus())
  }, [isEditing, todo.text])

  function save() {
    const trimmed = draft.trim()
    if (!trimmed) return
    onSaveEdit(trimmed)
  }

  return (
    <div className="item">
      <div className="itemMain">
        <input
          id={checkboxId}
          className="checkbox"
          type="checkbox"
          checked={todo.completed}
          onChange={onToggle}
          aria-label={todo.completed ? 'Mark as active' : 'Mark as completed'}
        />

        {isEditing ? (
          <input
            ref={inputRef}
            className="input inputSm"
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save()
              if (e.key === 'Escape') onCancelEdit()
            }}
            aria-label="Edit todo"
          />
        ) : (
          <label htmlFor={checkboxId} className={todo.completed ? 'text done' : 'text'}>
            {todo.text}
          </label>
        )}
      </div>

      <div className="itemActions">
        {isEditing ? (
          <>
            <button className="btn btnPrimary" type="button" onClick={save}>
              Save
            </button>
            <button className="btn btnGhost" type="button" onClick={onCancelEdit}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btnGhost"
              type="button"
              onClick={() => {
                setDraft(todo.text)
                onStartEdit()
              }}
            >
              Edit
            </button>
            <button className="btn btnDanger" type="button" onClick={onDelete}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default TodoItem
