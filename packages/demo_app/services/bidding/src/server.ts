import express from 'express';

const app = express();

app.use((_, res) => res.json({ hello: 'world' }));

app.listen(3000, () => console.log('✅ Listening at http://localhost:3000/'));
