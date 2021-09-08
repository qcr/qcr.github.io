import {Button} from '@material-ui/core';

import styles from '../styles/focus_button.module.scss';

export default function FocusButton({url, text, icon, newTab}) {
  return (
    <a href={url} target={newTab && '_blank'} className={styles.link}>
      <Button raised trailingIcon={icon} className={styles.button}>
        {text}
      </Button>
    </a>
  );
}
