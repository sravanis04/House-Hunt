import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav } from 'react-bootstrap';
import { UserContext } from '../../../App';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AddProperty from './AddProperty';
import AllProperties from './AllProperties';
import AllBookings from './AllBookings';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const OwnerHome = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const { setUserData, setUserLoggedIn } = useContext(UserContext);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserData(null);
    setUserLoggedIn(false);
    navigate('/');
  }

  if (!user || !user.userData) {
    return null;
  }

  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand as={Link} to="/"><h2>RentEase</h2></Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
            </Nav>
            <Nav>
              <h5 className='mx-3 my-auto'>Hi, {user.userData.name}</h5>
              <Nav.Link onClick={handleLogOut}>Log Out</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
            <Tab label="Add Property" {...a11yProps(0)} />
            <Tab label="All Properties" {...a11yProps(1)} />
            <Tab label="All Bookings" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <AddProperty />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <AllProperties />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <AllBookings />
        </CustomTabPanel>
      </Box>
    </div>
  )
}

export default OwnerHome;