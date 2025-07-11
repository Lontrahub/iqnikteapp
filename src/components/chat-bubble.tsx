
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperPlaneRight, X, CircleNotch } from 'phosphor-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { MessageData } from 'genkit';

import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { answerUserQuery } from '@/ai/flows/recommend-medicinal-plants';
import { GeminiStar } from './icons/gemini-star';
import { cn } from '@/lib/utils';
import { useAuth } from './../hooks/use-auth';

type ChatMessage = {
  role: 'user' | 'model';
  content: string;
};

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
        role: 'model',
        content: "Hello! I am a guide to the world of Mayan medicinal plants. Ask me about a plant, describe your symptoms, or let me know what you'd like to learn about today."
    }
  ]);
  const [input, setInput] = useState('');
  const { toast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map((msg): MessageData => ({
          role: msg.role,
          content: [{ text: msg.content }],
        }));

      const result = await answerUserQuery({ query: input, history });
      
      if (result && result.answer) {
        const modelMessage: ChatMessage = { role: 'model', content: result.answer };
        setMessages((prev) => [...prev, modelMessage]);
      } else {
        throw new Error("No answer received from AI.");
      }

    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to get an answer. Please try again later.',
      });
       const errorMessage: ChatMessage = { role: 'model', content: "I'm sorry, I couldn't process that. Please try asking in a different way." };
       setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);


  const hiddenPaths = [
    '/admin',
    '/',
    '/language-selection',
    '/forgot-password',
    '/login',
    '/register'
  ];

  if (isClient && typeof window !== 'undefined' && hiddenPaths.some(path => window.location.pathname.startsWith(path))) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 z-50"
          >
            <Card className="w-[350px] h-[500px] flex flex-col shadow-2xl border-2">
              <CardHeader className="flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <GeminiStar className="w-8 h-8 text-primary" />
                  <div>
                    <CardTitle className="font-serif text-xl">Mayan Guide</CardTitle>
                    <CardDescription>Ask me anything!</CardDescription>
                  </div>
                </div>
                 <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 pr-3">
                {messages.map((msg, index) => (
                  <div key={index} className={cn("flex items-start gap-2", msg.role === 'user' ? "justify-end" : "justify-start")}>
                    {msg.role === 'model' && <GeminiStar className="w-6 h-6 text-primary flex-shrink-0 mt-1" />}
                    <div className={cn(
                      "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                      msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                       <div className="prose prose-sm dark:prose-invert max-w-none">
                         <Markdown remarkPlugins={[remarkGfm]}>{msg.content}</Markdown>
                       </div>
                    </div>
                  </div>
                ))}
                 {isLoading && (
                  <div className="flex items-start gap-2 justify-start">
                    <GeminiStar className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div className="bg-muted rounded-lg px-3 py-2">
                       <CircleNotch className="h-5 w-5 animate-spin" />
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isLoading}
                  />
                  <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                    <PaperPlaneRight className="h-5 w-5" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button onClick={() => setIsOpen(!isOpen)} size="icon" className="rounded-full w-16 h-16 shadow-lg bg-primary hover:bg-primary/90">
          <AnimatePresence mode="wait">
          {isOpen ? (
             <motion.div key="close" initial={{opacity: 0, rotate: -90}} animate={{opacity: 1, rotate: 0}} exit={{opacity: 0, rotate: 90}}>
                <X className="h-8 w-8 text-primary-foreground" />
             </motion.div>
          ) : (
             <motion.div key="open" initial={{opacity: 0, rotate: 90}} animate={{opacity: 1, rotate: 0}} exit={{opacity: 0, rotate: -90}}>
                <GeminiStar className="h-8 w-8 text-primary-foreground" />
            </motion.div>
          )}
          </AnimatePresence>
        </Button>
      </motion.div>
    </>
  );
}
