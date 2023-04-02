"use strict";

// Add new pet to the system

const petArr = []; // All the pet in the list
const idArr = []; // All the ids of the pets in the list
let healthyPets = []; // For healthy pets
const btnSubmit = document.getElementById("submit-btn"); // submit btn
const btnHealthyPet = document.getElementById("healthy-btn"); // show healthy pet btn

// I can simply use onClick but it doesn't seem to challenging enough. ?

// Display every element in the petArr
function renderTableData(petArr) {
  const tableBodyEl = document.getElementById("tbody");
  tableBodyEl.innerHTML = "";
  for (let i = 0, petArrLen = petArr.length; i < petArrLen; i++) {
    const row = document.createElement("tr");
    row.classList.add("table-row");
    row.classList.add(`row-id--${petArr[i].id}`);
    row.innerHTML = `<th scope="row">${petArr[i].id}</th>
							<td>${petArr[i].dataName}</td>
							<td>${petArr[i].age}</td>
							<td>${petArr[i].type}</td>
							<td>${petArr[i].weight} kg</td>
							<td>${petArr[i].length} cm</td>
							<td>${petArr[i].breed}</td>
							<td>
								<i class="bi bi-square-fill" style="color: ${petArr[i].color}"></i>
							</td>
							<td>${
                petArr[i].vaccinated
                  ? '<i class="bi bi-check-circle-fill"></i>'
                  : '<i class="bi bi-x-circle-fill"></i>'
              }</td>
							<td>${
                petArr[i].dewormed
                  ? '<i class="bi bi-check-circle-fill"></i>'
                  : '<i class="bi bi-x-circle-fill"></i>'
              }</td>
							<td>${
                petArr[i].sterilized
                  ? '<i class="bi bi-check-circle-fill"></i>'
                  : '<i class="bi bi-x-circle-fill"></i>'
              }</td>
							<td>${petArr[i].date.toISOString().split("T")[0]}</td>
                            <td class="bmi-id--${petArr[i].id}">${
      petArr[i].bmi
    }</td>
							<td><button type="button" class="id--${
                petArr[i].id
              } btn btn-danger btn-delete">Delete</button> 

							</td>`;
    //   This button should contain only one class with the first 4 letters of "id--" because this class is used to store the id of the pet.
    // If another class with the first 4 letter of "id--" appear, there is a good chance the program will delete the wrong row because it takes the wrong id.
    tableBodyEl.appendChild(row);
  }
}

// Adding delete function to the delete button. Because I don't use the onClick function, I need to add the delete function to every delete buttons
// every time the table is re-rendered. So making it a function would be eaiser to complete the task.
function addDelete() {
  let btnDeletes = document.querySelectorAll(".btn-delete");
  if (btnDeletes) {
    //remove the pet from the list
    const deletePet = function (id) {
      if (confirm("Are you sure")) {
        // General list
        for (let i = 0, petArrLen = petArr.length; i < petArrLen; i++) {
          if (petArr[i].id === id) {
            petArr.splice(i, 1);
            break;
          }
        }
        // id list. So the removed ID can be use in the future.
        for (let i = 0, idArrLen = idArr.length; i < idArrLen; i++) {
          if (idArr[i] === id) {
            idArr.splice(i, 1);
            break;
          }
        }
        // remove from the healthy pet list as well if the pet is listed in the healthy list
        for (
          let i = 0, healthyPetsLen = healthyPets.length;
          i < healthyPetsLen;
          i++
        ) {
          if (healthyPets[i].id === id) {
            healthyPets.splice(i, 1);
            break;
          }
        }
        const tableRows = document.querySelectorAll(".table-row");

        // console.log(tableRows);
        // Making the content of the row that contains the clicked delete button empty instead of re-rendering the whole table.
        for (let i = 0, tableRowLen = tableRows.length; i < tableRowLen; i++) {
          //   console.log(tableRows[i]);
          for (
            let j = 0, rowIClassListLen = tableRows[i].classList.length;
            j < rowIClassListLen;
            j++
          ) {
            // console.log(tableRows[i].classList[j]);
            // The row contains a class "row-id---", and we base on this class to find out which row is deleted.
            // The row is deleted if its "row-id--" has the same value as the id extract from the clicked delete button
            if (tableRows[i].classList[j].indexOf("row-id--") !== -1) {
              //   console.log(tableRows[i].classList[j].indexOf("row-id--"));
              //   console.log(
              //     tableRows[i].classList[j].slice(
              //       tableRows[i].classList[j].indexOf("row-id--") + 8
              //     )
              //   );
              if (
                tableRows[i].classList[j].slice(
                  tableRows[i].classList[j].indexOf("row-id--") + 8
                ) === id
              ) {
                // console.log("set");
                tableRows[i].innerHTML = "";
                break;
              }
            }
          }
        }
      }
      return 1; // Not nessecary for now but maybe in the future
    };

    // Add the delete function to all the delete button
    for (let j = 0, btnDelLen = btnDeletes.length; j < btnDelLen; j++) {
      //   console.log(j);
      btnDeletes[j].addEventListener("click", function () {
        // When a button is clicked, extract the id of the pet from the class "id--" of the clicked button and store it into the removedID variable

        const btnJClassList = btnDeletes[j].classList;
        // console.log(btnJClassList);
        let indexOfId = 0; // The index of the class than contains the id of the pet in this button
        for (
          let i = 0, btnJClassListLen = btnJClassList.length;
          i < btnJClassListLen;
          i++
        ) {
          // check to see which class contains the id--
          if (btnJClassList[i].indexOf("id--") !== -1) {
            indexOfId = i;
            // console.log(indexOfId);
            break;
          }
        }
        // extract the id from the class
        const removedID = btnJClassList[indexOfId].slice(4);
        // 4 because of the length of "id--" is for, the rest of the class name is the id of the pet.
        // console.log(removedID);
        deletePet(removedID);
      });
    }
  }
}

