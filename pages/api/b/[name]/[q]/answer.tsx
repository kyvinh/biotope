export default async function handler(req, res) {

    // Check request and params

    if (req.method !== 'POST') {
        res.status(400).send({ message: 'Only POST requests allowed' })
        return
    }

    const biotopeName = req.query.name;
    const questionnaireId = req.query.q;

    console.log('Body', req.body)
}