import React from 'react';

import {
  Dialog,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
  styled,
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

const StyledDialog = styled(Dialog)({
  '.MuiDialog-paper': {
    borderRadius: '0px',
  },
});

const StyledListItem = styled(ListItemButton)({
  paddingRight: '48px',
});

const StyledTitle = styled(DialogTitle)(({theme}) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

export default function SimpleDialog({open, onClose, urls}: SimpleDialogProps) {
  return (
    <StyledDialog open={open} onClose={onClose}>
      <StyledTitle>Select dataset variant</StyledTitle>
      <List>
        {urls.map((u, i) => (
          <StyledListItem key={i}>
            <a href={u.url} target="_blank" rel="noreferrer">
              <ListItemText
                primary={u.name}
                secondary={u.size ? u.size : ' '}
              />
            </a>
          </StyledListItem>
        ))}
      </List>
    </StyledDialog>
  );
}
