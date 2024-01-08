/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable class-methods-use-this */
import models from '../models';
import { getErrorMessage } from './Util';

const { order, meal, orderMeal } = models;

class OrderController {
  verifyMealsInOrder(req, res, next) {
    const { meals } = req.body;
    const mealIds = meals.map((ml) => ml.mealId);

    meal.findAll({ where: { id: mealIds } }).then((data) => {
      const dbMealIds = data.map((x) => x.id);
      const missingMeals = mealIds.filter((item) => !dbMealIds.includes(item));

      if (missingMeals.length) {
        res.status(401).send({
          message: `We do not have meals with the following ids: [${missingMeals.join(', ')}]`,
        });
      } else {
        next();
      }
    });
  }

  postOrder(req, res, next) {
    const {
      address, paymentReference, phoneNumber, meals, status,
    } = req.body;
    const userId = req.user.id;
    const mealIds = meals.map((ml) => ml.mealId);

    order.create({
      phoneNumber,
      paymentReference,
      address,
      userId,
      status,
    }).then((createdOrder) => {
      meal.findAll({ where: { id: mealIds } }).then((mealRecords) => {
        req.order = createdOrder;
        req.meals = mealRecords.map((ml) => ({
          ...meals.find((item) => item.mealId === ml.id),
          name: ml.name,
          price: ml.price,
        }));

        next();
      });
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
        totalPrice,
      });
    });
  }

  putOrder(req, res, next) {
    const {
      address, phoneNumber, status, meals,
    } = req.body;
    const mealIds = meals.map((ml) => ml.mealId);
    const userId = req.user.id;

    order.findOne({ where: { id: req.params.id } }).then((existingOrder) => {
      if (existingOrder) {
        order.update(
          {
            address,
            phoneNumber,
            status,
            userId,
          },
          { where: { id: req.params.id }, returning: true },
        ).then((updatedOrder) => {
          meal.findAll({ where: { id: mealIds } }).then((mealRecords) => {
            req.order = updatedOrder;
            req.meals = mealRecords.map((ml) => ({
              ...meals.find((item) => item.mealId === ml.id),
              name: ml.name,
              price: ml.price,
            }));

            next();
          });
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
            totalPrice,
          });
        });
      });
    });
  }

  getOrderByIdParam(req, res) {
    orderMeal.findAll({ where: { orderId: req.params.id } }).then((orderMeals) => {
      let totalPrice = 0;

      orderMeals.forEach((ml) => {
        totalPrice = (ml.price * ml.units) + totalPrice;
      });

      order.findOne({
        include: [{
          model: meal,
        }],
        where: { id: req.params.id },
      }).then((responseData) => {
        if (responseData) {
          res.status(200).send({ order: responseData, totalPrice });
        } else {
          res.status(404).send({ message: 'Order not found' });
        }
      });
    });
  }

  getOrders(req, res) {
    const { limit, offset } = req.query;
    const queryLimit = limit;
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
        const promises = orders.map((odr) => orderMeal.findAll({ where: { orderId: odr.id } })
          .then((orderMeals) => {
            let totalPrice = 0;

            orderMeals.forEach((ml) => {
              totalPrice = (ml.price * ml.units) + totalPrice;
            });

            return order.findOne({
              include: [{
                model: meal,
              }],
              where: { id: odr.id },
            }).then((responseData) => {
              if (responseData) {
                return { order: responseData, totalPrice };
              }
              return { message: 'Order not found' };
            });
          }));

        Promise.all(promises)
          .then((results) => {
            res.status(200).send({
              orders: results,
              count,
              limit: queryLimit,
              offset: queryOffset,
            });
          })
          .catch((error) => {
            res.status(401).send(getErrorMessage(error));
          });
      }).catch((error) => {
        res.status(401).send(getErrorMessage(error));
      });
    });
  }

  getLastTenOrders(req, res) {
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
        order: [['createdAt', 'DESC']],
      }).then((orders) => {
        const promises = orders.map((odr) => orderMeal.findAll({ where: { orderId: odr.id } })
          .then((orderMeals) => {
            let totalPrice = 0;

            orderMeals.forEach((ml) => {
              totalPrice = (ml.price * ml.units) + totalPrice;
            });

            return order.findOne({
              include: [{
                model: meal,
              }],
              where: { id: odr.id },
            }).then((responseData) => {
              if (responseData) {
                return { order: responseData, totalPrice };
              }
              return { message: 'Order not found' };
            });
          }));

        Promise.all(promises)
          .then((results) => {
            res.status(200).send({
              orders: results,
              count,
              limit: queryLimit,
              offset: queryOffset,
            });
          })
          .catch((error) => {
            res.status(401).send(getErrorMessage(error));
          });
      }).catch((error) => {
        res.status(401).send(getErrorMessage(error));
      });
    });
  }

  deleteOrder(req, res) {
    order.destroy({
      where: { id: req.params.id },
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
