import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Box, Tooltip, tooltipClasses } from "@mui/material";
import APIs from "utils/APIs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

// Refered from https://mui.com/material-ui/react-dialog/

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle
      sx={{
        m: 0,
        p: 2,
        position: "relative",
        right: 0,
        top: 0,
      }}
      {...other}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

// Refered from https://mui.com/material-ui/react-tooltip/
const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

function NotificationBox({ open, setOpen, setNewNotification }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = React.useState(null);

  const notificationClick = (path) => {
    // console.log("Notification clicked..", path);
    if (path == "") {
      return;
    }
    navigate(path);
    setOpen(false);
  };

  const fetchData = () => {
    // console.log("in fetch data..");
    axios
      .post(APIs.API_GET_NOTIFICATION, { id: localStorage.getItem("userId") })
      .then((response) => {
        setData(response.data);
        // console.log("notification data:", response.data[0].isNew);
        if (response.data[0].isNew) {
          // console.log("new notification is true..");
          setNewNotification(true);
          enqueueSnackbar("You got a new Notification", { variant: "info" });
          // console.log("new notification is true");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    // console.log("Notifications called");
  };

  React.useEffect(() => {
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // React.useEffect(() => {
  //   if (localStorage.getItem("userId")) {
  //     navigate(`/login`);
  //   }
  // }, []);

  const handleClose = () => {
    setOpen(false);
    setNewNotification(false);
  };

  return (
    <div sx={{ overflowX: "hidden" }}>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="notification-title"
        open={open}
      >
        <BootstrapDialogTitle id="notification-title" onClose={handleClose}>
          Notification
        </BootstrapDialogTitle>
        <DialogContent
          dividers
          sx={{
            minWidth: "250px",
          }}
        >
          {data ? (
            data[0].data.map((item, index) => (
              <div
                className="clickNotifictionDiv"
                onClick={() => notificationClick(item.path)}
                // OnClick={() => notificationClick(item.path)}
              >
                <HtmlTooltip
                  disableHoverListener={item.path == "" ? true : false}
                  title={
                    <React.Fragment>
                      <Typography color="inherit">
                        Go to <u>{item.goToLocation}</u>
                      </Typography>
                    </React.Fragment>
                  }
                >
                  <Box
                    border={1}
                    borderRadius={4}
                    p={2}
                    margin={1}
                    sx={{ backgroundColor: "rgb(25,118,210)" }}
                  >
                    <Typography
                      gutterBottom
                      key={index}
                      sx={{ wordWrap: "break-word", color: "white" }}
                    >
                      {item.notification}
                    </Typography>
                    <Typography sx={{ textAlign: "right", color: "lightgray" }}>
                      {item.date}
                    </Typography>
                  </Box>
                </HtmlTooltip>
              </div>
            ))
          ) : (
            <Box border={1} borderRadius={4} p={2}>
              <Typography gutterBottom>No Notification</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

export default NotificationBox;
