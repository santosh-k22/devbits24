import { SignIn } from "@clerk/clerk-react"

// export default function SignInPage() {
//   return <SignIn />;
// }

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';


export default function SignInPage() {

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
            <SignIn />
        </Box>
      </Container>
  );
}