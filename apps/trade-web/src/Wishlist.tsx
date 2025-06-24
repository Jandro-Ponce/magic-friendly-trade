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
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from '@mui/material'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import DeleteIcon from '@mui/icons-material/Delete'
import NavBar from './NavBar'
import type { AuthUser } from './Login'
import { getWishlist, deleteWishlistItem } from './api'

export type WishlistProps = {
  user: AuthUser
  onLogout: () => void
}

export const Wishlist = ({ user, onLogout }: WishlistProps) => {
  const [items, setItems] = useState<any[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)

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
              <TableCell />
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
                <TableCell>
                  <DeleteIcon
                    sx={{ cursor: 'pointer' }}
                    onClick={() => setDeleteId(item.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
          <DialogTitle>
            ¿Estás seguro de que quieres eliminar esta carta?
          </DialogTitle>
          <DialogActions>
            <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
            <Button
              onClick={async () => {
                if (deleteId) {
                  try {
                    await deleteWishlistItem(deleteId, user.access_token)
                    setItems(items.filter((it) => it.id !== deleteId))
                  } catch (err) {
                    console.warn(err)
                  } finally {
                    setDeleteId(null)
                  }
                }
              }}
              color="error"
              variant="contained"
            >
              Sí
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default Wishlist
