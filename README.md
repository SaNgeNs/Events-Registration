# Events-Registration

### `Everything is implemented except for sorting events by organizer`

### [Site](https://events-registration-blush.vercel.app/events/)

### How to start a project locally:
1) `npm run install:all`

2) In the frontend folder create an `.env` file with

`VITE_BASE_API_URL=`***`YOU_API_URL`***

3) In the backend folder create an .env file with

`DATABASE_URL=`***`MONGO_API_KEY`*** - [MongoDB Cloud Services](https://www.mongodb.com/products/platform/cloud)

`TICKETMASTER_API_KEY=`***`API_KEY`*** - [Ticketmaster](https://developer.ticketmaster.com/)

4) In the backedn folder, run the command `npm run init-db` to create the database and fill it with initial data

5) `npm run dev`

**frontend** - `http://localhost:5173/`

**backend** - `http://localhost:3000/`

##### In order to run a script to receive events from *Ticketmaster*, you need to run the command `npm run fetch-events`
