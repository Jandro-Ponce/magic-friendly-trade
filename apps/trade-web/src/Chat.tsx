import { useEffect, useState } from 'react';
import { Box, Container, Typography, List, ListItem, TextField, Button, IconButton } from '@mui/material';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';
import NavBar from './NavBar';
import type { AuthUser } from './Login';
import { getMessages, sendMessage } from './api';
import { useParams } from 'react-router-dom';

export type ChatProps = {
  user: AuthUser;
  onLogout: () => void;
};

export const Chat = ({ user, onLogout }: ChatProps) => {
  const { id } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    getMessages(id, user.access_token)
      .then(setMessages)
      .catch((err) => console.warn(err));
  }, [id, user.access_token]);

  const handleSend = async () => {
    if (!id || !text.trim()) return;
    try {
      const msg = await sendMessage(id, text.trim(), user.access_token);
      setMessages([...messages, msg]);
      setText('');
    } catch (err) {
      console.warn(err);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar user={user} onLogout={onLogout} />
      <Container sx={{ mt: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant='h6' sx={{ mb: 2 }}>Chat</Typography>
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <List>
            {messages.map((msg: any) => (
              <ListItem key={msg.id}>{msg.sender?.username}: {msg.content}</ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ display: 'flex', mt: 1, alignItems: 'center', position: 'relative' }}>
          <TextField
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setPickerOpen((prev) => !prev)}>
                  <InsertEmoticonIcon />
                </IconButton>
              ),
            }}
          />
          <Button onClick={handleSend} sx={{ ml: 1 }} variant='contained'>
            Enviar
          </Button>
          {pickerOpen && (
            <Box sx={{ position: 'absolute', bottom: 56, right: 0, zIndex: 1 }}>
              <EmojiPicker onEmojiClick={handleEmojiClick} height={350} />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Chat;
