import { meal } from '../models';
import { getErrorMessage } from './Util.js';

class MealsController {
    postMeal(req, res) {
        meal.create({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            userId: req.user.id,
            category: req.body.category,
            imageUrl: req.body.imageUrl,
        }).then((data) => {
            res.status(201).send({ message: 'Meal successfully created', meal: data });
        }).catch((error) => {
            res.status(401).send(getErrorMessage(error));
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
}

export default new MealsController();

