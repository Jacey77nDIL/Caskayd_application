"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import PayStackPayment from "@/components/payment";
import Image from "next/image";
import { format, isToday, isYesterday } from "date-fns";
import { Phone, Send, Paperclip, Mic, Smile, ArrowLeft, Loader2 ,CreditCard} from "lucide-react";

// Import Central API
import { 
  getConversations, 
  getConversationDetail, 
  sendMessage, 
  markConversationAsRead, 
  getCampaigns 
} from "@/utils/api";

// --- TYPES ---
interface Message {
  id: number | string;
  sender: "me" | "other";
  text: string;
  time: string; // Display time (e.g. 10:30 AM)
  day: string;  // Display day (e.g. Today)
  status?: "sent" | "delivered" | "seen";
  timestamp: Date; // Actual date object for sorting
}

interface ChatPreview {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timeDisplay: string;
  unread: number;
  timestamp: Date;
}

interface Campaign {
  id: number;
  name: string;
  payment: boolean;
}

// --- HELPERS ---
function formatMessageTime(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatMessageDay(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMMM d, yyyy");
}

export default function WebMessages() {
  // State
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Initial Data Load
  useEffect(() => {
    async function initData() {
      setIsLoadingChats(true);
      
      // Parallel Fetch
      const [conversations, campaignsData] = await Promise.all([
        getConversations(),
        getCampaigns()
      ]);

      // Process Campaigns
      if (campaignsData.success) {
        const list = campaignsData.data.map((c: any) => ({
          id: c.id,
          name: c.title,
          payment: (c.budget || 0) > 0,
        }));
        setCampaigns(list);
        if (list.length > 0) setSelectedCampaign(list[0]);
      }

      // Process Chats
      if (Array.isArray(conversations)) {
        const formatted = conversations.map((c: any) => ({
          id: c.id.toString(),
          name: c.creator_email || "Unknown User", // Or creator_name if available
          avatar: "/images/rufus.png", // Placeholder until backend sends avatar
          lastMessage: c.last_message || "Start a conversation",
          timeDisplay: formatMessageTime(c.last_message_time),
          timestamp: new Date(c.last_message_time || Date.now()),
          unread: c.unread_count || 0,
        })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        
        setChats(formatted);
      }
      
      setIsLoadingChats(false);
    }

    initData();
  }, []);

// 2. Load Selected Chat Messages (With Real-Time Polling)
  useEffect(() => {
    if (!selectedChatId) return;

    let isMounted = true;

    // We define the fetcher function so we can reuse it
    async function loadChatDetails(isBackgroundPoll = false) {
      // Only show the big loading spinner on the very first load, not on background updates
      if (!isBackgroundPoll) setIsLoadingMessages(true);

      try {
        const data = await getConversationDetail(Number(selectedChatId));
        
        if (isMounted && data && data.messages) {
          // Map messages
          const mappedMsgs: Message[] = data.messages.map((m: any) => ({
            id: m.id,
            sender: m.sender_type === "business" ? "me" : "other",
            text: m.content,
            time: formatMessageTime(m.created_at),
            day: formatMessageDay(m.created_at),
            timestamp: new Date(m.created_at),
            status: "read",
          }));

          setMessages(mappedMsgs);

          // Mark as read logic (Keep this lightweight or move it out of the poll if needed)
          if (!isBackgroundPoll) {
             setChats(prev => prev.map(c => c.id === selectedChatId ? { ...c, unread: 0 } : c));
             await markConversationAsRead(selectedChatId);
          }
        }
      } catch (error) {
        console.error("Polling error", error);
      } finally {
        if (isMounted && !isBackgroundPoll) setIsLoadingMessages(false);
      }
    }

    // A. Initial Load (Shows Spinner)
    loadChatDetails();

    // B. Set Interval to Poll every 3 seconds (No Spinner)
    const intervalId = setInterval(() => {
      loadChatDetails(true); 
    }, 3000); 

    // C. Cleanup on Unmount or when Chat ID changes
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [selectedChatId]);

  // 3. Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handlers
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChatId) return;

    const tempId = Date.now();
    const now = new Date();
    
    // Optimistic UI Update
    const newMessage: Message = {
      id: tempId,
      sender: "me",
      text: messageInput,
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      day: "Today",
      timestamp: now,
      status: "sent",
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageInput("");

    try {
      const res = await sendMessage(selectedChatId, newMessage.text);
      // Update ID with server ID if needed
      setMessages(prev => prev.map(m => m.id === tempId ? { ...m, id: res.id, status: "delivered" } : m));
    } catch (err) {
      console.error("Message failed", err);
      // Ideally show error state on message
    }
  };

  const activeChat = chats.find(c => c.id === selectedChatId);
  const filteredChats = chats.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:flex-row md:ml-64 w-full h-full">
        
        {/* LEFT SIDEBAR (List) */}
        <aside className={`
          bg-white border-r border-gray-200 flex flex-col w-full md:w-1/3 h-full
          ${selectedChatId ? "hidden md:flex" : "flex"}
        `}>
          {/* Campaigns Filter */}
          <div className="p-4 border-b border-gray-100 flex-shrink-0">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Campaigns</h2>
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin">
              {campaigns.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCampaign(c)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedCampaign?.id === c.id
                      ? "bg-[#823A5E] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto p-4">
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full mb-4 px-4 py-2 rounded-xl bg-gray-100 text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#823A5E]/20"
            />
            
            {isLoadingChats ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gray-400" /></div>
            ) : (
              <div className="space-y-2">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChatId(chat.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      selectedChatId === chat.id ? "bg-[#823A5E]/10 border border-[#823A5E]/20" : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <Image src={chat.avatar} alt={chat.name} width={48} height={48} className="rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <p className="font-semibold text-gray-900 truncate">{chat.name}</p>
                        <span className="text-xs text-gray-500">{chat.timeDisplay}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500 truncate w-4/5">{chat.lastMessage}</p>
                        {chat.unread > 0 && (
                          <span className="bg-[#823A5E] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT CHAT WINDOW */}
        <section className={`
          flex-col h-full flex-1 bg-white
          ${selectedChatId ? "flex" : "hidden md:flex"}
        `}>
          {selectedChatId && activeChat ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedChatId(null)} className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <Image src={activeChat.avatar} alt={activeChat.name} width={40} height={40} className="rounded-full" />
                  <div>
                    <h3 className="font-bold text-gray-900">{activeChat.name}</h3>
                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
                    </p>
                  </div>
                </div>
                
               <button 
  onClick={() => setShowPaymentModal(true)} 
  className="bg-[#823A5E] text-white text-sm font-medium p-2 md:px-4 md:py-2 rounded-lg hover:bg-[#6d2e4f] shadow-sm transition-transform active:scale-95 flex items-center gap-2"
  title="Make Payment" // Tooltip for mobile users
>
  <CreditCard className="w-5 h-5" />
  <span className="hidden md:inline">Make Payment</span>
</button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-6">
                {isLoadingMessages ? (
                  <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gray-400" /></div>
                ) : (
                  messages.map((msg, index) => {
                    const isNewDay = index === 0 || msg.day !== messages[index - 1].day;
                    const isMe = msg.sender === "me";
                    return (
                      <div key={msg.id}>
                        {isNewDay && (
                          <div className="flex justify-center mb-4">
                            <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
                              {msg.day}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm text-sm relative group ${
                            isMe ? "bg-[#823A5E] text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                          }`}>
                            <p>{msg.text}</p>
                            <div className={`text-[10px] mt-1 text-right opacity-70 ${isMe ? "text-pink-100" : "text-gray-400"}`}>
                              {msg.time} {isMe && (msg.status === "sent" ? "✓" : "✓✓")}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
                <button className="p-2 text-gray-400 hover:text-[#823A5E] transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type your message..."
                    className="w-full bg-gray-100 text-gray-900 rounded-full px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-[#823A5E]/20"
                  />
                  <button className="absolute right-3 top-2.5 text-gray-400 hover:text-[#823A5E]">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                {messageInput.trim() ? (
                  <button onClick={handleSendMessage} className="p-2.5 bg-[#823A5E] text-white rounded-full hover:bg-[#6d2e4f] shadow-md transition-transform hover:scale-105">
                    <Send className="w-5 h-5" />
                  </button>
                ) : (
                  <button className="p-2.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
                    <Mic className="w-5 h-5" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-center p-8">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <Send className="w-8 h-8 text-[#823A5E]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Your Messages</h3>
              <p className="text-gray-500 max-w-sm mt-2">
                Select a chat from the left to view conversations with creators regarding your campaigns.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)} />
          <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <PayStackPayment onClose={() => setShowPaymentModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}