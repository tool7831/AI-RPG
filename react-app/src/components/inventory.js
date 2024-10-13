import React, { useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, Button, Container, Popover } from '@mui/material';
import { Item, ItemType } from '../scripts/item.ts';
const itemStyle = {
  width: 70, 
  height: 70, 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  border: '1px solid grey', 
  cursor: 'pointer'
}
// 임시 아이템 데이터
const items = [
  { name: 'Sword', type: 'leftHand', description: 'A sharp blade for cutting.', effects: { strength: 10 }, use_restriction: { strength: 5 } },
  { name: 'Plate Armor', type: 'armor', description: 'A sturdy shield for defense.', effects: { defense: 15, speed: -10 }, use_restriction: { strength: 15 } },
  { name: 'Potion', type: 'consumable', description: 'A healing potion.', effects: { strength: 10 }, use_restriction: { strength: 5 } },
  { name: 'Plate Pants', type: 'pants', description: 'A sharp blade for cutting.', effects: { defense: 10, speed: -5 }, use_restriction: { strength: 10 } },
  { name: 'Leather Gloves', type: 'gloves', description: 'A sturdy shield for defense.', effects: { defense: 2, dexterity: 3 }, use_restriction: { dexterity: 5 } },
  { name: 'Plate Gloves', type: 'gloves', description: 'A sturdy shield for defense.', effects: { defense: 5 }, use_restriction: { strength: 5 } },
  { name: 'Cursed Ring', type: 'ring1', description: 'A cursed ring', effects: { intelligence: 10, speed: -10, strength: -10 }, use_restriction: {} }
];

function formatStat(value) {
  return value >= 0 ? `+${value}` : `${value}`;
}

const Inventory = ({ actor }) => {
  const [equippedItems, setEquippedItems] = useState(actor.inventory.equipments); // 플레이어의 장착된 아이템들
  const [inventoryItems, setInventoryItems] = useState(actor.inventory.items); // 플레이어의 인벤토리 아이템들
  const [selectedItem, setSelectedItem] = useState(null); // 클릭한 아이템
  const [selectedItemIdx, setSelectedItemIdx] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null); // 선택한 장비 슬롯
  const [anchorEl, setAnchorEl] = useState(null);
  const [render, setRender] = useState(0);

  const open = Boolean(anchorEl); // Popover 열림 상태 확인
  const id = open ? 'simple-popover' : undefined;

  const inventoryWithEmptySlots = [...inventoryItems];
  while (inventoryWithEmptySlots.length < actor.inventory.max_size) {
    inventoryWithEmptySlots.push(null); // 빈칸 추가
  }
  // 아이템 클릭 핸들러
  const handleItemClick = (item, idx, event) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
    setSelectedItemIdx(idx);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setRender(render + 1)
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
      setSelectedSlot(slot);
      setSelectedItem(equippedItems[slot])
      setAnchorEl(event.currentTarget);
    }
  };

  const handleDestroy = () => {
    actor.inventory.removeItem(selectedItemIdx);
    handleClose();
  }

  // 장비 슬롯 렌더링
  const renderEquipmentSlot = (slot, label) => (
    <Card sx={{ 
        width: 100, 
        height: 100, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'flex-start', 
        alignItems: 'center', 
        border: '1px solid grey',
        mb: 2 
      }} 
      onClick={(e) => handleEquipmentClick(slot, e)}
    >
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
      <Button onClick={addItem}>Add</Button>
      <Button onClick={clear}>Clear</Button>
      <Box 
        sx={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          flexDirection: 'column' 
          }}
      >
        {/* 장비 슬롯 */}
        <Box sx={{ border: 'solid' }}>
          <Typography variant="h6" align="center" sx={{ border: 'solid' }}>Equipped Items</Typography>
          <Grid container sx={{ 
            height:'300px',
            minWidth:'500px', 
            border: 'solid', backgroundColor: 'gray', overflowY: 'auto' }}>
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
        <Grid container sx={{ border: 'solid', height:'50%', overflowY:'auto' }}>
        {inventoryWithEmptySlots.map((item, idx) => (
          <Grid item xs={1} key={idx} sx={{ margin: '5px' }}>
            <Card
              onClick={(e) => item && handleItemClick(item, idx, e)} // 아이템이 있을 때만 클릭 이벤트
              sx={{ ...itemStyle, backgroundColor: item ? 'white' : '#f0f0f0' }} // 아이템 없을 때 색 변경
            >
              <CardContent>
                <Typography>
                  {item ? item.name : ''}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        </Grid>


        {/* 아이템 설명 */ }
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
            <Typography variant="h5">{selectedItem?.name}</Typography>
            <Typography>{selectedItem?.description}</Typography>
            <Typography variant='h6'>Effects</Typography>
            {selectedItem && Object.keys(selectedItem?.effects).map((stat) => (
              selectedItem?.effects[stat] !== null &&
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Typography color="textSecondary" key={stat} sx={{ textTransform: 'capitalize' }} >{stat}: {selectedItem?.effects[stat]}</Typography>
                {!selectedSlot && (
                  <Typography color={(equippedItems[selectedItem?.type]?.effects[stat] ? selectedItem?.effects[stat] - equippedItems[selectedItem?.type]?.effects[stat] : selectedItem?.effects[stat]) > 0 ? "primary" : "error"}
                    sx={{ marginLeft: '5px' }}>
                    ({formatStat(equippedItems[selectedItem?.type]?.effects[stat] ? selectedItem?.effects[stat] - equippedItems[selectedItem?.type]?.effects[stat] : selectedItem?.effects[stat])})
                  </Typography>)}
              </Box>
            ))}
            <Typography variant='h6'>Use Restriction</Typography>
            {selectedItem && Object.keys(selectedItem?.use_restriction).map((stat) => (
              selectedItem?.use_restriction[stat] !== null &&
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Typography color="textSecondary" key={stat} sx={{ textTransform: 'capitalize' }}>{stat}: {selectedItem?.use_restriction[stat]}</Typography>
                {!selectedSlot && (
                  <Typography color={selectedItem?.use_restriction[stat] <= actor.status.origin_status[stat] ? "primary" : "error"} sx={{ marginLeft: '5px' }}>
                    ({actor.status.origin_status[stat]})
                  </Typography>)}
              </Box>
            ))}
            {selectedItem && (<Button onClick={handleClose}>Cancel</Button>)}
            {selectedSlot !== null && (<Button onClick={handleUnequip}>Unequip</Button>)}
            {selectedSlot === null && (selectedItem?.type !== ItemType.Consumable ? (<Button onClick={handleEquip}>Equip</Button>) : (<Button>Use</Button>))}
            {selectedSlot === null && <Button color="error" onClick={handleDestroy}>Destroy</Button>}
          </CardContent>
        </Popover>
      </Box>
    </Container>
  );
};

export default Inventory;
