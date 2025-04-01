// src/components/NavBar.js
import React from 'react';
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// iOS-style Switch from MUI docs:
const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: 'inherit',
        opacity: 1,
        border: 0,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

/**
 * NavBar that defaults the iOS switch to OFF (checked=false),
 * but can be overridden by a parent via props.
 *
 * @param {boolean} [checked=false] - Whether the switch is on/off.
 * @param {function} onToggle - Callback to handle switch changes.
 */
export default function NavBar({ checked = false, onToggle }) {
  // Toggle handler calls the parent's onToggle with the new boolean
  const handleToggle = (event) => {
    onToggle(event.target.checked);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ backgroundColor: '#000' }}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu">
            {/* Update src path if your logo is in public/assets or public/assests */}
            <img
              src="/assets/PearsonLogo.png"
              alt="Pearson Logo"
              style={{ height: '40px', marginLeft: '42px' }}
            />
          </IconButton>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontfamily : 'Helvetica' }}>
            Nexus Audio Assistant
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <IOSSwitch
                  sx={{ m: 1 }}
                  checked={checked}
                  onChange={handleToggle}
                />
              }
              label=""
            />
          </FormGroup>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
