import {Button} from '@mui/material';

import styles from '../styles/focus_button.module.scss';

export default function FocusButton({url, text, icon, newTab}) {
  return (
    <a href={url} target={newTab && '_blank'} className={styles.link}>
      <Button
        color="primary"
        variant="contained"
        // classes={csIcon}
        className={styles.button}
        endIcon={icon}
        sx={{'.MuiButton-endIcon': {marginLeft: '12px'}}}
      >
        {text}
      </Button>
    </a>
  );
}
