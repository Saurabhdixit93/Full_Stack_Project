const { Schema, model } = require("mongoose");

const additionalDetailsSchema = new Schema(
  {
    user: {
 type: Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    about: {
      type: String,
      require: true,
    },
    skills: {
      type: String,
      require: true,
    },
    experiences: [
      {
        yearEx: {
          type: Number,
          require: true,
        },
        typeEx: {
          type: String,
          enum: ["full-time", "internship"],
          require: true,
        },
        companyName: {
          type: String,
          require: true,
        },
        descriptionEx: String,
      },
    ],
    education: [
      {
        startYear: {
          type: Number,
          require: true,
        },
        endYear: {
          type: Number,
          require: true,
        },
        degreeType: {
          type: String,
          require: true,
        },
        instituteName: {
          type: String,
          require: true,
        },
        descriptionInst: String,
      },
    ],
  },
  { timestamps: true }
);

const AdditionalModel = model("AdditionalModel", additionalDetailsSchema);
module.exports = AdditionalModel;
