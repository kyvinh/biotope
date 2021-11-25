// From https://github.com/vercel/next.js/discussions/15453#discussioncomment-989758

import fs from 'fs';
import path from 'path';

export default async function(req, res) {
    const id = req.query.imageId;

    try {
        // TODO should go into DB!
        const filePath = path.join(process.cwd(), `/prisma/seed-assets/${id}.jpg`);
        const imageBuffer = fs.createReadStream(filePath);

        await new Promise(function(resolve) {
            res.setHeader('Content-Type', 'image/jpeg');
            imageBuffer.pipe(res);
            imageBuffer.on('end', resolve);
            imageBuffer.on('error', function(err) {
                // @ts-ignore
                if (err.code === 'ENOENT') {
                    res.status(400).json({
                        error: true,
                        message: 'Sorry we could not find the file you requested!'
                    });
                    res.end();
                } else {
                    res
                        .status(500)
                        .json({ error: true, message: 'Sorry, something went wrong!' });
                    res.end();
                }
            });
        });
    } catch (err) {
        res.status(400).json({ error: true, message: err });
        res.end();
    }
}