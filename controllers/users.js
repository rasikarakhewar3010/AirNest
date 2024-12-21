const User = require("../models/user.js");



module.exports.renserSignup =(req, res) => {
    try {
        res.render("users/signup.ejs");
    } catch (e) {
        req.flash("error", "An error occurred while rendering the signup page.");
        return res.redirect("/error");
    }
};


module.exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        req.login(registerUser, (err)=>{
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to AirNest!");
            return res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
};

module.exports.renderLogin =  (req, res) => {
    try {
        res.render("users/login.ejs");
    } catch (e) {
        req.flash("error", "An error occurred while rendering the login page.");
        return res.redirect("/error");
    }
};

module.exports.login =  async (req, res) => {
    req.flash("success", "Welcome back to AirNest!");
    let redirectUrl = res.locals.redirectUrl || '/listings'
    return res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err) {
            return next(err);
        }
        req.flash("success", "You are loggedout!");
        return res.redirect("/listings");
    })
};