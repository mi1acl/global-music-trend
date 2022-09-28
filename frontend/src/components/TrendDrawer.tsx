import React, { useState, useEffect } from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Drawer from "@mui/material/Drawer";
import SpotifyPlayer from "react-spotify-web-playback";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import NewWindow from "react-new-window";

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

const openInPopUp = (url: string | URL | undefined) => {
    window.open(url, "_blank", "popup,noopener,noreferrer");
};

function TrendDrawer(props: DrawerProps) {
    const [authed, setAuthed] = useState(false);
    const [spotifyURL, setSpotifyURL] = useState("");
    const [token, setToken] = useState("");

    function handleButtonClick(): void {
        fetch(process.env.REACT_APP_API_URL + "/callback/authed")
            .then((res) => res.json())
            .then((body) => (body.authed ? setAuthed(true) : setAuthed(false)));
        if (authed) {
            console.log("authed");

            fetch(process.env.REACT_APP_API_URL + "/callback/test")
                .then((res) => res.json())
                .then((json) => {
                    if (json.token) {
                        setToken(json.token);
                    }
                });
        } else {
            fetch(process.env.REACT_APP_API_URL + "/auth/url")
                .then((res) => {
                    return res.text();
                })
                .then((url) => {
                    setSpotifyURL(url);
                })
                .catch((err) => console.log("something went wrong", err));
        }
    }

    useEffect(() => {
        if (spotifyURL) {
            openInPopUp(spotifyURL);
        }
    }, [spotifyURL]);
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
                        {token ? (
                            <SpotifyPlayer
                                token={token}
                                uris={["spotify:artist:6HQYnRM4OzToCYPpVBInuU"]}
                            />
                        ) : (
                            ""
                        )}
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
