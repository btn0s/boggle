import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

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
const END_GAME_RESET_DELAY = 1000
const RESHUFFLE_LIMIT = 100

const GAME_STATES = {
  default: 'default',
  win: 'win',
  loss: 'loss'
}
const LETTER_STATES = {
  default: 'default',
  selected: 'selected',
  win: 'win',
  loss: 'loss'
}
const STATUS_TEXTS = {
  [GAME_STATES.default]: 'Select some letters...',
  [GAME_STATES.win]: 'Great! You win.',
  [GAME_STATES.loss]: 'Not a word. Try again.',
}

const LETTER_STATE_COLORS = {
  [LETTER_STATES.default]: { border: 'black', background: 'white' },
  [LETTER_STATES.selected]: { border: 'navy', background: 'lightsteelblue' },
  [LETTER_STATES.win]: { border: 'darkgreen', background: 'lightgreen' },
  [LETTER_STATES.loss]: { border: 'darkred', background: 'lightpink' },
}

const Game = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  `
const GameInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
  max-width: 500px;
`
const GameBar = styled.div`
  display: flex;
  justify-content: space-between;
`

const Board = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
const Row = styled.div`
  display: flex;
  gap: 8px;
`
const Letter = styled.div`
  flex: 1;
  height: 100px;
  width: 100px;
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: ${props =>
    props.selected
      ? props.state === GAME_STATES.win
        ? LETTER_STATE_COLORS.win.background
        : props.state === GAME_STATES.loss
          ? LETTER_STATE_COLORS.loss.background
          : LETTER_STATE_COLORS.selected.background
      : LETTER_STATE_COLORS.default.background
  };
  border-color: ${props =>
    props.selected
      ? props.state === GAME_STATES.win
        ? LETTER_STATE_COLORS.win.border
        : props.state === GAME_STATES.loss
          ? LETTER_STATE_COLORS.loss.border
          : LETTER_STATE_COLORS.selected.border
      : LETTER_STATE_COLORS.default.border
  };
`

const StatusText = styled.div``
const Controls = styled.div`
  display: flex;
  gap: 8px;
`
const SubmitButton = styled.button``
const ReshuffleButton = styled.button``

const generateRowData = () => {
  const newRows = []

  for (let i = 1; i <= GRID_ROWS; i++) {
    const newRow = []

    for (let i = 1; i <= GRID_COLS; i++) {
      const characters = 'abcdefghijklmnopqrstuvwxyz'
      const newChar = characters.charAt(Math.floor(Math.random() * characters.length))
      newRow.push(newChar)
    }

    newRows.push(newRow)
  }

  return newRows;
}

function App() {
  const [gameState, setGameState] = useState(GAME_STATES.default)
  const [dictionary, setDictionary] = useState()

  const [rows, setRows] = useState([])
  const [word, setWord] = useState([])

  const fetchDictionary = async () => {
    const res = await fetch('https://raw.githubusercontent.com/btn0s/boggle/main/src/dictionary.json')
    const json = await res.json()
    setDictionary(json)
  }
  const setupRows = () => {
    const data = generateRowData()
    setRows(data)
  }

  let reshuffleDur = 10
  const handleReshuffle = () => {
    handleResetGame()
    setTimeout(() => {
      setupRows()
      if (reshuffleDur <= RESHUFFLE_LIMIT) {
        reshuffleDur += 10
        handleReshuffle()
      }
    }, reshuffleDur)
  }

  useEffect(() => {
    fetchDictionary()
    setupRows()
  }, [])

  const handleWinGame = () => {
    setGameState(GAME_STATES.win)
  }
  const handleLoseGame = () => {
    setGameState(GAME_STATES.loss)
  }
  const handleResetGame = () => {
    setGameState(GAME_STATES.default)
    setWord([])
  }

  const getAvailableOptions = () => { }

  const handleSelectLetter = (rowIndex, charIndex, char) => {
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
  const handleSubmitWord = () => {
    const foundWord = dictionary[word.map(e => e.char).join('')]

    if (foundWord) {
      handleWinGame()
    } else {
      handleLoseGame()
    }

    setTimeout(() => {
      handleResetGame()
    }, END_GAME_RESET_DELAY)
  }

  return (
    <Game>
      <GameInner>
        <Board state={gameState}>
          {
            rows.map((chars, rowIndex) => (
              <Row key={rowIndex}>
                {
                  chars.map((char, charIndex) => (
                    <Letter
                      key={charIndex}
                      state={gameState}
                      selected={word.some(char => char.rowIndex === rowIndex && char.charIndex === charIndex)}
                      onClick={() => handleSelectLetter(rowIndex, charIndex, char)}
                    >
                      {char}
                    </Letter>
                  ))
                }
              </Row>
            ))
          }
        </Board>
        <GameBar>
          <StatusText>
            {
              gameState === GAME_STATES.default && word.length > 0
                ? word.map(item => item.char).join('')
                : STATUS_TEXTS[GAME_STATES[gameState]]
            }
          </StatusText>
          <Controls>
            <ReshuffleButton onClick={handleReshuffle}>reshuffle</ReshuffleButton>
            <SubmitButton
              disabled={word.length < WORD_MIN_LENGTH}
              onClick={handleSubmitWord}
            >
              submit
            </SubmitButton>
          </Controls>
        </GameBar>
      </GameInner>
    </Game>
  )
}

export default App
