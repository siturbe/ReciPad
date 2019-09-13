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

    recipeIDs = [];
    
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
            let li = $('<li/>').addClass('ui-ingredient').text(subIngredientArray[i]).appendTo(rList);
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
    let groceryMessage = $('<h5>Here are all the ingredients you need for your saved recipes: </h5>');
    let groceryListDiv = $("<div class='groceryListDiv'>");

    let gList= $('<ul>')
    $.each(ingredientList, function(i){
        let li = $('<li/>').text(ingredientList[i]).appendTo(gList);
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

