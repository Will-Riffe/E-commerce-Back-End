const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint





// Then, you can use the association in the code
router.get('/', function (req, res) {
  Product.findAll({
    include: [
      {
        model: Category,
      },
      {
        model: Tag,
        through: { model: ProductTag, 
          attributes: { exclude: ['tag_id', 'productId', 'tagId'] } 
        },
      },
    ],
    attributes: { exclude: ['category_id', 'categoryId'] }
  })
    .then(function (products) {
      res.json(products);
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).json(err);
    });
});






// get one product
router.get('/:id', function (req, res) {
  Product.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      Category,
      {
        model: Tag,
        through: ProductTag,
        attributes: {
          exclude: ['category_id', 'categoryId']
        },
      },
    ],
  })
    .then(function (products) {
      res.json(products);
    })
    .catch(function (err) {
      console.log(err);
      res.status(400).json(err);
    });
});






// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length && req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});





// update product
router.put('/:id', function (req, res) {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then(function (product) {
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTags = ProductTag.findAll({ where: { product_id: req.params.id } });
        const productTagIds = productTags.map(function (tag) {
          return tag.tag_id;
        });

        // create filtered list of new tag_ids
        const newProductTags = req.body.tagIds
          .filter(function (tag_id) {
            return !productTagIds.includes(tag_id);
          })
          .map(function (tag_id) {
            return {
              product_id: req.params.id,
              tag_id: tag_id,
            };
          });

        // figure out which ones to remove
        const productTagsToRemove = productTags
          .filter(function (tag) {
            return !req.body.tagIds.includes(tag.tag_id);
          })
          .map(function (tag) {
            return tag.id;
          });

        // run both actions
        return Promise.all([
          ProductTag.destroy({ where: { id: productTagsToRemove } }),
          ProductTag.bulkCreate(newProductTags),
        ]);
      }

      return res.json(product);
    })
    .catch(function (err) {
      // console.log(err);
      res.status(400).json(err);
    });
});





router.delete('/:id', function (req, res) {
  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(function (products) {
      console.log(products);
      res.json(products);
    })
    .catch(function (err) {
      console.log(err);
      res.status(400).json(err);
    });
});


module.exports = router;
