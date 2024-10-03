import React, { useState } from 'react';
import { Button, Modal, Tab, Tabs, Box } from '@mui/material';
import Inventory from './inventory';
import StatusTab from './statusTab.js';
import SkillTab from './skillTab.js';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    height: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    backgroundColor: 'white',
    overFlowY: 'auto'
};

function MenuButton({actor, onClose, ...props}) {
    const [inventoryVisible, setInventoryVisible] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);

    const handleInventoryToggle = () => {
        setInventoryVisible(!inventoryVisible);
        setSelectedTab(0);
        onClose(actor);
    };

    const handleTabChange = (event, value) => {
        setSelectedTab(value);
    }
    return (
        <Box {...props}>
            <Button variant="contained" sx={{ borderRadius: 2 }} onClick={handleInventoryToggle} >Inventory</Button>
            <Modal open={inventoryVisible}>
                <div style={style}>
                    <Tabs value={selectedTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
                        <Tab value={0} label='Inventory' />
                        <Tab value={1} label='Status' />
                        <Tab value={2} label='Skills' />
                    </Tabs>
                    <Button variant='contained' onClick={handleInventoryToggle} sx={{ position: ' absolute', top: "0%", right: "0%" }}>Close</Button>
                    {selectedTab === 0 && <Inventory actor={actor} />}
                    {selectedTab === 1 && <StatusTab actor={actor} />}
                    {selectedTab === 2 && <SkillTab actor={actor} />}

                </div>
            </Modal>
        </Box>
    )
}

export default MenuButton;

