import React, { useState } from 'react';
import { Typography, Grid, List, Box, ListItemButton, Tab, Tabs, Button, Modal } from '@mui/material';
import { SkillIcons } from './icons';
import { AttackBox, DefendBox, SmiteBox } from './skillBox.js';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor:'white',
  border: '2px solid #000',
  boxShadow: 24,
  padding: '20px'
};

function SkillTab({ actor }) {

  const [selectedTab, setSelectedTab] = useState(0)
  const [selectedSkillIdx, setSelectedSkillIdx] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);

  const handleTabChange = (event, value) => {
    setSelectedTab(value);
    setSelectedSkillIdx(0)
  }
  const handleSkillSelect = (skill) => {
    setSelectedSkillIdx(skill);
  };

  const handleDelete = () => {
    setDeleteModal(true);
  }
  const handleCloseModal = () => {
    setDeleteModal(false);
  }
  const handleRealDelete = () => {
    actor.removeSkill(selectedTab, selectedSkillIdx);
    setSelectedSkillIdx(0)
    handleCloseModal();
  }

  const renderSkills = (skills) => (
    <Box sx={{ padding: '10px' }}>
      <Grid container>
        <Grid item xs={12} lg={6}>
          <List >
            {skills.map((skill, index) => (
              <ListItemButton key={index} sx={{border:'1px solid', borderRadius:'10px', marginBottom:'10px', marginRight:'10px'}} onClick={() => handleSkillSelect(index)} >
                <Typography mr={1}>{skill.name}</Typography>
                <SkillIcons type={skill.type} style={{ width: '20px', height: '20px' }} />
                {selectedTab === 0 && <Typography ml={1}>{skill.getTotalDamage(actor.status.status)}x{skill.count}</Typography>}
                {selectedTab === 1 && <Typography ml={1}>{skill.getTotalValue(actor.status.status)}</Typography>}
                {selectedTab === 2 && <Typography ml={1}>{skill.getTotalValue(actor.status.status)}</Typography>}
                <Typography ml={1} variant="body2" color="textSecondary"> ({skill.curCooldown})</Typography>
              </ListItemButton>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} lg={6}>
          {selectedSkillIdx !== null && selectedTab === 0 && (
            <AttackBox skill={actor.attacks[selectedSkillIdx]} status={actor.status.status} sx={{border:'1px solid #ddd', padding:'10px'}}/>
          )}
          {selectedSkillIdx !== null && selectedTab === 1 && (
            <DefendBox skill={actor.defends[selectedSkillIdx]} status={actor.status.status} sx={{border:'1px solid #ddd', padding:'10px'}}/>
          )}
          {selectedSkillIdx !== null && selectedTab === 2 && (
            <SmiteBox skill={actor.smites[selectedSkillIdx]} status={actor.status.status} sx={{border:'1px solid #ddd', padding:'10px'}}/>
          )}
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <React.Fragment>
      <Tabs value={selectedTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
        <Tab value={0} label='Attacks' />
        <Tab value={1} label='Defends' />
        <Tab value={2} label='Smites' />
      </Tabs>

      {selectedTab === 0 && renderSkills(actor.attacks)}
      {selectedTab === 1 && renderSkills(actor.defends)}
      {selectedTab === 2 && renderSkills(actor.smites)}
      <Button sx={{ml:'10px'}} variant='contained' color='error' onClick={handleDelete}>Delete Skill</Button>

      <Modal
        open={deleteModal}
        close={handleCloseModal}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <div style={style}>
          <Typography>Are you sure you want to delete it?</Typography>
          {selectedSkillIdx !== null && selectedTab === 0 && (
            <AttackBox skill={actor.attacks[selectedSkillIdx]} status={actor.status.status} sx={{border:'1px solid #ddd', padding:'10px'}}/>
          )}
          {selectedSkillIdx !== null && selectedTab === 1 && (
            <DefendBox skill={actor.defends[selectedSkillIdx]} status={actor.status.status} sx={{border:'1px solid #ddd', padding:'10px'}}/>
          )}
          {selectedSkillIdx !== null && selectedTab === 2 && (
            <SmiteBox skill={actor.smites[selectedSkillIdx]} status={actor.status.status} sx={{border:'1px solid #ddd', padding:'10px'}}/>
          )}
          <Button onClick={handleRealDelete}>Yes</Button>
          <Button onClick={handleCloseModal}>No</Button>
        </div>
      </Modal>

      </React.Fragment>
  )

}

export default SkillTab