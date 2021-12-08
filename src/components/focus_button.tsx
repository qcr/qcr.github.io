import React from 'react';
import {Button, styled} from '@mui/material';

interface FocusButtonProps {
  url?: string;
  text: string;
  icon: React.ReactNode;
  newTab?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const StyledButton = styled(Button)(({theme}) => ({
  textTransform: 'unset',
  width: '300px',
  svg: {
    fill: theme.palette.primary.contrastText,
  },
  '.MuiButton-endIcon': {
    height: '24px',
    marginLeft: '12px',
  },
}));

const StyledLink = styled('a')({
  textDecoration: 'none',
  margin: '0px auto',
});

export default function FocusButton({
  url,
  text,
  icon,
  newTab = true,
  onClick,
}: FocusButtonProps) {
  return (
    <StyledLink href={url} target={newTab ? '_blank' : undefined}>
      <StyledButton
        color="primary"
        variant="contained"
        endIcon={icon}
        onClick={onClick}
      >
        {text}
      </StyledButton>
    </StyledLink>
  );
}
