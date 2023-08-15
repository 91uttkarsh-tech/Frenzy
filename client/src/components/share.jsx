import * as React from "react";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { ShareOutlined } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import Facebook from "./Facebook";
import Twitter from "./Twitter";

export default function SimpleDialogDemo() {
  const [O, setO] = React.useState(false);
  return (
    <React.Fragment>
      <Button variant="outlined" onClick={()=>{setO(true)}}>
        <ShareOutlined/>
      </Button>
      <Dialog onClose={() => {setO(false)}} open={O}>
        <List sx={{display:'flex' }}>
          <ListItem><Facebook/></ListItem>
          <ListItem><Twitter/></ListItem>
        </List>
      </Dialog>
    </React.Fragment>
  );
}
