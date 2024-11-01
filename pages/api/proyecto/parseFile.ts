import type { NextApiRequest, NextApiResponse } from 'next';
import { processProyectoLines } from '../../utils/proyectoFileReader';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    const content:any = [];

    if (req.method !== 'POST') {
      return res.status(500).json({ error: 'There is no method for this endpoint'});
    }

    req.on('data', (data) => {
      content.push(data);
    });
  
    req.on('end', () => {
      const buffer = Buffer.concat(content);
  
      const decoder = new TextDecoder('windows-1252');
      const fileContent = decoder.decode(buffer);
  
      const lines = fileContent.split('\n');

      try {
        const result = processProyectoLines(lines);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ error: 'Error parsing the file' });
      }
    });

    req.on('error', (err) => {
        console.error(err);
        res.status(500).json({ error: 'Error processing the file' });
      });
}

export default handler;
