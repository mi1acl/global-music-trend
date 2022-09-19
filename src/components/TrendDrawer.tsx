import React from 'react'
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Drawer from "@mui/material/Drawer";
type DrawerProps = {
    title: string;
    songsData: [{
        image: {"#text":string}[];
        name: string;
        listeners: string;
    }];
    drawer: boolean;


    setDrawer: (newState:boolean)=>void;
}

function TrendDrawer(props: DrawerProps) {

  const toggleDrawer = (event: { type: string; key: string; }) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    props.setDrawer(false);
  };
    return ( 
        <React.Fragment>
          <Drawer
              variant="temporary"
            sx={{
              // width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                //   width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
            anchor="left"
            open={props.drawer}
            onClose={toggleDrawer}
          >
            <Toolbar />
            {props.songsData ? (
              <>
                <Typography variant="h5" className="text-center">
                  {props.title}
                  {/* {"'s Top Songs"} */}
                </Typography>
                <List
                  dense
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}
                >
                  {props.songsData.map((song) => {
                    const labelId = `checkbox-list-secondary-label-${song}`;
                    return (
                      <ListItem key={song.name} disablePadding>
                        <ListItemButton>
                          <ListItemAvatar>
                            <Avatar
                              alt={`Avatar n°${song.name }`}
                              src={`${song.image[1]["#text"]}`}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            id={labelId}
                            primary={`${song.name} | ${song.listeners}`}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </>
            ) : (
              <Typography variant="h5">
                {"Could not find the songs' information for this country"}
              </Typography>
            )}
          </Drawer>

      </React.Fragment>
     );
}

export default TrendDrawer;