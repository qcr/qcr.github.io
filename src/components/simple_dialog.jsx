import PropTypes from 'prop-types';
import React from 'react';

import {
  Dialog,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';

function SimpleDialog({open, onClose, urls}) {
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

SimpleDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  urls: PropTypes.array,
};

export default SimpleDialog;
