'use client';

import { useState, useEffect } from 'react';

type Word = {
  romaji: string;
  hiragana: string;
};

export default function Home() {
  const [inputChars, setInputChars] = useState<string>('');
  const [hiraganaChars, setHiraganaChars] = useState<string>('');
  const [availableWords, setAvailableWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [noWordsFound, setNoWordsFound] = useState<boolean>(false);

  // Fetch words based on the input hiragana characters
  const fetchWords = async (chars: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/words?chars=${encodeURIComponent(chars)}`);
      const data = await res.json();

      if (data.words.length === 0) {
        setNoWordsFound(true);
        setAvailableWords([]);
        setCurrentWord(null);
      } else {
        setAvailableWords(data.words);
        setCurrentWord(data.words[0]);
        setCurrentWordIndex(0);
        setNoWordsFound(false);

        const uniqueChars = [
          ...data.words.map((word: Word) => word.hiragana).join(''),
        ];
        // setHiraganaChars(uniqueChars.join(''));
      }
    } catch (err) {
      console.error('Failed to fetch words:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputChars.trim() === '') {
      alert('Please enter some hiragana characters.');
      return;
    }
    setUserInput('');
    setError('');
    setHiraganaChars(inputChars);
    fetchWords(inputChars.trim());
  };

  // Handle character click
  const handleCharClick = (char: string) => {
    console.log('char:', char);
    if (currentWord && currentWord.hiragana[userInput.length] === char) {
      setUserInput(userInput + char);
      console.log('userInput:', userInput, char);

      setError('');
    } else {
      setError('Incorrect character, try again.');
    }
  };

  // Check if the word is completed
  useEffect(() => {
    if (currentWord && userInput === currentWord.hiragana) {
      alert('Correct!');
      setUserInput('');
      setError('');
      const nextIndex = (currentWordIndex + 1) % availableWords.length;
      setCurrentWordIndex(nextIndex);
      setCurrentWord(availableWords[nextIndex]);
    }
  }, [userInput, currentWord, currentWordIndex, availableWords]);

  return (
    <div className="max-w-md mx-auto text-center p-4">
      <h1 className="text-3xl font-bold mb-4">Hiragana Practice</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <label htmlFor="hiraganaInput" className="block text-lg font-medium">
          Enter Hiragana Characters:
        </label>
        <input
          id="hiraganaInput"
          type="text"
          value={inputChars}
          onChange={(e) => setInputChars(e.target.value)}
          className="mt-1 p-2 border rounded w-full text-center"
          placeholder="e.g., あいうえお"
        />
        <button
          type="submit"
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Start Practice
        </button>
      </form>

      {loading && <p>Loading words...</p>}

      {noWordsFound && (
        <p className="text-red-500 font-semibold">
          No words can be formed from the provided characters.
        </p>
      )}

      {currentWord && (
        <>
          <p className="text-xl">
            Type the hiragana for: <strong>{currentWord.romaji}</strong>
          </p>
          <p className="text-2xl mt-2">Your input: {userInput}</p>
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
          <div className="flex flex-wrap justify-center mt-6">
            {hiraganaChars.split('').map((char, index) => (
              <button
                key={index}
                onClick={() => handleCharClick(char)}
                className="m-1 p-4 w-12 h-12 text-2xl border rounded shadow hover:bg-gray-100"
              >
                {char}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setUserInput('');
              setError('');
            }}
            className="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Clear
          </button>
        </>
      )}
    </div>
  );
}
