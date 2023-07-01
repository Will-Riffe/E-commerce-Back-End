const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint



// Gets all the categories by querying get request to path localhost:3001/api/categories in insomnia or similar program
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




// Gets specified category by querying get request to path localhost:3001/api/categories/id# in insomnia or similar program
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findOne({
      where: {
        id: req.params.id,
      },
      include: 
      [
        {model: Product,
        attributes: {exclude: ['category_id', 'categoryId']}},
      ],
    });
    res.json(category);
  } catch (err) {
    res.status(400).json(err);
  }
});




// User can post new category by running a POST request to localhost:3001/api/categories in insomnia or similar program
router.post('/', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json(err);
  }
});




// User can edit new category by running a PUT request to localhost:3001/api/categories in insomnia or similar program
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




// User can delete a specific category by running DELETE to localhost:3001/api/categories/id# in insomnia or similar program
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
