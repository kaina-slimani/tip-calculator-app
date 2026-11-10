// --- Déclaration des variables constantes // Declaration of constant variables --- //
// Inputs de saisie // Input fields
const billInput = document.getElementById('bill');
const peopleInput = document.getElementById('people');
const customTipInput = document.getElementById('custom-tip');

// Boutons & Actions // Buttons & Actions
const tipButtons = document.querySelectorAll('.tip-btn');
const resetBtn = document.getElementById('reset-btn');

// Affichage des résultats & Messages // Display results & Messages
const tipAmountResult = document.getElementById('tip-amount');
const totalAmountResult = document.getElementById('total-amount');
const peopleError = document.querySelector('.error-msg');

// --- Déclaration des variables évolutives dans le temps // Declaration of state variables evolving over time --- //
let billValue = 0.0;
let tipValue = 0.0;
let peopleValue = 0;


// --- Fonction pour récupérer la valeur au format décimal tapée dans la zone de saisie de la facture (Bill) --- //
// --- Function to retrieve decimal value typed in the bill input field --- //
billInput.addEventListener('input', function () {

    // parseFloat convertit la chaîne de caractères (ex: "142.55") en nombre décimal // parseFloat converts string (ex: "142.55") into a decimal number
    billValue = parseFloat(billInput.value);

    // si le champ est vide ou invalide, on remet à 0 // if input is empty or invalid, reset to 0
    if (isNaN(billValue)) {
        billValue=0.0;
    }
    
    calculateTip(); // Fonction qui fera les calculs et mettra à jour l'affichage // Function that runs calculations and updates display
});


// --- Fonction pour le choix du bouton, son visuel et la conversion du texte du bouton Custom --- //
// --- Function for button selection, visual style and Custom input handling --- //
tipButtons.forEach(function (btn) {

    btn.addEventListener('click', function () {

        // 1. Désactiver la couleur active sur TOUS les boutons // 1. Deactivate active color on ALL buttons
        tipButtons.forEach(function (otherBtn) {
            otherBtn.classList.remove('active');
        });

        // 2. Ajouter la classe .active sur le bouton cliqué // 2. Add .active class on the clicked button
        btn.classList.add('active');

        // 3. Récupérer le pourcentage du bouton et effacer l'input Custom // 3. Get button percentage and clear Custom input
        tipValue = parseFloat(btn.dataset.tip) / 100;
        customTipInput.value = '';

        // 4. Lancer le calcul global // 4. Trigger global calculation
        calculateTip();
    });
});


// --- Fonction pour écouter le champ de pourboire personnalisé (Custom) --- //
// --- Function to listen to custom tip input field --- //
customTipInput.addEventListener('input', function () {

    // 1. Désactiver la classe active sur TOUS les boutons fixes // 1. Deactivate active class on ALL preset buttons
    tipButtons.forEach(function (btn) {
        btn.classList.remove('active');
    });

    // 2. Récupérer et convertir la valeur tapée dans le champ Custom // 2. Retrieve and convert value typed in Custom field
    let customVal = parseFloat(customTipInput.value);

    // 3. Vérifier si la valeur est un nombre valide // 3. Check if value is a valid number
    if (!isNaN(customVal) && customVal >= 0) {
        tipValue = customVal / 100; // Convertit ex: 15 en 0.15 // Converts ex: 15 to 0.15
    } else {
        tipValue = 0.0; // Sinon, on remet le pourboire custom à zéro // Otherwise, reset custom tip to zero
    }

    // 4. Relancer le moteur de calcul // 4. Rerun calculation engine
    calculateTip();
});


