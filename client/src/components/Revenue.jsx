import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${date}/${month}/${year}`;
}

function getDatePrev() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${date}/${month-1}/${year}`;
}


export default function Revenue() {
  return (
    <React.Fragment>
      <Title>Revenue this month</Title>
      <Typography component="p" variant="h4">
        $3,024.00
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        from {getDatePrev()} to {getDate()}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View activity over month
        </Link>
      </div>
    </React.Fragment>
  );
}
