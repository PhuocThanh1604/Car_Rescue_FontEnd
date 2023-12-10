import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ToggleOn from '@mui/icons-material/ToggleOn';
import ToggleOff from '@mui/icons-material/ToggleOff';
import { useTheme } from '@mui/material/styles';

const StyledIconButton = styled(IconButton)(({ theme, isOn }) => ({
  color: isOn ? theme.palette.success.main : theme.palette.error.main,
}));

const ToggleButton = ({ initialValue, onChange }) => {
  const theme = useTheme();
  const handleToggle = () => onChange(!initialValue);

  return (
    <StyledIconButton onClick={handleToggle} isOn={initialValue}>
      {initialValue ? <ToggleOn /> : <ToggleOff />}
    </StyledIconButton>
  );
};

export default ToggleButton;
