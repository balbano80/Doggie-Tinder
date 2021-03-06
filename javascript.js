// global variables

var apiKey = '173d89b51a0bbcb9cdd81a9d2304fac7'
var url = 'https://api.petfinder.com/pet.find';
var currentDog;
var newDogArray = [];
var photo = $(".card-img-top");
var zip = sessionStorage.getItem('zipcode');


$("#show-dog").on("click", function(){
    sessionStorage.setItem('zipcode', $("#zip-code").val());
    displayImage();
    newDogDisplay();
});

console.log(zip);

var newDog;
var detailsBreed = sessionStorage.getItem("likedBreed");
var detailsAge = sessionStorage.getItem("likedAge");
var detailsSize = sessionStorage.getItem("likedSize");
var detailsSex = sessionStorage.getItem("likedSex");
var detailsShelter = sessionStorage.getItem("likedShelter");
var detailsImg = sessionStorage.getItem("likedImg");
var detailsName = sessionStorage.getItem("likedName");
var detailsPhone = sessionStorage.getItem("likedPhone");
var detailsEmail = sessionStorage.getItem("likedEmail");

displayImage();


// trying to get audio to play on the click button with the dog
$('#woof').on('click', function(event){
    event.preventDefault();
    sessionStorage.setItem('test', newDog);

    var music = document.createElement("audio");
    music.setAttribute("src", "images/deepbark.mp3");
    music.play(); 

    sessionStorage.setItem("likedImg", newDog.img);
    sessionStorage.setItem("likedBreed", newDog.breed.join(", "));
    sessionStorage.setItem("likedAge", newDog.age);
    sessionStorage.setItem("likedSize", newDog.size);
    sessionStorage.setItem("likedSex", newDog.sex);
    sessionStorage.setItem("likedShelter", newDog.shelter);
    sessionStorage.setItem("likedZip", newDog.zip);
    sessionStorage.setItem("likedName", newDog.name);
    sessionStorage.setItem("likedPhone", newDog.phone);
    sessionStorage.setItem("likedEmail", newDog.email);
    setTimeout(function(){
        window.location.href = "thirdpage.html";
    }, 500)
})

console.log(detailsBreed);
console.log(detailsShelter);
// detailsBreed = sessionStorage.getItem("likedBreed");
// detailsAge = sessionStorage.getItem("likedAge");
// detailsSize = sessionStorage.getItem("likedSize");
// detailsSex = sessionStorage.getItem("likedSex");

$(".details-img-top").attr("src", detailsImg);
$("#details-breed").html(detailsBreed);
$("#details-age").html(detailsAge);
$("#details-size").html(detailsSize);
$("#details-sex").html(detailsSex);
$("#details-name").html(detailsName);
$("#details-phone").html(detailsPhone);
$("#details-email").html(detailsEmail);


function createRando() {
    // set cuurent
    currentDog = Math.floor(Math.random()* newDogArray.length);
    return newDogArray[currentDog];
}


function newDogDisplay(){
    newDogArray.splice(currentDog,1);
    newDog = createRando();
    console.log(newDog);
    var dogPic = newDog.img;
    var dogBreed = newDog.breed.join(", ");
    var dogAge = newDog.age;
    var dogSex = newDog.sex;
    var dogSize = newDog.size;
    var dogZip = newDog.zip;
    var dogName = newDog.name;
    var dogPhone = newDog.phone;
    var dogEmail = newDog.email;
    var dogImg = $("<img css='height: 350px'>")
    dogImg.attr('src', dogPic);
  
    $(".card-img-top").attr('src', dogPic);
    $("#breed").html(dogBreed);
    $("#age").html(dogAge);
    $("#size").html(dogSize);
    $("#sex").html(dogSex);
}

$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
        break;

        case 39: // right
        newDogDisplay();
        checkAnimation();
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

function checkAnimation() {
        //delay remove/add class so the DOM can catch up
         $("#tag").removeClass('magictime boingInUp').delay(25).queue(
            function (next) {
                $(this).addClass('magictime boingInUp');
                next();
            }
        );
};


