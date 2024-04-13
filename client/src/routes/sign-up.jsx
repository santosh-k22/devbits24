import { SignUp } from "@clerk/clerk-react"
 
// export default function SignUpPage() {
//   return <SignUp />;
// }

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';


export default function SignUpPage() {

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
            <SignUp />
        </Box>
      </Container>
  );
}