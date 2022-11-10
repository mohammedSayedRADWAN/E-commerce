var express = require('express');
var router = express.Router();
const prodcut=require('../models/prodcut')
const Cart=require('../models/Cart');
/* GET home page. */
router.get('/', function(req, res, next) {
  var totalProdcuts=null;
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    if (req.user.cart) {
      totalProdcuts=req.user.cart.totalQuantity;
    }
    else{
      totalProdcuts=0;
    }
  }
  prodcut.find({},(error,doc)=>{
      if(error)
      console.log(error);
      

  var prodcutGrid=[];
  var columGird=3;
  for(var i=0;i<doc.length;i+=columGird)
  {
    prodcutGrid.push(doc.slice(i,i+columGird));
  }
  console.log("prodcutGrid=>> "+prodcutGrid);
  console.log("doc=>> "+doc.length);

res.render('index', { title: 'Shoping cart' ,prodcuts : prodcutGrid,cheackUser:req.isAuthenticated(),
totalProdcuts:totalProdcuts});
})
});


router.get('/addToCart/:id/:price/:prodcutName',(req,res,next)=>{

const cartID=req.user._id;
const prodcutPrice=parseInt(req.params.price,10)

const newProdcut={
  _id:req.params.id,
  price:parseInt(req.params.price,10),
  name:req.params.prodcutName,
  quantity:1,
}
Cart.findById(cartID,(error,cart)=>{
if(error)
{
  console.log(error);
}
if (!cart) {
 const newCart= new Cart({
  _id:cartID,
  totalQuantity:1,
  totalPrice:prodcutPrice,
  selectedProdcut:[newProdcut],
 })

 newCart.save((error,doc)=>{
if (error) {
  console.log(error);
}
console.log(doc);
 })

}
if(cart){
 var indexOfProdcut=-1;
 for(var i=0;i<cart.selectedProdcut.length;i++){
  if(req.params.id===cart.selectedProdcut[i]._id){
    indexOfProdcut=i;
    break;
  }
 }
 if(indexOfProdcut>=0){
  cart.selectedProdcut[indexOfProdcut].quantity=cart.selectedProdcut[indexOfProdcut].quantity+1;
  cart.selectedProdcut[indexOfProdcut].price=parseInt(cart.selectedProdcut[indexOfProdcut].price,10)+parseInt(cart.selectedProdcut[indexOfProdcut].price,10);
  cart.totalQuantity=cart.totalQuantity+1;
  cart.totalPrice=cart.totalPrice+prodcutPrice;
  console.log('prodcutPrice=',prodcutPrice);
  Cart.updateOne({_id:cartID},{$set:cart},(error,doc)=>{
    if(error){
      console.log(error);
    }
    console.log(doc);
    console.log(cart);
});

 }
 else{
  cart.totalQuantity=cart.totalQuantity+1;
  cart.totalPrice+=prodcutPrice;
  cart.selectedProdcut.push(newProdcut);
  Cart.updateOne({_id:cartID},{$set:cart},(error,doc)=>{
      if(error){
        console.log(error);
      }
      console.log(doc);
      console.log(cart);
  });
}
}
});

res.redirect('/')
});

router.get('/shoping-cart',(req,res,next)=>{
  
  
  if(!req.isAuthenticated()){
    res.redirect('users/signin');
    return;
  }
  if(!req.user.cart){
    res.render('ShopingCart',{cheackUser:true,totalProdcuts:0});
    return;
  }
  const userCart=req.user.cart;
  console.log(userCart);
res.render('ShopingCart',{userCart:userCart,cheackUser:true,totalProdcuts:req.user.cart.totalQuantity});
})
router.get('/increaseProdcut/:index',(req,res,next)=>{
  const index=req.params.index;
  const userCart=req.user.cart;
  const prodcuPrice=parseInt(userCart.selectedProdcut[index].price,10)/parseInt(userCart.selectedProdcut[index].quantity,10);
  userCart.selectedProdcut[index].quantity+=1;
  userCart.selectedProdcut[index].price+=prodcuPrice;
  userCart.totalQuantity+=1;
  userCart.totalPrice+=prodcuPrice;
  Cart.updateOne({_id:userCart._id},{$set:userCart},(error,doc)=>{
    if(error){
      console.log(error);
    }
    console.log(doc);
    res.redirect('/shoping-cart')
});
});
router.get('/decreaseProdcut/:index',(req,res,next)=>{
  const index=req.params.index;
  const userCart=req.user.cart;
  const prodcuPrice=userCart.selectedProdcut[index].price/userCart.selectedProdcut[index].quantity;
  userCart.selectedProdcut[index].quantity-=1;
  userCart.selectedProdcut[index].price-=prodcuPrice;
  userCart.totalQuantity-=1;
  userCart.totalPrice-=prodcuPrice;
  Cart.updateOne({_id:userCart._id},{$set:userCart},(error,doc)=>{
    if(error){
      console.log(error);
    }
    console.log(doc);
    res.redirect('/shoping-cart')
});

})
router.get('/deleteProdcut/:index',(req,res,next)=>{
  const index=req.params.index;
  const userCart=req.user.cart;
  if (userCart.selectedProdcut.length==1) {
    Cart.deleteOne({_id:userCart._id},(err,doc)=>{
      if (err) {
        console.log(err);
      }
      console.log(doc);
    })
    res.redirect('/shoping-cart')
  } else {
    userCart.totalQuantity-=userCart.selectedProdcut[index].quantity;
  userCart.totalPrice-=parseInt(userCart.selectedProdcut[index].price,10);

  userCart.selectedProdcut.splice(index,1);

  Cart.updateOne({_id:userCart._id},{$set:userCart},(error,doc)=>{
    if(error){
      console.log(error);
    }
    console.log(doc);
    res.redirect('/shoping-cart')
});
  }
  

});
router.get('/cheackOut',(req,res,next)=>{
  res.render('cheackOut',{cheackUser:true,totalProdcuts:req.user.cart.totalQuantity,totalPrice:req.user.cart.totalPrice})
})
module.exports = router;
