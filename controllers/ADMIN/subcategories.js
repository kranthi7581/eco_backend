const subcategoryModel = require("../../models/ADMIN/subcategories");
const categoryModel = require("../../models/ADMIN/categories");
const { deleteUploadFile } = require("../../utils/fileHelper");
const { Op } = require("sequelize");

const createSubcategory = async (req, res) => {
  try {
    const { id, name, description, categoryId, status, slug } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const slugValue = slug || (name ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") : "");
    const newSubcategory = await subcategoryModel.create({
      id,
      name,
      description,
      categoryId,
      image,
      status,
      slug: slugValue,
    });
    res.status(201).json({
      message: "Subcategory created successfully",
      subcategory: newSubcategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating subcategory", error });
  }
};

const getAllSubcategories = async (req, res) => {
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
    const subcategories = await subcategoryModel.findAll({
      where: whereCondition,
      include: [{ model: categoryModel }],
    });
    res
      .status(200)
      .json({ message: "Subcategories fetched successfully", subcategories });
  } catch (error) {
    res.status(500).json({ message: "Error fetching subcategories", error });
  }
};

const getSubcategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const subcategory = await subcategoryModel.findByPk(id, {
      include: [{ model: categoryModel }],
    });
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res
      .status(200)
      .json({ message: "Subcategory fetched successfully", subcategory });
  } catch (error) {
    res.status(500).json({ message: "Error fetching subcategory", error });
  }
};

const updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, categoryId, status, slug } = req.body;
    const subcategory = await subcategoryModel.findByPk(id);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    if (req.file) {
      if (subcategory.image) deleteUploadFile(subcategory.image);
      subcategory.image = `/uploads/${req.file.filename}`;
    }
    subcategory.name = name || subcategory.name;
    subcategory.description = description || subcategory.description;
    subcategory.categoryId = categoryId || subcategory.categoryId;
    subcategory.status = status || subcategory.status;
    if (slug) subcategory.slug = slug;
    await subcategory.save();
    res
      .status(200)
      .json({ message: "Subcategory updated successfully", subcategory });
  } catch (error) {
    res.status(500).json({ message: "Error updating subcategory", error });
  }
};

const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await subcategoryModel.findByPk(id);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    if (subcategory.image) deleteUploadFile(subcategory.image);
    await subcategory.destroy();
    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting subcategory", error });
  }
};

module.exports = {
  createSubcategory,
  getAllSubcategories,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
};
