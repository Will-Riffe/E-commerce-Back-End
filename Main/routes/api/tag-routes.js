const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');




// The `/api/tags` endpoint



// Gets all the tags by querying get request to path localhost:3001/api/tags in insomnia or similar program
router.get('/', function(req, res) {
  Tag.findAll({
    include: [
      {
        model: Product,
        through: { model: ProductTag, 
          attributes: { exclude: ['tag_id', 'productId', 'tagId'] }
        },
        attributes: { exclude: ['categoryId'] }
      },
    ],
  })
    .then(function(tags) {
      res.status(200).json(tags);
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});




// Gets specified tags by querying get request to path localhost:3001/api/tags/id# in insomnia or similar program
router.get('/:id', function(req, res) {
  Tag.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Product,
        through: { model: ProductTag, 
          attributes: { exclude: ['tag_id', 'productId', 'tagId'] }
        },
        attributes: { exclude: ['categoryId'] }
      },
    ],
  })
    .then(function(tag) {
      if (tag) {
        res.status(200).json(tag);
      } else {
        res.status(404).json({ message: 'Tag not found' });
      }
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});




// User can post new tags by running a POST request to localhost:3001/api/tags in insomnia or similar program
// along with appropriate JSON data, such as '{"tag_name": "Honey Makers"}'
router.post('/', function(req, res) {
  Tag.create(req.body)
    .then(function(tag) {
      res.status(200).json(tag);
    })
    .catch(function(err) {
      res.status(404).json(err);
    });
});




// User can edit a tags by running a PUT request to localhost:3001/api/tags in insomnia or similar program
// and specifying the id of the tag
router.put('/:id', function(req, res) {
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then(function(tag) {
      res.status(200).json(tag);
    })
    .catch(function(err) {
      res.status(404).json(err);
    });
});




// User can delete a specific tags by running DELETE to localhost:3001/api/tags/id# in insomnia or similar program
router.delete('/:id', function(req, res) {
  Tag.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(function(tag) {
      res.status(200).json(tag);
    })
    .catch(function(err) {
      res.status(404).json(err);
    });
});





module.exports = router;
