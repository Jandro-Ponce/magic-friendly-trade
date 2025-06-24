import { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
} from '@mui/material'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import NavBar from './NavBar'
import type { AuthUser } from './Login'
import { getWishlist } from './api'

export type WishlistProps = {
  user: AuthUser
  onLogout: () => void
}

export const Wishlist = ({ user, onLogout }: WishlistProps) => {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    getWishlist(user.access_token)
      .then(setItems)
      .catch((err) => console.warn(err))
  }, [user.access_token])

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar user={user} onLogout={onLogout} />
      <Container sx={{ mt: 2, flexGrow: 1 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Mi lista de deseos
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Foto</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Idioma</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.imageUrl ? (
                    <Tooltip
                      placement="right"
                      title={
                        <Box
                          component="img"
                          src={item.imageUrl}
                          alt={item.card?.name}
                          sx={{ maxWidth: 200 }}
                        />
                      }
                    >
                      <PhotoCameraIcon sx={{ cursor: 'pointer' }} />
                    </Tooltip>
                  ) : (
                    <PhotoCameraIcon />
                  )}
                </TableCell>
                <TableCell>{item.card?.name}</TableCell>
                <TableCell>{item.desiredQuantity}</TableCell>
                <TableCell sx={{ textTransform: 'capitalize' }}>
                  {item.language}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </Box>
  )
}

export default Wishlist
