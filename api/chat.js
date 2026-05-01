// api/chat.js
export const config = { runtime: "edge" };

const SYSTEM_CONTEXT = `You are a helpful AI assistant named Pau...`; // paste your full context here

export default async function handler(req) {
  const { message, history } = await req.json();

  const contents = [
    { role: "user", parts: [{ text: SYSTEM_CONTEXT + "\n\nPlease confirm you understand your role." }] },
    { role: "model", parts: [{ text: "Understood! I'm Pau, ready to help visitors learn about Lanz Paulo Abolac. What would you like to know?" }] },
    ...history,
    { role: "user", parts: [{ text: message }] }
  ];

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 512 }
      }),
    }
  );

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}