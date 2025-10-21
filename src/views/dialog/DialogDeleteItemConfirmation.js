import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Card } from '@mui/material';

export default function DialogDeleteItemConfirmation(props) {

  const { open, toggle, itemDataToDelete, onConfirm } = props;

  return (
    <Dialog
      open={open}
      onClose={toggle}
      PaperProps={{ sx: { borderRadius: '45px' } }}
    >
      <Card
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          py: '20px',
          px: '15px',
          textAlign: 'center',
          borderRadius: '42px'
          // backgroundColor: '#2D2245'
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
        Are you sure you want to delete this item?
        </DialogContent>
        <DialogActions>
          <Button onClick={toggle}>
           Cancel
          </Button>
          <Button onClick={(e) => onConfirm(e, itemDataToDelete)} variant="contained">
           Delete
          </Button>
        </DialogActions>
      </Card>
    </Dialog>
  );
}




