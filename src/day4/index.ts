import * as fs from 'fs'
import path from 'path'

const getNumbers = (scratchCard: string, side: 'winning' | 'yours') => {
  const numbersSection = scratchCard.split(':')[1].trim()
  const winningNumbersStr = numbersSection.split('|')[side === 'winning' ? 0 : 1].trim()
  return winningNumbersStr.split(/\s+/).map(Number)
}

const getNumWinningNumbers = (scratchCard: string) => {
  let res = 0
  const winningNumbers = getNumbers(scratchCard, 'winning')
  const yourNumbers = getNumbers(scratchCard, 'yours')
  for (const yourNumber of yourNumbers) {
    if (winningNumbers.indexOf(yourNumber) > -1) {
      res++
    }
  }
  return res
}

const run = async () => {
  const joinedPath = path.join(__dirname, 'input.txt')
  const inputText = fs.readFileSync(joinedPath, 'utf8')
  const inputTextLines = inputText.split('\n')

  // -- Part 1

  let sum = 0
  for (const line of inputTextLines) {
    const winningNumbers = getNumbers(line, 'winning')
    const yourNumbers = getNumbers(line, 'yours')

    let score = 0
    for (const yourNumber of yourNumbers) {
      if (winningNumbers.indexOf(yourNumber) > -1) {
        if (score === 0) {
          score++
        } else {
          score *= 2
        }
      }
    }

    sum += score
  }

  console.log('Part 1', sum)

  // -- Part 2

  const gameIdToLine: { [key: number]: string } = {}
  for (const line of inputTextLines) {
    const gameId = Number(line.split(':')[0].split(/\s+/)[1])
    gameIdToLine[gameId] = line
  }

  const gameIdToNumCards: { [key: number]: number } = {}
  for (const gameId in gameIdToLine) {
    gameIdToNumCards[Number(gameId)] = 1
  }

  const lastGameId = Math.max(...Object.keys(gameIdToLine).map(Number))

  for (const gameId in gameIdToNumCards) {
    const numOfThisCard = gameIdToNumCards[gameId]
    const numWinningNumbers = getNumWinningNumbers(gameIdToLine[gameId])
    for (let toCopy = Number(gameId) + 1; toCopy <= Number(gameId) + numWinningNumbers && toCopy <= lastGameId; toCopy++) {
      gameIdToNumCards[toCopy] = gameIdToNumCards[toCopy] + numOfThisCard
    }
  }

  const total = Object.values(gameIdToNumCards).reduce((sum, cur) => sum + cur)
  console.log('Part 2', total)
}

run()
