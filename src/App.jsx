import React, { useEffect, useState } from 'react'

import dictionary from './dictionary.json'

import './App.css'

/* 
  1. generate grid + populate with letters
  2. select letters
  3. validate

  -- nice-to-have --
  - styling
  2.1 limit to immediate siblings
  2.2 lock to h/v/diag axis
*/

const GRID_ROWS = 4
const GRID_COLS = 4
const WORD_MIN_LENGTH = 3
const GAME_STATES = {
  default: 'default',
  win: 'win',
  loss: 'loss'
}
const STATUS_TEXTS = {
  [GAME_STATES.default]: 'Select some letters...',
  [GAME_STATES.win]: 'Great! You win.',
  [GAME_STATES.loss]: 'Not a word. Try again.',
}

function App() {
  const [gameState, setGameState] = useState(GAME_STATES.default)

  const [rows, setRows] = useState([])
  const [word, setWord] = useState([])

  useEffect(() => {
    const newRows = []

    for (let i = 1; i <= GRID_ROWS; i++) {
      const newRow = []

      for (let i = 1; i <= GRID_COLS; i++) {
        const characters = 'abcdefghijklmnopqrstuvwxyz'
        const charactersLength = characters.length

        const newChar = characters.charAt(Math.floor(Math.random() * charactersLength))

        newRow.push(newChar)
      }

      newRows.push(newRow)
    }

    setRows(newRows)
  }, [])

  const toggleSelectChar = (rowIndex, charIndex, char) => {
    const newRows = [...rows]
    const newChar = { rowIndex, charIndex, char }

    const isCharAlreadySelected = word.some(char => char.rowIndex === rowIndex && char.charIndex === charIndex)

    let newWord = [...word]

    if (isCharAlreadySelected) {
      const indexToRemove = newWord.map(item => item.char).indexOf(char)
      newWord.splice(indexToRemove, 1)
    } else {
      newWord.push(newChar)
    }

    setWord(newWord)
    setRows(newRows)
  }

  const submitWord = () => {
    const foundWord = dictionary[word.join('')]

    if (foundWord) {
      setGameState(GAME_STATES.win)
    } else {
      setGameState(GAME_STATES.loss)
    }

    setTimeout(() => {
      setGameState(GAME_STATES.default)
      setWord([])
    }, 500)
  }

  const getStatusText = () => {
    let statusText = STATUS_TEXTS[GAME_STATES.default]

    if (word.length > 0) {
      statusText = word.map(item => item.char).join('')
    } else {
      statusText = STATUS_TEXTS[GAME_STATES[gameState]]
    }

    return statusText
  }

  return (
    <div className="App">
      <div className="inner">

        <div className="Board">
          {rows.map((row, rowIndex) => {
            return (
              <div className="Row">
                {row.map((char, charIndex) =>
                  <div
                    className={`
                      Col 
                      ${word.some(char => char.rowIndex === rowIndex && char.charIndex === charIndex) ? "is-active" : null}
                      game-${gameState}
                    `}
                    onClick={() => {
                      toggleSelectChar(rowIndex, charIndex, char)
                    }}
                  >
                    {char}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="controls">
          <div>
            {getStatusText()}
          </div>

          <div>
            <button disabled={word.length < WORD_MIN_LENGTH} onClick={submitWord}>Submit Word</button>
          </div>
        </div>

      </div>
    </div >
  )
}

export default App
