const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
    const userMessage = req.body.message.toLowerCase();
    const lastBotMessage = req.body.lastBotMessage || '';

    try {
        // Welcome message handling
        if ((userMessage === 'hello' || userMessage === 'hi') && !lastBotMessage) {
            const botMessage = `👋 Welcome to Budget Buddy AI! I'm here to help you with financial advice. Feel free to ask me anything about:

1) Investing & Trading
2) Budgeting & Saving
3) Tax Planning
4) Retirement Planning
5) Debt Management`;
            
            return res.json({ botMessage });
        }

        // Handle menu selection
        if (userMessage === '#1' || userMessage === '1') {
            const botMessage = `Let me explain investing fundamentals.

Key Points:
• Stocks: Ownership shares in companies that offer potential for higher returns through growth
• Bonds: Fixed-income investments that provide regular interest payments with lower risk
• Investment Strategy: Your choice depends on your risk tolerance and time horizon

Would you like to focus on stocks or bonds?`;
            
            return res.json({ botMessage });
        }

        // Handle requests for multiple topics
        if ((userMessage.includes('both') || userMessage.includes('and')) && 
            (userMessage.includes('growth') && userMessage.includes('dividend'))) {
            const botMessage = `Let me explain both growth and dividend investing.

Key Points:
• Growth Stocks: Focus on companies with high revenue growth and market expansion potential
• Dividend Stocks: Established companies that provide regular cash payments to shareholders
• Balanced Approach: Combining both types can provide growth potential and steady income

Would you like to explore growth stocks or dividend stocks in more detail first?`;
            
            return res.json({ botMessage });
        }

        // Handle specific stock topics
        if (userMessage.includes('dividend')) {
            const botMessage = `Let me explain dividend investing.

Key Points:
• Dividend Yield: Regular cash payments as a percentage of stock price
• Company Quality: Focus on established companies with strong cash flows
• Reinvestment Power: Dividends can be reinvested to compound returns

Would you like to learn about specific dividend stocks or dividend investment strategies?`;
            
            return res.json({ botMessage });
        }

        if (userMessage.includes('growth')) {
            const botMessage = `Let me explain growth investing.

Key Points:
• Company Selection: Focus on businesses with high revenue and earnings growth
• Market Opportunity: Look for companies in expanding markets
• Valuation Methods: Understanding how to value high-growth companies

Which growth sectors interest you most: technology, healthcare, or clean energy?`;
            
            return res.json({ botMessage });
        }

        // General stock response
        if (userMessage.includes('stock') && !lastBotMessage.includes('Would you like to learn about growth stocks or dividend stocks?')) {
            const botMessage = `Let me explain stock investing.

Key Points:
• Growth Potential: Stocks offer higher potential returns through capital appreciation and dividends
• Market Analysis: Understanding company fundamentals and market trends is crucial
• Risk Management: Diversification across sectors helps minimize individual stock risk

Would you like to learn about growth stocks or dividend stocks?`;
            
            return res.json({ botMessage });
        }

        // Format the system prompt to enforce response structure
        const systemPrompt = `You are Budget Buddy AI, a friendly financial advisor chatbot.

CRITICAL INSTRUCTION: You must format ALL responses EXACTLY like this example, no exceptions:

Let me explain [topic].

Key Points:
• [First Point]: [One clear sentence]
• [Second Point]: [One clear sentence]
• [Third Point]: [One clear sentence]

[One follow-up question]?

Example of GOOD response:
Let me explain growth investing.

Key Points:
• Growth Stocks: Companies with high potential for capital appreciation and market expansion
• Risk Profile: Higher volatility but potential for greater long-term returns
• Diversification: Important to spread investments across different growth sectors

Which growth sector interests you most: technology, healthcare, or renewable energy?

Current Context:
Previous Message: "${lastBotMessage}"
User Message: "${userMessage}"

Response (follow format exactly):`;

        try {
            const response = await axios.post(
                'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
                {
                    inputs: systemPrompt,
                    parameters: {
                        max_new_tokens: 250,
                        temperature: 0.3,
                        top_p: 0.9,
                        repetition_penalty: 1.2,
                        do_sample: true,
                        stop: ["Current Context:", "Example", "CRITICAL"]
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.HF_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: 15000
                }
            );

            let botMessage = '';
            if (response.data && Array.isArray(response.data)) {
                botMessage = response.data[0].generated_text;
            } else if (response.data && typeof response.data === 'string') {
                botMessage = response.data;
            }

            // Clean up response and remove extra newlines
            botMessage = botMessage
                .replace(systemPrompt, '')
                .replace('Response (follow format exactly):', '')
                .replace('\n\n• ', '\n• ')
                .trim();

            // Force format if response doesn't match template
            if (!botMessage.includes('Key Points:')) {
                const topic = userMessage.includes('growth') ? 'growth investing' : 'investing';
                botMessage = `Let me explain ${topic}.

Key Points:
• Investment Strategy: Focus on companies with strong growth potential and market expansion
• Risk Management: Balance higher returns with appropriate risk tolerance levels
• Portfolio Approach: Diversify across different sectors to optimize growth opportunities

Which aspect of ${topic} would you like to explore further?`;
            }

            res.json({ botMessage });

        } catch (apiError) {
            console.error('API Error:', apiError.message);
            
            // Provide a fallback response based on the user's message
            const fallbackMessage = `Let me explain financial planning.

Key Points:
• Investment Basics: Understanding different investment types helps make informed decisions
• Risk Assessment: Evaluating your risk tolerance guides investment choices
• Strategy Development: Creating a balanced portfolio matches your financial goals

What specific aspect would you like to learn more about?`;

            res.json({ botMessage: fallbackMessage });
        }

    } catch (error) {
        console.error('Server Error:', error.message);
        res.status(500).json({ 
            error: 'I apologize, but I\'m having trouble right now. Please try again shortly.',
            retry: true
        });
    }
});

module.exports = router;
