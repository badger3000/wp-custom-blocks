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
        const interest = parseFloat(interestInput.value) || 0;
        const debtType = debtTypeInput.value;
        const monthly = parseFloat(monthlyInput.value) || 0;
        const email = emailInput ? emailInput.value.trim() : '';

        // Calculate results
        const months = balance / monthly;
        const principal = balance;
        const interestPaid = (balance * interest) / 100;

        // Format currency function
        const formatCurrency = (amount) => {
          return '$' + parseFloat(amount).toFixed(2);
        };

        // Update results display
        results.querySelector('[data-result="monthly-payment"]').textContent =
          formatCurrency(monthly);
        results.querySelector('[data-result="months-to-pay"]').textContent =
          Math.round(months);
        results.querySelector('[data-result="total-principal"]').textContent =
          formatCurrency(principal);
        results.querySelector('[data-result="total-interest"]').textContent =
          formatCurrency(interestPaid);

        // If email is provided, send results
        if (email !== '') {
          const data = new FormData();
          data.append('action', 'send_calculator_results');
          data.append('nonce', window.calculatorData?.nonce || '');
          data.append('email', email);
          data.append('balance', balance);
          data.append('interest', interest);
          data.append('debtType', debtType);
          data.append('monthly', monthly);
          data.append('months', Math.round(months));
          data.append('principal', principal);
          data.append('totalInterest', interestPaid);

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
