import { PREMIUM_TIERS } from './planets';

// Constants
const API_ENDPOINT = 'https://api.gravitas.app'; // Production endpoint (would be different in dev)
const PAYMENT_ENDPOINTS = {
  VERIFY: '/api/payments/verify',
  CHECK_STATUS: '/api/payments/status',
  WEBHOOK: '/api/payments/webhook',
};

/**
 * Payment verification service to handle Stripe and PayPal payments
 * with server-side verification
 */
class PaymentService {
  constructor() {
    // Check if we have an active session token
    this.token = localStorage.getItem('gravitas_payment_token') || null;
    this.userId = localStorage.getItem('gravitas_user_id') || this._generateUserId();
    this.activePlan = localStorage.getItem('gravitas_premium_plan') || PREMIUM_TIERS.FREE;

    // Initialize validation state
    this._validateStoredToken();
  }

  /**
   * Generate a unique user ID for tracking payment status
   * In a real app, this would be a proper auth system
   */
  _generateUserId() {
    const userId = 'user_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('gravitas_user_id', userId);
    return userId;
  }

  /**
   * Validate the stored token with the server
   */
  async _validateStoredToken() {
    if (!this.token) return;

    try {
      const response = await fetch(`${API_ENDPOINT}${PAYMENT_ENDPOINTS.CHECK_STATUS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: this.token,
          userId: this.userId
        }),
      });

      if (!response.ok) {
        // Token is invalid, clear local storage
        this._clearPaymentData();
        return false;
      }

      const data = await response.json();
      if (data.valid && data.plan) {
        this.activePlan = data.plan;
        localStorage.setItem('gravitas_premium_plan', data.plan);
        return true;
      } else {
        this._clearPaymentData();
        return false;
      }
    } catch (error) {
      console.error('Error validating payment token:', error);
      return false;
    }
  }

  /**
   * Clear all payment data from local storage
   */
  _clearPaymentData() {
    localStorage.removeItem('gravitas_payment_token');
    localStorage.removeItem('gravitas_premium_plan');
    this.token = null;
    this.activePlan = PREMIUM_TIERS.FREE;
  }

  /**
   * Initiate a payment process and return the URL to redirect to
   * @param {string} plan - The premium tier to purchase
   * @param {string} method - Payment method ('paypal' or 'stripe')
   * @returns {Promise<string>} - URL to redirect to for payment
   */
  async initiatePayment(plan, method = 'paypal') {
    try {
      // In development, we'll use a simulation for testing
      if (process.env.NODE_ENV === 'development') {
        return this._simulatePaymentFlow(plan, method);
      }

      // In production, we would call the actual payment gateway
      const planAmount = this._getPlanAmount(plan);
      const response = await fetch(`${API_ENDPOINT}${PAYMENT_ENDPOINTS.VERIFY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId,
          plan: plan,
          amount: planAmount,
          method: method
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate payment');
      }

      const data = await response.json();

      // Return the payment URL where the user should be redirected
      return data.paymentUrl;
    } catch (error) {
      console.error('Error initiating payment:', error);
      throw error;
    }
  }

  /**
   * Get the amount for a given plan in EUR
   * @param {string} plan - The premium tier
   * @returns {number} - Amount in EUR
   */
  _getPlanAmount(plan) {
    switch (plan) {
      case PREMIUM_TIERS.BASIC:
        return 2.00;
      case PREMIUM_TIERS.PLUS:
        return 4.00;
      case PREMIUM_TIERS.EXPLORER:
        return 7.00;
      default:
        return 0;
    }
  }

  /**
   * Development-only method to simulate payment flow
   * @param {string} plan - The premium tier to purchase
   * @param {string} method - Payment method
   * @returns {Promise<string>} - URL for payment (in this case the PayPal sandbox)
   */
  async _simulatePaymentFlow(plan, method) {
    const planAmount = this._getPlanAmount(plan);

    // For PayPal, in a real implementation we would use PayPal's SDK
    if (method === 'paypal') {
      const baseUrl = 'https://www.sandbox.paypal.com/checkoutnow';
      const params = new URLSearchParams({
        token: `EC-DEMO-${Date.now()}`,
        useraction: 'commit'
      });

      // Store a temporary payment intent in localStorage for simulation
      localStorage.setItem('gravitas_payment_intent', JSON.stringify({
        plan,
        amount: planAmount,
        createdAt: new Date().toISOString(),
        paymentId: `PAYPAL-${Date.now()}`
      }));

      return `${baseUrl}?${params.toString()}`;
    }

    // For Stripe
    if (method === 'stripe') {
      const stripeSessionUrl = 'https://checkout.stripe.com/c/pay/demo';

      // Store a temporary payment intent in localStorage for simulation
      localStorage.setItem('gravitas_payment_intent', JSON.stringify({
        plan,
        amount: planAmount,
        createdAt: new Date().toISOString(),
        paymentId: `STRIPE-${Date.now()}`
      }));

      return stripeSessionUrl;
    }

    throw new Error('Unsupported payment method');
  }

  /**
   * Verify payment after user returns from payment gateway
   * @param {Object} params - Payment parameters from the redirect
   * @returns {Promise<Object>} - Payment verification result
   */
  async verifyPayment(params) {
    try {
      // In development, simulate verification
      if (process.env.NODE_ENV === 'development') {
        return this._simulateVerification();
      }

      // In production, verify with server
      const response = await fetch(`${API_ENDPOINT}${PAYMENT_ENDPOINTS.VERIFY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId,
          ...params
        }),
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      const data = await response.json();

      // If verification successful, store the token
      if (data.success) {
        this.token = data.token;
        this.activePlan = data.plan;
        localStorage.setItem('gravitas_payment_token', data.token);
        localStorage.setItem('gravitas_premium_plan', data.plan);
      }

      return data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  /**
   * Development-only method to simulate payment verification
   * @returns {Promise<Object>} - Simulated verification result
   */
  async _simulateVerification() {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        // Get the stored payment intent
        const paymentIntent = JSON.parse(localStorage.getItem('gravitas_payment_intent') || '{}');

        if (!paymentIntent.plan) {
          resolve({
            success: false,
            message: 'No pending payment found'
          });
          return;
        }

        // Generate a fake verification token
        const token = `VERIFIED-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

        // Store the token and plan
        this.token = token;
        this.activePlan = paymentIntent.plan;
        localStorage.setItem('gravitas_payment_token', token);
        localStorage.setItem('gravitas_premium_plan', paymentIntent.plan);

        // Clear the payment intent
        localStorage.removeItem('gravitas_payment_intent');

        resolve({
          success: true,
          plan: paymentIntent.plan,
          token: token,
          message: 'Payment verified successfully'
        });
      }, 1500); // Simulate 1.5s delay
    });
  }

  /**
   * Get the current active plan
   * @returns {string} - The active premium tier
   */
  getActivePlan() {
    return this.activePlan;
  }

  /**
   * Check if the user has an active subscription
   * @returns {boolean} - True if the user has any premium plan
   */
  hasPremiumAccess() {
    return this.activePlan !== PREMIUM_TIERS.FREE;
  }

  /**
   * Check if the user has access to a specific plan
   * @param {string} requiredPlan - The plan to check access for
   * @returns {boolean} - True if the user has access to the specified plan
   */
  hasAccessToPlan(requiredPlan) {
    const planValues = Object.values(PREMIUM_TIERS);
    const currentPlanIndex = planValues.indexOf(this.activePlan);
    const requiredPlanIndex = planValues.indexOf(requiredPlan);

    // User has access if their plan index is >= required plan index
    return currentPlanIndex >= requiredPlanIndex;
  }
}

// Create and export a singleton instance
const paymentService = new PaymentService();
export default paymentService;
