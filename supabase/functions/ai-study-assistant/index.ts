
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, prompt, subject, difficulty, context } = await req.json();

    let systemPrompt = '';
    let userPrompt = prompt;

    // Different system prompts based on request type
    switch (type) {
      case 'homework_help':
        systemPrompt = `You are an expert tutor helping students with their assignments. Provide clear, step-by-step explanations. Break down complex problems into manageable parts. Always encourage learning by explaining the "why" behind each step. Be patient and supportive.`;
        break;
      
      case 'generate_quiz':
        systemPrompt = `You are an educational content creator. Generate engaging quiz questions based on the subject and difficulty level provided. Include multiple choice questions with explanations for correct answers. Make questions that test understanding, not just memorization.`;
        userPrompt = `Create a quiz for ${subject} at ${difficulty} level. Topic: ${prompt}. Generate 5 multiple choice questions with 4 options each. Format as JSON with this structure: {"questions": [{"question": "...", "options": ["A", "B", "C", "D"], "correct": 0, "explanation": "..."}]}`;
        break;
      
      case 'explain_concept':
        systemPrompt = `You are a skilled educator who excels at explaining complex concepts in simple terms. Use analogies, examples, and clear language. Adapt your explanation to the student's level. Always check for understanding and provide additional clarification when needed.`;
        break;
      
      case 'generate_practice':
        systemPrompt = `You are a practice problem generator. Create relevant practice problems that help students master concepts. Include step-by-step solutions. Vary the difficulty and types of problems to provide comprehensive practice.`;
        userPrompt = `Generate 3 practice problems for ${subject} at ${difficulty} level on topic: ${prompt}. Include detailed solutions for each problem.`;
        break;
      
      default:
        systemPrompt = `You are a helpful AI tutor assistant. Provide educational support, answer questions clearly, and encourage learning.`;
    }

    console.log('Making OpenAI request:', { type, subject, difficulty });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log('OpenAI response received successfully');

    return new Response(JSON.stringify({ 
      content: generatedContent,
      type: type 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-study-assistant function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An error occurred processing your request' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
