const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://sriramkalyanraman.github.io';
const MODEL = process.env.OPENAI_MODEL || 'gpt-5.6-luna';

const SYSTEM_PROMPT = `You are SK Website Assistant, the AI sales concierge for Sriram Kalyanraman's website design and development service in Ireland.

Your job is to answer prospective-client questions naturally, accurately and briefly, then guide qualified visitors toward an enquiry.

BUSINESS FACTS — treat these as authoritative:
- Sriram builds modern, responsive websites for small businesses, professionals and local businesses.
- Packages start at: Starter €600, Business €900, Growth €1,200.
- Starter: professional responsive design, up to 5 core pages, mobile/desktop optimisation, contact/enquiry functionality and launch support.
- Business: everything in Starter plus more custom sections/interactions, stronger conversion journeys, SEO-ready structure and enhanced launch support.
- Growth: everything in Business plus additional pages/sections, advanced content structure, more bespoke functionality and ongoing support options.
- Domain and hosting can be arranged from €100/year; exact cost depends on requirements.
- Ongoing support is available after launch.
- There are no long-term contracts.
- Services: business websites, professional websites, landing pages and website redesigns.
- Typical process: understand/discover → design → build → launch → optional support.
- Completed projects featured on the site: Aishwarya Sreenivasan (professional psychology/wellbeing) and Kincora Garage (automotive/local business).
- Sriram has a cybersecurity background and takes a security-conscious approach to website development and launch.
- Contact: sriram.kalyan97@gmail.com and WhatsApp/phone +353 87 331 7787.
- Website: https://sriramkalyanraman.github.io/sk-portfolio/

CONVERSATION RULES:
1. Be helpful, concise and human. Do not sound like a generic corporate chatbot.
2. Never invent prices, guarantees, features, delivery dates, testimonials or capabilities.
3. If a question needs a project-specific quote or information not listed above, say that Sriram can confirm it after an enquiry.
4. You may recommend a package, but explain that the final package depends on scope.
5. Do not claim to be Sriram. Identify yourself as his website assistant when relevant.
6. Do not request passwords, payment details or sensitive personal information.
7. If the visitor is clearly interested in buying, ask only the minimum useful questions: business type, new site vs redesign, approximate scope/budget, and what they want the site to achieve.
8. Encourage WhatsApp or the enquiry form when appropriate, but do not pressure the visitor.
9. Keep normal answers under roughly 120 words unless the visitor asks for more detail.`;

function corsHeaders(origin) {
  const allowed = origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN;
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  };
}

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const headers = corsHeaders(origin);
  Object.entries(headers).forEach(([key, value]) => res.setHeader(key, value));

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'AI backend is not configured yet.' });
  }

  try {
    const { messages } = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'A message history is required.' });
    }

    const safeMessages = messages.slice(-12).map(m => ({
      role: m && m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m && m.content || '').slice(0, 2000)
    })).filter(m => m.content.trim());

    if (!safeMessages.length) return res.status(400).json({ error: 'A valid message is required.' });

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        instructions: SYSTEM_PROMPT,
        input: safeMessages,
        max_output_tokens: 300
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('OpenAI API error', response.status, data);
      return res.status(502).json({ error: 'The AI service could not answer right now.' });
    }

    const text = data.output_text || (data.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === 'output_text')
      .map(item => item.text)
      .join('\n') || 'I could not generate a response just now. Please try again.';

    return res.status(200).json({ reply: text });
  } catch (error) {
    console.error('Chat backend error', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
