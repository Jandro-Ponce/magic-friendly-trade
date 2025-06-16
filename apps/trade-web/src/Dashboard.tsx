import { Typography, Container } from "@mui/material";
import type { AuthUser } from "./Login";

type DashboardProps = {
  user: AuthUser;
};

export const Dashboard = ({ user }: DashboardProps) => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography>Your token: {user.access_token}</Typography>
    </Container>
  );
};
