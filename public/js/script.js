(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  //Tax code

  let checkToggle = 1;
  let allPrices = document.querySelectorAll(".price");

  let show = () => {
    allPrices.forEach((priceElement) => {
      let realPrice = priceElement.getAttribute("data-real-price");
      if (!realPrice) {
        // Save the original price first time
        realPrice = priceElement.innerText.match(/\d+/)[0]; // extract number only
        priceElement.setAttribute("data-real-price", realPrice);
      }

      if (checkToggle === 1) {
        let taxedPrice = Math.round(realPrice * 1.18);
        priceElement.innerText = `₹ ${taxedPrice} /night (incl. 18% GST)`;
      } else {
        priceElement.innerText = `₹ ${realPrice} /night`;
      }
    });

    checkToggle = checkToggle === 1 ? 0 : 1;
  };

  let showTaxesSwitch = document.getElementById("switchCheckDefault");
  showTaxesSwitch.addEventListener("click", show);
  showTaxes.addEventListener("click", show)