const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({

    image: {
        type: String,
        required: true
    }
});

var images = mongoose.model('image', imageSchema);

module.exports = images;