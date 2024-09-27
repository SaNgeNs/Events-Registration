
import express from 'express';
import cors from 'cors';
import eventRoute from './routes/events';
import userRoute from './routes/users';
import referralSourceRoute from './routes/referral-source';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/events', eventRoute.list);
app.get('/events/:id', eventRoute.one);

app.get('/events/:id/users', userRoute.list);
app.post('/events/:id/users', userRoute.registration);
app.get('/events/:id/users/statistics', userRoute.statistics);

app.get('/referral-source', referralSourceRoute.list);

app.listen(3000, () =>
  console.log('🚀 Server ready'),
);
