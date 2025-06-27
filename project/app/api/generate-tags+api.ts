export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return Response.json({ error: 'Text is required' }, { status: 400 });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    // Check if API key is missing or is a placeholder
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.warn('OpenAI API key not configured, using fallback tag generation');
      
      // Use fallback tag generation when API key is not configured
      const fallbackTags = generateFallbackTags(text);
      return Response.json({ tags: fallbackTags });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a social media content analyzer. Generate exactly 3 relevant hashtags for voice posts based on the content. 

Rules:
- Return only 3 hashtags
- No # symbol in response
- Use lowercase
- Focus on themes, emotions, and topics
- Make them discoverable and relevant
- Common voice post categories: deepthoughts, motivation, confession, philosophy, mindfulness, morning, energy, relationshipadvice, storytelling, wisdom, growth, reflection

Return only the 3 words separated by commas, nothing else.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: 50,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const tags = data.choices[0].message.content.trim().split(',').map((tag: string) => tag.trim());

    return Response.json({ tags: tags.slice(0, 3) });

  } catch (error) {
    console.error('Tag generation error:', error);
    
    // Always return JSON, never let the error bubble up as HTML
    try {
      const { text } = await request.json();
      const fallbackTags = generateFallbackTags(text);
      return Response.json({ tags: fallbackTags });
    } catch (parseError) {
      // If we can't even parse the request, return generic tags
      return Response.json({ 
        tags: ['mindfulness', 'reflection', 'storytelling'] 
      });
    }
  }
}

function generateFallbackTags(text: string): string[] {
  const lowerText = text.toLowerCase();
  const fallbackTags: string[] = [];
  
  // Keyword-based tag generation
  const tagMap = {
    'morning': ['morning', 'coffee', 'sunrise', 'wake'],
    'motivation': ['motivation', 'inspire', 'success', 'goal', 'achieve'],
    'deepthoughts': ['thought', 'philosophy', 'wonder', 'think', 'ponder'],
    'confession': ['confession', 'secret', 'admit', 'truth'],
    'energy': ['energy', 'positive', 'vibe', 'excited', 'happy'],
    'relationshipadvice': ['relationship', 'love', 'dating', 'partner', 'heart'],
    'mindfulness': ['mindful', 'peace', 'calm', 'meditation', 'zen'],
    'growth': ['growth', 'learn', 'improve', 'better', 'change'],
    'wisdom': ['wisdom', 'advice', 'experience', 'lesson'],
    'storytelling': ['story', 'tale', 'remember', 'once', 'happened']
  };

  // Check for keyword matches
  for (const [tag, keywords] of Object.entries(tagMap)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      fallbackTags.push(tag);
      if (fallbackTags.length >= 3) break;
    }
  }

  // Fill with generic tags if needed
  const genericTags = ['reflection', 'thoughts', 'voice', 'share', 'moment'];
  while (fallbackTags.length < 3) {
    const randomTag = genericTags[Math.floor(Math.random() * genericTags.length)];
    if (!fallbackTags.includes(randomTag)) {
      fallbackTags.push(randomTag);
    }
  }
  
  return fallbackTags.slice(0, 3);
}