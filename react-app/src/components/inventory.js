import React, { useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, Tooltip, Button, Dialog, DialogTitle, DialogActions, DialogContent, styled, Container } from '@mui/material';
import MouseHoverPopover from './mouseHoverPopover';

const itemStyle = {
  width: 70, height: 70, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid grey', cursor: 'pointer'
}

// 임시 아이템 데이터
const items = [
  { id: 1, name: 'Sword', description: 'A sharp blade for cutting.', type: 'weapon' },
  { id: 2, name: 'Shield', description: 'A sturdy shield for defense.', type: 'armor' },
  { id: 3, name: 'Potion', description: 'A healing potion.', type: 'consumable' },
  { id: 4, name: 'Sword', description: 'A sharp blade for cutting.', type: 'weapon' },
  { id: 5, name: 'Shield', description: 'A sturdy shield for defense.', type: 'armor' },
  { id: 6, name: 'Potion', description: 'A healing potion.', type: 'consumable' },
  { id: 7, name: 'Sword', description: 'A sharp blade for cutting.', type: 'weapon' },
  { id: 8, name: 'Shield', description: 'A sturdy shield for defense.', type: 'armor' },
  { id: 9, name: 'Potion', description: 'A healing potion.', type: 'consumable' },
  { id: 10, name: 'Sword', description: 'A sharp blade for cutting.', type: 'weapon' },
  { id: 11, name: 'Shield', description: 'A sturdy shield for defense.', type: 'armor' },
  { id: 12, name: 'Potion', description: 'A healing potion.', type: 'consumable' },
];

const equipmentSlots = {
  helmet: null,
  armor: null,
  pants: null,
  shoes: null,
  gloves: null,
  rightHand: null,
  leftHand: null,
  ring1: null,
  ring2: null,
  earring1: null,
  earring2: null,
  necklace: null,
};

const Inventory = () => {
  const [equippedItems, setEquippedItems] = useState(equipmentSlots); // 장착된 아이템들
  const [inventoryItems, setInventoryItems] = useState(items); // 인벤토리 아이템 리스트
  const [selectedItem, setSelectedItem] = useState(null); // 클릭한 아이템
  const [openDialog, setOpenDialog] = useState(false); // 팝업 열림 상태
  const [selectedSlot, setSelectedSlot] = useState(null); // 선택한 장비 슬롯

  // 아이템 클릭 핸들러
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  // 팝업 닫기 핸들러
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setSelectedSlot(null);
  };

  // 아이템 장착 핸들러
  const handleEquip = () => {
    if (selectedItem && selectedSlot) {
      // 이미 장착된 아이템이 있으면 인벤토리로 이동
      const existingItem = equippedItems[selectedSlot];
      if (existingItem) {
        setInventoryItems([...inventoryItems, existingItem]);
      }

      // 새로운 아이템 장착
      setEquippedItems({ ...equippedItems, [selectedSlot]: selectedItem });
      setInventoryItems(inventoryItems.filter(item => item.id !== selectedItem.id)); // 인벤토리에서 제거
    }
    handleCloseDialog();
  };

  // 장비 해제 핸들러
  const handleUnequip = () => {
    if (selectedSlot && equippedItems[selectedSlot]) {
      const unequippedItem = equippedItems[selectedSlot];
      setInventoryItems([...inventoryItems, unequippedItem]); // 인벤토리에 아이템 추가
      setEquippedItems({ ...equippedItems, [selectedSlot]: null }); // 장비 슬롯 비우기
    }
    handleCloseDialog();
  };

  // 장비 슬롯 클릭 핸들러
  const handleEquipmentClick = (slot) => {
    if (equippedItems[slot]) {
      setSelectedSlot(slot);
      setOpenDialog(true); // 장착 해제 팝업 열기
    }
  };

  // 장비 슬롯 렌더링
  const renderEquipmentSlot = (slot, label) => (
    <Card sx={{ width: 70, height: 70, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid grey', mb: 2 }} onClick={() => handleEquipmentClick(slot)}>
      {equippedItems[slot] ? (
        <Tooltip title={equippedItems[slot].description}>
          <Typography >{equippedItems[slot].name}</Typography>
        </Tooltip>
      ) : (
        <Typography>{label}</Typography>
      )}
    </Card>
  );

  return (
    <Container sx={{backgroundColor: 'white'}}>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        {/* 장비 슬롯 */}
        <Box sx={{border:'solid'}}>
          <Typography variant="h6" align="center" sx={{border:'solid'}}>Equipped Items</Typography>
          <Grid container sx={{border:'solid'}}>
            <Grid item xs={12}>
              <Grid container justifyContent="space-evenly">
                {renderEquipmentSlot('helmet', 'Helmet')}
                {renderEquipmentSlot('armor', 'Armor')}
                {renderEquipmentSlot('pants', 'Pants')}
                {renderEquipmentSlot('shoes', 'Shoes')}
                {renderEquipmentSlot('gloves', 'Gloves')}
                {renderEquipmentSlot('leftHand', 'Left Hand')}
                {renderEquipmentSlot('rightHand', 'Right Hand')}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container justifyContent="space-evenly">
                {renderEquipmentSlot('ring1', 'Ring 1')}
                {renderEquipmentSlot('ring2', 'Ring 2')}
                {renderEquipmentSlot('earring1', 'Earring 1')}
                {renderEquipmentSlot('earring2', 'Earring 2')}
                {renderEquipmentSlot('necklace', 'Necklace')}
              </Grid>
            </Grid>
          </Grid>

        </Box>

        {/* 인벤토리 슬롯 */}
        <Typography variant="h6" align="center" sx={{border:'solid'}}>Inventory</Typography>
        <Grid container sx={{border:'solid'}}>
          {inventoryItems.map((item) => (
            <Grid item key={item.id} sx={{margin:'5px'}}>
              <Tooltip title={item.description}>
                <Card onClick={() => handleItemClick(item)}sx={itemStyle}>
                  <CardContent>
                    <Typography>{item.name}</Typography>
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
          ))}
        </Grid>

        {/* 팝업창 */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{selectedSlot ? 'Manage Equipment' : selectedItem?.name}</DialogTitle>
          <DialogContent>
            {selectedSlot ? (
              `Do you want to unequip the ${equippedItems[selectedSlot]?.name}?`
            ) : (
              selectedItem?.description
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            {selectedSlot ? (
              <Button onClick={handleUnequip}>Unequip</Button>
            ) : (
              <Button onClick={handleEquip}>Equip</Button>
            )}
            {selectedItem && <Button color="error">Destroy</Button>}
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Inventory;
