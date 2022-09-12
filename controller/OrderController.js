import { order, meal, orderMeal } from '../models';
import moment from 'moment';

class OrderController {
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
    const newOrderMeals = [];
    let totalPrice = 0;

    meals.forEach((ml) => {
      newOrderMeals.push({
        orderId: order.id,
        mealId: ml.mealId,
        price: ml.price,
        units: ml.units,
      });
      totalPrice = (ml.price * ml.units) + totalPrice;
    });

    orderMeal.bulkCreate(newOrderMeals).then(() => {
      res.status(201).send({
        message: 'Order successfully created',
        order,
        meals,
        totalPrice: totalPrice
      });
    });
  }

  putOrder(req, res, next) {
    const { address, phoneNumber, meals } = req.body;
    const mealIds = meals.map((ml) => ml.mealId);
    const userId = req.user.id;

    order.findOne({ where: { id: req.params.id, userId } }).then((existingOrder) => {
      if (existingOrder) {
          order.update(
            {
              address,
              phoneNumber,
              userId,
            },
            { where: { id: req.params.id }, returning: true },
          ).then((updatedOrder) => {

            meal.findAll({ where: { id: mealIds } }).then((mealRecords) => {
              req.order = updatedOrder;
              req.meals = mealRecords.map((ml) => {
                return { ...meals.find(item => item.mealId === ml.id), price: ml.price }
              });

              next()
            })
          });
      } else {
        res.status(404).send({ message: 'Order not found' });
      }
    });
  }

  updateMealsInOrder(req, res) {
    orderMeal.destroy({ where: { orderId: req.params.id } }).then(() => {
      const newOrderMeals = [];
      const { meals } = req;
      let totalPrice = 0;

      meals.forEach((ml) => {
        newOrderMeals.push({
          orderId: req.params.id,
          mealId: ml.mealId,
          price: ml.price,
          units: ml.units,
        });
        totalPrice = (ml.price * ml.units) + totalPrice;
      });

      orderMeal.bulkCreate(newOrderMeals).then(() => {
        order.findOne({
          include: [{ model: meal }],
          where: { id: req.params.id },
        }).then(() => {
          res.status(200).send({
            message: 'Order successfully updated',
            mealsCount: meals.length,
            order: req.order[1],
            meals,
            totalPrice: totalPrice
          });
        });
      });
    });
  }

  getOrderByIdParam(req, res) {
    order.findOne({
      include: [{
        model: meal,
      }],
      where: { id: req.params.id, userId: req.user.id }
    }).then((responseData) => {
      if (responseData) {
        res.status(200).send({ order: responseData });
      } else {
        res.status(404).send({ message: 'Order not found' });
      }
    });
  }

  getOrders(req, res) {
    const { limit, offset } = req.query;
    const queryLimit = limit || 10;
    const queryOffset = offset || 0;

    order.count().then((count) => {
      order.findAll({
        include: [{
          model: meal,
        }],
        limit: queryLimit,
        offset: queryOffset,
        order: [['id', 'ASC']],
      }).then((orders) => {
        res.status(200).send({
          orders: orders,
          count,
          limit: queryLimit,
          offset: queryOffset
        });
      });
    });
  }

  deleteOrder(req, res) {
    order.destroy({
      where: { id: req.params.id, userId: req.user.id },
    }).then((deleted) => {
      if (deleted) {
        res.status(200).send({
          message: 'Order successfully deleted',
        });
      } else {
        res.status(404).send({
          message: 'Order not found',
        });
      }
    });
  }
}

export default new OrderController();