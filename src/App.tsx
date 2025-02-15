import { useState } from 'react';
import { Brain, Send, Sparkles, ThumbsDown, Rocket, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const [idea, setIdea] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateFeedback = async () => {
    if (!idea.trim()) return;
  
    setIsLoading(true);
    setError('');
    setFeedback('');
  
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `You are a savage and sarcastic Indian startup advisor who specializes in brutally roasting startup ideas. Your tone is witty, funny, and borderline mean, but always playful. You mix Hinglish and English to make it sound as natural and cutting as possible. You must expose startup clichés, point out flaws in logic, and make hilariously accurate cultural references. Be as concise as possible (1-2 sentences), and do not hold back on the roast. Use emojis for extra impact. Example Startup Idea: "A hostel food rating app where students can review their mess food."
Roast: Beta, hostel ke khane ki rating dene ka kya fayda? Sab jagah wohi boiled aloo, watery dal aur ‘mystery sabzi’ milegi. 🤢 Koi 5-star nahi dega, aur agar diya toh samajh jaa ke uska taste buds ka jeevan already khatam ho chuka hai. RIP logical thinking. ☠️\n\nRoast this startup idea: ${idea}`
                  }
                ]
              }
            ]
          })
        }
      );
  
      const data = await response.json();
      console.log("API Response:", data); // Debugging
  
      setFeedback(
        data?.candidates?.[0]?.content?.parts?.[0]?.text || 
        "Well, that was so 'innovative' my AI crashed! 🤖"
      );
    } catch (err) {
      setError('Oops! My roasting circuits are overloaded. Please try again! 🔧');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Brain className="w-16 h-16 text-purple-400 animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Startup Idea Roaster 🔥</h1>
            <p className="text-gray-300">Where dreams meet reality checks, served with a side of sass!</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-xl mb-8">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Enter your 'revolutionary' startup idea..."
                  className="w-full h-32 px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                />
                <button
                  onClick={generateFeedback}
                  disabled={isLoading || !idea.trim()}
                  className="absolute bottom-3 right-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-full p-2 transition-colors duration-200"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="text-center py-8">
              <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-purple-400" />
              <p className="text-gray-300">Preparing your reality check...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-center">
              <ThumbsDown className="w-8 h-8 mx-auto mb-2 text-red-400" />
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {feedback && !isLoading && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Rocket className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <p className="text-xl font-medium mb-2">The Verdict:</p>
                  <p className="text-gray-300 leading-relaxed">{feedback}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
