// Funkce pro přidání nového záznamu do tabulky
function addEntry(type) {
    var barvaLamely = document.getElementById('barva-lamely').value;
    var barvaNosniku = document.getElementById('barva-nosniku').value;
    var typNosniku = document.getElementById('typ-nosniku').value;
    var typOkna = document.getElementById('typ-okna').value;
    var sklo = document.getElementById('sklo').value;
    var sirkaCm = document.getElementById('sirka').value; // Šířka v centimetrech
    var vyskaCm = document.getElementById('vyska').value; // Výška v centimetrech
    var pokoj = document.getElementById('pokoj').value; // Pokoj

    if (!barvaLamely || !barvaNosniku || !typNosniku || !typOkna || !sklo || !sirkaCm || !vyskaCm || !pokoj) {
        alert("Prosím vyplňte všechna pole.");
        return;
    }

    // Převod na metry
    var sirka = (parseFloat(sirkaCm) / 100).toFixed(2); // Převod na metry a zaokrouhlení na 2 desetinná místa
    var vyska = (parseFloat(vyskaCm) / 100).toFixed(2); // Převod na metry a zaokrouhlení na 2 desetinná místa

    var pocet = 1; // Výchozí počet žaluzií
    var obsah = (sirka * vyska).toFixed(2); // Výpočet obsahu žaluzie v m2

    // Zaokrouhlení na 1 m² pokud je obsah menší než 1 m²
    if (obsah < 1) {
        obsah = 1.00;
    }

    var celkovyObsah = (obsah * pocet).toFixed(2); // Celkový obsah v m2

    // Generování řádku tabulky
    var newRow = "<tr><td>" + pokoj + "</td><td>" + type + "</td><td>" + sirkaCm + "x" + vyskaCm + "</td><td class='count'>" + pocet + "x</td><td class='area'>" + obsah + "m2</td><td>(" + celkovyObsah + "m2)</td><td><button onclick='increaseCount(this)'>+</button> <button onclick='decreaseCount(this)'>-</button></td></tr>";

    // Přidání řádku do tabulky
    document.getElementById('table-body').innerHTML += newRow;

    // Vyčištění vstupních polí po přidání záznamu
    document.getElementById('sirka').value = "";
    document.getElementById('vyska').value = "";

    // Aktualizace celkového obsahu po přidání řádku
    updateTotalArea();
}

// Funkce pro odstranění řádku z tabulky
function deleteRow(btn) {
    var row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);

    // Aktualizace celkového obsahu po odstranění řádku
    updateTotalArea();
}

// Funkce pro zvýšení počtu žaluzií
function increaseCount(btn) {
    var row = btn.parentNode.parentNode;
    var countCell = row.getElementsByClassName('count')[0];
    var count = parseInt(countCell.innerText);
    count++;
    countCell.innerText = count + "x";

    // Aktualizace celkového obsahu
    updateRowArea(row);
    updateTotalArea();
}

// Funkce pro snížení počtu žaluzií
function decreaseCount(btn) {
    var row = btn.parentNode.parentNode;
    var countCell = row.getElementsByClassName('count')[0];
    var count = parseInt(countCell.innerText);
    if (count > 1) {
        count--;
        countCell.innerText = count + "x";
    } else {
        // Volitelné: Potvrzení před smazáním řádku, pokud je počet 1
        var confirmDelete = confirm("Opravdu chcete odstranit tento rozměr?");
        if (confirmDelete) {
            row.parentNode.removeChild(row);
            updateTotalArea();
            return;
        }
    }

    // Aktualizace celkového obsahu
    updateRowArea(row);
    updateTotalArea();
}

// Funkce pro aktualizaci oblasti řádku
function updateRowArea(row) {
    var count = parseInt(row.getElementsByClassName('count')[0].innerText);
    var areaCell = row.getElementsByClassName('area')[0];
    var area = parseFloat(areaCell.innerText.replace("m2", ""));
    var totalAreaCell = row.getElementsByTagName('td')[5];
    var totalArea = (area * count).toFixed(2);
    totalAreaCell.innerText = "(" + totalArea + "m2)";
}

// Funkce pro kopírování hodnot tabulky jako hlavičky
function copyToClipboard() {
    var headerText = "Žaluzie. Barva lamely - " + document.getElementById('barva-lamely').value + ". Barva nosníku - " + document.getElementById('barva-nosniku').value + ". Typ nosníku - " + document.getElementById('typ-nosniku').value + ". Typ okna - " + document.getElementById('typ-okna').value.toUpperCase() + ". " + document.getElementById('sklo').value;
    
    // Kopírování hlavičky
    var copiedText = headerText + "\n\n";
    
    // Kopírování každého řádku z tabulky
    var tableRows = document.getElementById('table-body').getElementsByTagName('tr');
    for (var i = 0; i < tableRows.length; i++) {
        var cells = tableRows[i].getElementsByTagName('td');
        copiedText += cells[0].innerText + " " + cells[1].innerText + " " + cells[2].innerText + " " + cells[3].innerText + " " + cells[4].innerText + " " + cells[5].innerText + "\n";
    }
    
    // Zobrazení celkového obsahu
    copiedText += "\ndohromady: " + calculateTotalArea() + "m2";

    // Kopírování do schránky
    navigator.clipboard.writeText(copiedText).then(function() {
        alert("Zkopírováno!");
    }, function(err) {
        alert("Chyba při kopírování: ", err);
    });
}

// Funkce pro výpočet celkového obsahu
function calculateTotalArea() {
    var totalArea = 0;
    var tableRows = document.getElementById('table-body').getElementsByTagName('tr');
    for (var i = 0; i < tableRows.length; i++) {
        var totalAreaString = tableRows[i].getElementsByTagName('td')[5].innerText.trim();
        var totalAreaValue = parseFloat(totalAreaString.replace("m2", "").replace("(", "").replace(")", ""));
        totalArea += totalAreaValue;
    }
    return totalArea.toFixed(2);
}

// Funkce pro aktualizaci celkového obsahu
function updateTotalArea() {
    var totalArea = calculateTotalArea();
    document.getElementById('total-area').innerText = "dohromady: " + totalArea + "m2";
}

// Prevence proti náhodnému opuštění stránky
window.addEventListener('beforeunload', function (e) {
    var confirmationMessage = 'Opravdu chcete opustit tuto stránku? Vaše data nebudou uložena.';
    e.returnValue = confirmationMessage;
    return confirmationMessage;
});
