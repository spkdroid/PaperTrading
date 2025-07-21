import axios from 'axios';

const API_URL = 'https://spkdroid.com/stock/api.php';

export const fetchStocks = async () => {
    try {
        console.log('Fetching stocks...'); // Add this line
        const response = await axios.get(API_URL);
        console.log('API Response:', response.data); // Add this line
        return response.data;
    } catch (error) {
        console.error('Error fetching stocks:', error);
        throw error;
    }
};