let log = console.log

// CART LOGIC:
let cartItems = [];

let totalAmount = 0;
let discount = 0;
totalAmount = totalAmount - (totalAmount * discount);

$('body').on('click', '.fontStore >li >.buyButton', addToCart) // when buyButton is clicked
$('body').on('click', '.cart >ul >li', removeFromCart) // when <li> is clicked in .cart

function addToCart() {
  // finds the closest 'li' to clicked .buyButton, finds .fontName.text()
  let fontName = $(this).closest('li').find('.fontName').text(); // selects fontname
  let family = $(this).closest('li').find('.fontFamily').text(); // selects fontfamily

  for (let i = 0; i < cartItems.length; i++) {
    if (cartItems[i].name === fontName) {
      alert("This font is already in the cart.");
      return;
    }
  }

  // Get the closest <li> to the clicked button and clones it for future appending
  let font = $(this).closest('li').clone();
  // Change the buyButton text to a green '✔'
  $(this).text('✔').css({
    'color': '#37cc3e',
    'font-weight': '800',
    'border': '1.5px solid #37cc3e'
  });
  // 'X' on:hover
  if ($(this).text() != 'Add') {
    $(this).hover(function () {
      $(this).text('X').css({
        'color': '#FF0000',
        'font-weight': '800',
        'border': '1.5px solid #FF0000'
      });
    }, function () {
      $(this).text('✔').css({
        'color': '#37cc3e',
        'font-weight': '800',
        'border': '1.5px solid #37cc3e'
      });
    });
  }

  font.find('.buyButton').remove(); // Remove the .buyButton from the cloned <li>
  font.find('.fontPrice').css({ // Align .fontPrice to the right
    'text-align': 'right',
    'font-size': '16px'
  })
  font.find('.fontFamily').css('display', 'none') // makes sure fontFamily remains hidden
  $('.cart > ul').append(font); // Move the <li> to the cart

  // finds the .fontPrice and converts it to a number
  let price = Number($(this).closest('li').find('.fontPrice').text().split(' ')[0]);

  cartItems.push({ name: fontName, family: family, price: price });
  log(cartItems)

  // applyFamilyDiscount(); //FIXME: 
  totalAmount += price;

  updateTotalAmount(totalAmount);
}


function removeFromCart() {
  // 'this' refers to the clicked item <li>
  const item = $(this);
  // extract price and convert to Number()
  const price = Number(item.find('.fontPrice').text().split(' ')[0]);
  const fontName = item.find('.fontName').text();

  // restore the buyButton text to 'Add' in the corresponding .fontStore
  const fontStoreItems = $('.fontStore > li'); // Select all fontStore items
  for (let i = 0; i < fontStoreItems.length; i++) {
    // find the matching === fontName
    if ($(fontStoreItems[i]).find('.fontName').text() === fontName) {
      // change teh css of [i]
      $(fontStoreItems[i]).find('.buyButton').text('Add').css({
        'font-weight': '400',
        'color': '',
        'border': '1px solid #cfcfcf'
      });
      // turns off .hover() on [i]
      $(fontStoreItems[i]).find('.buyButton').off('mouseenter mouseleave')
    }
  }
  // Find the correct item in cartItems array
  //I had to add the .trim().toLowerCase because of whitespaces and capital letters. FINALLY!
  //.findIndex returns the first item that matches condition (fontName) and returns -1/false if not found
  const indexToRemove = cartItems.findIndex(item =>
    item.name.trim().toLowerCase() === fontName.trim().toLowerCase()
  );
  if (indexToRemove !== -1) { // if .findIndex returns 1/true and not !== -1 (false) 
    cartItems.splice(indexToRemove, 1); // splice at (indexToRemove, 1)
  }

  // remove the appended item and update totalAmount
  item.remove();
  totalAmount -= price;

  // applyFamilyDiscount(); //FIXME:
  updateTotalAmount(totalAmount);
  log(cartItems);
}

// updates totalAmount, needs totalAmount as perimeter
function updateTotalAmount(totalAmount) {
  // declares totalNumber as #totalAmount and converts it to a Number()
  let totalNumber = Number($('#totalAmount').text());
  // updates #totalAmount text to totalPrice
  totalNumber = totalAmount;

  // call calculateDiscount function for checking/adding discount:
  totalNumber = calculateDiscount(totalNumber);
  // updates totalAmount display
  $('#totalAmount').text(totalNumber.toFixed(2));

  if (cartItems.length === 0) {
    $('#totalAmount').text('0.00');
  }
}


//TODO: Didn't have time to solve this problem fully:
// function applyFamilyDiscount() {
//     // Create an object to count occurrences of each family
//     const familyCounts = {};

