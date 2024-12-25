document.addEventListener('DOMContentLoaded', function () {
    const assetForm = document.getElementById('assetForm');
    const portfolioChartCtx = document.getElementById('portfolioChart').getContext('2d');
    const pieChartCtx = document.getElementById('pieChart').getContext('2d');
    let portfolioChart = new Chart(portfolioChartCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Asset Values',
                data: [],
                backgroundColor: 'rgba(110, 142, 251, 0.5)',
                borderColor: 'rgba(110, 142, 251, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    let pieChart = new Chart(pieChartCtx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#3498db', '#1abc9c', '#e74c3c', '#f1c40f', '#8e44ad',
                    '#9b59b6', '#34495e', '#2ecc71', '#e67e22', '#c0392b'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
    assetForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const assetName = document.getElementById('assetName').value;
        const assetAmount = parseFloat(document.getElementById('assetAmount').value);
        const dateAdded = new Date().toLocaleDateString(); 
        fetch('http://localhost:8080/addAsset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `name=${encodeURIComponent(assetName)}&amount=${encodeURIComponent(assetAmount)}`
        })
        portfolioChart.data.labels.push(assetName);
        portfolioChart.data.datasets[0].data.push(assetAmount);
        portfolioChart.update();
        pieChart.data.labels.push(assetName);
        pieChart.data.datasets[0].data.push(assetAmount);
        pieChart.update();
        const totalBalance = portfolioChart.data.datasets[0].data.reduce((acc, value) => acc + value, 0);
        document.getElementById('total-balance').textContent = `₹${totalBalance.toFixed(2)}`;
        const transactionList = document.getElementById('transaction-list');
        const row = document.createElement('tr');
        row.innerHTML = `<td>${assetName}</td><td>${dateAdded}</td><td>₹${assetAmount.toFixed(2)}</td>`;
        transactionList.appendChild(row);
        assetForm.reset();
});
    document.getElementById('logout').addEventListener('click', function () {
        alert('You have been logged out.'); 
        window.location.href = 'signin.html'; 
    });
});
