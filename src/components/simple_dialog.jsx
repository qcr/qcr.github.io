import {
  Dialog,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';

export default function SimpleDialog({open, onClose, urls}) {
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
        {urls.map((u) => (
          <ListItemButton sx={{paddingRight: '48px'}}>
            <a href={u.url} target="_blank">
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
