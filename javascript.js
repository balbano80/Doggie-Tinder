// global variables

var apiKey = '173d89b51a0bbcb9cdd81a9d2304fac7'
var url = 'https://api.petfinder.com/pet.find';
var currentDog;
var newDogArray = [];

// trying to get audio to play on the click button with the dog
$('#woof').on('click', function(){
    var music = new Audio();
    music.src = "images/deepbark.mp3";
    music.play();  
})



function createRando() {
    // set cuurent
    currentDog = Math.floor(Math.random()* newDogArray.length);
    return newDogArray[currentDog];
}


function newDogDisplay(){
    newDogArray.splice(currentDog,1);
    var newDog = createRando();
    console.log(newDog);
    var dogPic = newDog.img;
    var dogBreed = newDog.breed.join(", ");
    var dogAge = newDog.age;
    var dogSex = newDog.sex;
    var dogSize = newDog.size;
    var dogZip = newDog.zip;

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
        newDogDisplay();
        break;

        case 39: // right
        newDogDisplay();
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});


function displayImage() {

    $.ajax({
        url: url,
        jsonp: "callback",
        dataType: "jsonp",
        data: {
            key: apiKey,
            // id: 'CA387',
            animal: 'dog',
            location: '94701',
            count: 500,
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
                dogImg = "http://via.placeholder.com/500x500";
            }


           var doggyStuff = {
               img: dogImg,
               breed: breed,
               age: dogInfo[i].age['$t'],
               sex: dogInfo[i].sex['$t'],
               size: dogInfo[i].size['$t'],
               zip: dogInfo[i].contact.zip['$t']
           };

           newDogArray.push(doggyStuff);
           
        }
        
        console.log(newDogArray);

       }       

    });   

};

setTimeout(function(){
    $(document).on("click", "#next", function(){
    newDogDisplay();
    });
}, 4000);
    // On click listener that will navigate through the dog array when hit(same as left or right arrow key).
    // I put this in a setTimeout function, because errors will show up if hit while the page is waiting for the
    // petfinder api to return the data and populate the array

displayImage();
