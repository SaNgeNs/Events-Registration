
import express from 'express';
import cors from 'cors';
import apiRouter from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

if (process.env.IS_DEV_MODE === 'true') {
  app.listen(3000, () =>
    console.log('🚀 Server ready'),
  );
}

export default app;
