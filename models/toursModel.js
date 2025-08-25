const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const slug = require("slugify");
const User = require("./UserModel");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tour Name is required"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour must have less or equal than 40 characters"],
      minlength: [8, " A tour must have grater that 10 characters"],
    },

    slug: String,

    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },

    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "difficult", "medium"],
        message: "Diffculty can be easy, difficult, medium",
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1"],
      max: [5, "Rating should be less than 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: function (val) {
        //this points to new docum created
        return val < this.price;
      },
      message: "Discount price ({VALUE}) should be below regular price",
    },

    summary: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },

    images: [String],

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },

    startDates: [Date],

    secretTour: {
      type: Boolean,
      default: false,
    },

    startLocation: {
      //GeoJSON is used to specify geo data
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },

    guides: [{ type: mongoose.Schema.ObjectId, ref: "user" }],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Document Middleware , runs before the save command and create command

tourSchema.pre("save", function (next) {
  //Slugify converts the name into of tour into a url-friendly slug string and stores it into slug field
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre("save", async function (next) {
  const guidesdata = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidesdata);
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });

  next();
});

tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour_id",
  localField: "_id",
});

//this points to document
//did not persist in database ,we can not access by query
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

const Tour = mongoose.model("Tour", tourSchema);

//this points to query
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  //Sample
  next();
});

//this refers to aggregation object
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

module.exports = Tour;
