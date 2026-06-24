import 'dotenv/config';
import express from 'express';
import { config } from './config';
import { AuthRouter, CharactersRouter, SaveRouter } from './routes';

const app = express();
app.use(express.json());

app.use('/auth', AuthRouter);
app.use('/characters', CharactersRouter);
app.use('/internal', SaveRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(config.PORT, '0.0.0.0', () => {
  console.log(`Server running on 0.0.0.0:${config.PORT}`);
});
