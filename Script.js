// Global object to store all travel data
let travelData = {
    destination: '',
    budget: '',
    departureDate: '',
    returnDate: '',
    duration: 0,
    adults: 2,
    children: 0,
    infants: 0,
    flightClass: '',
    localTransport: '',
    hotel: ''
};

// Function to handle destination selection from pre-set cards
function selectDestination(name, budget, id) {
    // Remove 'selected' class from all cards
    const allCards = document.querySelectorAll('.destination-card');
    allCards.forEach(card => card.classList.remove('selected'));

    // Find the specific card that was clicked and add the 'selected' class
    const selectedCard = document.querySelector(`.destination-card[onclick*='${id}']`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }

    // Update global data object
    travelData.destination = name;
    travelData.budget = budget;
    
    // Update the display
    document.getElementById('selectedDestination').innerText = name;
    document.getElementById('selectedBudget').innerText = `Estimated Budget: ${budget}`;

    // Enable the "Continue" button
    document.getElementById('nextToStep2').disabled = false;

    // Store the selected destination data in local storage
    localStorage.setItem('selectedDestination', JSON.stringify({ name, budget, id }));

    alert(`${name} has been selected!`);
}

// Function to handle the custom destination search
function searchDestination() {
    const customInput = document.getElementById('customDestination');
    const destination = customInput.value.trim();

    if (destination) {
        const budget = 'Varies based on location';
        
        // Remove 'selected' class from all pre-set cards
        const allCards = document.querySelectorAll('.destination-card');
        allCards.forEach(card => card.classList.remove('selected'));

        // Update global data object
        travelData.destination = destination;
        travelData.budget = budget;

        // Update the display
        document.getElementById('selectedDestination').innerText = destination;
        document.getElementById('selectedBudget').innerText = `Estimated Budget: ${budget}`;
        
        // Enable the "Continue" button
        document.getElementById('nextToStep2').disabled = false;
        
        // Store the custom destination data in local storage without an ID
        localStorage.setItem('selectedDestination', JSON.stringify({ name: destination, budget }));
        
        alert(`${destination} has been selected!`);
        customInput.value = ''; // Clear the input field
    } else {
        alert("Please enter a destination to search.");
    }
}

// Function to navigate to the next step
function nextStep(stepNumber) {
    // Check if a destination has been selected before proceeding
    const selected = localStorage.getItem('selectedDestination');
    if (!selected) {
        alert("Please select or search for a destination first.");
        return;
    }

    // Redirect to the appropriate page based on the step number
    if (stepNumber === 2) {
        window.location.href = 'dates-budget.html';
    } else if (stepNumber === 3) {
        window.location.href = 'transport.html';
    }
}

// Function to load the saved destination on page load
function loadSavedDestination() {
    const savedData = localStorage.getItem('selectedDestination');
    if (savedData) {
        const { name, budget, id } = JSON.parse(savedData);
        
        // Update the display with saved data
        document.getElementById('selectedDestination').innerText = name;
        document.getElementById('selectedBudget').innerText = `Estimated Budget: ${budget}`;
        
        // Enable the button
        document.getElementById('nextToStep2').disabled = false;
        
        // Find the matching card and highlight it if an ID exists
        if (id) {
            const selectedCard = document.querySelector(`.destination-card[onclick*='${id}']`);
            if (selectedCard) {
                selectedCard.classList.add('selected');
            }
        }
    }
}

// Event listener for the "Enter" key on the custom search input
document.addEventListener('DOMContentLoaded', () => {
    loadSavedDestination(); // Load saved data on page load

    const customDestinationInput = document.getElementById('customDestination');
    if (customDestinationInput) {
        customDestinationInput.addEventListener('keypress', function(event) {
            // Check if the pressed key is 'Enter' (key code 13)
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent default form submission behavior
                searchDestination();
            }
        });
    }
});

// The following functions are for the other steps (2, 3, 4, 5) of your planner.
// I have kept them here in case your other pages (dates-budget.html etc.)
// are using them. If not, they can be removed.

function calculateDuration() {
    const departureDate = document.getElementById('departureDate').value;
    const returnDate = document.getElementById('returnDate').value;
    
    if (departureDate && returnDate) {
        const departure = new Date(departureDate);
        const returnD = new Date(returnDate);
        const timeDiff = returnD.getTime() - departure.getTime();
        const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        if (dayDiff > 0) {
            travelData.departureDate = departureDate;
            travelData.returnDate = returnDate;
            travelData.duration = dayDiff;
            document.getElementById('tripDuration').textContent = `${dayDiff} days`;
            checkStep2Complete();
        } else {
            document.getElementById('tripDuration').textContent = 'Invalid dates';
        }
    }
}

function selectBudget(budgetType) {
    document.querySelectorAll('.budget-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.closest('.budget-option').classList.add('selected');
    travelData.budget = budgetType;
    checkStep2Complete();
}

function checkStep2Complete() {
    if (travelData.departureDate && travelData.returnDate && travelData.budget) {
        document.getElementById('nextToStep3').disabled = false;
    }
}

function selectTransport(flightClass) {
    document.querySelectorAll('.transport-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.closest('.transport-option').classList.add('selected');
    travelData.flightClass = flightClass;
    checkStep3Complete();
}

function selectLocalTransport(transportType) {
    travelData.localTransport = transportType;
    checkStep3Complete();
}

function checkStep3Complete() {
    if (travelData.flightClass && travelData.localTransport) {
        document.getElementById('nextToStep4').disabled = false;
    }
}

function selectAccommodation(hotelType) {
    document.querySelectorAll('.accommodation-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.closest('.accommodation-option').classList.add('selected');
    travelData.hotel = hotelType;
    checkStep4Complete();
}

function checkStep4Complete() {
    if (travelData.hotel) {
        document.getElementById('nextToStep5').disabled = false;
    }
}

function generateSummary() {
    document.getElementById('summaryDestination').textContent = travelData.destination;
    document.getElementById('summaryDates').textContent = `${travelData.departureDate} to ${travelData.returnDate}`;
    document.getElementById('summaryTravelers').textContent = `${travelData.adults} Adults, ${travelData.children} Children, ${travelData.infants} Infants`;
    document.getElementById('summaryFlight').textContent = travelData.flightClass;
    document.getElementById('summaryHotel').textContent = travelData.hotel;
}
