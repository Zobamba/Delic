import { order, meal, orderMeal } from '../models';

class OrdersController {
    verifyMealsInOrder(req, res, next) {
        let { meals } = req.body;
        const mealIds = meals.map((ml) => ml.mealId);

        meal.findAll({ where: { id: mealIds } }).then((data) => {
            const dbMealIds = data.map(x => x.id);
            const missingMeals = mealIds.filter(item => !dbMealIds.includes(item))

            if (missingMeals.length) {
                res.status(401).send({
                    message: `We do not have meals with the following ids: [${missingMeals.join(', ')}]`
                });
            } else {
                next()
            }
        });
    }

    postOrder(req, res, next) {
        const { address, phoneNumber, meals } = req.body;
        const userId = req.user.id;
        const mealIds = meals.map((ml) => ml.mealId);

        order.create({
            phoneNumber,
            address,
            userId,
        }).then((createdOrder) => {
            meal.findAll({ where: { id: mealIds } }).then((mealRecords) => {
                req.order = createdOrder;
                req.meals = mealRecords.map((ml) => {
                    return { ...meals.find(item => item.mealId === ml.id), price: ml.price }
                });

                next();
            })
        });
    }

    mapOrderToMeals(req, res) {
        const { meals, order } = req;

        console.log(meals);

        const newOrderMeals = [];
        meals.forEach((ml) => {
            newOrderMeals.push({
                orderId: order.id,
                mealId: ml.mealId,
                price: ml.price,
                units: ml.units,
            });
        });

        orderMeal.bulkCreate(newOrderMeals).then(() => {
            res.status(201).send({
                message: 'Order successfully created',
                order,
                meals
            });
        });
    }
}

export default new OrdersController();