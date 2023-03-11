import type { NextApiRequest, NextApiResponse } from 'next';

function getResponse (req: NextApiRequest , res: NextApiResponse ) {
  if (req.method === 'POST') {
    console.log('route hit POST')
    const comment = req.body.comment;
    const newComment = {
      id: Date.now(),
      text: comment
    }
    res.status(201).json(comment)
  }
}

export default getResponse