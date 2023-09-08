function addItem() {
  const inputValue = document.getElementById("itemInput").value.trim();

  if (inputValue !== "") {
    const listItem = document.createElement("li");
    listItem.textContent = inputValue;

    const removeButton = document.createElement("button");
    removeButton.textContent = "X";

    removeButton.addEventListener("click", function () {
      listItem.remove();
      removeFromCookies(inputValue);
      filterItems(document.getElementById("searchInput").value);
    });

    listItem.appendChild(removeButton);

    document.getElementById("itemList").appendChild(listItem);

    document.getElementById("itemInput").value = "";

    filterItems(document.getElementById("searchInput").value);

    saveToCookies(inputValue);
  }
}

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

  document.cookie = `items=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

  if (itemList.length > 0) {
    document.cookie = `items=${encodeURIComponent(itemList.join("; "))}`;
  }
}

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

function addItemFromCookies(item) {
  const listItem = document.createElement("li");
  listItem.textContent = item;

  const removeButton = document.createElement("button");
  removeButton.textContent = "X";

  removeButton.addEventListener("click", function () {
    listItem.remove();
    removeFromCookies(item);
    filterItems(document.getElementById("searchInput").value);
  });

  listItem.appendChild(removeButton);

  document.getElementById("itemList").appendChild(listItem);
}

function filterItems(inputText) {
  const itemList = document.getElementById("itemList");
  const items = itemList.getElementsByTagName("li");
  const dropdownContent = document.getElementById("dropdownContent");
  const dropdownItems = dropdownContent.querySelectorAll("div");

  dropdownContent.innerHTML = "";

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemName = item.textContent;

    if (isMatchingSubstring(itemName, inputText)) {
      const dropdownItemText = document.createElement("div");
      dropdownItemText.textContent = itemName.replace("X", "");

      dropdownItemText.addEventListener("click", function () {
        document.getElementById("searchInput").value = itemName.replace("X", "");
        dropdownContent.innerHTML = "";
        showOnlySelected(itemName.replace("X", ""));
      });

      dropdownContent.appendChild(dropdownItemText);
    }
  }

  if (inputText.length > 0 && dropdownItems.length > 0) {
    dropdownContent.style.display = "block";
  } else {
    dropdownContent.style.display = "none";
  }
}

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

function showOnlySelected(selectedItem) {
  const itemList = document.getElementById("itemList");
  const items = itemList.getElementsByTagName("li");

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemName = item.textContent.replace("X", "");

    if (itemName === selectedItem) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.getElementById("submitButton");
  submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    addItem();
  });

  const dropdownContent = document.getElementById("dropdownContent");
  dropdownContent.style.display = "none";

  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", function () {
    filterItems(this.value);

    if (this.value === "") {
      dropdownContent.innerHTML = "";
      dropdownContent.style.display = "none";
      showAllItems();
    }
  });

  function showAllItems() {
    const itemList = document.getElementById("itemList");
    const items = itemList.getElementsByTagName("li");

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      item.style.display = "flex";
    }
  }

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

  getItemsFromCookies();
});
