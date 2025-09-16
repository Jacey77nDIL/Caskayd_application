"use client";

import React, { useEffect, useRef, useState } from "react";
import TopNavbar from "@/components/TopNavbar";

type ChatMessage = {
  id: string;
  user: string;
  text?: string;
  image?: string;
  ts: number;
};

export default function WebCreatorChatPage() {
  const [username] = useState(() => `User${Math.floor(Math.random() * 900 + 100)}`);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const now = Date.now();
    return [
      { id: "m1", user: "Spotify", text: "Pay me double", ts: now - 1000 * 60 * 60 * 4 },
      { id: "m2", user: "mail.ua", text: "Type shit", ts: now - 1000 * 60 * 60 * 3 },
      { id: "m3", user: "Spotify", text: "Okay", ts: now - 1000 * 60 * 60 * 24 },
      { id: "m4", user: username, text: "I can handle it.", ts: now - 1000 * 60 * 60 * 24 + 1000 * 60 },
      { id: "m5", user: username, text: "Thank you ❤", ts: now - 1000 * 60 * 5 },
    ];
  });

  const [activeChat, setActiveChat] = useState<string>("Spotify");
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});
  const [onlineUsers, setOnlineUsers] = useState<Record<string, number>>({});
  const bcRef = useRef<BroadcastChannel | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const post = (payload: any) => bcRef.current?.postMessage(payload);

  useEffect(() => {
    const bc = new BroadcastChannel("caskayd-chat-channel");
    bcRef.current = bc;

    post({ type: "presence", action: "join", user: username, ts: Date.now() });

    bc.onmessage = (ev) => {
      const data = ev.data;
      if (!data?.type) return;

      if (data.type === "message") {
        setMessages((prev) => {
          if (prev.some((m) => m.id === data.message.id)) return prev;
          return [...prev, data.message].sort((a, b) => a.ts - b.ts);
        });
      }

      if (data.type === "typing" && data.user !== username) {
        setIsTyping((prev) => {
          const next = { ...prev };
          if (data.typing) next[data.user] = true;
          else delete next[data.user];
          return next;
        });
      }

      if (data.type === "presence") {
        setOnlineUsers((prev) => {
          const next = { ...prev };
          if (data.action === "join" || data.action === "heartbeat") {
            next[data.user] = data.ts;
          } else if (data.action === "leave") {
            delete next[data.user];
          }
          return next;
        });
      }
    };

    const heartbeat = setInterval(() => {
      post({ type: "presence", action: "heartbeat", user: username, ts: Date.now() });
    }, 5000);

    const beforeUnload = () => {
      post({ type: "presence", action: "leave", user: username, ts: Date.now() });
    };
    window.addEventListener("beforeunload", beforeUnload);

    return () => {
      clearInterval(heartbeat);
      window.removeEventListener("beforeunload", beforeUnload);
      post({ type: "presence", action: "leave", user: username, ts: Date.now() });
      bc.close();
      bcRef.current = null;
    };
  }, [username]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setTimeout(() => {
      el.scrollTop = el.scrollHeight;
    }, 50);
  }, [messages, activeChat]);

  const sendMessage = (payload: { text?: string; image?: string }) => {
    if (!payload.text && !payload.image) return;
    const msg: ChatMessage = {
      id: `${username}-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      user: username,
      text: payload.text,
      image: payload.image,
      ts: Date.now(),
    };
    setMessages((prev) => [...prev, msg].sort((a, b) => a.ts - b.ts));
    post({ type: "message", message: msg });
  };

  const handleFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => sendMessage({ image: e.target?.result as string });
    reader.readAsDataURL(file);
  };

  const typingTimeoutRef = useRef<number | null>(null);
  const handleTextChange = (v: string) => {
    setText(v);
    post({ type: "typing", user: username, typing: true, ts: Date.now() });
    if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = window.setTimeout(() => {
      post({ type: "typing", user: username, typing: false, ts: Date.now() });
    }, 1200);
  };

  const fmtTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const typingUsers = Object.keys(isTyping).filter((u) => u !== username);

  const onlineList = React.useMemo(() => {
    const items = { ...onlineUsers };
    items[username] = Date.now();
    return Object.keys(items).sort();
  }, [onlineUsers, username]);

  // group messages by user
  const chats = React.useMemo(() => {
    const grouped: Record<string, ChatMessage[]> = {};
    for (const m of messages) {
      if (m.user === username) continue;
      if (!grouped[m.user]) grouped[m.user] = [];
      grouped[m.user].push(m);
    }
    return grouped;
  }, [messages, username]);

  return (
    <div className="h-screen flex flex-col bg-white">
      <TopNavbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/3 border-r flex flex-col bg-gray-50">
          <div className="p-4">
            <div className="flex items-center bg-[#f3e9ec] rounded-lg px-3 py-2">
              <span className="text-gray-500 mr-2">🔍</span>
              <input className="bg-transparent outline-none flex-1 text-sm" placeholder="Search" />
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {Object.entries(chats).map(([user, msgs]) => {
              const last = msgs[msgs.length - 1];
              const unread = last && last.user !== username;
              return (
                <div
                  key={user}
                  onClick={() => setActiveChat(user)}
                  className={`flex items-center justify-between p-3 cursor-pointer hover:bg-purple-50 ${
                    activeChat === user ? "bg-purple-100" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white">
                      {user[0]}
                    </div>
                    <div>
                      <div className="font-medium">{user}</div>
                      <div className="text-xs text-gray-500 max-w-[180px] truncate">
                        {last?.text || (last?.image ? "Image" : "")}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">{last ? fmtTime(last.ts) : ""}</div>
                    {unread && (
                      <div className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full mt-1">
                        1
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t bg-white">
            <div className="text-xs text-gray-500 mb-2">Online</div>
            <div className="flex space-x-2 flex-wrap">
              {onlineList.map((u) => (
                <div key={u} className="text-xs px-2 py-1 bg-white rounded-md shadow-sm">
                  {u === username ? `${u} (you)` : u}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat window */}
        <div className="flex-1 flex flex-col">
          {activeChat ? (
            <>
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white">
                    {activeChat[0]}
                  </div>
                  <div>
                    <div className="font-semibold">{activeChat}</div>
                    <div className="text-xs text-gray-500">
                      Last seen {fmtTime(Date.now() - 1000 * 60 * 12)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-xs text-gray-500 mr-2">
                    You: <span className="font-medium">{username}</span>
                  </div>
                  <button className="px-3 py-1 rounded-md border">📞</button>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-auto p-6 space-y-4 bg-white">
                {messages
                  .filter((m) => m.user === activeChat || m.user === username)
                  .map((m) => {
                    const mine = m.user === username;
                    return (
                      <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`${
                            mine ? "bg-[#5A3355] text-white" : "bg-[#f5f5f6] text-black"
                          } p-3 rounded-lg max-w-md shadow-sm`}
                        >
                          {m.image && <img src={m.image} className="max-w-xs rounded-md mb-2" />}
                          {m.text && <div>{m.text}</div>}
                          <div className="text-[10px] text-gray-400 mt-1 text-right">
                            {fmtTime(m.ts)}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {typingUsers.includes(activeChat) && (
                  <div className="text-sm text-gray-500">{activeChat} is typing...</div>
                )}
              </div>

              <div className="p-4 border-t bg-[#fff7fb]">
                <div className="flex items-center space-x-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                    />
                    <div className="px-3 py-2 rounded-md border">📷</div>
                  </label>

                  <input
                    value={text}
                    onChange={(e) => handleTextChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (text.trim()) {
                          sendMessage({ text: text.trim() });
                          setText("");
                          post({ type: "typing", user: username, typing: false, ts: Date.now() });
                        }
                      }
                    }}
                    placeholder="Say something"
                    className="flex-1 px-4 py-3 rounded-lg border outline-none"
                  />
                  <button
                    onClick={() => {
                      if (!text.trim()) return;
                      sendMessage({ text: text.trim() });
                      setText("");
                      post({ type: "typing", user: username, typing: false, ts: Date.now() });
                    }}
                    className="ml-2 bg-[#5A3355] text-white px-4 py-2 rounded-lg"
                  >
                    ➤
                  </button>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Tip: Open another tab to simulate another user.
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
