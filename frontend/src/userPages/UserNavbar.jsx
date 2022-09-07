import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { deleteLocalStorage, setLocalStorage, returnLocalStorage } from '../components/LocalStorageHelper';
import { useContext } from 'react';
import UserContext from '../context/userContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const UserNavBar = () => {
  const {data, setData} = useContext(UserContext); // centralised data storage, s.t. data can be used anywhere
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };

    const handleDashboard = () => {
        window.location.replace("/users/dashboard");
    };

    // const handleEditProfile = () => {
    //     window.location.replace("/users/editprofile");
    // };

    const handleLogout = () => {
        deleteLocalStorage();
        window.location.replace("/");
    };


  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            PID Control of DC Motor
          </Typography>

                        
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }} style={{color:"white"}}>
                <AccountCircleIcon/>
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
                <MenuItem key={0} onClick={handleDashboard}>
                  <Typography textAlign="center">Dashboard</Typography>
                </MenuItem>

                {/* <MenuItem key={1} onClick={handleEditProfile}>
                  <Typography textAlign="center">Edit Profile</Typography>
                </MenuItem> */}

                <MenuItem key={2} onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>

            </Menu>
          </Box>
        </Toolbar>

      </Container>
    </AppBar>
  );
};
export default UserNavBar;
