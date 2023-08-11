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
    const newMeal = meal.update(
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
    );
    newMeal.then((updated) => {
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
    });
  }

  putMeal2(req, res) {
    meal.findAll({
      order: sequelize.literal('id'),
      where: {},
    }).then((meals) => {
      meals.forEach((ml) => {
        meal.update({
          price2: parseInt(ml.price, 10),
        }, { where: { id: ml.id } });
      });
    }).then((updated) => {
      res.status(200).send(updated);
    });
  }

  getMeals(req, res) {
    const { offset, limit, searchKey } = req.query;
    const queryLimit = limit;
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
      }).catch((error) => {
        if (error.name === 'SequelizeDatabaseError') {
          return res.status(400).send({
            message: 'The limit or offset field(s) must be an integer',
          });
        }
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

  restoreMeals(req, res) {
    meal.restore({
      where: {
        id: {
          [Op.between]: [0, 611],
        },
      },
    }).then((restored) => {
      res.sendStatus(200).send(restored);
    });
  }
}

export default new MealsController();
