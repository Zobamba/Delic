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
        }).then(() => {
            res.status(201).send({ message: 'Meal successfully created' });
        }).catch((error) => {
            res.status(401).send(getErrorMessage(error));
        });
    }
}

export default new MealsController();

