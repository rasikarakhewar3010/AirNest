const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const {  reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //rdirectUrl save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a listing");
        return res.redirect("/login"); // Prevent further execution by returning
    }
    next(); // Proceed to the next middleware if authenticated
};

module.exports.saveRedirectUrl = (req,res, next) =>{
    if(req.session.redirectUrl) {
        res.locals.redirectUrl =req.session.redirectUrl
    }
    next();
};


// middleware to identify who is owner of listing
module.exports.isOwner = async (req,res,next) =>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error","You dont't have permission");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        return next(new ExpressError(msg, 400));
    }
    next();
};


// for server side validation of review form
module.exports.validateReview = (req,res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error)
    } else{
        next();
    }
};


// middleware to identify is the authore is same as the author of the review
module.exports.isReviewAuthor = async (req,res,next) =>{
    let { id, reviewId } = req.params;
    let revieW = await Review.findById(reviewId);
    if(!revieW.author.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
