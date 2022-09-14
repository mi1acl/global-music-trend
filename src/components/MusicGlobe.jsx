import Globe from "react-globe.gl";
import React from "react";
import * as d3 from "d3";
import { useState, useMemo, useEffect, useRef } from "react";
import * as ReactDOMServer from "react-dom/server";
import { country_data } from "../utils/data/coutries.js";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Drawer from "@mui/material/Drawer";

function PolygonLabel({ properties: d }) {
  let lbl = (
    <p className="text-slate-100 bg-gray-700 bg-opacity-60 rounded-sm p-1 left-0">{`${d.ADMIN} (${d.ISO_A2})`}</p>
  );
  return ReactDOMServer.renderToStaticMarkup(lbl);
}

function MusicGlobe() {
  const [countries, setCountries] = useState({ features: [] });
  const [hoverD, setHoverD] = useState();
  const [clickD, setClickD] = useState();
  const [songsData, setSongsData] = useState();
  const [drawer, setDrawer] = useState(true);
  const globeEl = useRef();

  useEffect(() => {
    // load data
    setCountries(country_data);
  }, []);

  useEffect(() => {
    // Auto-rotate
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = -0.1;

    globeEl.current.pointOfView({ lat: 150, lng: 90 }, 1000);
  }, []);

  const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);

  // GDP per capita (avoiding countries with small pop)
  const getVal = (feat) =>
    feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);

  const maxVal = useMemo(
    () => Math.max(...countries.features.map(getVal)),
    [countries]
  );
  colorScale.domain([0, maxVal]);

  // what happens when a country is clicked
  function handleClick(d) {
    setClickD(d);
    setDrawer(true);
    let aKey = process.env.REACT_APP_LASTFM_API_KEY;
    let url = `http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=${d.properties.BRK_NAME}&api_key=${aKey}&format=json&limit=10`;

    // fetch 10 most popular songs for the country.
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        data.message
          ? setSongsData(null) // message indicates an error
          : setSongsData(
              // Sort and save the data in the songsData state
              data.tracks.track.sort((a, b) => b.listeners - a.listeners)
            );
      });

    // console.log(songsData);
  }

  // ===================
  // music card contents
  // ===================
  const toggleDrawer = (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawer(false);
  };

  const drawer_contents = (
    <React.Fragment>
      {clickD ? (
        <Drawer
          //   variant="permanent"
          sx={{
            // width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              //   width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          anchor="left"
          open={drawer}
          onClose={toggleDrawer}
        >
          <Toolbar />
          {songsData ? (
            <>
              <Typography variant="h5" className="text-center">
                {clickD.properties.ADMIN}
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
                {songsData.map((song) => {
                  const labelId = `checkbox-list-secondary-label-${song}`;
                  return (
                    <ListItem key={song.name} disablePadding>
                      <ListItemButton>
                        <ListItemAvatar>
                          <Avatar
                            alt={`Avatar n°${song + 1}`}
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
      ) : (
        <Typography variant="h5">
          {"I will show trending music in every country, just select one!"}
        </Typography>
      )}
    </React.Fragment>
  );
  return (
    <>
      {drawer_contents}
      <Globe
        ref={globeEl}
        className="z-0 absolute left-0"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        showAtmosphere={true}
        atmosphereAltitude="0.20"
        lineHoverPrecision={0}
        polygonsData={countries.features.filter(
          // exclude antartica
          (d) => d.properties.ISO_A2 !== "AQ"
        )}
        polygonAltitude={(d) => (d === hoverD ? 0.12 : 0.06)}
        polygonCapColor={(d) =>
          d === hoverD ? "steelblue" : colorScale(getVal(d))
        }
        polygonSideColor={() => "rgba(0, 100, 0, 0.15)"}
        polygonStrokeColor={() => "#111"}
        polygonLabel={PolygonLabel}
        onPolygonHover={setHoverD}
        onPolygonClick={handleClick}
        polygonsTransitionDuration={300}
      />
    </>
  );
}
export default MusicGlobe;
