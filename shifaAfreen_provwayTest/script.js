const products = [
  {
    id: 1,
    unit: "1",
    discount: "10%",
    price: "$10.00 USD",
    original: "$24.00 USD",
    checked: false,
  },
  {
    id: 2,
    unit: "2",
    discount: "20%",
    price: "$18.00 USD",
    original: "$24.00 USD",
    checked: true,
  },
  {
    id: 3,
    unit: "3",
    discount: "30%",
    price: "$24.00 USD",
    original: "$24.00 USD",
    checked: false,
  },
];

const productContainer = document.querySelector(".product-container");

window.addEventListener("DOMContentLoaded", function () {
  // Dynamically render product cards
  const productCardsHTML = products
    .map((product) => {
      return `
        <div class="product-container__card">
          <div class="product-container__quantity">
            <div class="product-container__price">
             ${
               product.unit === "2"
                 ? '<div class="most-popular">MOST POPULAR</div>'
                 : ""
             }
              <input
                type="radio"
                id="unit-${product.id}"
                name="quantity"
                value="${product.unit}"
                aria-label="${product.unit}"
                ${product.checked ? "checked" : ""}
              />
              <label for="unit-${product.id}">
                ${product.unit} Unit
                <span class="discount">${product.discount} off</span>
              </label>
            </div>
            <p class="rate">
              <span class="current-price">${product.price}</span> 
              <span class="original-price"><s>${product.original}</s></span>
            </p>
          </div>
          <div class="product-container__choice">
            <!-- Selectors will dynamically render here -->
          </div>
        </div>
      `;
    })
    .join("");

  productContainer.innerHTML = productCardsHTML;

  // Add event listeners to radio buttons
  const radios = document.querySelectorAll('input[name="quantity"]');
  radios.forEach((radio) => {
    radio.addEventListener("change", displaySelectors);
  });

  // Add event listeners to product cards
  const cards = document.querySelectorAll(".product-container__card");
  cards.forEach((card) => {
    card.addEventListener("click", function (e) {
      // Ignore clicks on dropdowns or options
      if (["select", "option"].includes(e.target.tagName.toLowerCase())) {
        return;
      }

      if (
        e.target.tagName.toLowerCase() === "input" &&
        e.target.type === "radio"
      ) {
        return;
      }

      const radio = card.querySelector('input[type="radio"]');
      radio.checked = true;

      displaySelectors();
    });
  });

  // Trigger initial rendering for the checked radio button
  document
    .querySelector('input[name="quantity"]:checked')
    ?.dispatchEvent(new Event("change"));
});

//function to display selectors
function displaySelectors() {
  const choiceContainers = document.querySelectorAll(
    ".product-container__choice"
  );
  choiceContainers.forEach((container) => (container.innerHTML = ""));

  // Get the selected radio button
  const selectedRadio = document.querySelector(
    'input[name="quantity"]:checked'
  );

  if (!selectedRadio) return;

  document.querySelectorAll(".product-container__card").forEach((card) => {
    card.classList.remove("selected");
  });

  const cardDiv = selectedRadio.closest(".product-container__card");
  cardDiv.classList.add("selected");

  const parentCard = selectedRadio.closest(".product-container__card");

  const choiceContainer = parentCard.querySelector(
    ".product-container__choice"
  );

  const selectedValue = parseInt(selectedRadio.value.trim(), 10);

  // Generate selectors dynamically
  let selectorsHTML = `
    <div class="product-selectors product-selectors--headings">
      <div class="product-number"></div>
      <div class="heading">Size</div>
      <div class="heading">Colour</div>
    </div>
  `;

  for (let i = 1; i <= selectedValue; i++) {
    selectorsHTML += `
      <div class="product-selectors">
        <div class="product-number">#${i}</div>
        <select id="size${i}" name="size${i}" class="dropdown">
          <option value="s">S</option>
          <option value="m">M</option>
          <option value="l">L</option>
        </select>
        <select id="colour${i}" name="colour${i}" class="dropdown">
          <option value="colour">Colour</option>
          <option value="red">Red</option>
          <option value="black">Black</option>
        </select>
      </div>
    `;
  }

  choiceContainer.innerHTML = selectorsHTML;

  updateTotalAmount(cardDiv);
}

// Function to update the total amount
function updateTotalAmount(cardDiv) {
  const currentPriceElement = cardDiv.querySelector(".current-price");
  if (!currentPriceElement) return;

  const priceText = currentPriceElement.textContent.trim();

  const totalAmtElement = document.querySelector(".total-amt");
  if (totalAmtElement) {
    totalAmtElement.textContent = `Total: ${priceText}`;
  }
}
