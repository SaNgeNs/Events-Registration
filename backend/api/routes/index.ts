import { Router } from 'express';
import eventRoute from './events';
import userRoute from './users';
import referralSourceRoute from './referral-source';

const apiRouter = Router();

apiRouter.get('/events', eventRoute.list);
apiRouter.get('/events/:id', eventRoute.one);

apiRouter.get('/events/:id/users', userRoute.list);
apiRouter.post('/events/:id/users', userRoute.registration);
apiRouter.get('/events/:id/users/statistics', userRoute.statistics);

apiRouter.get('/referral-source', referralSourceRoute.list);

export default apiRouter;