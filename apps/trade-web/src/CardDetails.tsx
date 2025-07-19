import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import NavBar from './NavBar'
import type { AuthUser } from './Login'
import { getCard, getSellers, createConversation } from './api'

export type CardDetailsProps = {
  user: AuthUser
  onLogout: () => void
}

export const CardDetails = ({ user, onLogout }: CardDetailsProps) => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [card, setCard] = useState<any | null>(null)
  const [sellers, setSellers] = useState<any[]>([])
  const params = new URLSearchParams(location.search)
  const quantity = params.get('quantity')
  const language = params.get('language')

  useEffect(() => {
    if (!id) return
    getCard(id)
      .then(setCard)
      .catch((err) => console.warn(err))
  }, [id])

  useEffect(() => {
    if (!id) return
    getSellers(id, user.access_token)
      .then((data) => {
        let filtered = data
        if (quantity) {
          const q = parseInt(quantity, 10)
          filtered = filtered.filter((s: any) => s.quantity >= q)
        }
        if (language) {
          filtered = filtered.filter((s: any) => s.language === language)
        }
        setSellers(filtered)
      })
      .catch((err) => console.warn(err))
  }, [id, user.access_token, location.search])

  const imgSrc =
    card?.image_uris?.normal || card?.card_faces?.[0]?.image_uris?.normal || null

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar user={user} onLogout={onLogout} />
      <Container sx={{ mt: 2, flexGrow: 1, textAlign: 'center' }}>
        {card ? (
          <>
            <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
              {card.name}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                width: 'fit-content',
                mx: 'auto',
              }}
            >
              {imgSrc && (
                <Box
                  component="img"
                  src={imgSrc}
                  alt={card.name}
                  sx={{ maxWidth: 240, width: '100%' }}
                />
              )}
              <Box>
                <Typography sx={{ mb: 1, textAlign: 'left' }}>
                  <strong>Costo de maná:</strong> {card.mana_cost}
                </Typography>
                <Typography sx={{ mb: 1, textAlign: 'left' }}>
                  <strong>Tipo:</strong> {card.type_line}
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-line', textAlign: 'left', maxWidth: '60ch' }}>
                  <strong>Texto:</strong> {card.oracle_text}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 4 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Usuario</TableCell>
                    <TableCell>Foil</TableCell>
                    <TableCell>Firmada</TableCell>
                    <TableCell>Comentario</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Idioma</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sellers.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.user?.username}</TableCell>
                      <TableCell>{s.foil ? 'Sí' : 'No'}</TableCell>
                      <TableCell>{s.signed ? 'Sí' : 'No'}</TableCell>
                      <TableCell>{s.comment || ''}</TableCell>
                      <TableCell>{s.quantity}</TableCell>
                      <TableCell>{s.language || 'indiferente'}</TableCell>
                      <TableCell>
                        <ChatBubbleOutlineIcon
                          sx={{ cursor: 'pointer' }}
                          onClick={async () => {
                            try {
                              const conv = await createConversation(
                                s.user.id,
                                user.access_token,
                              )
                              navigate(`/conversations/${conv.id}`)
                            } catch (err) {
                              console.warn(err)
                            }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </>
        ) : (
          <Typography>Cargando...</Typography>
        )}
      </Container>
    </Box>
  )
}

export default CardDetails
