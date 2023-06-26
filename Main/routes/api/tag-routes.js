const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');




// The `/api/tags` endpoint



// route to fetch ALL TAGS
router.get('/', function(req, res) {
  Tag.findAll({
    include: [
      {
        model: Product,
        through: ProductTag,
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




// route to fetch SPECIFIC TAG BY ID
router.get('/:id', function(req, res) {
  Tag.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Product,
        through: ProductTag,
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




// route to CREATE A NEW TAG
router.post('/', function(req, res) {
  Tag.create(req.body)
    .then(function(tag) {
      res.status(200).json(tag);
    })
    .catch(function(err) {
      res.status(404).json(err);
    });
});




// route to UPDATE TAG BY ID
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




// route to DELETE TAG BY ID
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
