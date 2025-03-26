document.addEventListener("DOMContentLoaded", function () {
  // Check if calculator block exists in the DOM
  const calculatorBlocks = document.querySelectorAll(".calculator-block");

  if (!calculatorBlocks.length) return;
  console.log("Calculator blocks found:", calculatorBlocks);

  // Initialize each calculator block
  calculatorBlocks.forEach((calculator) => {
    const form = calculator.querySelector("form");
    const balanceInput = calculator.querySelector(
      '[data-input="balance-owed"]'
    );
    const interestInput = calculator.querySelector(
      '[data-input="interest-rate"]'
    );
    const debtTypeSelect = calculator.querySelector('[data-input="debt-type"]');
    const paymentInput = calculator.querySelector(
      '[data-input="monthly-payment"]'
    );
    const monthlyPaymentResult = calculator.querySelector(
      '[data-result="monthly-payment"]'
    );
    const monthsToPayResult = calculator.querySelector(
      '[data-result="months-to-pay"]'
    );
    const totalPrincipalResult = calculator.querySelector(
      '[data-result="total-principal"]'
    );
    const totalInterestResult = calculator.querySelector(
      '[data-result="total-interest"]'
    );

    // Ensure all required elements exist
    if (
      form &&
      balanceInput &&
      interestInput &&
      debtTypeSelect &&
      paymentInput &&
      monthlyPaymentResult &&
      monthsToPayResult &&
      totalPrincipalResult &&
      totalInterestResult
    ) {
      // Add form submit handler
      form.addEventListener("submit", function (e) {
        // Only prevent default if form is valid
        if (form.checkValidity()) {
          e.preventDefault();

          // Get input values
          const balance = parseFloat(balanceInput.value);
          const interestRate = parseFloat(interestInput.value);
          const debtType = debtTypeSelect.value;
          const monthlyPayment = parseFloat(paymentInput.value);

          // Calculate results
          const monthsToPay = Math.ceil(balance / monthlyPayment);
          const totalPrincipal = balance;
          const totalInterest =
            ((balance * interestRate) / 100) * (monthsToPay / 12); // Adjust interest for years

          // Format currency
          const formatCurrency = (amount) => {
            return new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(amount);
          };

          // Update results
          monthlyPaymentResult.textContent = formatCurrency(monthlyPayment);
          monthsToPayResult.textContent = monthsToPay;
          totalPrincipalResult.textContent = formatCurrency(totalPrincipal);
          totalInterestResult.textContent = formatCurrency(totalInterest);

          // Announce results to screen readers
          const resultsRegion = calculator.querySelector(
            ".calculator-block__results"
          );
          resultsRegion.setAttribute("aria-busy", "false");
        }
      });
    }
  });
});