btnSubmit.addEventListener("click", function () {
  // Make the show healthy pet button display "Show healthy pet" text every time user add a new pet,
  // a list of every pet should be displayed instead of only healthy pet even though the user was seeing all healthy pet when they submit a new pet.
  btnShowHealthyPetText("Show Healthy Pet");
  healthyCheck = false;
  const petID = document.getElementById("input-id");
  const petName = document.getElementById("input-name");
  const petAge = document.getElementById("input-age");
  const petType = document.getElementById("input-type");
  const petWeight = document.getElementById("input-weight");
  const petLength = document.getElementById("input-length");
  const petColor = document.getElementById("input-color-1");
  const petBreed = document.getElementById("input-breed");
  const isVaccinated = document.getElementById("input-vaccinated");
  const isDewormed = document.getElementById("input-dewormed");
  const isSterilized = document.getElementById("input-sterilized");
  const data = {
    id: petID.value,
    dataName: petName.value,
    age: parseInt(petAge.value),
    type: petType.value,
    weight: petWeight.value,
    length: petLength.value,
    color: petColor.value,
    breed: petBreed.value,
    vaccinated: isVaccinated.checked,
    dewormed: isDewormed.checked,
    sterilized: isSterilized.checked,
    date: new Date(),
    bmi: "?",
  };

  // Validate information

  const validateData = function (data) {
    // ID
    if (!data.id) {
      alert("ID cannot be left empty");

      return false;
    }
    for (let i = 0, idArrLen = idArr.length; i < idArrLen; i++) {
      if (idArr[i] === data.id) {
        alert("ID cannot be duplicated");
        return false;
      }
    }
    // Age

    if (data.age < 1 || data.age > 15) {
      alert("Age must be between 1 and 15");
      return false;
    }

    // Weight
    if (data.weight < 1 || data.weight > 15) {
      alert("Weight must be between 1 and 15");
      return false;
    }

    // Length

    if (data.length < 1 || data.length > 100) {
      alert("Length must be between 1 and 100");
      return false;
    }

    // Type
    if (data.type === "Select Type") {
      alert("Please select type");
      return false;
    }

    // Breed
    if (data.breed === "Select Breed") {
      alert("Please select breed");
      return false;
    }
    idArr.push(data.id);
    return true;
  };

  // Add pet to the list
  const validate = validateData(data);
  //   const validate = 1;
  if (validate) {
    petArr.push(data);
    clearInput();
    renderTableData(petArr);
  }
  // Clear input
  function clearInput() {
    petID.value = "";
    petName.value = "";
    petAge.value = "";
    petType.value = "Select Type";
    petWeight.value = "";
    petLength.value = "";
    petColor.value = "#000000";
    petBreed.value = "Select Breed";
    isDewormed.checked = false;
    isVaccinated.checked = false;
    isSterilized.checked = false;
  }
  addDelete();
});

// Show healthy pet

let healthyCheck = false;

function btnShowHealthyPetText(message) {
  btnHealthyPet.textContent = message;
}

btnHealthyPet.addEventListener("click", function () {
  if (!healthyCheck) {
    // console.log(healthyCheck);
    healthyCheck = true;
    btnShowHealthyPetText("Show All Pet");
    // btnHealthyPet.textContent = "Show All Pet";
    healthyPets = [];

    for (let i = 0, petArrLen = petArr.length; i < petArrLen; i++) {
      if (petArr[i].vaccinated && petArr[i].dewormed && petArr[i].sterilized) {
        healthyPets.push(petArr[i]);
      }
    }
    // console.log(healthyPets);
    renderTableData(healthyPets);
    addDelete();
  } else {
    // btnHealthyPet.textContent = "Show Healthy Pet";
    btnShowHealthyPetText("Show Healthy Pet");
    healthyCheck = false;
    renderTableData(petArr);
    addDelete();
  }
});

// Calculate BMI
const btnBMI = document.getElementById("bmi-btn");
// For display BMI, add a new property to the petAdd[i] called bmi, this property has default value set to "?"
// When the calcBMI is called, the bmi property is modify and the renderTableData() is called to display new value of the bmi property
if (btnBMI) {
  btnBMI.addEventListener("click", function () {
    for (let i = 0, petArrLen = petArr.length; i < petArrLen; i++) {
      petArr[i].bmi = calcBMI(petArr[i]);
      //   console.log(petArr[i].bmi);
    }
    // Making bmi calculating button show all the pet.
    renderTableData(petArr);
    btnShowHealthyPetText("Show Healthy Pet");
    healthyCheck = false;
    addDelete();
  });
}

function calcBMI(petData) {
  let bmi = petData.weight / petData.length ** 2;
  switch (petData.type) {
    case "Dog":
      bmi *= 703;
      break;
    case "Cat":
      bmi *= 886;
      break;
    default:
      break;
  }

  return Math.round((bmi + Number.EPSILON) * 100) / 100;
}
