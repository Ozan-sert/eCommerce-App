import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
// @called  listProducts() productActions.js
export const getProducts = asyncHandler(async (req, res) => {
  // Access query string for search query and page number

  const keyword = req.query.keyword
    ? // Use the mongoose OR operator to apply the search to multiple fields
      {
        $or: [
          {
            name: {
              // regex - Regular expressions are patterns used to match character combinations in strings
              $regex: req.query.keyword,
              // Means case insensitive
              $options: "i",
            },
          },
          {
            description: {
              $regex: req.query.keyword,
              $options: "i",
            },
          },
          {
            brand: {
              $regex: req.query.keyword,
              $options: "i",
            },
          },
        ],
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });

  const pageSize = Number(req.query.itemsPerPage);

  const pages = Math.ceil(count / pageSize) || 1;
  // Page number passed in from frontend, if none then user is on page 1
  const page =
    req.query.pageNumber > pages
      ? pages
      : pageSize > count
      ? 1
      : Number(req.query.pageNumber) || 1;

  // Get products for correct page
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(count > pageSize ? pageSize * (page - 1) : 0);

  res.json({ products, page, pages });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
// @called  listProductDetails() productActions.js
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);

    throw new Error("Product not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
// @called  deleteProduct() ProductListScreen -> productActions -> productRoutes
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);

    throw new Error("Product not found");
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
// @called  createProduct ProductCreateScreen -> productActions -> productRoutes
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
    numReviews,
  } = req.body;

  const productExists = await Product.findOne({ name });

  if (productExists) {
    res.status(400);
    throw new Error("Product already exists");
  }

  const product = await Product.create({
    user: req.user._id,
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
    numReviews,
  });

  if (product) {
    res.status(201).json({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      brand: product.brand,
      category: product.category,
      countInStock: product.countInStock,
    });
  } else {
    res.status(400);
    throw new Error("Invalid product data");
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
// @called  updateProduct() ProductEditScreen -> productActions -> productRoutes
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
// @called  createProductReview() ProductScreen -> productActions -> productRoutes
export const createProductReview = asyncHandler(async (req, res) => {
  
	const { rating, comment } = req.body;
 
	if (!rating || !comment) {
		res.status(400);
		throw new Error("Please add both Rating and Comment");
  	}

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    // Overall product rating gets the average of the individual review ratings
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
// @called  createProductReview() ProductScreen -> productActions -> productRoutes
export const getTopProducts = asyncHandler(async (req, res) => {
  // Sorts by rating in ascending order
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});
