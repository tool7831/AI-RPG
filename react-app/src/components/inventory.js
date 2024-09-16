import React, { act, useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, Tooltip, Button, Dialog, DialogTitle, DialogActions, DialogContent, Container, Popover } from '@mui/material';
import { Item, ItemType } from '../scripts/item.ts';
const itemStyle = {
  width: 70, height: 70, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid grey', cursor: 'pointer'
}
// 임시 아이템 데이터
const items = [
  { name: 'Sword', type: 'leftHand', description: 'A sharp blade for cutting.', effects: { strength: 10 }, use_restriction: { strength: 5 } },
  { name: 'Plate Armor', type: 'armor', description: 'A sturdy shield for defense.', effects: { defense: 15, speed: -10 }, use_restriction: { strength: 15 } },
  { name: 'Potion', type: 'consumable', description: 'A healing potion.', effects: { strength: 10 }, use_restriction: { strength: 5 } },
  { name: 'Plate Pants', type: 'pants', description: 'A sharp blade for cutting.', effects: { defense: 10, speed: -5 }, use_restriction: { strength: 10 } },
  { name: 'Leather Gloves', type: 'gloves', description: 'A sturdy shield for defense.', effects: { defense: 2, dexterity: 3 }, use_restriction: { dexterity: 5 } },
  { name: 'Plate Gloves', type: 'gloves', description: 'A sturdy shield for defense.', effects: { defense: 5 }, use_restriction: { strength: 5 } },
  { name: 'Cursed Ring', type: 'ring1', description: 'A cursed ring', effects: { speed: -10 }, use_restriction: {} }
];


const Inventory = ({ actor, handleInventoryToggle }) => {
  const [equippedItems, setEquippedItems] = useState(actor.inventory.equipments); // 플레이어의 장착된 아이템들
  const [inventoryItems, setInventoryItems] = useState(actor.inventory.items); // 플레이어의 인벤토리 아이템들
  const [selectedItem, setSelectedItem] = useState(null); // 클릭한 아이템
  const [selectedItemIdx, setSelectedItemIdx] = useState(null)
  const [openDialog, setOpenDialog] = useState(false); // 팝업 열림 상태
  const [selectedSlot, setSelectedSlot] = useState(null); // 선택한 장비 슬롯
  const [anchorEl, setAnchorEl] = useState(null);
  const [render, setRender] = useState(0);

  const open = Boolean(anchorEl); // Popover 열림 상태 확인
  const id = open ? 'simple-popover' : undefined;

  // 아이템 클릭 핸들러
  const handleItemClick = (item, idx, event) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
    setSelectedItemIdx(idx);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExited = () => {
    setTimeout(() => {
      setSelectedItem(null);
      setSelectedItemIdx(null);
      setSelectedSlot(null);
    }, 200)
  };

  // 아이템 장착 핸들러
  const handleEquip = () => {
    if (selectedItem) {
      // 이미 장착된 아이템이 있으면 인벤토리로 이동
      const existingItem = equippedItems[selectedItem.type];
      actor.equip(selectedItemIdx);

      console.log('Equip:', selectedItem)
      console.log('Unequip:', existingItem);
    }

    setEquippedItems(actor.inventory.equipments)
    handleClose();
  };

  // 장비 해제 핸들러
  const handleUnequip = () => {
    if (selectedSlot && equippedItems[selectedSlot]) {
      const unequippedItem = equippedItems[selectedSlot];
      actor.unequip(selectedSlot)
      console.log('Unequip:', unequippedItem)
    }
    setEquippedItems(actor.inventory.equipments)
    handleClose();
  };

  // 장비 슬롯 클릭 핸들러
  const handleEquipmentClick = (slot, event) => {
    if (equippedItems[slot]) {
      setAnchorEl(event.currentTarget);
      setSelectedSlot(slot);
      setSelectedItem(equippedItems[slot])
    }
  };

  const handleDestroy = () => {
    actor.inventory.removeItem(selectedItemIdx);
    handleClose();
  }

  // 장비 슬롯 렌더링
  const renderEquipmentSlot = (slot, label) => (
    <Card sx={{ width: 100, height: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', border: '1px solid grey', mb: 2 }} onClick={(e) => handleEquipmentClick(slot, e)}>
      <Typography>{label}</Typography>
      {equippedItems[slot] ? (
        <Typography>{equippedItems[slot].name}</Typography>
      ) : null}
    </Card>
  );

  const addItem = () => {
    items.forEach((item) => actor.inventory.addItem(Item.fromJSON(item)))
    setInventoryItems(actor.inventory.items)
    setRender(render + 1)
  }
  const clear = () => {
    actor.inventory.items = []
    setInventoryItems(actor.inventory.items)
    setEquippedItems(actor.inventory.equipments)
  }
  return (
    <Container>
      <Button variant='contained' onClick={handleInventoryToggle}>Close</Button>
      <Button onClick={addItem}>Add</Button>
      <Button onClick={clear}>Clear</Button>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        {/* 장비 슬롯 */}
        <Box sx={{ border: 'solid' }}>
          <Typography variant="h6" align="center" sx={{ border: 'solid' }}>Equipped Items</Typography>
          <Grid container sx={{ border: 'solid', backgroundColor: 'gray' }}>
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
        <Typography variant="h6" align="center" sx={{ border: 'solid' }}>Inventory</Typography>
        <Grid container sx={{ border: 'solid' }}>
          {inventoryItems.map((item, idx) => (
            <Grid item key={idx} sx={{ margin: '5px' }}>
              <Card onClick={(e) => handleItemClick(item, idx, e)} sx={itemStyle}>
                <CardContent>
                  <Typography>{item.name}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Popover id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          TransitionProps={{onExit: handleExited}}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <CardContent>
            <Typography variant="h6">{selectedItem?.name}</Typography>
            <Typography>{selectedItem?.description}</Typography>
            {selectedItem && Object.keys(selectedItem?.effects).map((stat) =>
              <Typography color="textSecondary" key={stat}>{stat}: {selectedItem?.effects[stat]}</Typography>
            )}
            
            {selectedItem && (<Button onClick={handleClose}>Cancel</Button>)}
            {selectedSlot && (<Button onClick={handleUnequip}>Unequip</Button>)}
            {!selectedSlot && selectedItem?.type !== ItemType.Consumable && (<Button onClick={handleEquip}>Equip</Button>)}
            {!selectedSlot && <Button color="error" onClick={handleDestroy}>Destroy</Button>}
          </CardContent>
        </Popover>

      </Box>
    </Container>
  );
};

export default Inventory;
