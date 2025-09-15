import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../features/auth/authSlice';
import useAIStore from '../features/ai/aiSlice';
import logoSrc from '../assets/logo-main.png';

const AICompanionPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { history, isLoading, isError, message, sendMessage, reset } = useAIStore();
  const [currentMessage, setCurrentMessage] = useState('');
  const chatEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      toast.error('You must be logged in to chat with Sathi.');
      navigate('/login');
    }
    return () => {
      reset();
    };
  }, [user, navigate, reset]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isLoading]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || isLoading) return;

    const newMessage = {
      role: 'user' as const,
      parts: [{ text: currentMessage }],
    };

    const newHistory = [...history, newMessage];
    useAIStore.setState({ history: newHistory });
    setCurrentMessage('');

    if (user?.token) {
      await sendMessage(newHistory, user.token);
    }
  };

  return (
    <div className="flex h-[calc(100vh-81px)] flex-col bg-gradient-to-br from-pastel-purple via-brand-cream to-pastel-pink bg-[length:200%_200%] animate-gradient-pan">
      <div className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl space-y-4">
          {history.length === 0 && (
            <div className="text-center p-8">
                <img src={logoSrc} alt="Sathi.care Logo" className="mx-auto h-16 w-auto" />
                <h1 className="mt-4 text-3xl font-bold text-brand-charcoal">Hello, I'm Sathi.</h1>
                <p className="mt-2 text-gray-600">Your AI companion for moments when you just need to talk.</p>
            </div>
          )}

          {history.map((turn, index) => (
            <div key={index} className={`flex items-end gap-2 ${turn.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {turn.role === 'model' && <img src={logoSrc} alt="Sathi" className="h-8 w-8 rounded-full" />}
              <div className={`max-w-lg rounded-2xl px-4 py-3 shadow ${turn.role === 'user' ? 'bg-pastel-pink text-white' : 'bg-white/80 text-brand-charcoal'}`}>
                <p className="text-sm whitespace-pre-wrap">{turn.parts[0].text}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
              <img src={logoSrc} alt="Sathi" className="h-8 w-8 rounded-full" />
              <div className="max-w-lg rounded-2xl px-4 py-3 shadow bg-white/80 text-brand-charcoal">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-pastel-purple [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-pastel-purple [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-pastel-purple"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="p-4 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSendMessage} className="flex items-center gap-4">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type your message here..."
              disabled={isLoading}
              className="flex-grow rounded-full border-gray-300 px-4 py-2 shadow-sm focus:border-pastel-purple focus:ring-pastel-purple"
            />
            <button type="submit" disabled={isLoading || !currentMessage.trim()} className="rounded-full bg-pastel-pink p-3 text-white shadow-lg transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:bg-pastel-pink/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
          <p className="mt-2 text-center text-xs text-gray-500">
            Disclaimer: Sathi is an AI companion and not a replacement for professional therapy or psychiatric advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AICompanionPage;