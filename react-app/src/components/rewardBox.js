import { Box, Typography } from "@mui/material";
import React from "react";
import ItemBox from "./itemBox";
import { StatIcons } from "./icons";


function RewardBox({rewards, ...props}) {
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    return (
        <div {...props}>
            { typeof rewards === 'object' && Object.keys(rewards).map((key) => {
                if(typeof rewards[key] === 'object' && rewards[key] !== undefined) {
                    if (key === "exp" || key === "gold" || key === "heal") {
                        return <Typography key={key} >{key}: {rewards[key]}</Typography>
                    }
                    else if (key === "stats") {
                        return (Object.keys(rewards[key]).map((stat) => (
                            rewards[key][stat] !== null &&
                            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                <StatIcons key={stat+'icon'} type={key} />
                                <Typography variant="body2" key={stat} sx={{ marginLeft: '10px' }}>
                                {capitalize(stat)}: {rewards[key][stat]}
                                </Typography>
                            </Box>
                        )))
                    }
                    else if (key === "items") {
                        return rewards[key].map((item, idx) => <ItemBox key={idx} item={item} sx={{}}/>) 
                    }
                    return null;
                }
             }
            )}
        </div>
    )
}

export default RewardBox

