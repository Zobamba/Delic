import { meal } from '../models';
import sequelize from 'sequelize';

const { Op } = sequelize;

const mealViewModelFromArray = (meals) => {
  const viewModel = [];
  meals.forEach((item) => {
    const thisModel = {
      id: item.id,
      name: item.name,
      price: item.price,
      userId: item.userId,
      category: item.category,
      description: item.description,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      imageUrl: item.imageUrl,
    };
    viewModel.push(thisModel);
  });
  return viewModel;
};

const mealViewModel = (item) => {
  const viewModel = {
    id: item.id,
    name: item.name,
    price: item.price,
    userId: item.userId,
    category: item.category,
    description: item.description,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    imageUrl: item.imageUrl,
  };
  return viewModel;
};

class MealsController {
  constructor() {
    this.putMeal = this.putMeal.bind(this);
    this.getMeals = this.getMeals.bind(this);

  }

  postMeal(req, res) {
    const newMeal = meal.build({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      userId: req.user.id,
      category: req.body.category,
      imageUrl: req.body.imageUrl,
    });

    meal.findOne({ where: { name: newMeal.name, userId: newMeal.userId } }).then((existingMeal) => {
      if (existingMeal) {
        res.status(409).send({
          message: 'You have already created a meal with this name',
        });
      } else {
        newMeal.save().then((response) => {
          meal.findOne({
            where: { id: response.id },
          }).then(returnedMeal => res.status(201).send({
            message: 'Meal successfully created',
            meal: mealViewModel(returnedMeal),
          }));
        });
      }
    });
  }

  getMealById(req, res) {
    meal.findOne({ where: { id: req.params.id, userId: req.user.id } }).then((ml) => {
      if (ml) {
        res.status(200).send(ml);
      } else {
        res.status(404).send({
          message: 'Meal not found',
        });
      }
    });
  }

  fetchUpdatedMeal(res, update) {
    meal.findOne({
      where: { id: update.id },
    }).then(returnedMeal => res.status(200).send({
      message: 'Meal successfully updated',
      meal: mealViewModel(returnedMeal),
    }));
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
      { where: { id: req.params.id, userId: req.user.id }, returning: true },
    ).then((updated) => {
      const update = updated[1][0];
      if (update) {
        this.fetchUpdatedMeal(res, update);
      } else {
        res.status(404).send({
          message: 'Meal not found',
        });
      }
    });
  }

  getMeals(req, res) {
    const { searchKey } = req.query;
    meal.count({
      where: searchKey === undefined ? { userId: req.user.id } :
        {
          userId: req.user.id,
          [Op.or]: {
            name: { [Op.iLike]: `%${searchKey}%` },
            description: { [Op.iLike]: `%${searchKey}%` },
            category: { [Op.iLike]: `%${searchKey}%` },
          },
        },
    }).then((count) => {
      this.findAllMeals(req, res, count);
    });
  }

  findAllMeals(req, res, count) {
    const { offset, limit, searchKey } = req.query;
    meal.findAll({
      order: sequelize.literal('name'),
      offset: offset || 0,
      limit: limit || 10,
      where: searchKey === undefined ? { userId: req.user.id } :
        {
          userId: req.user.id,
          [Op.or]: {
            name: { [Op.iLike]: `%${searchKey}%` },
            description: { [Op.iLike]: `%${searchKey}%` },
            category: { [Op.iLike]: `%${searchKey}%` },
          },
        },
    }).then((meals) => {
      const viewModel = mealViewModelFromArray(meals);
      res.status(200).send({ meals: viewModel, count });
    });
  }

  deleteMeal(req, res) {
    meal.destroy({
      where: { id: req.params.id, userId: req.user.id },
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
    });
  }

}

export default new MealsController();

