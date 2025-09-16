"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { Search, Phone, Send, Paperclip, Mic, Smile, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { format, isToday, isYesterday } from "date-fns";

// ---- MOCK DATA ----
const mockCampaigns = [
  { id: 1, name: "New Product Launch", payment: true },
  { id: 2, name: "Summer Promo", payment: true },
  { id: 3, name: "Brand Collab", payment: false },
];

const mockChats = [
  {
    id: "1",
    name: "Ethan Lue",
    avatar: "/images/ethan.png",
    lastMessage: "Pay me double",
    time: "12:15",
    unread: 3,
    seen: false,
    messages: [
      { id: 1, sender: "other", text: "I can handle it.", time: "14:00", day: "Yesterday" },
      { id: 2, sender: "me", text: "Okay", time: "14:02", day: "Yesterday", status: "seen" },
      { id: 3, sender: "other", text: "You’re on board", time: "09:02", day: "Today" },
    ],
  },
  {
    id: "2",
    name: "Rufus",
    avatar: "/images/rufus.png",
    lastMessage: "Type shit",
    time: "11:05",
    unread: 0,
    seen: true,
    messages: [
      { id: 1, sender: "other", text: "Yo!", time: "10:00", day: "Today" },
      { id: 2, sender: "me", text: "Hey bro 👋", time: "10:05", day: "Today", status: "seen" },
    ],
  },
  {
    id: "3",
    name: "Christiana Perry",
    avatar: "/images/christiana.png",
    lastMessage: "The last ad you made was splendid!",
    time: "11:04",
    unread: 0,
    seen: true,
    messages: [
      { id: 1, sender: "other", text: "The last ad you made was splendid!", time: "11:00", day: "Today" },
      { id: 2, sender: "me", text: "Thank you ❤️", time: "11:02", day: "Today", status: "seen" },
    ],
  },
];

function formatDay(date: Date) {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMMM d, yyyy");
}

