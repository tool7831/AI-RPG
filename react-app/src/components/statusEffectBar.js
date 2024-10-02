import React, { useState } from 'react';
import { Typography, Box, Container, Popover} from '@mui/material';
import { StatusEffectIcons } from './icons';

function StatusEffectBar({ actor }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleItemClick = (icon, event) => {
    setAnchorEl(event.currentTarget);
    setSelectedIcon(icon);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleExited = () => {
    setTimeout(() => {
      setSelectedIcon(null);
    }, 200)
  };
  return (
    <Container>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', height: '80px' }}>
        {actor.status.curStatusEffects.map((statusEffect) => (
          <div key={statusEffect} onClick={(e) => handleItemClick(statusEffect, e)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid' }}>
            <StatusEffectIcons type={statusEffect.type}/>
            <Typography>{statusEffect.duration}</Typography>
          </div>
        ))}
      </Box>

      <Popover id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        TransitionProps={{ onExit: handleExited }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box>
          <Typography>{selectedIcon?.name}</Typography>
          <Typography>{selectedIcon?.type}</Typography>
          <Typography>{selectedIcon?.value}</Typography>
        </Box>
      </Popover>

    </Container>
  );
}

export default StatusEffectBar;