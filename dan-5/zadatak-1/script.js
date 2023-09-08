// Function to add an item to the TODO list
function addItem() {
  const inputValue = document.getElementById("itemInput").value.trim();

  if (inputValue !== "") {
    const listItem = document.createElement("li");
    listItem.textContent = inputValue;

    const removeButton = document.createElement("button");
    removeButton.textContent = "X";

    removeButton.addEventListener("click", function () {
      listItem.remove();
      removeFromCookies(inputValue); // Remove from cookies
      filterItems(document.getElementById("searchInput").value);
    });

    listItem.appendChild(removeButton);

    document.getElementById("itemList").appendChild(listItem);

    document.getElementById("itemInput").value = "";

    filterItems(document.getElementById("searchInput").value); // Update the dropdown

    // Save the item in cookies
    saveToCookies(inputValue);
  }
}

// Function to save an item to cookies
function saveToCookies(item) {
  const cookies = document.cookie;
  const cookieArray = cookies.split("; ");
  const itemList = [];

  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].split("=");
    if (cookie[0] === "items") {
      itemList.push(decodeURIComponent(cookie[1]));
    }
  }

  itemList.push(item);

  document.cookie = `items=${encodeURIComponent(itemList.join("; "))}`;
}

// Function to remove an item from cookies
function removeFromCookies(item) {
  const cookies = document.cookie;
  const cookieArray = cookies.split("; ");
  const itemList = [];

  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].split("=");
    if (cookie[0] === "items") {
      itemList.push(decodeURIComponent(cookie[1]));
    }
  }

  const index = itemList.indexOf(item);
  if (index !== -1) {
    itemList.splice(index, 1);
  }

  // Clear the entire 'items' cookie
  document.cookie = `items=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

  // Re-add the remaining items back to the 'items' cookie
  if (itemList.length > 0) {
    document.cookie = `items=${encodeURIComponent(itemList.join("; "))}`;
  }
}

// Function to retrieve items from cookies
function getItemsFromCookies() {
  const cookies = document.cookie;
  const cookieArray = cookies.split("; ");
  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].split("=");
    if (cookie[0] === "items") {
      const itemList = decodeURIComponent(cookie[1]).split("; ");
      for (const item of itemList) {
        addItemFromCookies(item);
      }
    }
  }
}

// Function to add an item from cookies
function addItemFromCookies(item) {
  const listItem = document.createElement("li");
  listItem.textContent = item;

  const removeButton = document.createElement("button");
  removeButton.textContent = "X";

  removeButton.addEventListener("click", function () {
    listItem.remove();
    removeFromCookies(item); // Remove from cookies
    filterItems(document.getElementById("searchInput").value);
  });

  listItem.appendChild(removeButton);

  document.getElementById("itemList").appendChild(listItem);
}

// Function to filter items based on input
function filterItems(inputText) {
  const itemList = document.getElementById("itemList");
  const items = itemList.getElementsByTagName("li");
  const dropdownContent = document.getElementById("dropdownContent");
  const dropdownItems = dropdownContent.querySelectorAll("div");

  // Clear the previous dropdown content
  dropdownContent.innerHTML = "";

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemName = item.textContent;

    // Check if the item matches the input text with the same letters in the same positions
    if (isMatchingSubstring(itemName, inputText)) {
      // Create a copy of the list item text without the "X" button
      const dropdownItemText = document.createElement("div");
      dropdownItemText.textContent = itemName.replace("X", "");

      // Add an event listener to populate the input when a dropdown item is clicked
      dropdownItemText.addEventListener("click", function () {
        document.getElementById("searchInput").value = itemName.replace(
          "X",
          ""
        );
        dropdownContent.innerHTML = ""; // Clear the dropdown
        showOnlySelected(itemName.replace("X", ""));
      });

      dropdownContent.appendChild(dropdownItemText);
    }
  }

  // Show or hide the dropdown based on the number of matching items and input length
  if (inputText.length > 0 && dropdownItems.length > 0) {
    dropdownContent.style.display = "block";
  } else {
    dropdownContent.style.display = "none";
  }
}

// Function to check if a string contains a matching substring with the same letters in the same positions
function isMatchingSubstring(fullString, searchString) {
  if (searchString.length > fullString.length) {
    return false;
  }

  for (let i = 0; i < searchString.length; i++) {
    if (searchString.charAt(i) !== fullString.charAt(i)) {
      return false;
    }
  }

  return true;
}

// Function to show only the selected item in the items list
function showOnlySelected(selectedItem) {
  const itemList = document.getElementById("itemList");
  const items = itemList.getElementsByTagName("li");

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemName = item.textContent.replace("X", "");

    if (itemName === selectedItem) {
      item.style.display = "flex"; // Show the selected item
    } else {
      item.style.display = "none"; // Hide other items
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.getElementById("submitButton");
  submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    addItem();
  });

  // Initially hide the dropdown menu
  const dropdownContent = document.getElementById("dropdownContent");
  dropdownContent.style.display = "none";

  // Add an input event listener to show/hide the dropdown based on input
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", function () {
    filterItems(this.value);

    // Clear the dropdown and show all items when the input text is empty
    if (this.value === "") {
      dropdownContent.innerHTML = "";
      dropdownContent.style.display = "none";
      showAllItems();
    }
  });

  // Function to show all items in the items list
  function showAllItems() {
    const itemList = document.getElementById("itemList");
    const items = itemList.getElementsByTagName("li");

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      item.style.display = "flex"; // Show all items
    }
  }

  // Keyboard navigation
  searchInput.addEventListener("keydown", function (e) {
    const dropdownItems = document.querySelectorAll("#dropdownContent div");
    let selectedItemIndex = -1;

    for (let i = 0; i < dropdownItems.length; i++) {
      if (dropdownItems[i].classList.contains("selected")) {
        selectedItemIndex = i;
        break;
      }
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedItemIndex = (selectedItemIndex + 1) % dropdownItems.length;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (selectedItemIndex === -1) {
        selectedItemIndex = dropdownItems.length - 1;
      } else {
        selectedItemIndex =
          (selectedItemIndex - 1 + dropdownItems.length) % dropdownItems.length;
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedItemIndex !== -1) {
        const selectedText = dropdownItems[selectedItemIndex].textContent;
        searchInput.value = selectedText;
        dropdownContent.style.display = "none";
        showOnlySelected(selectedText);
      }
    }

    for (let i = 0; i < dropdownItems.length; i++) {
      if (i === selectedItemIndex) {
        dropdownItems[i].classList.add("selected");
      } else {
        dropdownItems[i].classList.remove("selected");
      }
    }
  });

  // Add an event listener to load items from cookies when the page is loaded
  getItemsFromCookies();
});
