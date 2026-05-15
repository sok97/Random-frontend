import type { TodoFilter } from '../types/todo'

type Props = {
  value: TodoFilter
  onChange: (filter: TodoFilter) => void
}

const FilterButtons = ({ value, onChange }: Props) => {
  return (
    <div className="filters" role="radiogroup" aria-label="Filter todos">
      <button
        className={value === 'all' ? 'btn btnPrimary' : 'btn btnGhost'}
        type="button"
        onClick={() => onChange('all')}
        aria-pressed={value === 'all'}
      >
        All
      </button>
      <button
        className={value === 'active' ? 'btn btnPrimary' : 'btn btnGhost'}
        type="button"
        onClick={() => onChange('active')}
        aria-pressed={value === 'active'}
      >
        Active
      </button>
      <button
        className={value === 'completed' ? 'btn btnPrimary' : 'btn btnGhost'}
        type="button"
        onClick={() => onChange('completed')}
        aria-pressed={value === 'completed'}
      >
        Completed
      </button>
    </div>
  )
}

export default FilterButtons
