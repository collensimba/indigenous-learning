import { NextRequest, NextResponse } from "next/server";

const BLOCKED_WORDS = ["violence", "adult", "inappropriate", "harmful"];

const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
  Shona: "Respond primarily in Shona language. Include English translations in brackets where helpful.",
  Ndebele: "Respond primarily in Ndebele language. Include English translations in brackets where helpful.",
  Tonga: "Respond primarily in Tonga language. Include English translations in brackets where helpful.",
};

const GRADE_INSTRUCTIONS: Record<string, string> = {
  ECD: "Use very simple words, short sentences, and fun examples. The child is 3-5 years old.",
  "Grade 1": "Use simple vocabulary and short sentences. The child is 6 years old.",
  "Grade 2": "Use simple vocabulary. The child is 7 years old.",
  "Grade 3": "Use clear simple language. The child is 8 years old.",
  "Grade 4": "Use moderate vocabulary. The child is 9-10 years old.",
  "Grade 5": "Use moderate vocabulary with some complexity. The child is 10-11 years old.",
  "Grade 6": "Use more advanced vocabulary. The child is 11-12 years old.",
  "Grade 7": "Use advanced primary school vocabulary. The child is 12-13 years old.",
};

export async function POST(req: NextRequest) {
  try {
    const { question, language, grade, subject } = await req.json();

    const questionLower = question.toLowerCase();
    const isBlocked = BLOCKED_WORDS.some(word => questionLower.includes(word));
    if (isBlocked) {
      return NextResponse.json({
        answer: "Sorry, I can only answer educational questions suitable for children.",
      });
    }

    const prompt = `You are Dandaro, a friendly AI tutor for Zimbabwean primary school children.

LANGUAGE: ${LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.Shona}
GRADE: ${GRADE_INSTRUCTIONS[grade] || GRADE_INSTRUCTIONS["Grade 3"]}
SUBJECT: ${subject}
CURRICULUM: Zimbabwe MoPSE curriculum.

FORMAT YOUR RESPONSE AS:
1. Explanation (simple, grade appropriate)
2. Worked Example
3. Practice Question
4. Zimbabwean cultural context or proverb
5. Encouraging message in ${language}

Student Question: ${question}`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq error:", data);
      return NextResponse.json(
        { error: "Failed to generate content" },
        { status: 500 }
      );
    }

    const answer = data.choices?.[0]?.message?.content || "Sorry, I could not generate a response.";

    return NextResponse.json({ answer });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to generate content. Please try again." },
      { status: 500 }
    );
  }
}