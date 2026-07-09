const Product = require('../models/productModel');

// GET /api/products
const getProducts = async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};
  const category = req.query.category ? { category: req.query.category } : {};

  const count = await Product.countDocuments({ ...keyword, ...category });
  const products = await Product.find({ ...keyword, ...category })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Produit non trouvé' });
  }
};

// POST /api/products (Admin)
const createProduct = async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;
  const product = await Product.create({
    user: req.user._id,
    name, price, description, image, brand, category, countInStock,
  });
  res.status(201).json(product);
};

// PUT /api/products/:id (Admin)
const updateProduct = async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock ?? product.countInStock;
    const updated = await product.save();
    res.json(updated);
  } else {
    res.status(404).json({ message: 'Produit non trouvé' });
  }
};

// DELETE /api/products/:id (Admin)
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: 'Produit supprimé' });
  } else {
    res.status(404).json({ message: 'Produit non trouvé' });
  }
};

// POST /api/products/:id/reviews
const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Vous avez déjà évalué ce produit' });
    }
    const review = { name: req.user.name, rating: Number(rating), comment, user: req.user._id };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: 'Avis ajouté' });
  } else {
    res.status(404).json({ message: 'Produit non trouvé' });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview };