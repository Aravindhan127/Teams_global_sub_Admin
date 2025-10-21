import { useState } from 'react'
import {
  Avatar,
  Box,
  Card,
  Typography,
  LinearProgress,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  IconButton,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  AvatarGroup
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import StarIcon from '@mui/icons-material/Star'
const VoteList = ({ pollData, pollName }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  if (!pollData?.length) {
    return (
      <Box sx={{ display: 'flex', p: 5 }}>
        <Typography>No votes yet</Typography>
      </Box>
    )
  }

  const totalVotes = pollData.reduce((acc, option) => acc + option.voteCount, 0)
  console.log('PollData', pollData)
  return (
    <>
      <TableContainer>
        <Table sx={{ borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  borderBottom: 'none',
                  fontWeight: 600,
                  py: 1,
                  color: '#ffffff',
                  fontSize: '15px !important',
                  textTransform: 'capitalize'
                }}
              >
                Options
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: 'none',
                  fontWeight: 600,
                  py: 1,
                  color: '#ffffff',
                  fontSize: '15px !important',
                  textTransform: 'capitalize'
                }}
              >
                Votes
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: 'none',
                  fontWeight: 600,
                  py: 1,
                  color: '#ffffff',
                  fontSize: '15px !important',
                  textTransform: 'capitalize'
                }}
              >
                Percentage
              </TableCell>
              <TableCell
                sx={{
                  borderBottom: 'none',
                  fontWeight: 600,
                  py: 1,
                  color: '#ffffff',
                  fontSize: '15px !important',
                  textTransform: 'capitalize'
                }}
              >
                Users
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pollData.map(option => {
              const { pollOptionId, optionTag, voteCount, voterList } = option
              const percentage = totalVotes > 0 ? ((voteCount / totalVotes) * 100).toFixed(0) : 0

              return (
                <TableRow
                  key={pollOptionId}
                  sx={{
                    backgroundColor: '#f9f9f9',
                    '& td': { borderBottom: 'none', py: 0.5 } // keep very small padding
                  }}
                >
                  <TableCell sx={{ fontWeight: 500, color: '#000 !important', fontSize: '15px' }}>
                    {optionTag}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#000 !important', fontSize: '15px' }}>
                    {voteCount} Votes
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#000 !important', fontSize: '15px' }}>
                    {percentage}%
                  </TableCell>
                  <TableCell>
                    <AvatarGroup
                      max={4}
                      sx={{ justifyContent: 'start', cursor: 'pointer' }}
                      onClick={() => {
                        setSelectedOption(option)
                        setDrawerOpen(true)
                      }}
                    >
                      {voterList.map((voter, idx) => (
                        <Avatar
                          key={idx}
                          alt='User'
                          src={voter?.profileUrl || '/default-profile.png'}
                          sx={{ width: 28, height: 28, border: '2px solid #fff' }}
                        />
                      ))}
                    </AvatarGroup>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* {pollData.map((option) => (
                    <Box key={option.pollOptionId} sx={{ mb: 2 }}>
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <LinearProgress
                                variant="determinate"
                                // value={
                                //     totalVotes === 0
                                //         ? 0  
                                //         : Math.max(10, (option.voteCount / totalVotes) * 100) 
                                // }
                                max={100}
                                value={option.voteCount}
                                sx={{
                                    height: 8,
                                    borderRadius: 1,
                                    width: "80%",
                                    backgroundColor: "#E0E0E0",
                                    "& .MuiLinearProgress-bar": {
                                        background: "#1e3a8a",
                                    },
                                }}
                            />
                            <Typography variant="body2">
                                {option.voteCount} {option.voteCount === 1 ? "Vote" : "Votes"}
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {option.optionTag}
                        </Typography>
                    </Box>
                ))} */}

      {/* <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button onClick={() => setDrawerOpen(true)} sx={{ color: "primary.main", textTransform: "none" }}>
                    <Typography variant="body2" sx={{ fontStyle: "italic", color: "#00000080" }}>
                        View Vote List
                    </Typography>
                </Button>
            </Box> */}

      {/* Drawer Component */}
      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{
          BackdropProps: { sx: { backgroundColor: 'transparent' } }
        }}
      >
        <Box sx={{ width: 400, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon sx={{ fill: '#1e3a8a' }} />
            </IconButton>
            <Typography variant='h6' sx={{ color: 'primary.main', fontWeight: 600 }}>
              Poll Details
            </Typography>
          </Box>
          <Box sx={{ mt: 5, p: 3 }}>
            <Typography variant='body1' sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
              {pollName}
            </Typography>
            <Divider />
          </Box>

          {selectedOption && (
            <Box sx={{ mt: 3, p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                  {selectedOption.optionTag || '-'}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    width: '80px',
                    bgcolor: '#49be0470',
                    borderRadius: '8px',
                    alignItems: 'center'
                  }}
                >
                  <Typography
                    sx={{
                      padding: '2px 8px',
                      color: '#3e8f41',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    {selectedOption.voteCount || '0'} {selectedOption.voteCount === 1 ? 'Vote' : 'Votes'}
                  </Typography>
                  <StarIcon sx={{ fill: '#3e8f41', fontSize: '12px' }} />
                </Box>
              </Box>

              <List dense>
                {selectedOption.voterList?.length > 0 ? (
                  selectedOption.voterList.map(voter => (
                    <ListItem key={voter.userSeqId} sx={{ alignItems: 'center' }}>
                      <ListItemAvatar>
                        <Avatar src={voter.profileUrl} alt={`${voter.firstName} ${voter.lastName}`} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${voter.firstName} ${voter.lastName}` || '-'}
                        secondary={voter.userType || '-'}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary='No Votes Added' sx={{ textTransform: 'capitalize' }} />
                  </ListItem>
                )}
              </List>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  )
}

export default VoteList
