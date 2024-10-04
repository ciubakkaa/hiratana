// app/api/words/route.ts
import { NextResponse } from 'next/server';

type Word = {
  romaji: string;
  hiragana: string;
};

type ApiResponse = {
  words: Word[];
};

const allWords: Word[] = [
  { romaji: 'konnichiwa', hiragana: 'こんにちは' },
  { romaji: 'arigatou', hiragana: 'ありがとう' },
  { romaji: 'sushi', hiragana: 'すし' },
  { romaji: 'sensei', hiragana: 'せんせい' },
  { romaji: 'nihon', hiragana: 'にほん' },
  { romaji: 'arashi', hiragana: 'あらし' },
  { romaji: 'kasa', hiragana: 'かさ' },
  { romaji: 'mizu', hiragana: 'みず' },
  // Add more words as needed
];

function canFormWord(wordHiragana: string, chars: string): boolean {
  const charsArr = chars.split('');
  for (const char of wordHiragana) {
    const index = charsArr.indexOf(char);
    if (index === -1) {
      return false;
    }
    charsArr.splice(index, 1);
  }
  return true;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hiraganaChars = searchParams.get('chars');

    let words: Word[] = [];

    if (hiraganaChars) {
      // Filter words that can be formed from the given hiragana characters
      words = allWords.filter((word) =>
        canFormWord(word.hiragana, hiraganaChars)
      );
    } else {
      // If no characters provided, return all words
      words = allWords;
    }

    return NextResponse.json({ words });
  } catch (error) {
    console.error('Failed to fetch words:', error);
    return NextResponse.json(
      { error: 'Failed to fetch words' },
      { status: 500 }
    );
  }
}
