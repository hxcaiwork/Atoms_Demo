import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VOLC_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || process.env.VOLC_BASE_URL,
});

export interface GenerationResult {
  success: boolean;
  code?: string;
  error?: string;
}

export async function generateCodeFromPrompt(
  prompt: string,
  existingCode?: string
): Promise<GenerationResult> {
  try {
    let systemPrompt = `You are an expert web developer helping build a web application based on the user's description.
Generate a complete, working single-page HTML application that includes all necessary HTML, CSS, and JavaScript.
The output should be ONLY the complete code, wrapped in \`\`\`html and \`\`\` tags.
Make sure the code is functional, responsive, and follows modern best practices.`;

    if (existingCode) {
      systemPrompt += `\n\nThe user is modifying an existing project. Here is the current code:\n\`\`\`html\n${existingCode}\n\`\`\`\n\nApply the user's requested changes to this code and return the complete updated version.`;
    }

    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return { success: false, error: 'No response from AI' };
    }

    // Extract code from markdown code block
    const codeMatch = content.match(/```html\n([\s\S]*?)\n```/);
    const code = codeMatch ? codeMatch[1] : content;

    return { success: true, code };
  } catch (error) {
    console.error('AI generation error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
