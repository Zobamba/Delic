import sequelize from 'sequelize';
import { menu, meal, menuMeal } from '../models';
import moment from 'moment';

const { Op } = sequelize;

class MenusController {
  verifyMealsInMenu(req, res, next) {
    let { meals } = req.body;
    meal.findAll({ where: { id: meals, userId: { [Op.ne]: req.user.id } } }).then((data) => {
      if (data.length) {
        res.status(401).send({
          message: `The meal, ${data[0].name}, was not created by you. 
              You can not create a menu with another user's meal.`,
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
      res.status(400).send({ message: error });
    });
  }

}

export default new MenusController();