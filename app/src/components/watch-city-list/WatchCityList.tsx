import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material"
import type { WatchCity } from "./watch-list-types"

const WatchCityList = ({ cities }: { cities: WatchCity[] }) => {
  return (
    <Container maxWidth='md' sx={{ mt: 4 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        Watch Cities
      </Typography>
      <Paper elevation={2} sx={{ mt: 2 }}>
        <List>
          {cities.length === 0 ? (
            <ListItem>
              <ListItemText primary='No watch cities found' />
            </ListItem>
          ) : (
            cities.map(
              (city: { id: string; name: string; filterWear: number }) => (
                <ListItem key={city.id} divider>
                  <ListItemText
                    primary={city.name}
                    secondary={`Filter Wear: ${city.filterWear}`}
                  />
                </ListItem>
              )
            )
          )}
        </List>
      </Paper>
    </Container>
  )
}

export default WatchCityList
