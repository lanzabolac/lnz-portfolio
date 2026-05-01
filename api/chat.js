export const config = { runtime: "edge" };

const SYSTEM_CONTEXT = `You are a helpful AI assistant named Pau...`; // keep yours

export default async function handler(req) {
  try {
    const { message, history } = await req.json();

    // history already has the latest user message pushed before fetch,
    // so use history directly (it ends with the current user message)
    const contents = [
      { role: "user", parts: [{ text: SYSTEM_CONTEXT + "\n\nPlease confirm you understand your role." }] },
      { role: "model", parts: [{ text: "Understood! I'm Pau, ready to help visitors learn about Lanz Paulo Abolac. What would you like to know?" }] },
      ...history, // already includes current message at the end
    ];

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

    // Surface API errors clearly
    if (!res.ok) {
      console.error("Gemini error:", JSON.stringify(data));
      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Handler error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}