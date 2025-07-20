import { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Table,
  TableContainer,
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
import { getSales, deleteSaleItem } from './api'

export type SalesProps = {
  user: AuthUser
  onLogout: () => void
}

export const Sales = ({ user, onLogout }: SalesProps) => {
  const [items, setItems] = useState<any[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    getSales(user.access_token)
      .then(setItems)
      .catch((err) => console.warn(err))
  }, [user.access_token])

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar user={user} onLogout={onLogout} />
      <Container sx={{ mt: 2, flexGrow: 1 }}>
        <Typography variant='h6' sx={{ mb: 2 }}>
          Ventas
        </Typography>
        <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Foto</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Foil</TableCell>
              <TableCell>Firmada</TableCell>
              <TableCell>Comentario</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.card?.imageUrl ? (
                    <Tooltip
                      placement='right'
                      title={
                        <Box
                          component='img'
                          src={item.card.imageUrl}
                          alt={item.card.name}
                          sx={{
                            maxWidth: 200,
                            backgroundColor: 'black',
                            borderRadius: '6px',
                            border: '6px solid black',
                          }}
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
                <TableCell>{item.foil ? 'Sí' : 'No'}</TableCell>
                <TableCell>{item.signed ? 'Sí' : 'No'}</TableCell>
                <TableCell>{item.comment || ''}</TableCell>
                <TableCell>{item.quantity}</TableCell>
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
        </TableContainer>
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
                    await deleteSaleItem(deleteId, user.access_token)
                    setItems(items.filter((it) => it.id !== deleteId))
                  } catch (err) {
                    console.warn(err)
                  } finally {
                    setDeleteId(null)
                  }
                }
              }}
              color='error'
              variant='contained'
            >
              Sí
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default Sales
