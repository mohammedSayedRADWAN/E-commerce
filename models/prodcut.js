const mongoose = require('mongoose');
//mongoose.Schema function ass it parameter object
const prodcutSchema = mongoose.Schema({
    imgPath: {
        type: String,
        required: true
    },
    prodcutName: {
        type: String,
        required: true
    },
    imgInformation: {
        type: {
            storageCapacity: Number,
            numberOfsim: String,
            cameraResolution: Number,
            displaySize: Number
        },
        required: true
    },
    imgPath: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
});

module.exports=mongoose.model('Prodcut',prodcutSchema);