import * as React from "react";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { ShareOutlined } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import Facebook from "./Facebook";
import Twitter from "./Twitter";

export default function SimpleDialogDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <IconButton
        color="primary"
        onClick={() => setOpen(true)}
        sx={{ border: "1px solid", borderColor: "primary.main" }}
      >
        <ShareOutlined />
      </IconButton>

      <Dialog onClose={() => setOpen(false)} open={open}>
        <List sx={{ display: "flex", gap: 2, p: 2 }}>
          <ListItem><Facebook /></ListItem>
          <ListItem><Twitter /></ListItem>
        </List>
      </Dialog>
    </React.Fragment>
  );
}
