// app/api/words/route.ts
import { NextResponse } from 'next/server';

type Word = {
  romaji: string;
  hiragana: string;
};

type ApiResponse = {
  words: Word[];
};

export async function GET() {
  try {
    // Replace with a real API endpoint
    // For demonstration, we'll use mock data
    const data: ApiResponse = {
      words: [
        { romaji: 'konnichiwa', hiragana: 'こんにちは' },
        { romaji: 'arigatou', hiragana: 'ありがとう' },
        { romaji: 'sushi', hiragana: 'すし' },
        { romaji: 'sensei', hiragana: 'せんせい' },
        { romaji: 'nihon', hiragana: 'にほん' },
        // Add more words
      ],
    };
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch words:', error);
    return NextResponse.json({ error: 'Failed to fetch words' }, { status: 500 });
  }
}
