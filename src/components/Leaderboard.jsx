import React, { useEffect, useState } from 'react'

const LB_KEY = 'mathx_leaderboard'

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2,'0')
  const s = Math.floor(sec % 60).toString().padStart(2,'0')
  return `${m}:${s}`
}

export default function Leaderboard() {
  const [scores, setScores] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LB_KEY)
      const arr = raw ? JSON.parse(raw) : []
      setScores(arr.slice(0,20))
    } catch (err) {
      setScores([])
    }
  }, [])

  if (!scores.length) return <div className="p-4 bg-zinc-900 rounded">No scores yet — play a session to appear here.</div>

  return (
    <div className="p-4 bg-zinc-900 rounded text-sm">
      <div className="flex justify-between font-semibold mb-3">
        <div>Rank</div>
        <div>Name</div>
        <div>Accuracy</div>
        <div>Time</div>
        <div>Best Streak</div>
      </div>
      <div className="space-y-2">
        {scores.map((s, i) => (
          <div key={s.date} className="flex justify-between items-center opacity-90">
            <div className="w-12">#{i+1}</div>
            <div className="flex-1">{s.name}</div>
            <div className="w-24">{s.accuracy}%</div>
            <div className="w-20">{formatTime(s.time)}</div>
            <div className="w-20">{s.bestStreak}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