//     // Count each family's occurrences in cartItems
//     for (let i = 0; i < cartItems.length; i++) {
//         const family = cartItems[i].family;
//         familyCounts[family] = (familyCounts[family] || 0) + 1;
//     }

//     // Check for families with 3 or more items and apply discount
//     for (let family in familyCounts) {
//         if (familyCounts[family] >= 3) {
//             totalAmount -= 100; // Apply a discount of 100
//             alert(`Discount applied for family: ${family}`);
//         }
//     }
// }


function calculateDiscount(totalNumber) {
  // if you buy 6 or more items = 30% off total
  if (cartItems.length >= 6) {
    discount = 0.3;
    totalNumber = totalNumber - (totalNumber * discount);
    $('.bool').text('max ] 30% off');
    $('.discount').css('background-color', '#ff0000');
    // if you buy 3 or more items = 20% off total
  } else if (cartItems.length >= 3) {
    discount = 0.2;
    totalNumber = totalNumber - (totalNumber * discount);
    $('.bool').text('true ] 20% off');
    $('.discount').css('background-color', '#37cc3e');
  } else {
    $('.bool').text('false ]');
    $('.discount').css('background-color', '#cfcfcf');
  }

  // hidden discount code, everything is free!!:
  let fontPrev = $('.fontPreview').text();
  if (fontPrev == '1337' && cartItems.length >= 0) {
    totalNumber = 0;
    $('.bool').text('FREE ]');
    $('.discount').css('background-color', '#d24dd7');
  }

  return totalNumber; // Return the updated totalNumber
}


// USER CONFIG/TYPEFACE CONFIG:

// TODO: Don't activate changeFont() when clicking the .buyButton.

// when any <li> in .fontSelect is clicked -> .fontPreview font-family is updated.
$('body').on('click', '.fontStore >li', changeFont)
function changeFont() {
  //selects 'li' and finds it's .fontName.css()
  let listFont = $(this).find('.fontName').css('font-family');
  // Change the font-family of .fontPreview
  $('.fontPreview').css('font-family', listFont);
}

// Toggle dark-mode text:
$('body').on('click', '#darkModeText', darkmodeText)
let isDarkModeText = false; // tracks the darkmode toggle
function darkmodeText() {
  isDarkModeText = !isDarkModeText
  if (isDarkModeText) {
    $('.fontPreview').css('background-color', '#1e1e1e');
    $('.fontPreview').css('color', '#f8f8ff');
  } else {
    $('.fontPreview').css('background-color', 'transparent')
    $('.fontPreview').css('color', '#1e1e1e')
  }
}

// Italic:
$('body').on('click', '#styleItalic', italicToggle)
function italicToggle() {
  $('.fontPreview').css('font-style', 'italic');
}

// Regular:
$('body').on('click', '#styleRegular', regularToggle)
function regularToggle() {
  $('.fontPreview').css('font-style', '');
}

// Bold:
let isBold = false; // tracks bold toggle
$('body').on('click', '#styleBold', boldToggle)
function boldToggle() {
  isBold = !isBold
  if (isBold) {
    $('.fontPreview').css('font-weight', 'bold');
  } else {
    $('.fontPreview').css('font-weight', '300');
  }
}

// InputPreview:
$('body').on('input', 'input:text', updateFontPreview)
function updateFontPreview() {
  let input = $(this) // this = $('#inputPreview')
  const inputValue = input.val()
  let fontPreview = $('.fontPreview')
  fontPreview.text(inputValue);

  // handles if (fontPreview is empty => reset the text)
  if (fontPreview.text() == '') {
    fontPreview.text('The quick brown fox jumps over the lazy dog')
  }
  calculateDiscount()
  updateTotalAmount()
}


//Eyecandy:

// Random color-generator on:hover:
document.addEventListener("DOMContentLoaded", function () {
  const colors = [
    'var(--random-color1)',
    'var(--random-color2)',
    'var(--random-color3)',
    'var(--random-color4)',
    'var(--random-color5)'
  ];
  // Function to set a random color
  function setRandomColor() {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.documentElement.style.setProperty('--random-color', randomColor);
  }
  // Set initial random color
  setRandomColor();

  // Randomizer for DEV text
  const dev = document.querySelectorAll('.dev');
  dev.forEach(item => {
    item.addEventListener('mouseenter', setRandomColor);
  });
  // Randomizer hover effect for .mainDetails >summaary
  const summaries = document.querySelectorAll('.mainDetails summary');
  summaries.forEach(summary => {
    summary.addEventListener('mouseenter', setRandomColor);
  });
});
