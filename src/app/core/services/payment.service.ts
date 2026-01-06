import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  // Assuming Gateway is running on 9000. 
  // If Payment Service is separate, use 8086 or whatever port you configured.
  private apiUrl = 'http://localhost:9000/payment-gateway-service/api/payment'; 

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    };
  }

  // 1. Create Order
  createOrder(policyId: number) {
    // Backend expects: { "policyId": 123 }
    return this.http.post<any>(
      `${this.apiUrl}/cart/create`, 
      { policyId: policyId }, 
      this.getHeaders()
    );
  }

  // 2. Confirm Payment
    confirmPayment(orderId: string, paymentId: string, signature: string, policyId: number) {
        let params = new HttpParams()
            .set("razorpay_order_id", orderId)
            .set("razorpay_payment_id", paymentId)
            .set("razorpay_signature", signature)
            .set("policyId", policyId);

        const options = {
        headers: this.getHeaders().headers, // <--- ADD THIS
        params: params, 
        responseType: "text" as "json" // Angular hack for text response
    };

    return this.http.post(
        `${this.apiUrl}/confirm`,
        null,
        options
    );
  }


}