import React, { useState } from "react";
import { Box, Paper, Typography, Collapse, IconButton } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const WhatsAppCRMStats = () => {
  const [showStats, setShowStats] = useState(true);

  const stats = [
    {
      icon: <ChatBubbleOutlineIcon sx={{ color: "#5B4B8A" }} />,
      label: "Total Messages",
      value: "12,845",
      change: "+12%",
      changeColor: "#4CAF50",
    },
    {
      icon: <GroupOutlinedIcon sx={{ color: "#5B4B8A" }} />,
      label: "Active Chats",
      value: "234",
      change: "+5%",
      changeColor: "#4CAF50",
    },
    {
      icon: <CheckCircleOutlineOutlinedIcon sx={{ color: "#5B4B8A" }} />,
      label: "Response Rate",
      value: "94%",
      change: "+3%",
      changeColor: "#4CAF50",
    },
    {
      icon: <AccessTimeOutlinedIcon sx={{ color: "#5B4B8A" }} />,
      label: "Avg Response Time",
      value: "2.5m",
      change: "-8%",
      changeColor: "#FF5252",
    },
  ];

  return (
    <Box sx={{ bgcolor: "#ffffff", p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
          cursor: "pointer",
          width: "fit-content",
          userSelect: "none",
          "&:hover": { opacity: 0.8 },
        }}
        onClick={() => setShowStats(!showStats)}
      >
        {showStats ? (
          <KeyboardArrowUpIcon sx={{ transition: "0.3s" }} />
        ) : (
          <KeyboardArrowDownIcon sx={{ transition: "0.3s" }} />
        )}
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {showStats ? "Hide CRM Stats" : "Show CRM Stats"}
        </Typography>
      </Box>

      {/* Collapsible Section */}
      <Collapse in={showStats}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            justifyContent: "flex-start",
          }}
        >
          {stats.map((item, index) => (
            <Paper
              key={index}
              elevation={1}
              sx={{
                p: 3,
                borderRadius: "12px",
                flex: "1 1 280px",
                maxWidth: "340px",
                minWidth: "280px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                bgcolor: "#ffffff",
                border: "1px solid #e0e0e0",
              }}
            >
              {/* Top Row: Icon + Change */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#F1EFFA",
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </Box>

                <Box
                  sx={{
                    bgcolor: "#F1EFFA",
                    px: 1.2,
                    py: 0.3,
                    borderRadius: "20px",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: item.changeColor, fontWeight: 600 }}
                  >
                    {item.change}
                  </Typography>
                </Box>
              </Box>

              {/* Label */}
              <Typography
                variant="body2"
                sx={{ color: "#6c6c6c", mb: 0.5, fontWeight: 500 }}
              >
                {item.label}
              </Typography>

              {/* Value */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#0A0A23",
                  fontSize: "1.4rem",
                }}
              >
                {item.value}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

export default WhatsAppCRMStats;
