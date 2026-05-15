import { useId, useState } from 'react'

type Props = {
  onAdd: (text: string) => void
  activeCount: number
  totalCount: number
}

const TodoForm = ({ onAdd, activeCount, totalCount }: Props) => {
  const inputId = useId()
  const [text, setText] = useState('')

  function submit() {
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setText('')
  }

  return (
    <div className="form">
      <label className="srOnly" htmlFor={inputId}>
        Add a todo
      </label>
      <input
        id={inputId}
        className="input"
        type="text"
        value={text}
        placeholder="Add a todo…"
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit()
        }}
      />
      <button className="btn btnPrimary" type="button" onClick={submit}>
        Add
      </button>

      <div className="meta" aria-label="Todo counts">
        <span>{activeCount} left</span>
        <span>•</span>
        <span>{totalCount} total</span>
      </div>
    </div>
  )
}

export default TodoForm
