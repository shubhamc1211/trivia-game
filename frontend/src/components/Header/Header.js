import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { SmartToy } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import NotificationBox from "modules/Notifiaction";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const pages = ["About", "Login", "Team", "Games", "Leaderboard"];
const paths = ["/about", "/login", "/team", "/games", "/leaderboard"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function adjustHeight() {
  const root = document.getElementById("root");
  const header = document.getElementsByTagName("header")[0];
  root.style.height = `calc(100vh - ${header.clientHeight}px)`;

  // get second child of root
  const main = root.children[1];
  if (main && main.clientHeight < root.clientHeight) {
    main.style.height = `calc(100vh - ${header.clientHeight}px)`;
  }
}

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [newNotification, setNewNotification] = React.useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    // execute on location change
    console.log("Location changed!", location.pathname);
    adjustHeight();
    const excludedPaths = [
      "/",
      "/about",
      "/login",
      "/register",
      "/validate",
      "/questions",
    ];

    if (!excludedPaths.includes(location.pathname)) {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/login", {
          state: {
            errorMessage: "Please login to continue.",
          },
        });
      }
    }
  }, [location, navigate]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (item) => {
    const userId = localStorage.getItem("userId");

    console.log(item);
    if (item === "Logout") {
      localStorage.clear();
      navigate("/login");
    }
    if (item === "Profile") {
      navigate(`/user/${userId}`);
    }
    setAnchorElUser(null);
  };
  const handleNotifaction = () => {
    setOpen(true);
  };

  const handleNavMenuClick = (page) => {
    setAnchorElNav(null);

    console.log(page);

    if (page === undefined) return;

    const pageIndex = pages.indexOf(page);
    const navigateTo = paths[pageIndex];
    navigate(navigateTo);
  };

  return (
    <AppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <SmartToy
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 1,
              height: "48px",
              width: "48px",
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            T
            <Typography
              sx={{
                mt: 0.7,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              rivia
            </Typography>
            T
            <Typography
              sx={{
                mt: 0.7,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              itans
            </Typography>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={() => {
                    handleNavMenuClick(page);
                  }}
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <SmartToy
            sx={{
              display: { xs: "flex", md: "none" },
              mr: 1,
              height: "36px",
              width: "36px",
            }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 1,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            T
            <Typography
              sx={{
                display: { xs: "flex", md: "none" },
                mt: 0.7,
                fontFamily: "monospace",
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              rivia
            </Typography>
            T
            <Typography
              sx={{
                display: { xs: "flex", md: "none" },
                ml: 0,
                mt: 0.7,
                fontFamily: "monospace",
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              itans
            </Typography>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => {
                  handleNavMenuClick(page);
                }}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>
          {localStorage.getItem("userId") ? (
            <>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                <Button
                  key={"Notification"}
                  onClick={handleNotifaction}
                  sx={{ my: 2, color: "white", display: "block", width: "1px" }}
                >
                  {!newNotification ? (
                    <NotificationsIcon />
                  ) : (
                    <NotificationsActiveIcon />
                  )}
                </Button>
              </Box>
              <NotificationBox
                open={open}
                setOpen={setOpen}
                setNewNotification={setNewNotification}
              />
            </>
          ) : (
            <></>
          )}
          {localStorage.getItem("userId") && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      handleCloseUserMenu(setting);
                    }}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
