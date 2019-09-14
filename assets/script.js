


  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAg1Jfe5UX_hieHr8S2rRjwVMEd-AuxWng",
    authDomain: "recipad-ddf61.firebaseapp.com",
    databaseURL: "https://recipad-ddf61.firebaseio.com",
    projectId: "recipad-ddf61",
    storageBucket: "",
    messagingSenderId: "633336468983",
    appId: "1:633336468983:web:9b09e18f4668e9c2344af2"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

//   ui.start('#firebaseui-auth-container', {
//     signInOptions: [
//         {
//         provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
//         requireDisplayName: false,
//         },
//         firebase.auth.PhoneAuthProvider.PROVIDER_ID,
//     ],
//     // Other config options...
//   });

  var ui = new firebaseui.auth.AuthUI(firebase.auth());

  var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true;
      },
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById('loader').style.display = 'none';
      }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: 'index.html',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
    //   firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //   firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    //   firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    //   firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
  };


// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);



//Pull the data from the API

let vegeterian;
let vegan;
let exclusions;
let exclusionList;
let cuisine;
let cuisineList;
let searchInput;
let searchResults={};
let recipeID;
let recipeIDs=[];
let savedRecipes=[];
let ingredientList=[];
let noUnitIngredientList = [];


function getSearchResults(){
    $('#recipe-list').empty();
    let vegetarianTrue = document.getElementById('restriction1').checked;
    if( vegetarianTrue == true){vegetarian='vegetarian'} else {vegetarian='not vegetarian'};
    console.log(vegetarian);

    let veganTrue = document.getElementById('restriction2').checked;
    if( veganTrue == true){vegan='vegan'} else {vegan='not vegan'};
    console.log(vegan);

    if(veganTrue== true){diet='vegan'} else if(vegetarianTrue ==true) { diet = 'vegetarian'} else {diet = ""};
    console.log(diet);

    exclusions = $('#ingredientExclusion').val();
    let exclusions2 = exclusions.replace(/ /g,'');
    exclusionList = exclusions2.replace(/,/g,'%2C%20')
    console.log(exclusionList);
    
    cuisine = $('#cuisine-input').val();
    let cuisine2 = cuisine.replace(/ /g,'');
    cuisineList = cuisine2.replace(/,/g,'%2C%20')
    console.log(cuisineList);

    searchInput = $('#searchBar').val();
    console.log(searchInput);

    var queryURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search?diet=" + diet + "&excludeIngredients=" + exclusionList + "&cuisine=" + cuisineList + "&intolerances&number=10&offset=0&type=main%20course&query=" + searchInput;

    console.log(queryURL);

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": queryURL,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
            "x-rapidapi-key": "e4bd1d4763mshbadb182061cbec8p14ada1jsna099cc6dbfa1"
        }
    }
    
    $.ajax(settings).then(function (response) {
        console.log(response);
        let searchResults = response.results;

        console.log(searchResults[1].title);
        for(let i=0; i<9; i++){
            let recipeDiv = $("<div class='recipeDiv'>")
            let recipeID = searchResults[i].id;
            let recipeTitle = searchResults[i].title;
            let prepTime = searchResults[i].readyInMinutes;
            let servings = searchResults[i].servings;
            let imageURL = "https://spoonacular.com/recipeImages/" + searchResults[i].image;
            let recipeImage = $("<img class='thumbnail'>");
            recipeImage.attr({
                'src': imageURL,
            })

            let p = $('<p>').text(recipeTitle + ', ' + prepTime + ' min of prep time, serves ' + servings);

            let addButton = $("<button class='btn waves-effect waves-lighth addRecipe' type='submit' name='action' style='background-color: green' value='" + recipeID + "'>Add Recipe</button>");

            recipeDiv.append(recipeImage);
            recipeDiv.append(p);
        
            $('#recipe-list').append(recipeDiv);
            $('#recipe-list').append(addButton);
        }
        
    });
}

function addItem(){
    let recipeNumber = $(this).val();
    recipeIDs.push(recipeNumber);
    console.log(recipeIDs);
}

function addRecipesToSavedList(){
    for(let i=0; i<recipeIDs.length; i++){
        let recipeURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/" + recipeIDs[i] + "/information"
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": recipeURL,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
                "x-rapidapi-key": "e4bd1d4763mshbadb182061cbec8p14ada1jsna099cc6dbfa1"
            }
        }
        
        $.ajax(settings).then(function (response) {
            savedRecipes.push(response);
        console.log(i, response);        
        });
    }

    recipeIDs = []; //this keeps the for loop from adding what it added the prior loop again
    
    console.log(savedRecipes);
}

function clearSavedRecipes(){
    savedRecipes = [];
    recipeIDs = [];
    ingredientArray = [];
    subIngredientArray = [];
    ingredientList = [];
    $('#recipe-list').empty();
}

function showSavedRecipes(){
    $('#recipe-list').empty();
    for(let i=0; i<savedRecipes.length; i++){
        let recipeSavedDiv = $("<div class='recipeSavedDiv'>");
        let titleSaved = savedRecipes[i].title;
        let instructionsSaved = savedRecipes[i].instructions;
        let recipeImageSaved = $("<img class='thumbnail'>");

        let pTitleSaved = $('<h4>').text(titleSaved);
        let pSaved = $('<p>').text(instructionsSaved);
        recipeImageSaved.attr({'src': savedRecipes[i].image,})
        
        let ingredientArray = savedRecipes[i].extendedIngredients;
        let subIngredientArray =[ ];

        for(let j=0; j<ingredientArray.length; j++){
            subIngredientArray.push(ingredientArray[j].originalString);
        }

        let rList = $('<ul>')
        $.each(subIngredientArray,function(i){
            let li = $('<li/>').text(subIngredientArray[i]).appendTo(rList);
        });

        recipeSavedDiv.append(pTitleSaved);
        recipeSavedDiv.append(recipeImageSaved);
        recipeSavedDiv.append(pSaved);
        recipeSavedDiv.append(rList);

        $('#recipe-list').append(recipeSavedDiv);
        ingredientList.push(...subIngredientArray);
    }
    console.log(ingredientList);
}

function generateGroceryList(){
    $('#recipe-list').empty();
    // for(let i=0; i < savedRecipes.length; i++){
    //     let ingredientNameArray = savedRecipes[i].originalName;
    //     let ingredientNameSubArray = [];

    //     for(let j=0; j<ingredientNameArray.length; j++){
    //         ingredientNameSubArray.push(ingredientNameArray[j].originalName);
    //     };

    //     noUnitIngredientList.push(...ingredientNameSubArray);
    // }


    let groceryMessage = $('<h5>Here are all the ingredients you need for your saved recipes: </h5>');
    let groceryListDiv = $("<div class='groceryListDiv'>");
    // let itemCheckbox = $("<input type='checkbox'></input>");
    

    let gList= $('<ul class="itemsForList">')
    $.each(ingredientList, function(i){
        let li = $("<li/>").text(ingredientList[i]).addClass('ui-ingredient').appendTo(gList);
    });

    groceryListDiv.append(groceryMessage);
    groceryListDiv.append(gList);

    $('#recipe-list').append(groceryListDiv);
}









$(document).on('click','#searchButton',getSearchResults);
$(document).on('click','.addRecipe',addItem);
$(document).on('click','#saveRecipesButton', addRecipesToSavedList);
$(document).on('click','#clearButton', clearSavedRecipes);
$(document).on('click','#showSavedRecipesButton', showSavedRecipes);
$(document).on('click','#showShoppingList', generateGroceryList);
// $(document).on('click','#generateListButton', getRecipeInformation);

