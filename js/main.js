"use strict";

function renderCoffee(coffee) {
    // var html = '<tr class="coffee">';
    // html += '<td>' + coffee.id + '</td>';
    // html += '<td>' + coffee.name + '</td>';
    // html += '<td>' + coffee.roast + '</td>';
    // html += '</tr>';
    let html = '<div class="coffee col-6 d-flex align-items-baseline" id="' + coffee.id + '">';
    html += '<h3 class="coffee inline">' + coffee.name + '</h3>';
    html += '<p class="roast inline text-secondary pl-2">' + coffee.roast + '</p>';
    html += '</div>';

    return html;
}

function renderCoffees(coffees) {
    var html = '<div class="row">';
    for (var i = 0; i < coffees.length; i++) {
        html += renderCoffee(coffees[i]);
    }
    return html += "</div>";
}

function updateCoffees(e) {
    try {
        e.preventDefault(); // don't submit the form, we just want to update the data
    } catch {
        
    }

    let selectedRoast = roastSelection.value;
    let filterCoffee = coffeeSearch.value.toLowerCase();
    let filteredCoffees = [];
    if (selectedRoast === "all") {
        coffees.forEach(function (coffee) {
            if (coffee.name.toLowerCase().startsWith(filterCoffee)) {
                filteredCoffees.push(coffee);
            }
        });
    } else {
        coffees.forEach(function (coffee) {
            if (coffee.roast === selectedRoast && coffee.name.toLowerCase().startsWith(filterCoffee)) {
                filteredCoffees.push(coffee);
            }
        });
    }
    contentBody.innerHTML = renderCoffees(filteredCoffees);
}

function createCoffee(e) {
    e.preventDefault();
    let id = coffees.length + 1;
    let coffee = {
        id: id,
        name: document.getElementById("coffee-adding").value,
        roast: document.getElementById("roast-adding").value,
    };
    coffees.push(coffee);
    addedCoffees.push(coffee);
    saveCoffeeToLocalStorage(coffee);
    updateCoffees(e);
}

// from http://www.ncausa.org/About-Coffee/Coffee-Roasts-Guide
var coffees = [
    {id: 1, name: 'Light City', roast: 'light'},
    {id: 2, name: 'Half City', roast: 'light'},
    {id: 3, name: 'Cinnamon', roast: 'light'},
    {id: 4, name: 'City', roast: 'medium'},
    {id: 5, name: 'American', roast: 'medium'},
    {id: 6, name: 'Breakfast', roast: 'medium'},
    {id: 7, name: 'High', roast: 'dark'},
    {id: 8, name: 'Continental', roast: 'dark'},
    {id: 9, name: 'New Orleans', roast: 'dark'},
    {id: 10, name: 'European', roast: 'dark'},
    {id: 11, name: 'Espresso', roast: 'dark'},
    {id: 12, name: 'Viennese', roast: 'dark'},
    {id: 13, name: 'Italian', roast: 'dark'},
    {id: 14, name: 'French', roast: 'dark'},
];

function resetCoffees() {
    coffees.splice(14);
    updateCoffees();
}

var contentBody = document.querySelector('#coffees');
var submitButton = document.querySelector('#submit');
var roastSelection = document.querySelector('#roast-selection');
var coffeeSearch = document.querySelector('#coffee-search');
let coffeeAdd = document.getElementById("create-coffee");

contentBody.innerHTML = renderCoffees(coffees);

submitButton.addEventListener('click', updateCoffees);
roastSelection.addEventListener('change', updateCoffees);
coffeeSearch.addEventListener('input', updateCoffees);

// prevent pressing enter from refreshing the page
coffeeSearch.addEventListener('keypress', function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
    }
});
coffeeAdd.addEventListener('click', createCoffee);

// listen for the enter key press and use it to submit the new coffee
document.getElementById("coffee-adding")
    .addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            createCoffee(e);
            let caller = e.target || e.srcElement;
            caller.value = "";
        }
    });

// save added coffees in localStorage so they are not lost after refresh
let addedCoffees = [];

function saveCoffeeToLocalStorage() {
   localStorage.setItem('coffees', JSON.stringify(addedCoffees));
}

function getCoffeeFromLocalStorage() {
    if(localStorage.coffees) {
        addedCoffees = addedCoffees.concat(JSON.parse(localStorage.getItem('coffees')));
        coffees = coffees.concat(addedCoffees);
        updateCoffees();
    }
}

function clearCoffeeFromLocalStorage() {
    if(localStorage.coffees) {
        localStorage.removeItem('coffees');
        resetCoffees();
    }
}

// when page has finished loading call getCoffeeFromLocalStorage
document.addEventListener('DOMContentLoaded', function() {
    getCoffeeFromLocalStorage();
}, false);

// add ctrl + alt + c keyboard shortcut to remove all coffee the user has added
document.addEventListener('keyup', function (e) {
    if (e.ctrlKey && e.altKey && e.code === "KeyC") {
        if(confirm("Are you sure you want to delete your created coffees?")){
            clearCoffeeFromLocalStorage();
        }
    }
});
