import { useState } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmergencyModal } from "@/components/modals/emergency-modal";
import { MessageSquare, Send, User, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSupportAgents, startChatSession, sendChatMessage } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

export default function SupportPage() {
  const [message, setMessage] = useState("");
  const [chatSession, setChatSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Get available support agents
  const { data: supportAgents, isLoading, error } = useQuery({
    queryKey: ['supportAgents'],
    queryFn: getSupportAgents,
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to load support agents. Please try again later.",
        variant: "destructive"
      });
    }
  });

  const handleStartChat = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to start a chat session.",
        variant: "destructive"
      });
      return;
    }

    try {
      const session = await startChatSession(user.id);
      setChatSession(session.id);
      setMessages([{
        id: '1',
        text: 'Hello! How can I help you today?',
        sender: 'agent',
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Failed to start chat session:', error);
      toast({
        title: "Error",
        description: "Failed to start chat session. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !chatSession) return;

    try {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: 'user',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newMessage]);
      setMessage("");

      // Send message to server
      await sendChatMessage(chatSession, message);

      // Simulate agent response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: 'Thank you for your message. An agent will respond shortly.',
          sender: 'agent',
          timestamp: new Date()
        }]);
      }, 1000);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary pb-20">
        <AppHeader title="Chat Support" />
        <main className="pt-20 px-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary pb-20">
        <AppHeader title="Chat Support" />
        <main className="pt-20 px-4">
          <div className="text-white/60 text-center">
            Failed to load support agents. Please try again later.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary pb-20">
      <AppHeader title="Chat Support" />

      <main className="pt-20 px-4">
        <div className="space-y-6">
          {/* Support Agents Card */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl border-none">
            <CardContent className="p-4">
              <h2 className="text-white font-semibold text-lg mb-3">Available Support Agents</h2>
              <div className="space-y-3">
                {supportAgents && supportAgents.length > 0 ? (
                  supportAgents.map((agent) => (
                    <div key={agent.id} className="flex items-center bg-white/5 p-3 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm">{agent.name}</h3>
                        <p className="text-white/60 text-xs">{agent.specialty}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-secondary/20 text-secondary rounded-full p-2"
                        onClick={handleStartChat}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-white/60 text-center py-4">
                    No support agents available at the moment
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chat Window */}
          {chatSession && (
            <Card className="bg-white/10 backdrop-blur-sm rounded-xl border-none">
              <CardContent className="p-4">
                <div className="flex flex-col h-[400px]">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            msg.sender === 'user'
                              ? 'bg-secondary text-white'
                              : 'bg-white/20 text-white'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <div className="flex items-center text-white/40 text-xs mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {msg.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 bg-white/20 rounded-lg px-4 py-3 text-white border border-white/10 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button
                      className="bg-secondary text-white rounded-lg px-4 py-3"
                      onClick={handleSendMessage}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Navbar />
      <EmergencyModal />
    </div>
  );
} 