import { loginForm } from './authentication.js';
import { retriveData } from './queryData.js';
import { displayStats } from './graphPage.js';

// Check if there is a token
if (localStorage.getItem('jwToken')) {
    try {
        // Check if the token is correct and fetch user and transaction data
        const { userData, transactionsData } = await retriveData();
        
        // Validate userData and transactionsData
        if (userData && transactionsData) {
            displayStats(userData, transactionsData);
        } else {
            throw new Error('User data or transaction data is missing.');
        }
    } catch (error) {
        console.error('Error retrieving data:', error.message);
        localStorage.removeItem('jwToken'); 
        location.reload();
    }
} else {
    loginForm();
}
