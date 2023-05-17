/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
// import moment from 'moment';
import models from '../models';

const { menu, meal, menuMeal } = models;

class MenusController {
  constructor() {
    this.putMenu = this.putMenu.bind(this);
  }

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

    menu.create({ userId, expiredAt: req.body.expiredAt }).then((createdMenu) => {
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
        });
      });
    }).catch((error) => {
      res.status(400).send({ message: error.name });
    });
  }

  getMenuById(id) {
    return menu.findOne({
      include: [{
        model: meal,
      }],
      where: { id },
    }).then((responseData) => responseData);
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
        where: {},
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

  getAllMenusMeals(req, res) {
    const { limit, offset } = req.query;
    const queryLimit = limit || 10;
    const queryOffset = offset || 0;

    menu.findAll({
      include: [{
        model: meal,
      }],
      limit: queryLimit,
      offset: queryOffset,
      order: [['id', 'ASC']],
      where: {},
    }).then(() => {
      menuMeal.findAll({
        include: [{
          model: meal,
        }],
        limit: queryLimit,
        offset: queryOffset,
        order: [['id', 'ASC']],
        where: {},
      }).then((menus) => {
        res.status(200).send({
          menus,
          limit: queryLimit,
          offset: queryOffset,
        });
      });
    });
  }

  putMenu(req, res) {
    const { date, meals } = req.body;
    const userId = req.user.id;

    menu.findOne({ where: { id: req.params.id } }).then((existingMenu) => {
      if (existingMenu) {
        if (existingMenu.date !== date) {
          menu.findOne({ where: { date } }).then((alreadyExist) => {
            if (alreadyExist) {
              res.status(400).send({
                message: 'You have a menu for the selected date. Please choose a different date.',
              });
            } else {
              this.updateMenu(req, res, date, meals, userId);
            }
          });
        } else {
          this.updateMenu(req, res, date, meals, userId);
        }
      } else {
        return res.status(404).send({ message: 'Menu not found' });
      }
    });
  }

  updateMenu(req, res, date, meals, userId) {
    menu.update(
      {
        date,
        userId,
      },
      { where: { id: req.params.id }, returning: true },
    ).then((updated) => {
      const updatedMenu = updated[1][0];

      if (updatedMenu) {
        if (meals) {
          this.updateMealsInMenu(req, res, meals, updatedMenu);
        } else {
          this.getMenuById(updatedMenu.id).then((responseData) => {
            if (responseData) {
              meal.findAll({ where: { id: meals } }).then((mealRecords) => {
                res.status(200).send({
                  message: 'Menu successfully updated',
                  menu: { ...menu.dataValues, meals: mealRecords },
                });
              });
            }
          });
        }
      }
    });
  }

  updateMealsInMenu(req, res, meals, updatedMenu) {
    menuMeal.destroy({ where: { menuId: req.params.id } }).then(() => {
      const newMenuMeals = [];
      meals.forEach((ml) => {
        newMenuMeals.push({
          menuId: req.params.id,
          mealId: ml,
        });
      });

      menuMeal.bulkCreate(newMenuMeals).then(() => {
        this.getMenuById(updatedMenu.id).then((responseData) => {
          if (responseData) {
            meal.findAll({ where: { id: meals } }).then((mealRecords) => {
              res.status(200).send({
                message: 'Menu successfully updated',
                menu: { ...menu.dataValues, meals: mealRecords },
              });
            });
          }
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
