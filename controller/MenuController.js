/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */

import sequelize from 'sequelize';
import models from '../models';

const { Op } = sequelize;

const { menu, meal, menuMeal } = models;

class MenusController {
  verifyMealsInMenu(req, res, next) {
    const { meals } = req.body;
    meal.findAll({ where: { id: meals } }).then((data) => {
      const mealIds = data.map((x) => x.id);
      const missingMeals = meals.filter((item) => !mealIds.includes(item));

      if (missingMeals.length) {
        res.status(401).send({
          message: `We do not have meals with the following ids: [${missingMeals.join(', ')}]`,
        });
      } else {
        next();
      }
    });
  }

  postMenu(req, res, next) {
    const userId = req.user.id;
    const { expiredAt } = req.body;

    menu.create({ userId, expiredAt }).then((createdMenu) => {
      req.menu = createdMenu;
      req.meals = req.body.meals;

      return next();
    });
  }

  mapMenuToMeals(req, res) {
    const { meals, menu } = req;

    const newMenuMeals = [];
    meals.forEach((ml) => {
      newMenuMeals.push({
        menuId: menu.id,
        mealId: ml,
      });
    });

    menuMeal.bulkCreate(newMenuMeals).then(() => {
      meal.findAll({ where: { id: meals } }).then((mealRecords) => {
        res.status(201).send({
          message: 'Menu successfully created',
          menu: { ...menu.dataValues, meals: mealRecords },
          mealsCount: mealRecords.length,
        });
      });
    }).catch((error) => {
      res.status(400).send({ message: error.name });
    });
  }

  getMenuByIdParam(req, res) {
    menu.findOne({
      include: [{
        model: meal,
      }],
      where: { id: req.params.id },
    }).then((responseData) => {
      if (responseData) {
        res.status(200).send({ menu: responseData });
      } else {
        res.status(404).send({ message: 'Menu not found' });
      }
    });
  }

  getMenus(req, res) {
    const { limit, offset } = req.query;
    const queryLimit = limit || 10;
    const queryOffset = offset || 0;

    menu.count().then((count) => {
      menu.findAll({
        include: [{
          model: meal,
        }],
        limit: queryLimit,
        offset: queryOffset,
        order: [['id', 'ASC']],
      }).then((menus) => {
        res.status(200).send({
          menus,
          count,
          limit: queryLimit,
          offset: queryOffset,
        });
      });
    });
  }

  getActiveMenusMeals(req, res) {
    const { limit, offset } = req.query;
    const queryLimit = limit;
    const queryOffset = offset || 0;

    menu.findAll({
      where: {
        expiredAt: {
          [Op.gt]: new Date(),
        },
      },
    }).then((activeMenus) => {
      const menuIds = activeMenus.map((menus) => menus.id);

      if (activeMenus) {
        menuMeal.findAll({
          include: [{
            model: meal,
          }],
          where: { menuId: menuIds },
        }).then((menusMeals) => {
          const mealIds = menusMeals.map((menusMeal) => menusMeal.mealId);

          meal.findAll({
            where: { id: mealIds },
            limit: queryLimit,
            offset: queryOffset,
            order: [['id', 'ASC']],
          }).then((mealRecords) => {
            res.status(200).send({
              mealRecords,
              mealsCount: mealRecords.length,
              limit: queryLimit,
              offset: queryOffset,
            });
          });
        });
      } else {
        res.status(404).send({ message: 'No active Menu(s)' });
      }
    });
  }

  putMenu(req, res, next) {
    const { expiredAt, meals } = req.body;
    const userId = req.user.id;

    menu.findOne({ where: { id: req.params.id } }).then((existingMenu) => {
      if (existingMenu) {
        menu.update(
          {
            expiredAt,
            userId,
          },
          { where: { id: req.params.id }, returning: true },
        ).then((updatedMenu) => {
          meal.findAll({ where: { id: meals } }).then((mealRecords) => {
            req.menu = updatedMenu;
            req.meals = mealRecords;

            next();
          });
        });
      } else {
        res.status(404).send({ message: 'Menu not found' });
      }
    });
  }

  updateMealsInMenu(req, res) {
    menuMeal.destroy({ where: { menuId: req.params.id } }).then(() => {
      const newMenuMeals = [];
      const { meals } = req;

      meals.forEach((ml) => {
        newMenuMeals.push({
          menuId: req.params.id,
          mealId: ml.id,
        });
      });

      menuMeal.bulkCreate(newMenuMeals).then(() => {
        menu.findOne({
          include: [{ model: meal }],
          where: { id: req.params.id },
        }).then(() => {
          res.status(200).send({
            message: 'Menu successfully updated',
            mealsCount: meals.length,
            menu: req.menu[1],
            meals,
          });
        });
      });
    });
  }

  deleteMenu(req, res) {
    menu.destroy({
      where: { id: req.params.id },
    }).then((deleted) => {
      if (deleted) {
        res.status(200).send({
          message: 'Menu successfully deleted',
        });
      } else {
        res.status(404).send({
          message: 'Menu not found',
        });
      }
    });
  }
}

export default new MenusController();
