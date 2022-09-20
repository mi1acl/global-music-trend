import MusicGlobe from "./MusicGlobe";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

function App() {
  return (
    <div className="App">
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Music World
          </Typography>
        </Toolbar>
      </AppBar>
      <MusicGlobe />
    </div>
  );
}

export default App;
