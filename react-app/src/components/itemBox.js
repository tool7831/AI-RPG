import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Popover } from '@mui/material';
const itemStyle = {
  width: 70, 
  height: 70, 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  border: '1px solid grey', 
  cursor: 'pointer'
}
function ItemBox({item, ...props}) {

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl); // Popover 열림 상태 확인
  const id = open ? 'simple-popover' : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Card onClick={(e) => {setAnchorEl(e.currentTarget)}} sx={itemStyle} {...props}>
        <CardContent>
          <Typography>{item.name}</Typography>
        </CardContent>
      </Card>
      
      <Popover id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
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
             item?.effects[stat] !== null && <Typography color="textSecondary" key={stat}>{stat}: {item?.effects[stat]}</Typography>
          )}
          <Typography variant='h6'>Use Restriction</Typography>
          {Object.keys(item?.use_restriction).map((stat) =>
            item?.use_restriction[stat] !== null && <Typography color="textSecondary" key={stat}>{stat}: {item?.use_restriction[stat]}</Typography>
          )}
          <Button onClick={handleClose}>Cancel</Button>
        </CardContent>
      </Popover>
    </Box>
  )
}

export default ItemBox;