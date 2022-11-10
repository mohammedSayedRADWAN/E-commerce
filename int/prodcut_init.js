const Prodcut=require('../models/prodcut');
const mongoose =require('mongoose');

const url = 'mongodb://127.0.0.1:27017/shoping-cart'
mongoose.connect(url, { useNewUrlParser: true })
const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
});
const prodcuts=[new Prodcut({
    imgPath:'/images/istockphoto-1190227699-1024x1024.jpg',
    prodcutName:'Iphone pro3 max',
    imgInformation:{
            storageCapacity: 256,
            numberOfsim: 'Dul Sim',
            cameraResolution: 16,
            displaySize: 6.5
    },

    price:220,
}),
new Prodcut({
    imgPath:'/images/istockphoto-1190447864-1024x1024.jpg',
    prodcutName:'Iphone pro3 max',
    imgInformation:{
            storageCapacity: 256,
            numberOfsim: 'Dul Sim',
            cameraResolution: 16,
            displaySize: 6.5
    },

    price:220,
}),
new Prodcut({
    imgPath:'/images/istockphoto-1282316283-1024x1024.jpg',
    prodcutName:'Iphone pro3 max',
    imgInformation:{
            storageCapacity: 256,
            numberOfsim: 'Dul Sim',
            cameraResolution: 16,
            displaySize: 6.5
    },

    price:220,
}),
new Prodcut({
    imgPath:'/images/istockphoto-1282316283-1024x1024.jpg',
    prodcutName:'Iphone pro3 max',
    imgInformation:{
            storageCapacity: 256,
            numberOfsim: 'Dul Sim',
            cameraResolution: 16,
            displaySize: 6.5
    },

    price:220,
}),
new Prodcut({
    imgPath:'/images/istockphoto-1307398982-1024x1024.jpg',
    prodcutName:'Iphone pro3 max',
    imgInformation:{
            storageCapacity: 256,
            numberOfsim: 'Dul Sim',
            cameraResolution: 16,
            displaySize: 6.5
    },

    price:220,
}),
new Prodcut({
    imgPath:'/images/istockphoto-1190227699-1024x1024.jpg',
    prodcutName:'Iphone pro3 max',
    imgInformation:{
            storageCapacity: 256,
            numberOfsim: 'Dul Sim',
            cameraResolution: 16,
            displaySize: 6.5
    },

    price:220,
}),
new Prodcut({
    imgPath:'/images/istockphoto-1347945603-1024x1024.jpg',
    prodcutName:'Iphone pro3 max',
    imgInformation:{
            storageCapacity: 256,
            numberOfsim: 'Dul Sim',
            cameraResolution: 16,
            displaySize: 6.5
    },

    price:220,
}),
new Prodcut({
    imgPath:'/images/istockphoto-1190227699-1024x1024.jpg',
    prodcutName:'Iphone pro3 max',
    imgInformation:{
            storageCapacity: 256,
            numberOfsim: 'Dul Sim',
            cameraResolution: 16,
            displaySize: 6.5
    },

    price:220,
}),

];

var done=0;

for(var i=0;i<prodcuts.length;i++)
{
    console.log(i);
    prodcuts[i].save((error,doc)=>{
        
if(error)
{
    console.log(error);
}
console.log(doc);

done++;
if(done===prodcuts.length)
        {mongoose.disconnect();}
    }
    )
}