import axios from "axios"

export interface IInitializeTransaction{
    amount: number;
    email: string;
    matric_no: string;
    description: string;
    reference?: string;
    callback_url?: string;
    metadata?: Record<string, any>
}

export default class Paystack {
    API_URL='https://api.paystack.co';
    API_KEY=process.env.PAYSTACK_SECRET_KEY

    async initializeTransaction(data){
        try {
            
            let response = await axios.post(`${this.API_URL}/transaction/initialize`, data, {
                headers: {
                    Authorization: `Bearer ${this.API_KEY}`,
                    'Content-Type': 'application/json'
                }
            })
    
            return response.data
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async verifyTransaction(reference: string){
        try {
            
            let response = await axios.get(`${this.API_URL}/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${this.API_KEY}`,
                    'Content-Type': 'application/json'
                }
            })
    
            return response.data
        } catch (error) {
            throw new Error(error.message)
        }
    }
}