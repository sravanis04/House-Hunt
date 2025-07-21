import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const MyBookings = () => {
   const [myBookings, setMyBookings] = useState([]);

   const getMyBookings = async () => {
      try {
         const response = await axios.get('http://localhost:8001/api/user/getmybookings', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
         });

         if (response.data.success) {
            setMyBookings(response.data.data);
         } else {
            message.error(response.data.message);
         }
      } catch (error) {
         console.log(error);
         message.error("Failed to fetch your bookings.");
      }
   };

   useEffect(() => {
      getMyBookings();
   }, []);

   return (
      <div>
        <h3 className="mb-3">My Bookings</h3>
         <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="my bookings table">
               <TableHead>
                  <TableRow>
                     <TableCell>Booking ID</TableCell>
                     <TableCell align="center">Property ID</TableCell>
                     <TableCell align="center">Owner ID</TableCell>
                     <TableCell align="center">My Name</TableCell>
                     <TableCell align="center">My Contact</TableCell>
                     <TableCell align="center">Booking Status</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {myBookings && myBookings.length > 0 ? (
                     myBookings.map((booking) => (
                        <TableRow
                           key={booking._id}
                           sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                           <TableCell component="th" scope="row">
                              {booking._id}
                           </TableCell>
                           <TableCell align="center">{booking.propertyId}</TableCell>
                           <TableCell align="center">{booking.ownerID}</TableCell>
                           <TableCell align="center">{booking.userName}</TableCell>
                           <TableCell align="center">{booking.phone}</TableCell>
                           <TableCell align="center" style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                              {booking.bookingStatus}
                           </TableCell>
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell colSpan={6} align="center">You have no bookings.</TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </TableContainer>
      </div>
   );
};

export default MyBookings;