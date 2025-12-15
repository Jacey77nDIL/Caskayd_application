"use client";

import { useState, useEffect, useRef } from "react";
import TopNavbar from "@/components/TopNavbar";
import { Search, Phone, Send, Paperclip, Mic, Smile, ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import { format, isToday, isYesterday } from "date-fns";
import { 
  getConversations, 
  getConversationDetail, 
  sendMessage, 
  markConversationAsRead 
} from "@/utils/api"; 

interface Message {
  id: number | string;
  sender: "me" | "other";
  text: string;
  time: string;
  day: string;
  status?: "sent" | "delivered" | "seen";
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[];
  timestamp: Date;
}

function formatDay(date: Date) {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMMM d, yyyy");
}

export default function WebCreatorChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "chat">("list");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- 1. Fetch Chats on Load ---
  useEffect(() => {
    async function fetchChats() {
      setIsLoading(true);
      const data = await getConversations();
      
      if (Array.isArray(data)) {
        const formattedChats = data.map((conv: any) => ({
          id: conv.id.toString(),
          name: conv.business_name || "Unknown Business",
          avatar: "/images/ethan.png",
          lastMessage: conv.last_message || "Start chatting",
          time: new Date(conv.last_message_time || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          timestamp: new Date(conv.last_message_time || Date.now()),
          unread: conv.unread_count || 0,
          messages: [],
        })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        
        setChats(formattedChats);
      }
      setIsLoading(false);
    }

    fetchChats();
  }, []);

  // --- 2. Scroll to bottom ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages]);

  // --- 3. Handle Select Chat ---
  const handleSelectChat = async (chat: Chat) => {
    setViewMode("chat");
    setIsLoadingMessages(true);
    
    setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unread: 0 } : c));

    const [detail] = await Promise.all([
      getConversationDetail(Number(chat.id)),
      markConversationAsRead(chat.id)
    ]);

    if (detail && detail.messages) {
      const formattedMessages = detail.messages.map((msg: any) => ({
        id: msg.id,
        sender: msg.sender_type === "creator" ? "me" : "other",
        text: msg.content,
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        day: formatDay(new Date(msg.created_at)),
        status: "read"
      }));

      setSelectedChat({
        ...chat,
        unread: 0,
        messages: formattedMessages
      });
    } else {
      setSelectedChat({ ...chat, messages: [] });
    }
    
    setIsLoadingMessages(false);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat) return;

    const tempId = Date.now();
    const now = new Date();

    const localMessage: Message = {
      id: tempId,
      sender: "me",
      text: messageInput,
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      day: formatDay(now),
      status: "sent",
    };

    setSelectedChat(prev => prev ? ({
      ...prev,
      messages: [...prev.messages, localMessage]
    }) : null);

    setMessageInput("");

    try {
      const res = await sendMessage(selectedChat.id, localMessage.text);
      if (res && res.id) {
        setSelectedChat(prev => prev ? ({
          ...prev,
          messages: prev.messages.map(m => m.id === tempId ? { ...m, id: res.id, status: "delivered" } : m)
        }) : null);
      }

      setChats(prev => prev.map(c => 
        c.id === selectedChat.id 
          ? { ...c, lastMessage: localMessage.text, time: localMessage.time, timestamp: now } 
          : c
      ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));

    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    // MAIN CONTAINER: Locked to screen height, no window scroll
    <main className="h-screen bg-white overflow-hidden flex flex-col">
      
      {/* 1. Navbar: Fixed height, does not shrink/grow */}
      
        <TopNavbar />
      

      {/* 2. Content Area: Takes remaining height, flex container */}
      <div className="flex-1 flex w-full overflow-hidden relative pt-20 md:pt-18">
        
        {/* --- LEFT SIDEBAR (Chats List) --- 
            - Always independent scroll 
            - Fixed width on desktop
        */}
        <aside
          className={`
            flex-col w-full md:w-[350px] lg:w-[400px] border-r border-gray-200 bg-white h-full
            ${viewMode === "list" ? "flex" : "hidden md:flex"}
          `}
        >
          {/* Header (Fixed) */}
          <div className="p-4 border-b border-gray-100 bg-white flex-none">
            <h2 className="text-xl font-bold text-[#823A5E] mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-100 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#823A5E]/20"
              />
            </div>
          </div>

          {/* List (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {isLoading ? (
              <div className="flex justify-center pt-10"><Loader2 className="animate-spin text-[#823A5E]" /></div>
            ) : filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChat(chat)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                    selectedChat?.id === chat.id ? "bg-[#823A5E]/10" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="relative flex-none">
                    <Image src={chat.avatar} alt={chat.name} width={48} height={48} className="rounded-full object-cover" />
                    {chat.unread > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#823A5E] rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="font-semibold text-gray-900 truncate">{chat.name}</p>
                      <span className="text-xs text-gray-400">{chat.time}</span>
                    </div>
                    <div className="flex justify-between items-center mt-0.5">
                      <p className={`text-sm truncate w-4/5 ${chat.unread > 0 ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                        {chat.lastMessage}
                      </p>
                      {chat.unread > 0 && (
                        <span className="bg-[#823A5E] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 pt-10 text-sm">No conversations found.</p>
            )}
          </div>
        </aside>

        {/* --- RIGHT PANE (Chat Window) --- 
            - Independent scroll for messages
        */}
        <section
          className={`
            flex-1 flex flex-col bg-[#F5F7FA] h-full
            ${viewMode === "chat" ? "flex absolute inset-0 z-50 md:static" : "hidden md:flex"}
          `}
        >
          {selectedChat ? (
            <>
              {/* Chat Header (Fixed) */}
              <div className="flex-none flex items-center gap-3 p-4 bg-white border-b border-gray-200 shadow-sm z-10">
                <button 
                  className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full"
                  onClick={() => { setViewMode("list"); setSelectedChat(null); }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <Image src={selectedChat.avatar} alt={selectedChat.name} width={40} height={40} className="rounded-full flex-none" />
                <div className="flex-1">
                  <p className="font-bold text-gray-900 leading-tight">{selectedChat.name}</p>
                  <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
                  </p>
                </div>
                <Phone className="w-5 h-5 text-gray-400 hover:text-[#823A5E] cursor-pointer" />
              </div>

              {/* Messages Area (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoadingMessages ? (
                  <div className="flex justify-center pt-10"><Loader2 className="animate-spin text-[#823A5E]" /></div>
                ) : (
                  selectedChat.messages.map((msg, idx) => {
                    const showDayDivider = idx === 0 || msg.day !== selectedChat.messages[idx - 1].day;
                    const isMe = msg.sender === "me";
                    
                    return (
                      <div key={msg.id}>
                        {showDayDivider && (
                          <div className="flex justify-center my-4">
                            <span className="px-3 py-1 text-[10px] font-medium rounded-full bg-gray-200 text-gray-600 uppercase tracking-wide">
                              {msg.day}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`
                              max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm relative group break-words
                              ${isMe 
                                ? "bg-[#823A5E] text-white rounded-br-none" 
                                : "bg-white text-gray-900 rounded-bl-none border border-gray-100"
                              }
                            `}
                          >
                            <p>{msg.text}</p>
                            <div className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${isMe ? "text-white/70" : "text-gray-400"}`}>
                              {msg.time}
                              {isMe && <span>{msg.status === "sent" ? "✓" : "✓✓"}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area (Fixed) */}
              <div className="flex-none p-4 bg-white border-t border-gray-200 flex items-center gap-3">
                <button className="p-2 text-gray-400 hover:text-[#823A5E] transition flex-none">
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="w-full pl-4 pr-10 py-3 rounded-full bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#823A5E]/20 transition-all"
                  />
                  <Smile className="absolute right-3 top-3 w-5 h-5 text-gray-400 cursor-pointer hover:text-[#823A5E]" />
                </div>
                {messageInput.trim() ? (
                  <button 
                    onClick={handleSendMessage} 
                    className="p-3 bg-[#823A5E] text-white rounded-full hover:bg-[#6d2e4f] shadow-lg transition transform hover:scale-105 flex-none"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                ) : (
                  <button className="p-3 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 flex-none">
                    <Mic className="w-5 h-5" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Send className="w-8 h-8 text-[#823A5E]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Your Messages</h3>
              <p className="text-gray-500 max-w-sm mt-2">
                Select a conversation from the list to start chatting with businesses.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}