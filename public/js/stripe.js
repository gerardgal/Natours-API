/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_51KPt70Am2jVeMMNtxOiF3xC64KVmAdhzw2qiq6hxzdKQrxMfuPPYksWHm6bgkZKCZ9a7fUrH2NAxbFnSSSULcxBA00nk6Z1dwZ');

export const bookTour = async tourId => {
  try {
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // Checkout form
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
