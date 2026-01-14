import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { requirementChange, existingTestPlan, screenshot } = req.body;

    if (!requirementChange) {
      return res.status(400).json({ error: 'Requirement change is required' });
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Build the prompt for Claude
    const systemPrompt = `You are an expert QA engineer helping to update test plans based on requirement changes.

Your task is to:
1. Analyze the requirement change
2. Review the existing test plan context
3. Generate NEW test cases that are needed for the new requirements
4. Identify MODIFIED test cases (existing ones that need updates)

Return your response in this JSON format:
{
  "newTestCases": [
    {
      "id": "tc-new-1",
      "scenario": "Clear, specific test scenario",
      "steps": "1. First step\\n2. Second step\\n3. Third step with expected result",
      "ios": "",
      "android": "",
      "isNew": true,
      "isModified": false
    }
  ],
  "modifiedTestCases": [
    {
      "id": "tc-existing-id",
      "scenario": "Updated scenario description",
      "steps": "1. Updated step\\n2. Another step",
      "ios": "✅ #14204",
      "android": "",
      "isNew": false,
      "isModified": true
    }
  ]
}

Guidelines:
- Be SPECIFIC and DETAILED in scenarios and steps
- Reference actual feature names, UI elements, and behaviors
- Include clear expected results in steps
- For modified cases, explain what changed
- Each test should be actionable and testable
- Use proper formatting with numbered steps separated by \\n`;

    const userPrompt = `Requirement Change:
${requirementChange}

${existingTestPlan ? `Existing Test Plan Context:
${JSON.stringify(existingTestPlan, null, 2)}` : ''}

Please analyze this requirement change and generate appropriate test cases. Return ONLY valid JSON in the format specified.`;

    const messages = [
      {
        role: 'user',
        content: screenshot
          ? [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: screenshot.mimeType || 'image/png',
                  data: screenshot.base64Data,
                },
              },
              {
                type: 'text',
                text: userPrompt,
              },
            ]
          : userPrompt,
      },
    ];

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages,
    });

    // Extract the JSON from Claude's response
    const responseText = response.content[0].text;

    // Try to extract JSON if Claude wrapped it in markdown code blocks
    let jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) {
      jsonMatch = responseText.match(/```\n([\s\S]*?)\n```/);
    }

    const jsonText = jsonMatch ? jsonMatch[1] : responseText;
    const testCases = JSON.parse(jsonText);

    res.status(200).json({
      success: true,
      testCases: testCases,
      requirementChange: requirementChange,
    });
  } catch (error) {
    console.error('Test case generation error:', error);
    res.status(500).json({
      error: 'Failed to generate test cases',
      message: error.message,
      details: error.response?.data || error,
    });
  }
}
