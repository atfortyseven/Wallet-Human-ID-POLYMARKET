// lib/ai-editor.ts
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSmartTitles(newsContext: string) {
    const prompt = `
    # ROLE
    Actúa como un Editor Jefe Senior. Tu especialidad es la psicología del lector y el SEO semántico.

    # TASK
    Genera 10 variaciones de títulos RADICALMENTE diferentes para la noticia proporcionada.
    Usa los siguientes estilos: Click-Gap, Analítico, Emocional, Contrarian, SEO Long-Tail, Punchy, Storyteller, Cita, Utilidad, Avant-Garde.

    # INPUT
    ${newsContext}

    # OUTPUT FORMAT
    Responde ÚNICAMENTE en formato JSON puro con la siguiente estructura:
    {
      "variations": [
        { "style": "Nombre del estilo", "title": "El título generado" }
      ]
    }
  `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Rápido y barato para títulos
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.8, // Añade esa chispa de creatividad
        });

        const content = response.choices[0].message.content;
        return content ? JSON.parse(content).variations : [];
    } catch (error) {
        console.error("AI Generation Error:", error);
        // Return empty array instead of throwing to prevent app crash
        return [];
    }
}
