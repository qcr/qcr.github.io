import {Button, makeStyles} from '@material-ui/core';

import styles from '../styles/focus_button.module.scss';

const iconStyle = makeStyles({
  endIcon: {
    marginLeft: '12px',
  },
});

export default function FocusButton({url, text, icon, newTab}) {
  const csIcon = iconStyle();
  return (
    <a href={url} target={newTab && '_blank'} className={styles.link}>
      <Button
        color="primary"
        variant="contained"
        classes={csIcon}
        className={styles.button}
        endIcon={icon}
      >
        {text}
      </Button>
    </a>
  );
}
