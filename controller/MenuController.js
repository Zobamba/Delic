import sequelize from 'sequelize';
import { menu, meal, menuMeal, user } from '../models';
import moment from 'moment';

const { Op } = sequelize;

class MenusController {
  constructor() {
    this.putMenu = this.putMenu.bind(this);
  }
  verifyMealsInMenu(req, res, next) {
    let { meals } = req.body;
    meal.findAll({ where: { id: meals, userId: { [Op.ne]: req.user.id } } }).then((data) => {
      if (data.length) {
        res.status(401).send({
          message: `The meal, ${data[0].name}, was not created by you. You can not have a menu with another user's meal.`,
        });
      } else {
        meal.findAll({ where: { id: meals } }).then((data) => {
          const mealIds = data.map(x => x.id);
          const missingMeals = meals.filter(item => !mealIds.includes(item))

          if (missingMeals.length) {
            res.status(401).send({
              message: `We do not have meals with the following ids: [${missingMeals.join(', ')}]`
            });
          } else {
            next();
          }
        });
      }
    });
  }

  postMenu(req, res, next) {
    const { date } = req.body;
    const userId = req.user.id;
    const menuDate = moment([date], 'YYYY/MM/DD');

    menu.findOne({ where: { userId, date: menuDate } }).then((existingMenu) => {
      if (existingMenu) {
        return res.status(400).send({
          message: 'You have already created a menu for the selected date.',
        });
      } else {
        menu.create({ userId, date: menuDate }).then((createdMenu) => {
          req.menu = createdMenu;
          req.meals = req.body.meals;

          return next();
        });
      }
    });
  }

  mapMenuToMeals(req, res) {
    const { meals, menu } = req;

    const newMenuMeals = [];
    meals.forEach((ml) => {
      newMenuMeals.push({
        menuId: menu.id,
        mealId: ml
      });
    });

    menuMeal.bulkCreate(newMenuMeals).then(() => {
      meal.findAll({ where: { id: meals } }).then((mealRecords) => {
        res.status(201).send({
          message: 'Menu(s) successfully created',
          menu: { ...menu.dataValues, meals: mealRecords }
        });
      })
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
    }).then(responseData => responseData);
  }

  getMenuByIdParam(req, res) {
    menu.findOne({
      include: [{
        model: meal,
      }],
      where: { id: req.params.id, userId: req.user.id },
    }).then((responseData) => {
      if (responseData) {
        res.status(200).send({ menu: responseData });
      } else {
        res.status(404).send({ message: 'Menu not found' });
      }
    });
  }

  getMenus(req, res) {
    const { date } = req.query;
    menu.findAll({
      include: [
        {
          model: meal, user
        },
      ],
      limit: req.query.limit || 10,
      offset: req.query.offset || 0,
      order: [['date', 'DESC']],
      where: date ? { date } : null,
    }).then((responseData) => {
      res.status(200).send((responseData));
    });
  }

  putMenu(req, res) {
    const { date, meals } = req.body;
    const userId = req.user.id;

    menu.findOne({ where: { id: req.params.id } }).then((existingMenu) => {
      if (existingMenu) {
        if (existingMenu.date !== date) {
          menu.findOne({ where: { userId, date } }).then((alreadyExist) => {
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
        id: req.params.id,
        date,
        userId,
      },
      { where: { id: req.params.id, userId: req.user.id }, returning: true },
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
                  menu: { ...menu.dataValues, meals: mealRecords }
                });
              })
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
          mealId: ml
        });
      });

      menuMeal.bulkCreate(newMenuMeals).then(() => {
        this.getMenuById(updatedMenu.id).then((responseData) => {
          if (responseData) {
            meal.findAll({ where: { id: meals } }).then((mealRecords) => {

              res.status(200).send({
                message: 'Menu successfully updated',
                menu: { ...menu.dataValues, meals: mealRecords }
              });
            })
          }
        });
      });
    });
  }

}

export default new MenusController();