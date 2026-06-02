const {
  products,
  Category: categoryModel,
  subcategory: subcategoryModel,
} = require("../../models/relations");
const { deleteUploadFile } = require("../../utils/fileHelper");
const { Op } = require("sequelize");

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
    let whereCondition = {};
    if (search) {
      whereCondition = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ]
      };
    }
    const allProducts = await products.findAll({
      where: whereCondition,
      include: [{ model: categoryModel }, { model: subcategoryModel }],
    });
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
    const product = await products.findByPk(id, {
      include: [{ model: categoryModel }, { model: subcategoryModel }],
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
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
