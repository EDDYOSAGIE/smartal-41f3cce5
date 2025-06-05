import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!openAIApiKey) {
    return new Response(JSON.stringify({
      isValid: false,
      explanation: 'Server error: OpenAI API key not configured.',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    let body: any;
    try {
      body = await req.json();
    } catch (err) {
      console.error("Invalid JSON body:", await req.text());
      throw new Error("Request body is not valid JSON.");
    }

    const { fileName, fileContent, fileType } = body;

    if (!fileName || !fileContent || !fileType) {
      throw new Error("Missing required fields: fileName, fileContent, or fileType.");
    }

    const preview = typeof fileContent === 'string' ? fileContent.substring(0, 1000) : '';

    const systemPrompt = `You are a bank statement validator. Your job is to determine if the uploaded file is a legitimate bank statement.

A valid bank statement should contain:
- Account holder information
- Bank/financial institution details
- Transaction dates
- Transaction descriptions
- Amounts (debits/credits)
- Account balances
- Statement period dates

Common formats include:
- CSV files with columns like: Date, Description, Amount, Balance
- PDF bank statements with transaction lists
- Files from banks like Access bank,UBA,Stanbic ibtc, etc.

Analyze the content and respond with:
1. "valid" if it appears to be a bank statement
2. "invalid" if it's not a bank statement
3. A brief explanation

File name: ${fileName}
File type: ${fileType}
Content preview: ${preview}`;

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
          { role: 'user', content: 'Please validate this file as a bank statement.' }
        ],
        max_tokens: 200,
        temperature: 0.3,
      }),
    });

    const data = await response.json();

    if (!data?.choices?.[0]?.message?.content) {
      throw new Error("OpenAI response missing expected content.");
    }

    const validation = data.choices[0].message.content;

    console.log("OpenAI response:", validation);

    const isValid = validation.toLowerCase().includes('valid') && !validation.toLowerCase().includes('invalid');

    return new Response(JSON.stringify({
      isValid,
      explanation: validation
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in validate-bank-statement function:', error);
    return new Response(JSON.stringify({
      isValid: false,
      explanation: 'Error validating file. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
