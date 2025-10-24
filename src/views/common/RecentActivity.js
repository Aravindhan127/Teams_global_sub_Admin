import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider
} from '@mui/material';
import {
  CheckCircle,
  Event,
  Chat,
  LocationOn
} from '@mui/icons-material';

const ExactActivityFeed = () => {
  const activityData = [
    {
      icon: <CheckCircle sx={{ color: '#4CAF50', fontSize: 18 }} />,
      title: 'New User Approved',
      timestamp: '5 min ago',
      content: "John Smith's membership application was approved by Admin"
    },
    {
      icon: <Event sx={{ color: '#2196F3', fontSize: 18 }} />,
      title: 'Upcoming Event',
      timestamp: '2 hours ago',
      content: 'Monthly networking meetup scheduled for tomorrow'
    },
    {
      icon: <Chat sx={{ color: '#25D366', fontSize: 18 }} />,
      title: 'New WhatsApp Message', 
      timestamp: '3 hours ago',
      content: 'Sarah Johnson inquired about membership benefits'
    },
    {
      icon: <LocationOn sx={{ color: '#FF5722', fontSize: 18 }} />,
      title: 'Lounge Request Declined',
      timestamp: '5 hours ago',
      content: 'Request for new lounge location was declined by Admin'
    }
  ];

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        width: '100%',
        margin: '20px auto', 
        borderRadius: '12px',
        overflow: 'hidden',
        height: '35%'
      }}
    >
 
      {/* Header */}
      <Box sx={{ p: 2.5, borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            fontSize: '1.1rem',
            color: '#333'
          }}
        >
          Recent Activity
        </Typography>
          <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            fontSize: '0.3rem',
            color: '#1e40af',
          }}
        >
          View All
        </Typography>

      </Box >

  <Box sx={{
    maxHeight: '82%',  // limit height
    overflowY: 'auto',   // vertical scroll
    overflowX: 'hidden', // optional
    padding: '16px',
    border: '1px solid #ccc',
    borderRadius: '8px'
  }}
>
      {/* Activity Items */}
      {activityData.map((item, index) => (
        <Box key={index}>
          <Box sx={{ p: 2.5 }}>
            {/* First Line: Icon + Title + Time */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 2 }}>
                {item.icon}
                <Typography 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    ml: 1.5,
                    color: '#333'
                  }}
                >
                  {item.title}
                </Typography>
              </Box>
              <Typography 
                sx={{ 
                  fontSize: '0.75rem',
                  color: '#666'
                }}
              >
                {item.timestamp}
              </Typography>
            </Box>

            {/* Second Line: Description */}
            <Typography 
              sx={{ 
                fontSize: '0.85rem',
                color: '#555',
                lineHeight: 1.4,
                pl: 8 // Match text alignment with titles
              }}
            >
              {item.content}
            </Typography>
          </Box>

          {/* Divider */}
          {index < activityData.length - 1 && (
            <Divider sx={{ mx: 2 }} />
          )}
        </Box>
      ))}
    </Box>
    </Paper>
  );
};

export default ExactActivityFeed;