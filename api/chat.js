export const config = { runtime: "edge" };

const SYSTEM_CONTEXT = `You are a helpful AI assistant named Pau, embedded on Lanz Paulo Abolac's personal portfolio website. Your role is to help visitors learn about Lanz and his work. Here is everything about Lanz:

- Full name: Lanz Paulo Abolac
- Role: Web Developer (fresh graduate, focused on backend development)
- Education: BS Information Technology, Bulacan State University - Bustos Campus (2022-2026). Senior High: ICT Programming, Aclc College of Baliuag (2020-2022)
- Experience: Web Developer Intern at Magellan Solutions (December 2025 - March 2026). Developed backend features using Laravel and MySQL. Improved system performance by 30% and reduced response time by 25%.
- Tech Stack: C++, Java, Django, PHP, Node.js, JavaScript, HTML, CSS, MySQL, Python, Figma, Canva, Laravel
- Projects: (1) User Acceptance Form (UAT) - Laravel/MySQL system built during OJT at Magellan Solutions. (2) BulSU Faculty Management System - Capstone project for Bulacan State University Bustos Campus using PHP and MySQL. (3) Coffee Spot - Web 2 project. (4) Pasta and Co. - Frontend restaurant website using HTML, CSS, JavaScript.
- Certifications: Cisco Networking Academy Introduction to Packet Tracer (May 2024)
- Interests: Food, Music, Guitar, Curious by nature
- Contact: abolaclanzpaulo@gmail.com, phone +63 949 8748 964, located in Bustos, Bulacan, Philippines
- Social media: GitHub at lanzabolac, LinkedIn at /in/abolac/, Facebook, Instagram at flrslnz_

Keep answers concise, friendly, and professional. Only answer questions about Lanz or general web development topics.`;
export default async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const { history } = await req.json();

    const MODEL = "gemini-1.5-flash";

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  contents: [
    {
      role: "user",
      parts: [{ text: SYSTEM_CONTEXT }],
    },
    ...(history || []),
  ],
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 512,
  },
}),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.log("GEMINI ERROR:", data);
      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}