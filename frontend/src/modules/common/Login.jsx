import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav } from 'react-bootstrap';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { message } from 'antd';
import { UserContext } from '../../App'; // Import context

const Login = () => {
  const navigate = useNavigate();
  // Get state setters from context to update the global state
  const { setUserData, setUserLoggedIn } = useContext(UserContext);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data?.email || !data?.password) {
      return message.error("Please fill all fields");
    }

    axios.post('http://localhost:8080/api/user/login', data)
      .then((res) => {
        if (res.data.success) {
          message.success(res.data.message);

          const loggedInUser = res.data.user;
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(loggedInUser));

          // Update global state
          setUserData(loggedInUser);
          setUserLoggedIn(true);

          // Navigate based on user type
          switch (loggedInUser.type) {
            case "Admin":
              navigate("/adminhome");
              break;
            case "Renter":
              navigate("/renterhome");
              break;
            case "Owner":
              if (loggedInUser.granted === 'ungranted') {
                message.error('Your account is not yet confirmed by the admin');
                // Clear local storage if login shouldn't persist
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUserData(null);
                setUserLoggedIn(false);
              } else {
                navigate("/ownerhome");
              }
              break;
            default:
              navigate("/login");
              break;
          }
        } else {
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        if (err.response && (err.response.status === 401 || err.response.status === 404)) {
          message.error(err.response.data.message || "Invalid credentials");
        } else {
          message.error("Something went wrong during login.");
        }
      });
  };

  return (
    <>
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
              <Link to={'/'}>Home</Link>
              <Link to={'/login'}>Login</Link>
              <Link to={'/register'}>Register</Link>
            </Nav>

          </Navbar.Collapse>
        </Container>
      </Navbar>


      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={data.email}
              onChange={handleChange}
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              value={data.password}
              onChange={handleChange}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container justifyContent="space-between">
              <Grid item>
                <Link to={'/forgotpassword'} variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to={'/register'} variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default Login;