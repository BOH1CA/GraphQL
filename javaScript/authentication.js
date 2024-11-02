export function loginForm() {
    const form = document.createElement('form');
    const title = document.createElement('p');
    const inputUser = document.createElement('input');
    const inputPassword = document.createElement('input');
    const submitButton = document.createElement('button');
    
    // Set element attributes
    form.id = 'loginForm';
    title.id = 'title';
    inputUser.id = 'username';
    inputPassword.id = 'password';
    inputUser.type = 'text';
    inputPassword.type = 'password';
    submitButton.type = 'submit';

    // Set element content
    title.textContent = 'GraphQL';
    submitButton.textContent = 'Login';
    inputUser.placeholder = 'Username or Email';
    inputPassword.placeholder = 'Password';
    inputUser.required = true;
    inputPassword.required = true;
    

    // Append elements
    form.append(title, inputUser, inputPassword, submitButton);
    document.body.appendChild(form);

    // Helper to display error message
    const showError = (message) => {
        alert(message);
    };

    // Validate form input
    const validateInput = (username, password) => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
        if (!username || !password) {
            showError('Both fields are required.');
            return false;
        }
        if (!isEmail && username.length < 3) {
            showError('Username must be at least 3 characters or a valid email.');
            return false;
        }
        if (password.length < 4) {
            showError('Password must be at least 6 characters.');
            return false;
        }
        return true;
    };

    // Handle form submission
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = inputUser.value.trim();
        const password = inputPassword.value.trim();

        if (!validateInput(username, password)) {
            return;
        }

        const encodeInfo = btoa(`${username}:${password}`);

        try {
            const response = await fetch('https://01.kood.tech/api/auth/signin', {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${encodeInfo}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Invalid credentials');
                } else {
                    throw new Error('Server error, please try again later');
                }
            }

            const token = await response.json();
            if (!token) {
                throw new Error('Token missing in response');
            }

            localStorage.setItem('jwToken', token);
            location.reload();

        } catch (error) {
            showError(error.message);
        }
    });
}

