document.addEventListener('DOMContentLoaded', function () {
  const calculators = document.querySelectorAll('.calculator-block');

  calculators.forEach(function (calculator) {
    const form = calculator.querySelector('.calculator-block__form');
    const results = calculator.querySelector('.calculator-block__results');

    if (form && results) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const balanceInput = form.querySelector('[data-input="balance-owed"]');
        const interestInput = form.querySelector('[data-input="interest-rate"]');
        const debtTypeInput = form.querySelector('[data-input="debt-type"]');
        const monthlyInput = form.querySelector('[data-input="monthly-payment"]');
        const emailInput = form.querySelector('[data-input="user-email"]');

        const balance = parseFloat(balanceInput.value) || 0;
        const annualInterestRate = parseFloat(interestInput.value) || 0;
        const debtType = debtTypeInput.value;
        const monthly = parseFloat(monthlyInput.value) || 0;
        const email = emailInput ? emailInput.value.trim() : '';

        // Calculate monthly interest rate
        const monthlyRate = annualInterestRate / 100 / 12;

        // Calculate number of months needed to pay off the debt
        let remainingBalance = balance;
        let months = 0;
        let totalInterest = 0;

        // Calculate amortization
        while (remainingBalance > 0 && months < 1200) { // Cap at 100 years
          const monthlyInterest = remainingBalance * monthlyRate;
          const monthlyPrincipal = Math.min(monthly - monthlyInterest, remainingBalance);
          
          if (monthly <= monthlyInterest) {
            // Payment is too low to cover interest
            alert('Monthly payment must be higher than the monthly interest: $' + monthlyInterest.toFixed(2));
            return;
          }

          totalInterest += monthlyInterest;
          remainingBalance -= monthlyPrincipal;
          months++;

          // Handle small remaining amounts
          if (remainingBalance < 0.01) {
            remainingBalance = 0;
          }
        }

        // Format currency function
        const formatCurrency = (amount) => {
          return '$' + parseFloat(amount).toFixed(2);
        };

        // Update results display
        results.querySelector('[data-result="monthly-payment"]').textContent =
          formatCurrency(monthly);
        results.querySelector('[data-result="months-to-pay"]').textContent =
          months;
        results.querySelector('[data-result="total-principal"]').textContent =
          formatCurrency(balance);
        results.querySelector('[data-result="total-interest"]').textContent =
          formatCurrency(totalInterest);

        // If email is provided, send results
        if (email !== '') {
          const data = new FormData();
          data.append('action', 'send_calculator_results');
          data.append('nonce', window.calculatorData?.nonce || '');
          data.append('email', email);
          data.append('balance', balance);
          data.append('interest', annualInterestRate);
          data.append('debtType', debtType);
          data.append('monthly', monthly);
          data.append('months', months);
          data.append('principal', balance);
          data.append('totalInterest', totalInterest);

          fetch(window.calculatorData?.ajaxurl || '/wp-admin/admin-ajax.php', {
            method: 'POST',
            credentials: 'same-origin',
            body: data,
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                alert('Results have been sent to your email!');
              } else {
                alert('Failed to send email: ' + (data.data || 'Please try again.'));
              }
            })
            .catch((error) => {
              console.error('Error:', error);
              alert('Failed to send email. Please try again.');
            });
        }

        // Announce results to screen readers
        results.setAttribute('aria-busy', 'false');
      });
    }
  });
});
