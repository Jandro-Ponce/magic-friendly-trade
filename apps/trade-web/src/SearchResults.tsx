import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Container, Typography, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import SellIcon from "@mui/icons-material/Sell";
import NavBar from "./NavBar";
import type { AuthUser } from "./Login";
import CardEditionModal from "./CardEditionModal";
import InventoryModal from "./InventoryModal";
import {
  searchCards,
  getCard,
  type CardWithEditions,
  findSellers,
  createInventoryItem,
} from "./api";

type SearchResultsProps = {
  user: AuthUser;
  onLogout: () => void;
};

export const SearchResults = ({ user, onLogout }: SearchResultsProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState<CardWithEditions | null>(null);
  const [editionOpen, setEditionOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [selectedEdition, setSelectedEdition] = useState<any | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setQuery(q);
    if (!q) {
      setResults([]);
      return;
    }
    searchCards(q)
      .then((data) => setResults(data.data || []))
      .catch((err) => console.warn(err));
  }, [location.search]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar user={user} onLogout={onLogout} />
      <Container sx={{ mt: 2, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SearchIcon sx={{ mr: 1 }} />
          <Typography variant="h6">
            {`Resultados para la búsqueda de "${query}"`}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            columnGap: 0.25,
            rowGap: 1,
          }}
        >
          {results.map((card) => {
            const imgSrc =
              card.image_uris?.normal ||
              card.card_faces?.[0]?.image_uris?.normal ||
              null;
            return (
              <Box
                key={card.id}
                sx={{
                  mb: 0.5,
                  maxWidth: 240,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    maxWidth: 240,
                    maxHeight: 336,
                    width: '100%',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/cards/${card.id}`)}
                >
                  {imgSrc && (
                    <Box
                      component="img"
                      src={imgSrc}
                      alt={card.name}
                      sx={{ display: 'block', maxWidth: 240, width: '100%' }}
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    mt: 0.5,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-around',
                  }}
                >
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    startIcon={<AddShoppingCartIcon />}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 3,
                      boxShadow: 2,
                      '&:hover': {
                        boxShadow: 3,
                      },
                    }}
                    onClick={async () => {
                      try {
                        const cardData = await getCard(card.id);
                        setSelectedCard(cardData);
                        setEditionOpen(true);
                      } catch (err) {
                        console.warn(err);
                      }
                    }}
                  >
                    Compro
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="warning"
                    startIcon={<SellIcon />}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 3,
                      boxShadow: 1,
                      '&:hover': {
                        boxShadow: 2,
                      },
                    }}
                    onClick={async () => {
                      try {
                        const cardData = await getCard(card.id)
                        setSelectedCard(cardData)
                        setSellOpen(true)
                      } catch (err) {
                        console.warn(err)
                      }
                    }}
                  >
                    Vendo
                  </Button>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Container>
      <CardEditionModal
        open={editionOpen}
        editions={selectedCard?.editions ?? []}
        onClose={() => setEditionOpen(false)}
        onConfirm={async (_ed, _wishlist, _language, _quantity) => {
          setSelectedEdition(_ed);
          setEditionOpen(false);
          try {
            await findSellers(
              {
                cardId: _ed.id,
                cardName: selectedCard?.name ?? '',
                imageUrl:
                  _ed.image_uris?.normal ||
                  _ed.card_faces?.[0]?.image_uris?.normal ||
                  '',
                language: _language === 'indiferente' ? undefined : _language,
                quantity:
                  _quantity === 'indiferente'
                    ? undefined
                    : (_quantity as number),
                addToWishlist: _wishlist,
              },
              user.access_token,
            );
          } catch (err) {
            console.warn(err);
          } finally {
            const params = new URLSearchParams();
            if (_language !== 'indiferente') {
              params.set('language', _language);
            }
            if (_quantity !== 'indiferente') {
              params.set('quantity', String(_quantity));
            }
            navigate(`/cards/${_ed.id}?${params.toString()}`);
          }
        }}
      />
      <InventoryModal
        open={sellOpen}
        editions={selectedCard?.editions ?? []}
        onClose={() => setSellOpen(false)}
        onConfirm={async (_ed, _language, _quantity) => {
          setSelectedEdition(_ed)
          setSellOpen(false)
          try {
            await createInventoryItem(
              {
                cardId: _ed.id,
                cardName: selectedCard?.name ?? '',
                imageUrl:
                  _ed.image_uris?.normal ||
                  _ed.card_faces?.[0]?.image_uris?.normal ||
                  '',
                quantity:
                  typeof _quantity === 'number' ? _quantity : 1,
              },
              user.access_token,
            )
          } catch (err) {
            console.warn(err)
          }
        }}
      />
    </Box>
  );
};

export default SearchResults;
