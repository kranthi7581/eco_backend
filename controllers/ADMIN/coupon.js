const { Op } = require("sequelize");
const { coupons } = require("../../models/relations");

const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      expiryDate,
      usageLimit,
    } = req.body;

    const newCoupon = await coupons.create({
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      expiryDate,
      usageLimit,
    });

    res.status(201).json(newCoupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllCoupons = async (req, res) => {
  try {
    const allCoupons = await coupons.findAll();
    res.status(200).json(allCoupons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCoupons = async (req, res) => {
  try {
    const { id } = req.params;
    await coupons.update(req.body, {
      where: { id },
    });
    const coupon = await coupons.findByPk(id);
    res.status(200).json({
      message: "Coupon updated successfully",
      coupon,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoupon = await coupons.destroy({ where: { id } });
    res.status(200).json(deletedCoupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const applyCoupon = async (req, res) => {
  try {
    const { code, totalAmount } = req.body;

    const coupon = await Coupon.findOne({
      where: {
        code,
        isActive: true,
        expiryDate: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!coupon) {
      return res.status(400).json({
        message: "Invalid or expired coupon",
      });
    }

    if (totalAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        message: `Minimum order amount is ${coupon.minOrderAmount}`,
      });
    }

    let discount = 0;

    if (coupon.discountType === "percentage") {
      discount = (totalAmount * coupon.discountValue) / 100;

      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.discountValue;
    }

    const finalAmount = totalAmount - discount;

    res.json({
      coupon,
      discount,
      finalAmount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupons,
  deleteCoupon,
  applyCoupon,
};
