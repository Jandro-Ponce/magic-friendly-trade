import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'

export type Quantity = 'indiferente' | 1 | 2 | 3 | 4

export type CardEditionModalProps = {
  open: boolean
  editions: any[]
  onClose: () => void
  onConfirm?: (
    edition: any,
    addToWishlist: boolean,
    language: string,
    quantity: Quantity
  ) => void
}

export const CardEditionModal = ({
  open,
  editions,
  onClose,
  onConfirm,
}: CardEditionModalProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [addToWishlist, setAddToWishlist] = useState(false)
  const [language, setLanguage] = useState('indiferente')
  const [quantity, setQuantity] = useState<Quantity>('indiferente')
  const LANGUAGES = [
    'indiferente',
    'EN',
    'ES',
    'FR',
    'DE',
    'IT',
    'PT',
    'JA',
    'KO',
    'RU',
    'ZH',
  ]
  const QUANTITIES: Quantity[] = ['indiferente', 1, 2, 3, 4]

  const handleConfirm = () => {
    if (selectedIndex != null && onConfirm) {
      onConfirm(editions[selectedIndex], addToWishlist, language, quantity)
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
              ed.image_uris?.normal ||
              ed.card_faces?.[0]?.image_uris?.normal ||
              null
            return (
              <Box
                key={ed.id ?? idx}
                sx={{
                  border: '1px solid',
                  borderColor:
                    selectedIndex === idx ? 'primary.main' : 'divider',
                  borderWidth: selectedIndex === idx ? 2 : 1,
                  borderRadius: 0,
                  cursor: 'pointer',
                  width: 240,
                  height: 336,
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
      <DialogActions
        sx={{
          p: 2,
          position: 'sticky',
          bottom: 0,
          backgroundColor: 'background.paper',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={addToWishlist}
                  onChange={(e) => setAddToWishlist(e.target.checked)}
                  color="success"
                  sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                />
              }
              label="Agregar a mi lista de deseos"
            />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="language-label">Idioma</InputLabel>
              <Select
                labelId="language-label"
                value={language}
                label="Idioma"
                onChange={(e) => setLanguage(e.target.value as string)}
                color="success"
                sx={{ textTransform: 'capitalize' }}
              >
                {LANGUAGES.map((lang) => (
                  <MenuItem key={lang} value={lang}>
                    {lang}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="quantity-label">Cantidad</InputLabel>
              <Select
                labelId="quantity-label"
                value={quantity}
                label="Cantidad"
                onChange={(e) =>
                  setQuantity(e.target.value as Quantity)
                }
                color="success"
              >
                {QUANTITIES.map((qt) => (
                  <MenuItem key={qt} value={qt}>
                    {qt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button
            variant="contained"
            color="success"
            sx={{
              textTransform: 'none',
              borderRadius: 3,
              boxShadow: 2,
              '&:hover': { boxShadow: 3 },
            }}
            onClick={handleConfirm}
            disabled={selectedIndex === null}
          >
            Buscar Vendedores
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default CardEditionModal
