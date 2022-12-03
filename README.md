# Description
This website is currently deployed with Cyclic and is available at: [Natours-gerard](https://natours-gerard.cyclic.app)

<p align="center">
    <img src="https://github.com/gerardgal/Natours-API/blob/main/public/img/screenshots/Home.jpg" alt="Home Page" />
</p>

## Applied technologies

- NodeJS / Express.
- MongoDB / Mongoose ODM.
- JWT / Bcrypt.
- Stripe / Sendgrid.
- Pug Templates / Parcel bundler.

## What can you do in this version?

- Register a new account.
- Modify your account settings.
- See all available tours.
- Book a tour!
- Check your bookings.

## How to 'pay' for a tour?

<p> This app uses Stripe payments webhook in order to process and checkout all bookings.
The transaction is made within a test enviroment so no charges are applied. </p>
<p> In order to pay for a tour you just need to enter 4242 4242 4242 4242 as the card number, any expiration date in the future and any CVC. </p>

## API Documentation

In order to test all the endpoints available , click [here](https://documenter.getpostman.com/view/15232621/UVksLtaP) to access the API Postman documentation.
