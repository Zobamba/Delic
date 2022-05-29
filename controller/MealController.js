import { meal } from '../models';

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

    meal.findOne({ where: { name: newMeal.name, userId: newMeal.userId } }).then((existingMeal) => {
      if (existingMeal) {
        res.status(409).send({
          message: 'You have already created a meal with this name',
        });
      } else {
        newMeal.save().then((response) => {
          meal.findOne({
            where: { id: response.id },
          }).then(newMeal => res.status(201).send({
            message: 'Meal successfully created',
            meal: newMeal
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
        meal.findOne({
          where: { id: update.id },
        }).then(updatedMeal => res.status(200).send({
          message: 'Meal successfully updated',
          meal: updatedMeal,
        }));
      } else {
        res.status(404).send({
          message: 'Meal not found',
        });
      }
    });
    meal.findOne({ where: { name: req.body.name, userId: req.user.id } }).then((existingMeal) => {
      if (existingMeal) {
        res.status(409).send({
          message: 'You already have a meal with this name',
          meal: existingMeal,
        });
      }
    });
  }

}

export default new MealsController();

