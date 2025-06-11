import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question } = body;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'Ti si asistent za korisnike sajta KlikOglas. Odgovaraj jasno i kratko na pitanja vezana za postavljanje, uređivanje i brisanje oglasa.',
          },
          {
            role: 'user',
            content: question,
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('OpenAI API error:', data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    return NextResponse.json({ answer: data.choices[0].message.content });
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ error: 'Greška na serveru' }, { status: 500 });
  }
}