export default function WebCreatorChatPage() {
  const [chats, setChats] = useState(mockChats);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [selectedCampaign, setSelectedCampaign] = useState(mockCampaigns[0]);
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReactions, setShowReactions] = useState<{ [key: number]: boolean }>({});
  const [loadingOlder, setLoadingOlder] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Sort chat list by most recent activity
  useEffect(() => {
    setChats((prev) =>
      [...prev].sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
      )
    );
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages]);

  // Simulate typing indicator for demo
  useEffect(() => {
    if (selectedChat?.id === "1") {
      setIsTyping(true);
      const timeout = setTimeout(() => setIsTyping(false), 3000);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [selectedChat]);

  // Handle selecting a chat → reset unread
  const handleSelectChat = (chat: any) => {
    setSelectedChat({ ...chat, unread: 0 });
    setChats((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, unread: 0 } : c))
    );
  };

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: messageInput,
      time,
      day: formatDay(now),
      status: "sent",
    };

    const updatedChats = chats.map((chat) =>
      chat.id === selectedChat.id
        ? {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: messageInput,
            time,
          }
        : chat
    );

    setChats(updatedChats);

    setSelectedChat((prev: any) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      lastMessage: messageInput,
      time,
    }));

    setMessageInput("");

    // Simulate delivery and seen
    setTimeout(() => {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === selectedChat.id
            ? {
                ...chat,
                messages: chat.messages.map((m) =>
                  m.id === newMessage.id ? { ...m, status: "delivered" } : m
                ),
              }
            : chat
        )
      );
    }, 1000);

    setTimeout(() => {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === selectedChat.id
            ? {
                ...chat,
                messages: chat.messages.map((m) =>
                  m.id === newMessage.id ? { ...m, status: "seen" } : m
                ),
              }
            : chat
        )
      );
    }, 2000);
  };

  // Handle emoji select (demo only)
  const handleEmojiSelect = (emoji: string) => {
    setMessageInput((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Handle reaction
  const toggleReaction = (msgId: number) => {
    setShowReactions((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  // Infinite scroll mock
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    if (messagesContainerRef.current.scrollTop === 0 && !loadingOlder) {
      setLoadingOlder(true);
      setTimeout(() => {
        const olderMessage = {
          id: Date.now(),
          sender: "other",
          text: "This is an older message (loaded via infinite scroll).",
          time: "08:00",
          day: "Yesterday",
        };
        setSelectedChat((prev: any) => ({
          ...prev,
          messages: [olderMessage, ...prev.messages],
        }));
        setLoadingOlder(false);
      }, 1500);
    }
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-black text-white bg-[url('/images/backgroundImage.png')] bg-cover bg-center">
      <Navbar />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar */}
        <aside className="w-1/3 bg-[#ffff] border-r border-gray-700 flex flex-col">
          {/* Campaigns */}
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Campaigns</h2>
            <div className="flex gap-2 overflow-x-auto">
              {mockCampaigns.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCampaign(c)}
                  className={`px-3 py-2 rounded-xl cursor-pointer whitespace-nowrap ${
                    selectedCampaign.id === c.id
                      ? "bg-[#823A5E] text-white"
                      : "bg-gray-700 text-gray-200"
                  }`}
                >
                  {c.payment && (
                    <span className="text-xs bg-purple-300 text-purple-800 px-2 py-0.5 rounded-full mr-2">
                      Payment
                    </span>
                  )}
                  {c.name}
                </div>
              ))}
            </div>
          </div>

          {/* Chats */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <h2 className="text-lg font-semibold mb-2 text-black">Chats</h2>
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded-lg bg-[#aaa] text-white text-sm focus:outline-none"
            />
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                  selectedChat?.id === chat.id ? "bg-[#7a7373]" : "hover:bg-[#a3a3a3]"
                }`}
              >
                <Image
                  src={chat.avatar}
                  alt={chat.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium text-black">{chat.name}</p>
                  <p className="text-xs text-[#4d4d4d] truncate">{chat.lastMessage}</p>
                </div>
                <div className="text-right text-xs text-gray-400">
                  <p>{chat.time}</p>
                  {chat.unread > 0 && (
                    <span className="bg-[#896574] text-white text-[10px] px-2 py-1 rounded-full">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Chat Pane */}
        <section className="flex-1 flex flex-col bg-[#ffffff]">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <Image
                    src={selectedChat.avatar}
                    alt={selectedChat.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-black">{selectedChat.name}</p>
                    <p className="text-xs text-gray-400">
                      {isTyping ? "Typing..." : `Last seen ${selectedChat.time}`}
                    </p>
                  </div>
                </div>
                <Phone className="w-5 h-5 text-black cursor-pointer" aria-label="Call" />
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-4"
                ref={messagesContainerRef}
                onScroll={handleScroll}
              >
                {loadingOlder && (
                  <p className="text-center text-gray-500 text-sm">Loading older messages...</p>
                )}
                {selectedChat.messages.map((msg: any, idx: number) => {
                  const showDayDivider =
                    idx === 0 || msg.day !== selectedChat.messages[idx - 1].day;

                  return (
                    <div key={msg.id}>
                      {showDayDivider && (
                        <div className="text-center my-2">
                          <span className="px-3 py-1 text-xs rounded-full bg-[#896574] text-[#5E3345]">
                            {msg.day}
                          </span>
                        </div>
                      )}
                      <div
                        className={`flex ${
                          msg.sender === "me" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`relative max-w-xs px-3 py-2 rounded-lg text-sm ${
                            msg.sender === "me"
                              ? "bg-[#823A5E] text-white"
                              : "bg-gray-700 text-white"
                          }`}
                          onClick={() => toggleReaction(msg.id)}
                        >
                          {msg.text}
                          <div className="text-[10px] text-gray-300 mt-1 text-right flex items-center justify-end gap-1">
                            {msg.time}
                            {msg.sender === "me" && (
                              <span>
                                {msg.status === "sent" && "✓"}
                                {msg.status === "delivered" && "✓✓"}
                                {msg.status === "seen" && (
                                  <span className="text-blue-400">✓✓</span>
                                )}
                              </span>
                            )}
                          </div>
                          {showReactions[msg.id] && (
                            <div className="absolute -top-8 left-0 flex gap-2 bg-gray-900 p-1 rounded-lg shadow">
                              <button onClick={() => handleEmojiSelect("👍")}>👍</button>
                              <button onClick={() => handleEmojiSelect("😂")}>😂</button>
                              <button onClick={() => handleEmojiSelect("❤️")}>❤️</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Composer */}
              <div className="p-4 border-t border-gray-700 flex items-center gap-3">
                <Paperclip className="w-5 h-5 text-black cursor-pointer" />
                <Smile
                  className="w-5 h-5 text-black cursor-pointer"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                />
                {showEmojiPicker && (
                  <div className="absolute bottom-16 left-1/2 bg-gray-900 p-2 rounded-lg flex gap-2">
                    <button onClick={() => handleEmojiSelect("😀")}>😀</button>
                    <button onClick={() => handleEmojiSelect("😂")}>😂</button>
                    <button onClick={() => handleEmojiSelect("❤️")}>❤️</button>
                    <button onClick={() => handleEmojiSelect("👍")}>👍</button>
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Say something"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 px-4 py-2 rounded-2xl bg-[#333333] text-white focus:outline-none"
                />
                {messageInput.trim() === "" ? (
                  <Mic className="w-5 h-5 text-black cursor-pointer" />
                ) : (
                  <button
                    onClick={handleSendMessage}
                    className="bg-[#823A5E] p-2 rounded-full hover:bg-[#9c4d73]"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

