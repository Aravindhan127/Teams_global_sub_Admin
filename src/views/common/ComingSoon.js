import React from 'react'
import { Box, Typography, Container, Paper } from '@mui/material'
import ConstructionIcon from '@mui/icons-material/Construction'
import { keyframes } from '@mui/system'

// Define animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`

const ComingSoon = ({ title }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8
      }}
    >
      <Container maxWidth='lg'>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh'
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 4, md: 8 },
              textAlign: 'center',
              borderRadius: 4,
              backgroundColor: 'background.paper',
              maxWidth: 600,
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: '#1e3a8a'
              }
            }}
          >
            <Box
              sx={{
                position: 'relative',
                mb: 4,
                animation: `${float} 3s ease-in-out infinite`
              }}
            >
              <ConstructionIcon
                sx={{
                  fontSize: 100,
                  color: '#1e3a8a',
                  filter: 'drop-shadow(0 4px 8px rgba(30, 58, 138, 0.2))',
                  animation: `${pulse} 2s ease-in-out infinite`
                }}
              />
            </Box>

            <Typography
              variant='fm-h3'
              gutterBottom
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                mb: 2,
                background: '#1e3a8a',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {title}
            </Typography>

            <Typography
              variant='h4'
              color='text.secondary'
              sx={{
                mb: 4,
                fontWeight: 500,
                letterSpacing: '0.5px'
              }}
            >
              Coming Soon
            </Typography>

            <Typography
              variant='body1'
              color='text.secondary'
              sx={{
                maxWidth: 400,
                mx: 'auto',
                mb: 6,
                fontSize: '1.1rem',
                lineHeight: 1.6
              }}
            >
              We're working hard to bring you something amazing. Stay tuned for updates!
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}

export default ComingSoon
