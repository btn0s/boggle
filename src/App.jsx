import { useEffect, useState } from 'react'

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

function App() {
  const [rows, setRows] = useState([])
  const [word, setWord] = useState([])

  useEffect(()=>{
    const newRows = []

    for (let i = 1; i <= GRID_ROWS; i++) {
      const newRow = []

      for (let i = 1; i <= GRID_COLS; i++) {
        const characters = 'abcdefghijklmnopqrstuvwxyz'
        const charactersLength = characters.length

        newRow.push({
          char: characters.charAt(Math.floor(Math.random() * charactersLength)),
          selected: false
        })
      }

      newRows.push(newRow)
    }

    setRows(newRows)
  }, [])

  const toggleSelectChar = (rowIndex, charIndex, char) => {
    const newRows = [...rows]
    const { selected } = newRows[rowIndex][charIndex]

    if (!selected) {
      const newWord = [...word, char]
      console.log(newWord)
      setWord(newWord)
    } else {
      const newWord = [...word]
      const indexToRemove = newWord.indexOf(char)
      newWord.splice(indexToRemove, 1)
      console.log(newWord)
      setWord(newWord)
    }

    newRows[rowIndex][charIndex].selected = !selected

    setRows(newRows)
  }

  const submitWord = () => {
    const foundWord = dictionary[word.join('')]

    if (foundWord) {
      alert('you win')
    } else {
      alert('try again')
    }

    setWord([])
  }

  return (
    <div className="App">
      <div className="inner">

        <div className="Board">
          {rows.map((row, rowIndex)=>{
            return (
              <div className="Row">
                {row.map(({ char, selected }, charIndex)=>
                  <div className="Col" onClick={()=>{ toggleSelectChar(rowIndex, charIndex, char) }}>
                    {char}
                      <small>
                        {selected ? "selected" : null}
                      </small>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        <div className="controls">
          <div>
            {word.join('')}
          </div>
          <div>
            <button onClick={submitWord}>Submit Word</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default App
