import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimService } from '../../../core/services/claim.service';
import { PolicyService } from '../../../core/services/policy.service';
import { AuthService } from '../../../core/services/auth.service';
import { PaymentService } from '../../../core/services/payment.service';
declare var Razorpay: any;

@Component({
  selector: 'app-customer-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-home.component.html',
  styleUrls: ['./customer-home.component.css']
})
export class CustomerHomeComponent implements OnInit {
  @Input() userId!: number;
  
  approvedClaims: any[] = [];
  policyCount: number = 0;
  pendingPolicies: any[] = []; // The Cart Items
  activePoliciesCount: number = 0;
  claimCount: number = 0;
  approvedAmount: number = 0;
  razorpayKey = 'rzp_test_S0LBUfSfKroGEG'; 
  constructor(
    private claimService: ClaimService,
    private policyService: PolicyService,
    private authService:AuthService,
    private paymentService: PaymentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // 1. Get Policies count
    this.policyService.getPoliciesByUserId(this.userId).subscribe(data => {
      this.pendingPolicies = data.filter((p: any) => p.policyStatus === 'PENDING_PAYMENT');
      
      // 2. Stats
      this.activePoliciesCount = data.filter((p: any) => p.policyStatus === 'ACTIVE').length;
      
      this.cdr.detectChanges();
    });

    // 2. Get Claims & Filter for Cart
    this.claimService.getClaimsByUserId(this.userId).subscribe(data => {
      this.claimCount = data.length;
      // Filter Approved for Cart
      this.approvedClaims = data.filter((c: any) => c.claimStatus === 'APPROVED');
      // Calculate Total
      this.approvedAmount = this.approvedClaims.reduce((acc, c) => acc + c.operationCost + c.medicineCost + c.postOpsCost, 0);
      this.cdr.detectChanges();
    });
  }

  payPremium(policy: any) {
    // 1. Call Backend to create Order
    this.paymentService.createOrder(policy.id).subscribe({
      next: (order: any) => {
        // order contains: { secretKey, razorpayOrderId, applicationFee, secretId, currency }
        // based on your RazorPayResponse class
        
        this.openRazorpay(order, policy);
      },
      error: (err) => alert("Failed to initiate payment. " + err.message)
    });
  }

  openRazorpay(order: any, policy: any) {
    const options = {
      "key": this.razorpayKey, 
      "amount": order.amount, // Amount in paise
      "currency": order.currency,
      "name": "InsurePlus",
      "description": "Premium for " + policy.plan.planName,
      "order_id": order.orderId, 
      
      // HANDLER: What happens after success
      "handler": (response: any) => {
        this.verifyPayment(response, policy.id);
      },
      
      "prefill": {
        "name": this.authService.getUserName(), 
        "email": "user@example.com", // You can fetch real email
        "contact": "9999999999"
      },
      "theme": {
        "color": "#4a148c"
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }

  verifyPayment(response: any, policyId: number) {
    // 2. Call Backend to Confirm
    this.paymentService.confirmPayment(
      response.razorpay_order_id,
      response.razorpay_payment_id,
      response.razorpay_signature,
      policyId
    ).subscribe({
      next: (msg) => {
        alert("Payment Successful! Policy Activated.");
        this.loadData(); // Refresh cart
      },
      error: (err) => alert("Payment Verification Failed")
    });
  }
}