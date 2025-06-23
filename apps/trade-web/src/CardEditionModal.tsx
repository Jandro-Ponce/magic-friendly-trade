import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material'

export type CardEditionModalProps = {
  open: boolean
  editions: any[]
  onClose: () => void
  onConfirm?: (edition: any) => void
}

export const CardEditionModal = ({
  open,
  editions,
  onClose,
  onConfirm,
}: CardEditionModalProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handleConfirm = () => {
    if (selectedIndex != null && onConfirm) {
      onConfirm(editions[selectedIndex])
    }
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Selecciona una edición</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'center',
            mt: 1,
          }}
        >
          {editions.map((ed, idx) => {
            const imgSrc =
              ed.image_uris?.small || ed.card_faces?.[0]?.image_uris?.small || null
            return (
              <Box
                key={ed.id ?? idx}
                sx={{
                  border: '1px solid',
                  borderColor:
                    selectedIndex === idx ? 'primary.main' : 'divider',
                  borderWidth: selectedIndex === idx ? 2 : 1,
                  borderRadius: 1,
                  cursor: 'pointer',
                  width: 80,
                  height: 112,
                  overflow: 'hidden',
                }}
                onClick={() => setSelectedIndex(idx)}
              >
                {imgSrc && (
                  <Box
                    component="img"
                    src={imgSrc}
                    alt={ed.name}
                    sx={{ width: '100%', height: '100%', display: 'block' }}
                  />
                )}
              </Box>
            )
          })}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleConfirm}
          disabled={selectedIndex === null}
        >
          Buscar Vendedores
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CardEditionModal
