import React, { useState } from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Drawer from "@mui/material/Drawer";
// import SpotifyPlayer from 'react-spotify-web-playback';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import NewWindow from "react-new-window";

type DrawerProps = {
    title: string;
    songsData: [
        {
            name: string;
            image: string;
            listeners: string;
        }
    ];
    open: boolean;
    toggleDrawer: () => void;
    setDrawer: (newState: boolean) => void;
};
const openInNewTab = (url: string | URL | undefined) => {
    window.open(url, "_blank", "popup,noopener,noreferrer");
};

function TrendDrawer(props: DrawerProps) {
    const [authed] = useState(false);
    const [spotifyURL, setSpotifyURL] = useState("");
    const [showDialog, setShowDialog] = useState(false);

    function handleButtonClick(): void {
        if (authed) {
            console.log("Authenticated!");
        } else {
            fetch(process.env.REACT_APP_API_URL + "/auth/url")
                .then((res) => res.text())
                .then((url) => setSpotifyURL(url));
        }
        console.log(spotifyURL);

        setShowDialog(true);

        openInNewTab(spotifyURL);
    }

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
                open={props.open}
                onClose={props.toggleDrawer}
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
                                return song.name ? (
                                    <ListItem key={song.name} disablePadding>
                                        <ListItemButton onClick={handleButtonClick}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    alt={`Avatar n°${song.name}`}
                                                    src={`${song.image}`}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                id={labelId}
                                                primary={`${song.name} | ${song.listeners}`}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ) : (
                                    ""
                                );
                            })}
                        </List>

                        {/* <SpotifyPlayer
                token="BQCHy2muPvGJcg8fzkowoSidIEKlZlGEpOpjuNFvdO3sikTaP2SkgEJ8jADr6QQHRqUzQN3VLyv94QmvJz5UbIWcwkFzezNpenXbFfTk1IHxamPxCa0"
                uris={['spotify:artist:6HQYnRM4OzToCYPpVBInuU']}
                /> */}
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
