import React from 'react';
import IconButton from '@mui/material/IconButton';
import ToggleOn from '@mui/icons-material/ToggleOn';
import ToggleOff from '@mui/icons-material/ToggleOff';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';

const useStyles = makeStyles((theme) => ({
  toggleOn: {
    color: theme.palette.success.main,
  },
  toggleOff: {
    color: theme.palette.error.main,
  },
}));

const ToggleButton = ({ initialValue, onChange }) => {
  const classes = useStyles();
  const theme = useTheme();

  const handleToggle = () => {
    onChange(!initialValue);
  };

  return (
    <IconButton onClick={handleToggle} className={initialValue ? classes.toggleOn : classes.toggleOff}>
      {initialValue ? (
        <ToggleOn style={{ color: theme.palette.success.main }} />
      ) : (
        <ToggleOff style={{ color: theme.palette.error.main }} />
      )}
    </IconButton>
  );
};

export default ToggleButton;
