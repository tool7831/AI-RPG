import React, { useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, Button, Container, Popover } from '@mui/material';
import { Item, ItemType } from '../scripts/item.ts';
const itemStyle = {
  width: 70, height: 70, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid grey', cursor: 'pointer'
}
const ItemBox = ({item, handleItemClick, handleExited, isEquipped, addon}) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl); // Popover 열림 상태 확인
  const id = open ? 'simple-popover' : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Card onClick={(e) => {setAnchorEl(e.currentTarget); handleItemClick(item, e)}} sx={itemStyle}>
        <CardContent>
          <Typography>{item.name}</Typography>
        </CardContent>
      </Card>
      
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
        <CardContent>
          <Typography variant="h5">{item?.name}</Typography>
          <Typography>{item?.description}</Typography>
          <Typography variant='h6'>Effects</Typography>
          {Object.keys(item?.effects).map((stat) =>
            <Typography color="textSecondary" key={stat}>{stat}: {item?.effects[stat]}</Typography>
          )}
          <Typography variant='h6'>Use Restriction</Typography>
          {Object.keys(item?.use_restriction).map((stat) =>
            <Typography color="textSecondary" key={stat}>{stat}: {item?.use_restriction[stat]}</Typography>
          )}
          <Button onClick={handleClose}>Cancel</Button>
          {addon && addon(item, isEquipped)}
        </CardContent>
      </Popover>
    </Box>
  )
}

export default ItemBox;