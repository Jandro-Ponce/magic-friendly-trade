import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Container, Typography } from '@mui/material'
import NavBar from './NavBar'
import type { AuthUser } from './Login'
import { getCard } from './api'

export type CardDetailsProps = {
  user: AuthUser
  onLogout: () => void
}

export const CardDetails = ({ user, onLogout }: CardDetailsProps) => {
  const { id } = useParams()
  const [card, setCard] = useState<any | null>(null)

  useEffect(() => {
    if (!id) return
    getCard(id)
      .then(setCard)
      .catch((err) => console.warn(err))
  }, [id])

  const imgSrc =
    card?.image_uris?.normal || card?.card_faces?.[0]?.image_uris?.normal || null

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar user={user} onLogout={onLogout} />
      <Container sx={{ mt: 2, flexGrow: 1 }}>
        {card ? (
          <>
            <Typography variant="h4" sx={{ mb: 2 }}>
              {card.name}
            </Typography>
            {imgSrc && (
              <Box
                component="img"
                src={imgSrc}
                alt={card.name}
                sx={{ maxWidth: 240, width: '100%', mb: 2 }}
              />
            )}
            <Typography sx={{ mb: 1 }}>
              <strong>Costo de maná:</strong> {card.mana_cost}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Tipo:</strong> {card.type_line}
            </Typography>
            <Typography sx={{ whiteSpace: 'pre-line' }}>
              <strong>Texto:</strong> {card.oracle_text}
            </Typography>
          </>
        ) : (
          <Typography>Cargando...</Typography>
        )}
      </Container>
    </Box>
  )
}

export default CardDetails
