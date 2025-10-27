import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  InputAdornment,
  Divider,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import WhatsAppCRMStats from "./WhatsAppCRMStats";
import ChatInputBar from "./ChatInputBar";

const WhatsAppBusiness = () => {
  const [activeChat, setActiveChat] = useState("OTG");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width:900px)");

  const conversations = [
    {
      id: "OTG",
      name: "OUR TEAMS GLOBAL",
      lastMessage: "Welcome to our global community!",
      time: "5m",
      online: true,
      messages: [
        { sender: "user", text: "Hi! I'm interested in learning more.", time: "10:30 AM" },
        { sender: "admin", text: "Hello! We'd love to tell you more.", time: "10:32 AM" },
        { sender: "user", text: "Looking forward to the next event!", time: "10:35 AM" },
        { sender: "admin", text: "We have an event next week, want details?", time: "10:36 AM" },
        { sender: "user", text: "Yes, please!", time: "10:37 AM" },
      ],
    },
    {
      id: "OTJ",
      name: "OUR TEAMS JOBOPEDIA",
      lastMessage: "New job posting: Senior Developer",
      time: "30m",
      online: true,
    },
    {
      id: "OTJ2",
      name: "Jk",
      lastMessage: "New job posting: Senior Developer",
      time: "35m",
      online: true,
    },
  ];

  const activeConversation = conversations.find((c) => c.id === activeChat);

  const handleSend = () => {
    if (!message.trim()) return;
    console.log("Sent:", message);
    setMessage("");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f5f6fa",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* STATS SECTION */}

        <Box sx={{ bgcolor: "#fff", p: 3 }}>
          <WhatsAppCRMStats />
        </Box>

      {/* MAIN SECTION */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        {/* SIDEBAR */}
        <Box
          sx={{
            width: isMobile ? (sidebarOpen ? "80%" : "0") : 320,
            borderRight: isMobile ? "none" : "1px solid #ddd",
            transition: "width 0.3s ease",
            display: "flex",
            flexDirection: "column",
            bgcolor: "#fff",
            overflow: "hidden",
            position: isMobile ? "absolute" : "relative",
            zIndex: 10,
            height: "100%",
            boxShadow: isMobile && sidebarOpen ? "4px 0 8px rgba(0,0,0,0.2)" : "none",
          }}
        >
          {/* Mobile Close Button */}
          {isMobile && sidebarOpen && (
            <IconButton
              onClick={() => setSidebarOpen(false)}
              sx={{ alignSelf: "flex-end", m: 1, color: "#1e40af" }}
            >
              <CloseIcon />
            </IconButton>
          )}

          {/* Search Box */}
          <Box sx={{ p: 2.8 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Divider />

          {/* Conversation List */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              "&::-webkit-scrollbar": { width: 6 },
              "&::-webkit-scrollbar-thumb": { bgcolor: "#ccc", borderRadius: "3px" },
            }}
          >
            {conversations
              .filter((c) =>
                c.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((chat) => (
                <Box
                  key={chat.id}
                  onClick={() => {
                    setActiveChat(chat.id);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    px: 2,
                    py: 1.5,
                    cursor: "pointer",
                    bgcolor: activeChat === chat.id ? "rgba(46,170,255,0.1)" : "white",
                    "&:hover": { bgcolor: "rgba(46,170,255,0.05)" },
                    borderLeft:
                      activeChat === chat.id
                        ? "4px solid #1e40af"
                        : "4px solid transparent",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "#f1efef",
                      width: 50,
                      height: 50,
                      color: "#1e40af",
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    {chat.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </Avatar>
                  {!isMobile && (
                    <Box sx={{ flex: 1, overflow: "hidden" }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "14px",
                          color: "#000",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {chat.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: "#666",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {chat.lastMessage}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}
          </Box>
        </Box>

        {/* CHAT AREA */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            bgcolor: "#fff",
          }}
        >
          {/* Header */}
          {activeConversation && (
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid #ddd",
                display: "flex",
                alignItems: "center",
                gap: 2,
                bgcolor: "#fff",
              }}
            >
              {isMobile && (
                <IconButton onClick={() => setSidebarOpen(true)} sx={{ color: "#1e40af" }}>
                  <MenuIcon />
                </IconButton>
              )}

              <Avatar sx={{ width: 55, height: 55, color: "#1e40af" }}>
                {activeConversation.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </Avatar>
              <Box>
                <Typography fontWeight={600} sx={{ color: "#333" }}>
                  {activeConversation.name}
                </Typography>
                <Typography sx={{ fontSize: "12px", color: "#1e40af" }}>
                  {activeConversation.online ? "Online" : "Offline"}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              backgroundColor: "#fafafa",
              "&::-webkit-scrollbar": { width: 6 },
              "&::-webkit-scrollbar-thumb": { bgcolor: "#ccc", borderRadius: "3px" },
            }}
          >
            {activeConversation?.messages?.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  alignSelf: msg.sender === "admin" ? "flex-end" : "flex-start",
                  maxWidth: "70%",
                  bgcolor: msg.sender === "admin" ? "#1e40af" : "#f1f1f1",
                  color: msg.sender === "admin" ? "#fff" : "#333",
                  px: 3,
                  py: 3,
                  borderRadius: 3,
                  borderTopRightRadius: msg.sender === "admin" ? 0 : "8px",
                  borderTopLeftRadius: msg.sender === "admin" ? "8px" : 0,
                }}
              >
                <Typography sx={{ fontSize: "14px", lineHeight: 1.5 , color: msg.sender === "admin" ? "#fff" : "#333",}}>
                  {msg.text}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "11px",
                    mt: 0.5,
                    opacity: 0.7,
                    textAlign: "right",
                    color: msg.sender === "admin" ? "#e5e5e5" : "#555",
                  }}
                >
                  {msg.time}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Input Bar */}
          <ChatInputBar message={message} setMessage={setMessage} onSend={handleSend} />
        </Box>
      </Box>
    </Box>
  );
};

export default WhatsAppBusiness;
