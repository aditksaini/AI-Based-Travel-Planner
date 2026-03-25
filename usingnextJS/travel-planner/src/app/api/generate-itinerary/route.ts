import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { destination, days, budget } = await req.json();

    if (!destination || !days || !budget) {
      return NextResponse.json({ error: 'Missing required fields: destination, days, or budget' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json({ error: 'Gemini API key is not configured in .env.local' }, { status: 500 });
    }

    const prompt = `Evaluate if ${days} days is appropriate for a meaningful travel itinerary to ${destination}. 
Return ONLY JSON in this exact format:
{
  "is_sufficient": boolean, // false if ${days} days is too few
  "recommended_minimum_days": number (only required if is_sufficient is false),
  "is_too_long": boolean, // true if ${days} days is too extraordinarily long and the destination can be fully explored in fewer days
  "recommended_maximum_days": number (only required if is_too_long is true),
  "message": "A short message explaining why it's insufficient or too long. If too long, say they can complete the full trip in [max] days and there is nothing left to explore." (only required if is_sufficient=false OR is_too_long=true),
  "itinerary": [
    {
      "day": 1,
      "title": "",
      "activities": [],
      "estimated_cost": ""
    }
  ] (only include if is_sufficient is true. If is_too_long is true, provide the itinerary for the 'recommended_maximum_days' instead of ${days} days)
}`;

    // Call Gemini API directly via fetch using the compatible 2.5 Flash model
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          responseMimeType: "application/json",
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      let parsedMessage = errorText;
      try {
        const parsed = JSON.parse(errorText);
        parsedMessage = parsed.error?.message || errorText;
      } catch (e) {}
      return NextResponse.json({ error: `Gemini Rejected Request: ${parsedMessage}` }, { status: response.status });
    }

    const data = await response.json();
    
    // Extract JSON from Gemini response
    let textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResult) {
       return NextResponse.json({ error: 'Invalid response format from Gemini.' }, { status: 500 });
    }

    try {
      // Clean up markdown block formatting if Gemini wraps the JSON
      textResult = textResult.replace(/```json/gi, '').replace(/```/g, '').trim();
      
      const parsedData = JSON.parse(textResult);

      if (parsedData.is_sufficient === false) {
         return NextResponse.json({
            is_sufficient: false,
            message: parsedData.message,
            recommended_days: parsedData.recommended_minimum_days
         });
      }

      if (!parsedData.itinerary || !Array.isArray(parsedData.itinerary)) {
         throw new Error("Invalid itinerary root object");
      }
      return NextResponse.json({
         is_sufficient: true,
         is_too_long: parsedData.is_too_long || false,
         recommended_maximum_days: parsedData.recommended_maximum_days,
         message: parsedData.message,
         itinerary: parsedData.itinerary
      });
    } catch(e) {
      console.error('Failed to parse Gemini output strictly:', textResult);
      return NextResponse.json({ error: 'Gemini returned an invalid JSON schema.' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error in /api/generate-itinerary endpoint:', error);
    return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
  }
}
