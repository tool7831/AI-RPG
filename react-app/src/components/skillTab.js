import React, { useState } from 'react';
import { Typography, Grid, List, Box, Button, Container, ListItemButton, Tab, Tabs } from '@mui/material';
import { StatIcons, StatusEffectIcons, SkillIcons } from './icons';
import { AttackBox, DefendBox, SmiteBox } from './skillBox.js';

function SkillTab({ actor }) {

  const [selectedTab, setSelectedTab] = useState(0)
  const [selectedSkill, setSelectedSkill] = useState(0);

  const handleTabChange = (event, value) => {
    setSelectedTab(value);
    setSelectedSkill(0)
  }
  const handleSkillSelect = (skill) => {
    setSelectedSkill(skill);
  };

  const renderSkills = (skills) => (
    <Box sx={{ border: 'solid', padding: '10px' }}>
      <Grid container>
        <Grid item xs={12} lg={6}>
          <List>
            {skills.map((skill, index) => (
              <ListItemButton key={index} onClick={() => handleSkillSelect(index)} disabled={skill.curCooldown !== 0} >
                <Typography mr={1}>{skill.name}</Typography>
                <SkillIcons type={skill.type} style={{ width: '20px', height: '20px' }} />
                {selectedTab === 0 && <Typography ml={1}>{skill.getTotalDamage(actor.status.status)}</Typography>}
                {selectedTab === 1 && <Typography ml={1}>{skill.getTotalValue(actor.status.status)}</Typography>}
                {selectedTab === 2 && <Typography ml={1}>{skill.getTotalValue(actor.status.status)}</Typography>}
                <Typography ml={1} variant="body2" color="textSecondary"> ({skill.curCooldown})</Typography>
              </ListItemButton>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} lg={6}>
          {selectedSkill !== null && selectedTab === 0 && (
            <Box sx={{ mt: 2 }}>
              <AttackBox skill={actor.attacks[selectedSkill]} status={actor.status.status} />
            </Box>
          )}
          {selectedSkill !== null && selectedTab === 1 && (
            <Box sx={{ mt: 2 }}>
              <DefendBox skill={actor.defends[selectedSkill]} status={actor.status.status} />
            </Box>
          )}
          {selectedSkill !== null && selectedTab === 2 && (
            <Box sx={{ mt: 2 }}>
              <SmiteBox skill={actor.smites[selectedSkill]} status={actor.status.status} />
            </Box>
          )}
        </Grid>

      </Grid>


    </Box>
  );

  return (
    <div>
      <Tabs value={selectedTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
        <Tab value={0} label='Attacks' />
        <Tab value={1} label='Defends' />
        <Tab value={2} label='Smites' />
      </Tabs>

      {selectedTab === 0 && renderSkills(actor.attacks)}
      {selectedTab === 1 && renderSkills(actor.defends)}
      {selectedTab === 2 && renderSkills(actor.smites)}
    </div>
  )

}

export default SkillTab