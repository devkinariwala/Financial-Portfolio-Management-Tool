document.addEventListener('DOMContentLoaded', function () {
    const signInForm = document.querySelector('form');
    const netIdInput = document.getElementById('netid');
    const passwordInput = document.getElementById('password');
    signInForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const netId = netIdInput.value;
        const password = passwordInput.value;
        if (!netId || !password) {
            alert('Please enter both SRM Net ID and Password.');
            return;
        }
        fetch('http://localhost:3000/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                netid: netId,
                password: password,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Signed in successfully!') {
                alert('Signed in successfully! Redirecting to home page...');
                window.location.href = 'index.html'; 
            } else {
                alert('Invalid SRM Net ID or Password.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while signing in.');
        });
    });
    document.getElementById('togglePassword').addEventListener('click', function () {
        const passwordInput = document.getElementById('password');
        const eyeIcon = this.querySelector('i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text'; 
            eyeIcon.classList.remove('fa-eye'); 
            eyeIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password'; 
            eyeIcon.classList.remove('fa-eye-slash'); 
            eyeIcon.classList.add('fa-eye');
        }
    });
});