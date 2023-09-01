import axios from "axios";

export default class ArticleService {
    constructor(){

    }

   async getArticles() {
        const options = {
        method: 'GET',
        url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/auto-complete',
        params: {
            q: 'stock',
            region: 'get-insights'
        },
        headers: {
            'X-RapidAPI-Key': 'c122176910msh710ad63b6fd09eap1458d4jsn21633a9c7180',
            'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
        }
        };
        
        try {
            const response = await axios.request(options);
            return response.data.news
        } catch (error) {
            throw error
        }
    }
}