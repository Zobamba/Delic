/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import sequelize from 'sequelize';
import models from '../models';

const { meal } = models;

const { Op } = sequelize;

class MealsController {
  postMeal(req, res) {
    const newMeal = meal.build({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      userId: req.user.id,
      category: req.body.category,
      imageUrl: req.body.imageUrl,
    });
    meal.findOne({ where: { name: newMeal.name } }).then((existingMeal) => {
      if (existingMeal) {
        res.status(409).send({
          message: `A meal with the name '${req.body.name}' already exists`,
        });
      } else {
        newMeal.save().then((response) => {
          meal.findOne({
            where: { id: response.id },
          }).then((createdMeal) => res.status(201).send({
            message: 'Meal successfully created',
            meal: createdMeal,
          }));
        });
      }
    });
  }

  getMealById(req, res) {
    meal.findOne({ where: { id: req.params.id } }).then((ml) => {
      if (ml) {
        res.status(200).send(ml);
      } else {
        res.status(404).send({
          message: 'Meal not found',
        });
      }
    });
  }

  putMeal(req, res) {
    meal.update(
      {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        userId: req.user.id,
        category: req.body.category,
        imageUrl: req.body.imageUrl,
      },
      {
        where: { id: req.params.id }, returning: true,
      },
    ).then((updated) => {
      const updatedMeal = updated[1][0];

      if (updatedMeal) {
        return res.status(200).send({
          message: 'Meal successfully updated',
          meal: updatedMeal,
        });
      }

      res.status(404).send({
        message: 'Meal not found',
      });
    }).catch((error) => {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).send({
          message: `A meal with the name '${req.body.name}' already exists`,
        });
      }

      res.status(400).send({
        message: 'An error occurred while trying to update meal record. Please try again',
      });
    });
  }

  getMeals(req, res) {
    const { offset, limit, searchKey } = req.query;
    const queryLimit = limit || 10;
    const queryOffset = offset || 0;
    meal.count({
      where: searchKey === undefined ? {}
        : {
          [Op.or]: {
            name: { [Op.iLike]: `%${searchKey}%` },
            description: { [Op.iLike]: `%${searchKey}%` },
            category: { [Op.iLike]: `%${searchKey}%` },
          },
        },
    }).then((count) => {
      meal.findAll({
        order: sequelize.literal('id'),
        offset: queryOffset,
        limit: queryLimit,
        where: searchKey === undefined ? {}
          : {
            [Op.or]: {
              name: { [Op.iLike]: `%${searchKey}%` },
              description: { [Op.iLike]: `%${searchKey}%` },
              category: { [Op.iLike]: `%${searchKey}%` },
            },
          },
      }).then((meals) => {
        res.status(200).send({
          meals,
          count,
          limit: queryLimit,
          offset: queryOffset,
        });
      });
    });
  }

  deleteMeal(req, res) {
    meal.destroy({
      where: { id: req.params.id },
    }).then((deleted) => {
      if (deleted) {
        res.status(200).send({
          message: 'Meal successfully deleted',
        });
      } else {
        res.status(404).send({
          message: 'Meal not found',
        });
      }
    }).catch((error) => {
      res.status(400).send({ message: error.name });
    });
  }
}

export default new MealsController();
