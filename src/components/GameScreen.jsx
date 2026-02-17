import React from 'react'

const GameScreen = ({ onEnd = () => {} }) => {
  return (
    <div className='min-h-screen bg-black text-white flex flex-col items-center justify-center gap-8 '>
        <div className='flex gap-10 text-sm opacity-80'>
            <div># 1/20</div>
            <div>⏱ 0:02</div>
            <div>🔥 0</div>
            <div>🎯 0%</div>
        </div>
        
      <div className='bg-zinc-900 px-16 py-10 rounded-2xl text-6xl font-bold'>
        39 <span className='mx-6'>+</span> 43

      </div>
            <div className="text-center">
        <p className="uppercase text-sm opacity-60 mb-2">
          Your Answer
        </p>
        <input
          type="number"
          placeholder="Type answer"
          className="bg-zinc-800 px-6 py-3 rounded-lg text-white outline-none"
        />
      </div>

          <div className="flex gap-4">
        <button className="bg-blue-500 px-6 py-3 rounded-lg">
          Submit
        </button>

        <button
          onClick={onEnd}
          className="border border-white/20 px-6 py-3 rounded-lg"
        >
          End Session
        </button>
      </div>
    </div>
  )
}

export default GameScreen
