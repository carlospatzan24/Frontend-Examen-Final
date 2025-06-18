import { Container, Typography } from '@mui/material';
import ContactForm from './components/ContactForm';

function App() {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography 
        variant="h3" 
        align="center" 
        gutterBottom
        sx={{ 
          fontWeight: 'bold',
          color: 'primary.main',
          mb: 4 
        }}
      >
        Formulario de Contacto
      </Typography>
      <ContactForm />
    </Container>
  );
}

export default App;