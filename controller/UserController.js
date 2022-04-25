import passwordHash from 'password-hash';


class UserController {
    signUp(req, res) {
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            passwordHash: passwordHash.generate(req.body.password),
            password_confirmation: passwordHash.generate(req.body.password),
        }

        if (!user.firstName || !user.email) {
            return res.status(400).json({ msg: 'please include a firstName and email' });
        }

    }
}

export default new UserController;