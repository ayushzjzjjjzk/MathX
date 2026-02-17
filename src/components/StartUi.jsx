import React from 'react'

const StartUi = () => {
  return (
    <>
    <div className=' flex top left-0 text-3xl font-black font-extrabold'>
      <h1>MathX</h1> 

      
    </div>

    <div className=' h-screen flex items-center justify-center flex-col gap-10'>
        <h2 className='font-semibold text-2xl'>Ready to practice?</h2>

        <button className='bg-blue-500 cursor-pointer hover:bg-blue-300 px-4 py-4 rounded-lg text-white'>Start Game</button>
    </div>

    </>


  )
}

export default StartUi
