import { useState, useEffect } from 'react'
import axios from 'axios';

// TODO:
// [ ] Check that word is valid i.e. in wordList
// [ ] Check the number of attempts
// [ ] Disable keys based on incorrect letters
// [ ] Use simple HTML alerts

const API_URL = 'https://wordle-api.cyclic.app/words';

const Box = ({ character, row, col }) => {
    return (
        <div className="box-border border-2 border-solid h-[2rem] w-[2rem] ">
            <div id={`${row}${col}`} className='flex justify-center items-center'>{character.toUpperCase()}</div>
        </div>
    )
}

const Row = ({ charList, row }) => {

    return (
        <div className='flex flex-auto gap-2 py-[0.25rem]'>
            {charList.map((char, idx) => <Box key={idx} row={row} col={idx + 1} character={char} />)}
        </div>
    )
}

const GameBoard = ({ attempts }) => {
    return (
        <div className='mx-auto'>
            {attempts.map((atmpt, idx) => <Row key={idx} row={idx + 1} charList={atmpt.split('')} />)}
        </div>
    )
}

const Key = ({ character, fn }) => {
    return (
        <div id={character} className='h-[2rem] w-[1.5rem] bg-gray-300 my-1 mx-0.5 text-center'>
            <button onClick={fn}>
                {character.toUpperCase()}
            </button>

        </div>
    )
}

const resetBoard = () => {
    let rows = []
    for (let i = 1; i <= 6; i++) {
        rows.push("     ");
    }
    return rows;
}

function App() {
    const [wordList, setWordList] = useState([])
    const [solution, setSolution] = useState('')
    const [row, setRow] = useState(1)
    const [col, setCol] = useState(1)
    const [attempt, setAttempt] = useState(1)
    const [guess, setGuess] = useState('')

    const playLetter = event => {
        console.log(`${row}${col}`);
        const l = event.target.innerHTML;
        const curPos = document.getElementById(`${row}${col}`);
        curPos.innerHTML = l
        setGuess(guess.concat(l))
        curPos.parentElement.classList.add('border-black')
        setCol(col + 1)
    }

    const deleteLetter = () => {
        if (col <= 1) {
            setCol(1)
        }
        const curPos = document.getElementById(`${row}${col - 1}`);
        curPos.innerHTML = " ";
        curPos.parentElement.classList.remove('border-black');
        setCol(col - 1);
        setGuess(guess.slice(0, guess.length-1))

    }

    const getGuessStatus = () => {
        const guessStatus = [];
        const solutionSplit = solution.split('');
        const guessSplit = guess.toLowerCase().split('');
        for (let i = 0; i < guessSplit.length; i++) {
            if (guessSplit[i] === solutionSplit[i]) {
                guessStatus.push('g')
            }
            else if (solutionSplit.includes(guessSplit[i])) {
                guessStatus.push('y')
            }
            else {
                guessStatus.push('n')
            }
        }
        return guessStatus;
    }

    const setGuessStatus = guessStatus => {
        for (let i = 0; i < guessStatus.length; i++) {
            if (guessStatus[i] === 'g') {
                const key = document.getElementById(solution[i]);
                const selectBox = document.getElementById(`${row}${i + 1}`);
                key.classList.remove('bg-gray-300')
                key.classList.add('bg-green-400')
                selectBox.classList.add('bg-green-400')
            }
            else if (guessStatus[i] === 'y') {
                const key = document.getElementById(solution[i]);
                const selectBox = document.getElementById(`${row}${i + 1}`);
                key.classList.remove('bg-gray-300')
                key.classList.add('bg-yellow-400')
                selectBox.classList.add('bg-yellow-400')
            }
            else {
                const key = document.getElementById(solution[i]);
                const selectBox = document.getElementById(`${row}${i + 1}`);
                key.classList.remove('bg-gray-300')
                key.classList.add('bg-gray-600')
                selectBox.classList.add('bg-gray-600')
            }
        }
    }

    const progress = () => {
        setRow(row + 1);
        setCol(1);
        setAttempt(attempt + 1);
        setGuess('')
    }

    const checkAnswer = () => {
        console.log(`${col}`);
        if (col < 6) {
            alert("Not enough letters");
        }
        else {
            const guessLowered = guess.toLowerCase();
            const found = wordList.filter(word => word === guessLowered)
            if (found.length === 1 && guessLowered === solution) {
                alert("You won!")
                const guessStatus = getGuessStatus();
                setGuessStatus(guessStatus);
            }
            else if (found.length !== 1) {
                alert("Word not in list.");


            }
            else if (found.length === 1){
                progress()
                const guessStatus = getGuessStatus();
                setGuessStatus(guessStatus);
            }

        }
        if (attempt === 6) {
            alert("Ran out of attempts!")
        }
    }

    useEffect(() => {
        const getWordsList = async () => {
            const response = await axios.get(API_URL);
            const wordList = response.data.map(wordObject => wordObject.word);
            const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
            setWordList(wordList)
            setSolution(randomWord)
        }
        getWordsList();
    }, [])

    return (
        <div className='container mx-auto max-w-[600px]'>
            <h1 className='text-center'>Low Budget Wordle Clone</h1>
            <div className='flex justify-center'>
                <div className='border-2 box-border border-emerald-500'>
                    <Row charList={solution.split('')} />
                </div>
            </div>
            <div className='flex justify-center'>
                <GameBoard attempts={resetBoard()} />
            </div>

            <div className='flex justify-center mt-2'>
                <Key character={'q'} fn={playLetter} />
                <Key character={'w'} fn={playLetter} />
                <Key character={'e'} fn={playLetter} />
                <Key character={'r'} fn={playLetter} />
                <Key character={'t'} fn={playLetter} />
                <Key character={'y'} fn={playLetter} />
                <Key character={'u'} fn={playLetter} />
                <Key character={'i'} fn={playLetter} />
                <Key character={'o'} fn={playLetter} />
                <Key character={'p'} fn={playLetter} />
            </div>
            <div className='flex justify-center'>
                <Key character={'a'} fn={playLetter} />
                <Key character={'s'} fn={playLetter} />
                <Key character={'d'} fn={playLetter} />
                <Key character={'f'} fn={playLetter} />
                <Key character={'g'} fn={playLetter} />
                <Key character={'h'} fn={playLetter} />
                <Key character={'j'} fn={playLetter} />
                <Key character={'k'} fn={playLetter} />
                <Key character={'l'} fn={playLetter} />
            </div>
            <div className='flex justify-center'>
                <Key character={'☑️'} fn={checkAnswer} />
                <Key character={'z'} fn={playLetter} />
                <Key character={'x'} fn={playLetter} />
                <Key character={'c'} fn={playLetter} />
                <Key character={'v'} fn={playLetter} />
                <Key character={'b'} fn={playLetter} />
                <Key character={'n'} fn={playLetter} />
                <Key character={'m'} fn={playLetter} />
                <Key character={'␡'} fn={deleteLetter} />
            </div>
        </div>
    )
}

export default App
