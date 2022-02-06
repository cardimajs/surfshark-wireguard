import React, { useState, useEffect } from "react";
import axios from "axios";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Appbar from "./components/Appbar";
import CssBaseline from "@mui/material/CssBaseline";
import LeakTest from "./components/LeakTest";

import { connect, disconnect } from "./services/api";

const App = () => {
  const [servers, setServers] = useState<any>([]);

  useEffect(() => {
    const fetchServers = async () => {
      const servers = await axios.get("http://localhost:4000/servers");
      setServers(servers.data);
    };
    fetchServers();
  }, []);

  return (
    <>
      <CssBaseline />
      <Appbar />
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Paper
            style={{ maxHeight: "calc(100vh - 65px)", overflow: "auto" }}
            elevation={8}
          >
            <List>
              {servers.map((server: any) => (
                <List key={server.hostname}>
                  <ListItem
                    secondaryAction={
                      <Button
                        variant="outlined"
                        color="success"
                        onClick={() => {
                          connect(server.hostname);
                        }}
                      >
                        Connect
                      </Button>
                    }
                  >
                    <ListItemAvatar>
                      <img src={server.location.flagUrl} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${server.location.region} - ${server.location.country}`}
                      secondary={`${server.tags.join(", ")}`}
                    />
                  </ListItem>
                </List>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={8}>
          <br />
          <Button variant="outlined" color="error" onClick={() => disconnect()}>
            Disconnect
          </Button>
          <br />
          <br />

          <Grid item xs={4}>
            <LeakTest />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default App;
