import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  Stack,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contact_reason_id: '',
    message: ''
  });
  const [reasons, setReasons] = useState([]);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar razones de contacto al montar el componente
  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const response = await axios.get('http://localhost:5000/contact-reasons/');
        setReasons(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contact reasons:', error);
        setSubmitStatus({ success: false, message: 'Error al cargar las razones de contacto' });
        setLoading(false);
      }
    };
    fetchReasons();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.contact_reason_id || !formData.message) {
      setSubmitStatus({ success: false, message: 'Todos los campos son requeridos' });
      return;
    }

    try {
      const contactData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        contact_reason_id: parseInt(formData.contact_reason_id),
        message: formData.message
      };

      await axios.post('http://localhost:5000/contacts/', contactData);
      
      setSubmitStatus({ success: true, message: 'Formulario enviado correctamente!' });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        contact_reason_id: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({ 
        success: false, 
        message: error.response?.data?.message || 'Error al enviar el formulario' 
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Stack spacing={3}>
        {submitStatus && (
          <Alert severity={submitStatus.success ? "success" : "error"}>
            {submitStatus.message}
          </Alert>
        )}

        <TextField
          label="Nombre"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          fullWidth
        />

        <TextField
          label="Apellido"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          fullWidth
        />

        <TextField
          label="Correo electrónico"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          fullWidth
        />

        <FormControl fullWidth required>
          <InputLabel>Razón de contacto</InputLabel>
          <Select
            name="contact_reason_id"
            value={formData.contact_reason_id}
            label="Razón de contacto"
            onChange={handleChange}
          >
            {reasons.map((reason) => (
              <MenuItem key={reason.id} value={reason.id}>
                {reason.reason} - {reason.description}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Mensaje"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          multiline
          rows={4}
          inputProps={{ maxLength: 500 }}
          helperText={`${formData.message.length}/500 caracteres`}
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
        >
          Enviar
        </Button>
      </Stack>
    </Box>
  );
}

export default ContactForm;