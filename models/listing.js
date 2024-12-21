const mongoose = require("mongoose");
const {Schema} = mongoose;
const Review = require("./review.js");
const { types } = require("joi");


const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
      default: "listingimage", // Set a default filename if needed
    },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
          : v,
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref:'Review',
    }
  ],

  // category: {
  //   type:String,
  //   enum: ["mountains", ]
  // },
  owner:{
    type: Schema.Types.ObjectId,
    ref:'User', 
  }
});

//mongoose middleware triggers when any listing deleted its review also get deleted
listingSchema.post("findOneAndDelete" , async (listing) =>{
  if(listing){
    await Review.deleteMany({_id : {$in: listing.reviews}})
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
