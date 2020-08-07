const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var packageSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    Category: {
        type: String,
        required: true
    },
    Prerequisite: {
        type: String,
        required: true
    },
    ReportAvailability: {
        type: String,
        required: true
    },
    Price: {
        type: Currency,
        required: true,
        min: 0
    },
    UsefulFor: {
        type: String,
        required: true
    },
    SampleRequired: {
        type: String,
        required: true
    }}
    , {
    timestamps: true
});


const lifeCycleSchema = new Schema({
   packages:[packageSchema]
}, {
    timestamps: true
});

var lifeCyclePackages = mongoose.model('lifeCyclePackage', lifeCycleSchema);

module.exports = lifeCyclePackages;