// --- Fonction pour l'indication du nombre de personnes --- //
// --- Function for number of people indication --- //
peopleInput.addEventListener('input', function () {

    // 1. Conversion de la valeur saisie en nombre entier // 1. Conversion of entered value to integer
    peopleValue = parseInt(peopleInput.value);

    // 2. Gestion de l'erreur si l'utilisateur saisit 0 // 2. Error management if user enters 0
    if (peopleValue === 0) {
        peopleError.style.display = 'block'; // Affiche le message "Can't be zero" // Displays "Can't be zero" message
        peopleInput.classList.add('error');  // Ajoute la bordure rouge via CSS // Adds red border via CSS
    
    } // 3. Sécurité si le champ est vide ou non valide (ex: champ effacé) // 3. Security if field is empty or invalid (ex: cleared field)
    else if (isNaN(peopleValue) || peopleValue < 1) {
        peopleError.style.display = 'none'; // Masque le message "Can't be zero" // Hides "Can't be zero" message
        peopleInput.classList.remove('error');  // Retire la bordure rouge via CSS // Removes red border via CSS
        peopleValue = 0; // Bloque le calcul si le champ est vidé // Prevents calculation if field is emptied
    
    } // 4. Dans le cas où le nombre saisi est valide (>= 1) // 4. In case entered number is valid (>= 1)
    else {
        peopleError.style.display = 'none';  // Masque le message d'erreur // Hides error message
        peopleInput.classList.remove('error'); // Retire la bordure rouge // Removes red border

        peopleInput.value = peopleValue; // Reformate pour éviter 03 et indique le chiffre 3 - Remplace le texte brut de l'input par le nombre entier nettoyé // Formats to avoid 03 and shows 3. Replaces raw input text with cleaned integer
    }

    // 5. On relance le moteur de calcul // 5. Rerun calculation engine
    calculateTip();
});


// --- Fonction pour la méthode de calcul des tips --- //
// --- Function for tip calculation method --- //
function calculateTip() {

    // Activer le bouton RESET dès qu'il y a une saisie // Enable RESET button as soon as there is input
    if (billValue >0 || tipValue > 0 || peopleValue >0) {
        resetBtn.disabled = false;
    } else {
        resetBtn.disabled = true;
    }

    // Calcul et affichage uniquement si le nombre de personnes est >= 1 et la facture > 0 // Calculate and display only if number of people is >= 1 and bill > 0
    if (peopleValue >= 1 && billValue > 0) {
        
        // 1. Calcul du montant du pourboire par personne // 1. Calculation of tip amount per person
        const tipAmount = (billValue * tipValue) / peopleValue;
        
        // 2. Calcul du total par personne (part de facture + part de pourboire) // 2. Calculation of total per person (bill share + tip share)
        const totalAmount = (billValue / peopleValue) + tipAmount;

        // 3. Affichage dans le DOM avec 2 décimales (.toFixed(2)) // 3. Display in DOM with 2 decimals (.toFixed(2))
        tipAmountResult.textContent = '$' + tipAmount.toFixed(2);
        totalAmountResult.textContent = '$' + totalAmount.toFixed(2);
        } else {
        tipAmountResult.textContent = '$0.00';
        totalAmountResult.textContent = '$0.00';
    }
}

// --- Fonction pour le bouton Reset --- //
// --- Function for Reset button --- //
resetBtn.addEventListener('click', function () {

    // 1. Réinitialisation des variables d'état // 1. Reset state variables
    billValue = 0.0;
    tipValue = 0.0;
    peopleValue = 0;

    // 2. Réinitialisation des champs de saisie // 2. Reset input fields
    billInput.value = '';
    peopleInput.value = '';
    customTipInput.value = '';

    // 3. Nettoyage des classes d'état visuel (.active et .error) // 3. Clean up visual state classes (.active and .error)
    tipButtons.forEach(function (btn) {
        btn.classList.remove('active');
    });
    peopleInput.classList.remove('error');
    peopleError.style.display = 'none';

    // 4. Remise à zéro de l'affichage des résultats // 4. Reset results display
    tipAmountResult.textContent = '$0.00';
    totalAmountResult.textContent = '$0.00';

    // 5. Désactivation du bouton RESET (redevient grisé) // 5. Disable RESET button (becomes greyed out again)
    resetBtn.disabled = true;
});