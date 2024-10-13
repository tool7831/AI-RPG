import { Box, Typography } from "@mui/material";
import React from "react";
import { StatIcons } from "./icons";


function PenaltyBox({penalty, ...props}) {
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    return (
        <div {...props}>
            {penalty.map((p) => {
                if (p?.type === "exp" || p?.type === "gold" || p?.type === "damage") {
                    return <Typography key={p?.type} >{p?.type}: {p?.value}</Typography>
                }
                else if (p?.type === "stats") {
                    return (Object.keys(p?.value).map((stat)=> (
                        p?.value[stat] !== null &&
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            <StatIcons key={stat+'icon'} type={stat} />
                            <Typography variant="body2" key={stat} sx={{ marginLeft: '10px' }}>
                            {capitalize(stat)}: {p?.value[stat]}
                            </Typography>
                        </Box>
                    )))
                }
                return <p>error</p>
             }
            )}
        </div>
    )
}

export default PenaltyBox