function displayImage() {

    $.ajax({
        url: url,
        jsonp: "callback",
        dataType: "jsonp",
        data: {
            key: apiKey,
            // id: 'CA387',
            animal: 'dog',
            location:  zip,
            count: 50,
            output: 'basic',
            format: 'json'
        },    
   success: function(response) {
       var dogData = response;
       console.log(dogData.petfinder.pets.pet);
       var dogInfo = dogData.petfinder.pets.pet;
       console.log(dogInfo);
       

        for (var i =0; i < dogInfo.length; i++) {
            var breed = [];
            var age;
            var shelter;


            if (dogInfo[i].breeds.breed === undefined) {
                breed.push("mix");
            } else if (Array.isArray(dogInfo[i].breeds.breed)) {
                for (var k=0; k < dogInfo[i].breeds.breed.length; k++){
                    breed.push(dogInfo[i].breeds.breed[k].$t);
                }
            } else {
                breed.push(dogInfo[i].breeds.breed['$t']);
            };
          
            if (dogInfo[i].media.photos) {
                var dogImg = (dogInfo[i].media.photos.photo[2]['$t']);
            } else {
                dogImg = "images/dogFiller.jpg";
            }

            if (dogInfo[i].contact.address1.$t === undefined){
                // console.log("in no address block");
                shelter = dogInfo[i].contact.zip['$t'];
            }
            else{
                shelter = dogInfo[i].contact.address1.$t;
            }
           var doggyStuff = {
               img: dogImg,
               breed: breed,
               age: dogInfo[i].age['$t'],
               sex: dogInfo[i].sex['$t'],
               size: dogInfo[i].size['$t'],
               zip: dogInfo[i].contact.zip['$t'],
               name: dogInfo[i].name['$t'],
               descrip: dogInfo[i].description['$t'],
               phone: dogInfo[i].contact.phone['$t'],
               email: dogInfo[i].contact.email['$t']
           };
        //    console.log(doggyStuff.shelter);
           newDogArray.push(doggyStuff);
           
        }
        
        console.log(newDogArray);
        

       }       
       
    });  
    
    

};

setTimeout(function(){
    $(document).on("click", "#next", function(){
    newDogDisplay();  
    checkAnimation();
    });
}, 2000);

///////////////////////////////////////GOOGLE API///////////////////////////////////////////////////////

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBSng1dVjOhkqyx8gzLZ4pS8snSbF6N4PI",
    authDomain: "doggie-tinder-4d87b.firebaseapp.com",
    databaseURL: "https://doggie-tinder-4d87b.firebaseio.com",
    projectId: "doggie-tinder-4d87b",
    storageBucket: "doggie-tinder-4d87b.appspot.com",
    messagingSenderId: "23510924318"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

var address = sessionStorage.getItem("likedZip");

console.log("address: " + address);
var APIkey = "AIzaSyCiwCxInV3d_DUB25n92pDjHmXsTSlajYs";

function latLong(){

   $.ajax({
       url: "https://maps.googleapis.com/maps/api/geocode/json?address="+ address + ",PL&key=" + APIkey,
       method: "GET"
   }).then(function(response){
       console.log(response);
       var loc = response.results[0].geometry.location;
       initMap(loc);
   });
   
   } // calling google geocode api and feeding it an address(zipcode now).  Then calling google maps function(initMap), and feeding it the geolocation(lat and long coordinates)

function initMap(location) {
   var uluru = location;
   var map = new google.maps.Map(document.getElementById('map'), {
     zoom: 12,
     center: uluru
   });
   var marker = new google.maps.Marker({
     position: uluru,
     map: map
   });
 }
 $(function(){
   latLong();
 });


////test///

$('#myModal').on('shown.bs.modal', function () {
   $('#myInput').trigger('focus')
 });

 function addAdoptee(){
   var firstName = $("#first-name").val().trim();
   var lastName = $("#last-name").val().trim();
    var email = $("#email").val().trim();
   var address = $("#address").val().trim();
   var city = $("#city").val().trim();
   var state = $("#state").val().trim();
   var zip = $("#zip").val().trim();

   database.ref().push({
     firstName: firstName,
     lastName: lastName,
     email: email,
     address: address,
     city: city,
     state: state,
     zip: zip
   })
   // , function(errorObj){
   //   console.log("Error: " + errorObj.code);
   // });

   $("#first-name").val("");
   $("#last-name").val("");
   $("#email").val("");
   $("#address").val("");
   $("#city").val("");
   $("#state").val("");
   $("#zip").val("");
}

$(document).on("click", ".adoptee", function(event){
   event.preventDefault();
   addAdoptee();
 });

$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
  });

  ///////////////////// animation /////////////////////

  $('#applybutton').hover(function () {
    $(this).toggleClass('magictime puffOut', 1000);

  });


  

//   $("#applybutton").removeClass('magictime puffOut').delay(25).queue(
//     function (next) {
//         $(this).addClass('magictime puffOut');
//         next();
//     }
// );