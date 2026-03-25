import { NextResponse } from 'next/server';

const systemPrompt = `You are a smart AI travel assistant. You help users with:

* Travel planning
* Destination suggestions
* Budget tips
* Itinerary advice

Guidelines:
* Keep answers concise and helpful
* Be conversational and friendly
* If user asks unrelated questions, still respond politely
* Prefer travel-related suggestions

Return your response in the following JSON format ONLY:
{
  "reply": "Your response here"
}`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 });
    }

    // Format history for Gemini API
    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === 'ai' || msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const contents = [
      ...formattedHistory,
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: contents,
        generationConfig: {
          responseMimeType: "application/json",
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      return NextResponse.json({ error: 'Failed to generate response' }, { status: response.status });
    }

    const data = await response.json();
    let textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResult) {
      return NextResponse.json({ error: 'Invalid response format from Gemini' }, { status: 500 });
    }

    try {
      textResult = textResult.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(textResult);
      if (parsedData.reply) {
        return NextResponse.json({ reply: parsedData.reply });
      }
      return NextResponse.json({ reply: textResult });
    } catch(e) {
      console.error('Failed to parse JSON:', textResult);
      return NextResponse.json({ reply: textResult });
    }

  } catch (error: any) {
    console.error('Error in /api/chat endpoint:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
