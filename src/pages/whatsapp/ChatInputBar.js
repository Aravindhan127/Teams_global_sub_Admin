import React from "react";
import { Box, IconButton, TextField } from "@mui/material";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import SendIcon from "@mui/icons-material/Send";
import KeyboardVoiceOutlinedIcon from "@mui/icons-material/KeyboardVoiceOutlined";

const ChatInputBar = ({ message, setMessage, onSend }) => {
  return (
    <Box
      sx={{
        p: 2,
        borderTop: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        bgcolor: "#fff",
      }}
    >
      {/* Emoji Icon */}
      <IconButton sx={{ color: "#1e3a8a" }}>
        <EmojiEmotionsOutlinedIcon />
      </IconButton>

      {/* Attachment Icon */}
      <IconButton sx={{ color: "#1e3a8a" }}>
        <AttachFileOutlinedIcon />
      </IconButton>

      {/* Input Field */}
      <TextField
        fullWidth
        size="small"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && message.trim() !== "") {
            onSend();
          }
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#f0f0f0",
            borderRadius: "30px",
            paddingLeft: "15px",
            paddingRight: "15px",
            "& fieldset": { border: "none" },
          },
          "& input": {
            fontSize: "14px",
          },
        }}
      />

      {/* Send Button */}
      <IconButton
        sx={{
          backgroundColor: "#0b1f8c",
          color: "#fff",
          "&:hover": { backgroundColor: "#1226a8" },
        }}
        onClick={onSend}
        disabled={!message.trim()}
      >
        <SendIcon />
      </IconButton>

      {/* Mic Icon */}
      <IconButton sx={{ color: "#1e3a8a" }}>
        <KeyboardVoiceOutlinedIcon />
      </IconButton>
    </Box>
  );
};

export default ChatInputBar;
