
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
    const { transactionData, fileName, fileType, fileSize } = await req.json();
    
    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!);
    
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
    
    if (userError || !user) {
      throw new Error('Invalid user');
    }

    console.log('Analyzing transactions for user:', user.id);

    const systemPrompt = `You are a financial analyst AI. Analyze the bank statement data and provide insights.

Your response should be a JSON object with this exact structure:
{
  "totalInflow": number,
  "totalOutflow": number,
  "netFlow": number,
  "categories": [
    {
      "name": "Category Name",
      "amount": number,
      "percentage": number,
      "transactions": number
    }
  ],
  "monthlyTrends": [
    {
      "month": "MMM",
      "inflow": number,
      "outflow": number
    }
  ],
  "insights": [
    "Insight 1",
    "Insight 2"
  ],
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ]
}

Categorize transactions into logical groups like:
- Food & Dining
- Transportation
- Shopping
- Bills & Utilities
- Entertainment
- Healthcare
- Income
- Transfers
- Other

Provide actionable insights and recommendations based on spending patterns.`;

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
          { role: 'user', content: `Analyze this bank statement data: ${JSON.stringify(transactionData)}` }
        ],
        max_tokens: 1500,
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    let analysisResults;
    
    try {
      analysisResults = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback analysis
      analysisResults = {
        totalInflow: 0,
        totalOutflow: 0,
        netFlow: 0,
        categories: [],
        monthlyTrends: [],
        insights: ["Analysis completed with limited data"],
        recommendations: ["Upload a complete bank statement for better insights"]
      };
    }

    // Store the analysis in the database
    const { data: analysis, error: insertError } = await supabase
      .from('financial_analyses')
      .insert({
        user_id: user.id,
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize,
        analysis_status: 'completed',
        analysis_results: analysisResults,
        insights: analysisResults.insights || []
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting analysis:', insertError);
    }

    return new Response(JSON.stringify(analysisResults), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-transactions function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to analyze transactions',
      totalInflow: 0,
      totalOutflow: 0,
      netFlow: 0,
      categories: [],
      monthlyTrends: [],
      insights: ["Error occurred during analysis"],
      recommendations: ["Please try uploading your file again"]
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
