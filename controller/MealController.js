import { meal } from '../models';

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
}

export default new MealsController();

