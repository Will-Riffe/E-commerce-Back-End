const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint




router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: 
      [
        {model: Product,
        attributes: {exclude: ['category_id', 'categoryId']}},
      ],
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});





router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findOne({
      where: {
        id: req.params.id,
      },
      include: [Product],
    });
    res.json(category);
  } catch (err) {
    res.status(400).json(err);
  }
});





router.post('/', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json(err);
  }
});





router.put('/:id', async (req, res) => {
  try {
    await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: 'Category updated successfully' });
  } catch (err) {
    res.status(400).json(err);
  }
});





router.delete('/:id', async (req, res) => {
  try {
    await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(400).json(err);
  }
});


module.exports = router;
