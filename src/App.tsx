import './index.css'

// ─── Types ───────────────────────────────────────────────────────────
type CellState = 'empty' | 'filled' | 'correct' | 'wrong' | 'active'

interface PuzzleCell {
  letter: string
  state: CellState
}

interface StatItem {
  value: string
  label: string
}

interface UnlockDay {
  label: string
  state: 'done' | 'today' | 'locked'
  display: string
}

// ─── Static data (replace with your real state/props) ────────────────
const STATS: StatItem[] = [
  { value: '35',   label: 'Day streak'     },
  { value: '128',  label: 'Puzzles solved' },
  { value: '94%',  label: 'Accuracy'       },
  { value: '2:14', label: 'Avg. time'      },
]

const PUZZLE_ROWS: PuzzleCell[][] = [
  [
    { letter: 'A', state: 'correct' },
    { letter: 'L', state: 'correct' },
    { letter: 'G', state: 'correct' },
    { letter: 'O', state: 'correct' },
    { letter: 'S', state: 'correct' },
  ],
  [
    { letter: 'T', state: 'filled' },
    { letter: 'R', state: 'filled' },
    { letter: 'E', state: 'filled' },
    { letter: 'E', state: 'filled' },
    { letter: '',  state: 'empty'  },
  ],
  [
    { letter: '', state: 'active' },
    { letter: '', state: 'empty'  },
    { letter: '', state: 'empty'  },
    { letter: '', state: 'empty'  },
    { letter: '', state: 'empty'  },
  ],
  [
    { letter: 'X', state: 'wrong' },
    { letter: 'Y', state: 'wrong' },
    { letter: '',  state: 'empty' },
    { letter: '',  state: 'empty' },
    { letter: '',  state: 'empty' },
  ],
  [
    { letter: '', state: 'empty' },
    { letter: '', state: 'empty' },
    { letter: '', state: 'empty' },
    { letter: '', state: 'empty' },
    { letter: '', state: 'empty' },
  ],
]

// 5 rows × 18 cols heatmap data: 0=empty, 1-4=intensity
const HEATMAP: number[][] = [
  [2,1,3,2,4,2,1,3,2,1,4,2,3,1,2,4,2,1],
  [1,3,4,1,2,3,4,2,1,3,2,4,1,3,2,1,4,2],
  [0,2,1,3,0,4,2,3,4,2,1,0,3,2,4,1,3,4],
  [3,4,2,0,3,1,3,1,2,4,3,2,4,1,3,2,4,4],
  [2,1,4,2,1,2,4,1,3,1,2,3,2,4,1,3,4,2],
]

const UNLOCK_DAYS: UnlockDay[] = [
  { label: 'Mon', state: 'done',   display: '✓' },
  { label: 'Tue', state: 'done',   display: '✓' },
  { label: 'Wed', state: 'done',   display: '✓' },
  { label: 'Thu', state: 'today',  display: '→' },
  { label: 'Fri', state: 'locked', display: '4' },
  { label: 'Sat', state: 'locked', display: '5' },
  { label: 'Sun', state: 'locked', display: '6' },
]

// ─── Sub-components ───────────────────────────────────────────────────

function Navbar() {
  return (
    <nav className="nav">
      <a className="nav-logo" href="/">
        <div className="logo-mark">PZ</div>
        <span className="logo-text">Puzzlebase</span>
      </a>
      <div className="nav-links">
        <button className="nav-link">How it works</button>
        <button className="nav-link">Leaderboard</button>
        <button className="nav-btn nav-btn-outline">Log in</button>
        <button className="nav-btn nav-btn-solid">Sign up</button>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-badge animate-fade-up">
        <div className="badge-dot" />
        Daily puzzle live
      </div>

      <h1 className="hero-title animate-fade-up delay-1">
        Train your mind,<br />
        <em>one puzzle</em> a day
      </h1>

      <p className="hero-sub animate-fade-up delay-2">
        A daily puzzle system with real-time validation, streak tracking,
        and an activity heatmap to keep you consistent.
      </p>

      <div className="hero-cta animate-fade-up delay-3">
        <button className="btn btn-primary">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L13 7L7 13M1 7H13" stroke="white" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Start today's puzzle
        </button>
        <button className="btn btn-ghost">View streak →</button>
      </div>
    </section>
  )
}

function StatsBar() {
  return (
    <div className="stats-bar animate-fade-up delay-4">
      {STATS.map((s, i) => (
        <>
          <div key={s.label} className="stat-item">
            <span className="stat-num">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
          {i < STATS.length - 1 && <div className="stat-divider" />}
        </>
      ))}
    </div>
  )
}

function PuzzleCard() {
  return (
    <div className="card animate-fade-up delay-2">
      <div className="card-accent" />
      <span className="card-label">Today's puzzle</span>

      <div className="puzzle-grid">
        {PUZZLE_ROWS.map((row, ri) =>
          row.map((cell, ci) => (
            <div
              key={`${ri}-${ci}`}
              className={`puzzle-cell state-${cell.state}`}
            >
              {cell.letter}
            </div>
          ))
        )}
      </div>

      <div className="keyboard-hint">
        <span className="key">A – Z</span>
        <span className="key">⌫</span>
        <span className="key">↵ Enter</span>
      </div>
    </div>
  )
}

function HeatmapCard() {
  const heatClass = (v: number) => {
    if (v === 0) return 'hm-cell'
    return `hm-cell hm-l${v}`
  }

  return (
    <div className="card animate-fade-up delay-3">
      <div className="card-accent" />
      <span className="card-label">Activity heatmap</span>

      <div className="heatmap-grid">
        {HEATMAP.flat().map((v, i) => (
          <div key={i} className={heatClass(v)} />
        ))}
      </div>

      <div className="streak-display">
        <span className="streak-num">35</span>
        <span className="streak-text">day streak<br />keep it going</span>
      </div>
    </div>
  )
}

function UnlockCard() {
  return (
    <div className="card col-span-2 animate-fade-up delay-4">
      <div className="card-accent" />
      <span className="card-label">Content unlock — this week</span>

      <div className="unlock-timeline">
        {UNLOCK_DAYS.map((day, i) => (
          <>
            <div key={day.label} className="unlock-day">
              <div className={`unlock-circle ${day.state}`}>
                {day.display}
              </div>
              <span className="day-label">{day.label}</span>
            </div>
            {i < UNLOCK_DAYS.length - 1 && (
              <div
                key={`conn-${i}`}
                className={`unlock-connector ${day.state === 'done' ? 'done' : ''}`}
              />
            )}
          </>
        ))}
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      {/* Background effects */}
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-radial" aria-hidden="true" />

      <div className="page-wrapper">
        <Navbar />
        <Hero />
        <StatsBar />

        <div className="main-grid">
          <PuzzleCard />
          <HeatmapCard />
          <UnlockCard />
        </div>
      </div>
    </>
  )
}