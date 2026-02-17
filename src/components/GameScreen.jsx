import React, { useState, useEffect, useRef } from 'react'
import Leaderboard from './Leaderboard'

const TOTAL_QUESTIONS = 20

function generateQuestion() {
  const ops = ['+','-','x']
  const op = ops[Math.floor(Math.random() * ops.length)]
  const a = Math.floor(Math.random() * 90) + 10
  const b = Math.floor(Math.random() * 90) + 1
  let answer = 0
  if (op === '+') answer = a + b
  if (op === '-') answer = a - b
  if (op === 'x') answer = a * b
  return { a, b, op, answer }
}

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2,'0')
  const s = Math.floor(sec % 60).toString().padStart(2,'0')
  return `${m}:${s}`
}

const LB_KEY = 'mathx_leaderboard'

const GameScreen = ({ onEnd = () => {} }) => {
  const [index, setIndex] = useState(1)
  const [question, setQuestion] = useState(() => generateQuestion())
  const [value, setValue] = useState('')
  const [feedback, setFeedback] = useState(null) // null | 'correct' | 'wrong'
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(true)
  const [showSave, setShowSave] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  const inputRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [question])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  function nextQuestion() {
    if (index >= TOTAL_QUESTIONS) {
      // end session: show save modal
      setRunning(false)
      setShowSave(true)
      return
    }
    setIndex(i => i + 1)
    setQuestion(generateQuestion())
    setValue('')
    setFeedback(null)
  }

  function handleSubmit(e) {
    e?.preventDefault()
    const num = Number(value)
    if (!Number.isFinite(num)) return

    setAttempts(a => a + 1)

    if (num === question.answer) {
      setFeedback('correct')
      setCorrectCount(c => c + 1)
      setStreak(s => {
        const ns = s + 1
        if (ns > bestStreak) setBestStreak(ns)
        return ns
      })
      setTimeout(nextQuestion, 700)
    } else {
      setFeedback('wrong')
      setStreak(0)
      setTimeout(nextQuestion, 1400)
    }
  }

  function saveResultAndExit() {
    const accuracy = attempts === 0 ? 0 : Math.round((correctCount / attempts) * 100)
    const record = {
      name: playerName?.trim() || 'Anonymous',
      time: elapsed,
      accuracy,
      correct: correctCount,
      attempts,
      bestStreak,
      date: Date.now(),
    }
    try {
      const raw = localStorage.getItem(LB_KEY)
      const arr = raw ? JSON.parse(raw) : []
      arr.push(record)
      // sort by accuracy desc, time asc
      arr.sort((a,b) => b.accuracy - a.accuracy || a.time - b.time)
      localStorage.setItem(LB_KEY, JSON.stringify(arr.slice(0,50)))
    } catch (err) {
      console.warn('Leaderboard save failed', err)
    }
    setShowSave(false)
    onEnd()
  }

  const accuracy = attempts === 0 ? 0 : Math.round((correctCount / attempts) * 100)

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6 p-6">
      <div className="flex gap-6 text-sm opacity-90 items-center">
        <div># {index}/{TOTAL_QUESTIONS}</div>
        <div>⏱ {formatTime(elapsed)}</div>
        <div>🔥 Streak: {streak}</div>
        <div>🏆 Best: {bestStreak}</div>
        <div>🎯 Accuracy: {accuracy}%</div>
      </div>

      <div className="bg-zinc-900 px-12 py-8 rounded-2xl text-6xl font-bold">
        {question.a} <span className="mx-6">{question.op}</span> {question.b}
      </div>

      <form onSubmit={handleSubmit} className="text-center">
        <p className="uppercase text-sm opacity-60 mb-2">Your Answer</p>
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Type answer"
          className="bg-zinc-800 px-6 py-3 rounded-lg text-white outline-none"
        />
      </form>

      <div className="flex gap-4">
        <button onClick={handleSubmit} className="bg-blue-500 px-6 py-3 rounded-lg">Submit</button>
        <button onClick={() => { setRunning(false); setShowSave(true) }} className="border border-white/20 px-6 py-3 rounded-lg">End Session</button>
        <button onClick={() => setShowLeaderboard(s => !s)} className="border border-white/20 px-6 py-3 rounded-lg">Leaderboard</button>
      </div>

      {feedback === 'correct' && (<div className="mt-4 text-green-400">Correct! Moving to next…</div>)}

      {feedback === 'wrong' && (
        <div className="mt-4 text-red-400">Wrong — correct answer: <span className="font-bold ml-2">{question.answer}</span></div>
      )}

      {showSave && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="bg-white text-black p-6 rounded-lg w-80">
            <h3 className="text-lg font-semibold mb-2">Save your score</h3>
            <p className="text-sm mb-2">Time: {formatTime(elapsed)} — Accuracy: {accuracy}% — Best streak: {bestStreak}</p>
            <input value={playerName} onChange={e=>setPlayerName(e.target.value)} placeholder="Your name" className="w-full p-2 mb-3 border rounded" />
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setShowSave(false); setRunning(true) }} className="px-3 py-2">Cancel</button>
              <button onClick={saveResultAndExit} className="bg-blue-600 text-white px-3 py-2 rounded">Save & Exit</button>
            </div>
          </div>
        </div>
      )}

      {showLeaderboard && (
        <div className="w-full max-w-2xl mt-6">
          <Leaderboard />
        </div>
      )}
    </div>
  )
}

export default GameScreen

