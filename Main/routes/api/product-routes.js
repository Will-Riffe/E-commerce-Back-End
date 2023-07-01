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
        through: { model: ProductTag, 
          attributes: { exclude: ['tag_id', 'productId', 'tagId'] } 
        },
      },
    ],
    attributes: { exclude: ['categoryId'] }
  })
    .then(function (products) {
      res.json(products);
    })
    .catch(function (err) {
      console.log(err);
      res.status(400).json(err);
    });
});






// User can post new product by running a POST request to localhost:3001/api/products in insomnia or similar program
// along with appropriate data as outlined under Product.create
router.post('/', (req, res) => {
  Product.create({
     product_name: req.body.product_name,
     price: req.body.price,
     stock: req.body.stock,
     category_id: req.body.category_id,
     tag_id: req.body.tag_id
     })
     .then((product) => {
      // below code should*** create pairings for productTag table
       if (req.body.tag_id.length) {
         const productTagIdArr = req.body.tag_id.map((tag_id) => {
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





// User can edit a product by running a PUT request to localhost:3001/api/products/id# in insomnia or similar program
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

        // chooses the ones to remove
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




// User can delete a specific product by running DELETE to localhost:3001/api/products/id# in insomnia or similar program
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
