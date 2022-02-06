import { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";

import { leakTest } from "../services/api";

const LeakTest = () => {
  const [leak, setLeak] = useState({ dns: true, ip: true });

  useEffect(() => {
    const fetchLeak = async () => {
      console.log("fetching leak");
      const res = await leakTest();
      console.log(res);
      setLeak(res);
    };
    fetchLeak();
  }, []);

  return (
    <Paper elevation={6}>
      <div>
        {leak.ip ? (
          <Alert severity="error">IP -{">"} Leak</Alert>
        ) : (
          <Alert severity="success">IP -{">"} OK</Alert>
        )}{" "}
        {leak.dns ? (
          <Alert severity="error">DNS -{">"} Leak</Alert>
        ) : (
          <Alert severity="success">DNS -{">"} OK</Alert>
        )}
      </div>
    </Paper>
  );
};

export default LeakTest;
