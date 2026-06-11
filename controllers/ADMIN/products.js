const {
  products,
  Category: categoryModel,
  subcategory: subcategoryModel,
} = require("../../models/relations");
const { deleteUploadFile } = require("../../utils/fileHelper");
const { Op } = require("sequelize");
const redis = require("../../config/redis");

const createProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      price,
      categoryId,
      subcategoryId,
      quantity,
      status,
      slug,
    } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const slugValue = slug || (name ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") : "");
    const newProduct = await products.create({
      id,
      name,
      description,
      price,
      quantity: quantity || 0,
      image,
      categoryId,
      subcategoryId,
      status,
      slug: slugValue,
    });

    // Invalidate product catalog cache
    try {
      await redis.del("products:all");
      console.log("Redis cache invalidated: products:all (new product created)");
    } catch (cacheErr) {
      console.error("Redis cache invalidation error (create):", cacheErr.message);
    }

    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { search } = req.query;
    
    // Direct DB query for search inputs to prevent cache bloating
    if (search) {
      const whereCondition = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ]
      };
      const allProducts = await products.findAll({
        where: whereCondition,
        include: [{ model: categoryModel }, { model: subcategoryModel }],
      });
      return res.status(200).json({
        message: "Products fetched successfully",
        products: allProducts,
      });
    }

    // Cache-Aside implementation for catalog list
    const cacheKey = "products:all";
    try {
      const cachedProducts = await redis.get(cacheKey);
      if (cachedProducts) {
        console.log("CACHE HIT: products:all");
        return res.status(200).json({
          message: "Products fetched successfully (cached)",
          products: JSON.parse(cachedProducts),
        });
      }
    } catch (cacheErr) {
      console.error("Redis GET error (getAll):", cacheErr.message);
    }

    console.log("CACHE MISS: products:all");
    const allProducts = await products.findAll({
      include: [{ model: categoryModel }, { model: subcategoryModel }],
    });

    try {
      // Store in Redis cache for 1 hour (3600 seconds)
      await redis.set(cacheKey, JSON.stringify(allProducts), "EX", 3600);
      console.log("Stored products in Redis: products:all");
    } catch (cacheErr) {
      console.error("Redis SET error (getAll):", cacheErr.message);
    }

    res.status(200).json({
      message: "Products fetched successfully",
      products: allProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `product:${id}`;

    // Check Redis cache first
    try {
      const cachedProduct = await redis.get(cacheKey);
      if (cachedProduct) {
        console.log(`CACHE HIT: ${cacheKey}`);
        return res.status(200).json({
          message: "Product fetched successfully (cached)",
          product: JSON.parse(cachedProduct),
        });
      }
    } catch (cacheErr) {
      console.error(`Redis GET error for key ${cacheKey}:`, cacheErr.message);
    }

    console.log(`CACHE MISS: ${cacheKey}`);
    const product = await products.findByPk(id, {
      include: [{ model: categoryModel }, { model: subcategoryModel }],
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    try {
      // Store in Redis cache for 2 hours (7200 seconds)
      await redis.set(cacheKey, JSON.stringify(product), "EX", 7200);
      console.log(`Stored product in Redis: ${cacheKey}`);
    } catch (cacheErr) {
      console.error(`Redis SET error for key ${cacheKey}:`, cacheErr.message);
    }

    res.status(200).json({ message: "Product fetched successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, categoryId, subcategoryId, quantity, status, slug } =
      req.body;
    const product = await products.findByPk(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (req.file) {
      if (product.image) deleteUploadFile(product.image);
      product.image = `/uploads/${req.file.filename}`;
    }
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ?? product.price;
    product.categoryId = categoryId || product.categoryId;
    product.subcategoryId = subcategoryId || product.subcategoryId;
    product.quantity = quantity ?? product.quantity;
    product.status = status || product.status;
    if (slug) product.slug = slug;
    await product.save();

    // Invalidate product details and catalog list cache
    try {
      await redis.del("products:all");
      await redis.del(`product:${id}`);
      console.log(`Redis cache invalidated: products:all and product:${id} (product updated)`);
    } catch (cacheErr) {
      console.error("Redis cache invalidation error (update):", cacheErr.message);
    }

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await products.findByPk(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.image) deleteUploadFile(product.image);
    await product.destroy();

    // Invalidate product details and catalog list cache
    try {
      await redis.del("products:all");
      await redis.del(`product:${id}`);
      console.log(`Redis cache invalidated: products:all and product:${id} (product deleted)`);
    } catch (cacheErr) {
      console.error("Redis cache invalidation error (delete):", cacheErr.message);
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
