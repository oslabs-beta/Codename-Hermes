import type { NextApiRequest, NextApiResponse } from 'next';

function getResponse (req: NextApiRequest , res: NextApiResponse ) {
  if (req.method === 'POST') {
    console.log('route hit POST')
    const { newBid } = req.body;
    // console.log(currBid,id,newBid, 'This is the backend seen');
    
    res.status(201).json(newBid)
  }
}

export default getResponse