import axios from 'axios';
import { Alert } from 'react-native';

// Helper function for API calls

const baseUrl = 'http://18.221.29.249:10030/user/';

const apiCall = async ({ url, method = 'GET', data = null, params = null }) => {
  try {
    const config = {
      method,
      url: `${baseUrl}${url}`, // Concatenate base URL with endpoint
      ...(data && { data }),
      ...(params && { params }),
    };

    const response = await axios(config);

    // console.log('afdsafasd',response);
    

    if (response.data.succeeded) {
      return response.data.ResponseBody; // Return the response body
    } else {
      Alert.alert('Error', response.data.ResponseMessage || 'Unknown error occurred');
      return null;
    }
  } catch (error) {
    console.error('API Error:', error);
    Alert.alert('Error', 'Something went wrong with the API call');
    return null;
  }
};

export default apiCall;
