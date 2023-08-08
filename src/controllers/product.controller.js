const productData = require("../models/data.json");
const { postNew } = require("../models");

const allProducts = (req, res) => {
  res.send({ data: productData.products });
};

const productById = (req, res) => {
  const params = req.params.id;

  res.send({
    data: productData.products[params],
  });
};

const createProduct = async (req, res) => {
  const idUser = req.user.id;
  const { title, body } = req.body;

  if (!idUser || !title || !body) {
    return res.status(400).send({
      message: "Some field must be filled, cannot be empty",
    });
  }

  const input = await postNew.create({
    user_id: idUser,
    title: title,
    body: body,
  });

  return res.status(201).send({
    message: "post created",
  });
};

const updateProduct = async (req, res) => {
  try {
    const { id, title, body } = req.body;

    const updatedData = await postNew.update(
      {
        title: title,
        body: body,
      },
      { where: { id: id } }
    );
    res.status(201).send({
      message: "user updated",
    });
  } catch (error) {
    res.send({
      message: "error occured",
      data: error,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedProduct = await postNew.destroy({ where: { id: id } });
    res.status(200).send({
      message: "your product has been deleted",
      data: deletedProduct,
    });
  } catch (error) {
    res.status(400).send({
      message: "error occured",
      data: error,
    });
  }
};

module.exports = {
  allProducts,
  productById,
  createProduct,
  updateProduct,
  deleteProduct,
};
