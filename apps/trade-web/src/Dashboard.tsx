import { Box } from "@mui/material";
import type { AuthUser } from "./Login";
import FondoDashboard from "./images/FondoDashboard.png";
import NavBar from "./NavBar";

type DashboardProps = {
  user: AuthUser;
  onLogout: () => void;
};

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar user={user} onLogout={onLogout} />
      <Box
        sx={{
          flexGrow: 1,
          backgroundImage: `url(${FondoDashboard})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />
    </Box>
  );
};

export default Dashboard;
