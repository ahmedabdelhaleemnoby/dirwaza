import app from './src/app.js';
import dotenv from 'dotenv';
import formData from 'express-form-data';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(formData.parse());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
