const productData = require("../models/data.json");

const allProducts = (req, res) => {
  res.send({ data: productData.products });
};

const productById = (req, res) => {
  const params = req.params.id;

  res.send({
    data: productData.products[params],
  });
};

module.exports = { allProducts, productById };
