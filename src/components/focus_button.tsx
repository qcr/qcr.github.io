import React from 'react';
import {Button} from '@mui/material';

import styles from '../styles/focus_button.module.scss';

interface FocusButtonProps {
  url?: string;
  text: string;
  icon: React.ReactNode;
  newTab?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function FocusButton({
  url,
  text,
  icon,
  newTab = true,
  onClick,
}: FocusButtonProps) {
  return (
    <a
      href={url}
      target={newTab ? '_blank' : undefined}
      className={styles.link}
    >
      <Button
        color="primary"
        variant="contained"
        // classes={csIcon}
        className={styles.button}
        endIcon={icon}
        sx={{'.MuiButton-endIcon': {height: '24px', marginLeft: '12px'}}}
        onClick={onClick}
      >
        {text}
      </Button>
    </a>
  );
}
