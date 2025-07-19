import { useEffect, useState } from 'react';
import { Box, Container, Typography, List, ListItem, ListItemButton } from '@mui/material';
import NavBar from './NavBar';
import type { AuthUser } from './Login';
import { getConversations } from './api';
import { useNavigate } from 'react-router-dom';

export type ConversationsProps = {
  user: AuthUser;
  onLogout: () => void;
};

export const Conversations = ({ user, onLogout }: ConversationsProps) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getConversations(user.access_token)
      .then(setConversations)
      .catch((err) => console.warn(err));
  }, [user.access_token]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar user={user} onLogout={onLogout} />
      <Container sx={{ mt: 2, flexGrow: 1 }}>
        <Typography variant='h6' sx={{ mb: 2 }}>
          Conversaciones
        </Typography>
        <List>
          {conversations.map((conv: any) => (
            <ListItem key={conv.id} disablePadding>
              <ListItemButton onClick={() => navigate(`/conversations/${conv.id}`)}>
                {conv.user1?.username} - {conv.user2?.username}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Container>
    </Box>
  );
};

export default Conversations;
