var express = require('express');
var router = express.Router();
var Author = require('../models/author.js');
var Book = require('../models/chapter.js')
var Chapter = require('../models/chapter.js')

var Promise = require('bluebird');

module.exports = router;

//Get all Pokemon
router.get('/pokemon', function(req, res, next){
  if(req.query.name){
    Pokemon.findAll({where: {name: req.query.name}})
    .then(pokemon => res.send(pokemon))
    .catch(next)
  } else {
    Pokemon.findAll()
    .then(pokemonArr => res.send(pokemonArr))
    .catch(next)
  }
});

// //Make a new pokemon
// router.post('/pokemon', function(req, res, next){
//   var name = req.body.name;
//   var type = req.body.type;
//   Pokemon.create({name: name, type: type})
//   .then(newPokemon => res.send(newPokemon))
//   .catch(next)
// })
//
// //Get specific Pokemon
// router.get('/pokemon/:id', function(req, res, next) {
//   Pokemon.findById(req.params.id)
//   .then(pokemon => res.send(pokemon))
//   .catch(next)
// });
//
//
// //Trainer finds pokemon
// router.put('/trainer/:trainerId/pokemon/:pokemonId', function(req, res, next) {
//   var trainerId = req.params.trainerId;
//   var pokemonId = req.params.pokemonId;
//
//   Promise.all([Trainer.findById(trainerId), Pokemon.findById(pokemonId)])
//   .spread((trainer, pokemon) => trainer.addPokemon(pokemon))
//   .then(trainer => res.send(trainer))
//   .catch(next)
//
// })
//
// //Trainer loses pokemon
// router.put('trainer/:trainerId/pokemon/:pokemonId/lose', function(req, res, next) {
//   var trainerId = req.params.trainerId;
//   var pokemonId = req.params.pokemonId;
//
//   Promise.all([Trainer.findById(trainerId), Pokemon.findById(pokemonId)])
//   .spread((trainer, pokemon) => trainer.removePokemon(pokemon))
//   .then(trainer => res.send(trainer))
//   .catch(next)
// })
//
// router.delete('/pokemon/:id', function(req, res, next) {
//   Pokemon.findById(req.params.id)
//   .then(pokemon => pokemon.destroy())
//   .then(() => res.sendStatus(204))
//   .catch(next)
// });
