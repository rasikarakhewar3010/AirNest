const Listing = require("../models/listing")

module.exports.index =async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listing/index.ejs", { allListings });
};

module.exports.renderNewForm =  (req, res) => {
    res.render("listing/new.ejs");
};

module.exports.create = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; //to identify owner
    newListing.image ={url,filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    return res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: 'reviews',
        populate: {
            path: "author",
        }
       })
      .populate('owner');
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listing/show.ejs", { listing, reviews: listing.reviews });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    let orignalImageUrl = listing.image.url;
    orignalImageUrl= orignalImageUrl.replace("/upload","/upload/w_250");
    res.render("listing/edit.ejs", { listing , orignalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing  });

    if (!listing) {
        req.flash("error", "The listing you requested does not exist!");
        return res.redirect("/listings");
    }

    if(typeof req.file !== "undefined"){
        let url= req.file.path;
        let filename = req.file.filename;
        listing.image = { url , filename };
        await listing.save();
    }
    
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};