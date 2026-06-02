const categoryModel = require("../../models/ADMIN/categories");
const { deleteUploadFile } = require("../../utils/fileHelper");
const { Op } = require("sequelize");

const createCategory = async (req, res) => {
  try {
    const { id, name, description, status, slug } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const slugValue = slug || (name ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") : "");
    const newCategory = await categoryModel.create({
      id,
      name,
      description,
      image,
      status,
      slug: slugValue,
    });
    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

const getAllCategories = async (req, res) => {
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
    const categories = await categoryModel.findAll({ where: whereCondition });
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoryModel.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;
    const category = await categoryModel.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    if (req.file) {
      if (category.image) deleteUploadFile(category.image);
      category.image = `/uploads/${req.file.filename}`;
    }
    category.name = name || category.name;
    category.description = description || category.description;
    category.status = status || category.status;
    await category.save();
    res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    if (category.image) deleteUploadFile(category.image);
    await category.destroy();
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
