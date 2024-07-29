document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');
    const tableBody = document.getElementById('table-body');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.querySelector('.username').value;
        let password = document.querySelector('.password').value;
        let link = document.querySelector('.link').value;

        // Ensure the link includes the protocol
        if (!link.startsWith('http://') && !link.startsWith('https://')) {
            link = 'http://' + link;
        }

        if (username && password && link) {
            // Generate the password
            password = generatePassword(password);

            // Add the new entry to the table
            const newRow = createTableRow(username, password, link);
            tableBody.appendChild(newRow);

            // Save to local storage
            saveEntriesToLocalStorage();

            // Clear input fields after saving
            document.querySelector('.username').value = '';
            document.querySelector('.password').value = '';
            document.querySelector('.link').value = '';
        } else {
            alert('Please fill out all fields');
        }
    });

    function createTableRow(username, password, link) {
        const newRow = document.createElement('tr');
        newRow.classList.add('row');
        
        newRow.innerHTML = `
            <td class="table-Data">
                ${username}
                <i class="fa-solid fa-copy copy-username btn cursor-pointer" data-username="${username}"></i>
            </td>
            <td class="table-Data">
                <input type="password" class="password-input outline-none hover:bg-[#97e8c5]" value="${password}" readonly>
                <i class="fa fa-eye toggle-password cursor-pointer"></i>
                <i class="fa-solid fa-copy copy-password btn cursor-pointer" data-password="${password}"></i>
                </td>
            <td class="table-Data table-button">
                <a href="${link}" class="links" target="_blank"><i class="fa-solid fa-globe"></i></a>
            </td>
            <td class="table-Data table-button">
                <i class="delete-btn delete fa-solid fa-trash"></i>
            </td>
        `;

        newRow.querySelector('.delete-btn').addEventListener('click', () => {
            newRow.remove();
            saveEntriesToLocalStorage();
        });

        return newRow;
    }

    function generatePassword(userInput) {
        const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';
        const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numericChars = '0123456789';

        function getRandomChar(charSet) {
            const randomIndex = Math.floor(Math.random() * charSet.length);
            return charSet[randomIndex];
        }

        function getRandomCharacters() {
            const special = getRandomChar(specialChars);
            const upper = getRandomChar(upperChars);
            const numeric = getRandomChar(numericChars);
            return special + upper + numeric;
        }

        let result = getRandomCharacters(); // Before user input

        for (let i = 0; i < userInput.length; i += 3) {
            result += userInput.substr(i, 3);
            if (i + 3 < userInput.length) {
                result += getRandomCharacters(); // After every 3 characters
            }
        }

        // If the input length is a multiple of three, add one more set of random characters
        result += getRandomCharacters();

        return result;
    }

    function saveEntriesToLocalStorage() {
        const entries = [];
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const username = row.querySelector('td:nth-child(1)').textContent;
            const password = row.querySelector('td:nth-child(2) .password-input').value;
            const link = row.querySelector('td:nth-child(3) a').href;
            entries.push({ username, password, link });
        });
        localStorage.setItem('entries', JSON.stringify(entries));
    }

    function loadEntriesFromLocalStorage() {
        const entries = JSON.parse(localStorage.getItem('entries')) || [];
        entries.forEach(entry => {
            const { username, password, link } = entry;
            const newRow = createTableRow(username, password, link);
            tableBody.appendChild(newRow);
        });
    }

    // Load entries from local storage on page load
    loadEntriesFromLocalStorage();

    // Handle password visibility toggle
    tableBody.addEventListener('click', (event, password) => {
        if (event.target.classList.contains('toggle-password')) {
            const passwordInput = event.target.previousElementSibling;
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                event.target.classList.add('fa-eye-slash');
                event.target.classList.remove('fa-eye');
                document.querySelectorAll('.password-input').forEach((element) => {
                    const entries = JSON.parse(localStorage.getItem('entries')) || [];
                    entries.forEach(entry => {
                        const password = entry;
                        var lenth = Object.values(entry)[1]
                        var length = lenth.length + 3
                        // console.log(length)
                        element.classList.toggle(`w-[${length}%]`);
                    });
                });
            } else {
                passwordInput.type = 'password';
                event.target.classList.add('fa-eye');
                event.target.classList.remove('fa-eye-slash');
                document.querySelectorAll('.password-input').forEach((element) => {
                    const entries = JSON.parse(localStorage.getItem('entries')) || [];
                    entries.forEach(entry => {
                        const password = entry;
                        var lenth = Object.values(entry)[1]
                        var length = lenth.length + 3
                        // console.log(length)
                        element.classList.toggle(`w-[${length}%]`);
                    });
                });
            }
            } else if (event.target.classList.contains('copy-username')) {
                const username = event.target.getAttribute('data-username');
                copyToClipboard(username);
                // alert('Username copied to clipboard!');
            } else if (event.target.classList.contains('copy-password')) {
                const password = event.target.getAttribute('data-password');
                copyToClipboard(password);
                // alert('Password copied to clipboard!');
            }

    });
    function copyToClipboard(text) {
        const tempInput = document.createElement('input');
        tempInput.style.position = 'absolute';
        tempInput.style.left = '-9999px';
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    }

    function handleButtonClick(event) {
        const target = event.target;
        const row = tableBody.querySelectorAll('tr');
        if (target.classList.contains('delete')) {
            const order = target.closest('row');
            order.remove();
            saveEntriesToLocalStorage();
        }
    }

    document.querySelectorAll('.delete').forEach((element) => {
        element.addEventListener('click', handleButtonClick);
    })
});


