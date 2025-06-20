import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NavBar from "./NavBar";
import type { AuthUser } from "./Login";
import { searchCards } from "./api";

type SearchResultsProps = {
  user: AuthUser;
  onLogout: () => void;
};

export const SearchResults = ({ user, onLogout }: SearchResultsProps) => {
  const location = useLocation();
  const [results, setResults] = useState<any[]>([]);
  const [query, setQuery] = useState("");

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
            gap: 0.25,
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
                  mb: 0.25,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  maxWidth: 240,
                  maxHeight: 336,
                  width: '100%',
                  overflow: 'hidden',
                }}
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
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default SearchResults;
