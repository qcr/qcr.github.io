import PropTypes from 'prop-types';
import React from 'react';

import {
  Dialog,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';

import {DatasetUrl} from '../../lib/content';

export type DialogOnClose = (
  event: {},
  reason: 'backdropClick' | 'escapeKeyDown'
) => void;

interface SimpleDialogProps {
  open: boolean;
  onClose: DialogOnClose;
  urls: DatasetUrl[];
}

export default function SimpleDialog({open, onClose, urls}: SimpleDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{'.MuiDialog-paper': {borderRadius: '0px'}}}
    >
      <DialogTitle sx={{backgroundColor: 'primary.main', color: 'white'}}>
        Select dataset variant
      </DialogTitle>
      <List>
        {urls.map((u, i) => (
          <ListItemButton key={i} sx={{paddingRight: '48px'}}>
            <a href={u.url} target="_blank" rel="noreferrer">
              <ListItemText
                primary={u.name}
                secondary={u.size ? u.size : ' '}
              />
            </a>
          </ListItemButton>
        ))}
      </List>
    </Dialog>
  );
}
