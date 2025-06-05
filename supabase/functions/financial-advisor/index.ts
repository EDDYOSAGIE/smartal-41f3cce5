
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.10';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!);
    
    // Get user's financial data context
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
    
    if (userError || !user) {
      throw new Error('Invalid user');
    }

    // Fetch user's financial analyses for context
    const { data: analyses } = await supabase
      .from('financial_analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // Create context from user's financial data
    let financialContext = '';
    if (analyses && analyses.length > 0) {
      const latestAnalysis = analyses[0];
      if (latestAnalysis.analysis_results) {
        financialContext = `Based on your recent financial data: ${JSON.stringify(latestAnalysis.analysis_results)}`;
      }
    }

    const systemPrompt = `You are a helpful AI financial advisor. You provide personalized advice based on the user's financial data and general financial best practices. 

${financialContext ? financialContext : 'The user hasn\'t uploaded any financial data yet.'}

Guidelines:
- Be encouraging and supportive
- Provide actionable advice
- Keep responses concise but helpful
- Focus on budgeting, saving, and spending optimization
- If the user hasn't uploaded data, encourage them to do so for personalized insights
- Never provide investment advice or specific financial product recommendations
- Always remind users to consult with financial professionals for major decisions`;

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
          { role: 'user', content: message }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in financial-advisor function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process request',
      response: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
