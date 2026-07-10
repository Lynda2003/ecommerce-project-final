const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => { console.error(err); process.exit(1); });

const User = mongoose.model('User', new mongoose.Schema({
  name: String, email: String, password: String, isAdmin: Boolean,
}, { timestamps: true }));

const Product = mongoose.model('Product', new mongoose.Schema({
  user: mongoose.Schema.Types.ObjectId,
  name: String, image: String, brand: String, category: String,
  description: String, reviews: Array, rating: Number,
  numReviews: Number, price: Number, countInStock: Number,
}, { timestamps: true }));

async function run() {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    const pass = await bcrypt.hash('admin123456', 10);
    const admin = await User.create({
      name: 'Admin', email: 'admin@ecommerce.com',
      password: pass, isAdmin: true,
    });

    const BASE = 'https://res.cloudinary.com/cij0gnaq/image/upload';

    await Product.insertMany([
      { user: admin._id, reviews: [], name: 'Nike Air Max 270', image: `${BASE}/chaussures_c7ix7h.jpg`, brand: 'Nike', category: 'Chaussures', description: 'Confort maximal avec la semelle Air Max.', price: 435, countInStock: 15, rating: 4.5, numReviews: 12 },
      { user: admin._id, reviews: [], name: 'T-Shirt Premium Coton', image: `${BASE}/tshirt_xhsnnp.jpg`, brand: 'StyleCo', category: 'Vetements', description: '100% coton bio, coupe moderne.', price: 99, countInStock: 50, rating: 4.2, numReviews: 8 },
      { user: admin._id, reviews: [], name: 'Montre Smart Watch Pro', image: `${BASE}/smartwatch_quz1qt.jpg`, brand: 'TechTime', category: 'Accessoires', description: 'Suivi sante, GPS, autonomie 7 jours.', price: 669, countInStock: 10, rating: 4.8, numReviews: 20 },
      { user: admin._id, reviews: [], name: 'Sac a Dos Urban', image: `${BASE}/sac_slyf8a.jpg`, brand: 'UrbanGear', category: 'Accessoires', description: 'Impermeable, compartiment laptop 15 pouces.', price: 199, countInStock: 25, rating: 4.3, numReviews: 15 },
      { user: admin._id, reviews: [], name: 'Casque Audio Bluetooth', image: `${BASE}/casque_jtwtes.jpg`, brand: 'SoundMax', category: 'Electronique', description: 'Son cristallin, reduction de bruit active.', price: 299, countInStock: 20, rating: 4.6, numReviews: 30 },
      { user: admin._id, reviews: [], name: 'Lunettes Aviator', image: `${BASE}/lunettes_k54qed.jpg`, brand: 'VisionPro', category: 'Accessoires', description: 'Protection UV400, monture legere.', price: 154, countInStock: 35, rating: 4.1, numReviews: 9 },
      { user: admin._id, reviews: [], name: 'Jean Slim Stretch', image: `${BASE}/jean_jfekj0.jpg`, brand: 'DenimCo', category: 'Vetements', description: 'Jean stretch ultra-confortable.', price: 167, countInStock: 40, rating: 4.4, numReviews: 18 },
      { user: admin._id, reviews: [], name: 'Sneakers Classic White', image: `${BASE}/sneakers_def47o.jpg`, brand: 'ClassicStep', category: 'Chaussures', description: 'Intemporelles, semelle ortholite.', price: 267, countInStock: 30, rating: 4.7, numReviews: 25 },
      { user: admin._id, reviews: [], name: 'Parfum Elegance Gold', image: `${BASE}/parfum_dten8c.jpg`, brand: 'LuxeParfum', category: 'Beaute', description: 'Fragrance orientale, notes de santal.', price: 189, countInStock: 18, rating: 4.9, numReviews: 22 },
      { user: admin._id, reviews: [], name: 'Ecouteurs Sans Fil Pro', image: `${BASE}/ecouteurs_n8h0wd.jpg`, brand: 'SoundMax', category: 'Electronique', description: 'True Wireless, etanche IPX5.', price: 224, countInStock: 22, rating: 4.5, numReviews: 17 },
      { user: admin._id, reviews: [], name: 'Robe Soiree Elegante', image: `${BASE}/robe_ibicde.jpg`, brand: 'EleganceMode', category: 'Vetements', description: 'Robe longue en soie pour occasions speciales.', price: 349, countInStock: 12, rating: 4.7, numReviews: 14 },
      { user: admin._id, reviews: [], name: 'Montre Classique Gold', image: `${BASE}/montre_old8qd.jpg`, brand: 'TimePro', category: 'Accessoires', description: 'Montre analogique, boitier acier dore.', price: 589, countInStock: 8, rating: 4.6, numReviews: 11 },
    ]);

    console.log('Donnees importees !');
    console.log('Admin: admin@ecommerce.com | Password: admin123456');
    process.exit();
  } catch (err) {
    console.error('Erreur:', err.message);
    process.exit(1);
  }
}

run();