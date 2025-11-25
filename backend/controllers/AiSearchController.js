import Restaurant from '../models/Restaurant.js';
import Order from '../models/Order.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('FATAL ERROR: GEMINI_API_KEY is not defined in .env file.');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const solveCraving = async (req, res) => {
  // ... (existing solveCraving code remains the same) ...
  const { craving } = req.query;

  if (!craving) {
    return res.status(400).json({ message: 'Craving query is required.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `A user in Bangalore, India is looking for food. Their craving is: "${craving}".
    Analyze this craving and suggest 3-5 specific, relevant dish names that would satisfy them.
    Focus on Indian and popular international cuisines.
    Return ONLY a valid JSON array of strings, like this: ["Dish Name 1", "Dish Name 2"]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      text = jsonMatch[1];
    }

    let suggestedDishes = [];

    try {
      suggestedDishes = JSON.parse(text);
    } catch (parseError) {
      console.error('AI response was not valid JSON after cleaning:', text);
      return res.status(500).json({ message: 'The AI returned an unexpected response. Please try a different craving.' });
    }

    if (!Array.isArray(suggestedDishes) || suggestedDishes.length === 0) {
      return res.json({ suggestedDishes: [], restaurants: [] });
    }

    const regex = suggestedDishes.map(dish => new RegExp(dish, 'i'));
    const restaurants = await Restaurant.find({
      'menuItems.name': { $in: regex },
    });

    res.json({ suggestedDishes, restaurants });
  } catch (error) {
    console.error('AI CRAVING SOLVER ERROR:', error);
    res.status(500).json({ message: 'Failed to solve craving. Please try again.' });
  }
};

const chatWithBot = async (req, res) => {
  const { message, history } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    if (message.toLowerCase().includes('order status')) {
      if (req.user) {
        const latestOrder = await Order.findOne({ user: req.user._id }).sort({ createdAt: -1 });
        if (latestOrder) {
          return res.json({ response: `Your latest order (ID: ${latestOrder._id}) was placed on ${new Date(latestOrder.createdAt).toLocaleDateString()}. Its current status is 'Preparing'.` });
        } else {
          return res.json({ response: "It looks like you haven't placed any orders yet." });
        }
      } else {
        return res.json({ response: "You need to be logged in for me to check your order status." });
      }
    }

    const systemInstructionText = `You are Toshi, a friendly, enthusiastic, and helpful foodie expert for a food delivery app called "ToshiTadka".
    Your personality is cheerful and you love emojis.
    Keep your answers concise and helpful (2-3 sentences max).
    If asked about order status, you must tell the user you can help if they are logged in.
    Do not answer questions unrelated to food, restaurants, or orders. If asked an unrelated question, politely steer the conversation back to food.`;

    let cleanedHistory = history || [];
    while (cleanedHistory.length > 0 && cleanedHistory[0].role !== 'user') {
      cleanedHistory.shift();
    }

    // --- THIS IS THE FIX ---
    // The systemInstruction parameter expects a structured Content object.
    const chat = model.startChat({
      history: cleanedHistory,
      systemInstruction: {
        parts: [{ text: systemInstructionText }],
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    
    res.json({ response: text });

  } catch (error) {
    console.error('CHATBOT ERROR:', error);
    res.status(500).json({ message: 'Chatbot is feeling a bit under the weather. Please try again.' });
  }
};

export { solveCraving, chatWithBot };

