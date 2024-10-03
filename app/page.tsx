// app/page.tsx
'use client';

import { useState, useEffect } from 'react';

type Word = {
  romaji: string;
  hiragana: string;
};

export default function Home() {
  const [hiraganaChars, setHiraganaChars] = useState<string>('');
  const [availableWords, setAvailableWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Fetch words from the API
  useEffect(() => {
    const fetchWords = async () => {
      try {
        const res = await fetch('/api/words');
        const data: any = await res.json();

        // Assume the API returns an array of words with 'romaji' and 'hiragana' fields
        setAvailableWords(data.words);
        setCurrentWord(data.words[0]);

        // Extract unique hiragana characters from the words
        // @ts-ignore
        const chars = [...new Set(data.words.map((word: Word) => word.hiragana).join(''))];
        setHiraganaChars(chars.join(''));
      } catch (err) {
        console.error('Failed to fetch words:', err);
      }
    };
    fetchWords();
  }, []);

  // Handle character click
  const handleCharClick = (char: string) => {
    if (currentWord && currentWord.hiragana[userInput.length] === char) {
      setUserInput(userInput + char);
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

  if (!currentWord) return <div className="text-center mt-10">Loading...</div>;

  // Hiragana keyboard characters
  const hiraganaKeyboard = hiraganaChars.split('');

  return (
    <div className="max-w-md mx-auto text-center p-4">
      <h1 className="text-3xl font-bold mb-4">Hiragana Practice</h1>
      <p className="text-xl">
        Type the hiragana for: <strong>{currentWord.romaji}</strong>
      </p>
      <p className="text-2xl mt-2">Your input: {userInput}</p>
      {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
      <div className="flex flex-wrap justify-center mt-6">
        {hiraganaKeyboard.map((char, index) => (
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
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Clear
      </button>
    </div>
  );
}
