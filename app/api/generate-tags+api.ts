export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return Response.json({ error: 'Text is required' }, { status: 400 });
    }

    // Since we're removing OpenAI integration, use fallback tag generation
    console.log('Using fallback tag generation for text:', text.substring(0, 50) + '...');
    
    const fallbackTags = generateFallbackTags(text);
    return Response.json({ tags: fallbackTags });

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