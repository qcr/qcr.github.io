import {Button} from '@material-ui/core';

import styles from '../styles/focus_button.module.scss';

export default function FocusButton({url, text, icon, newTab}) {
  return (
    <a href={url} target={newTab && '_blank'} className={styles.link}>
      <Button
        color="primary"
        variant="contained"
        className={styles.button}
        endIcon={icon}
      >
        {text}
      </Button>
    </a>
  );
}
