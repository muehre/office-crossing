import path from 'path'
import express from 'express'

const app = express(),
    DIST_DIR = path.join(__dirname, '..', '..'),
    HTML_FILE = path.join(DIST_DIR, 'index.html');


app.use(express.static(DIST_DIR));
app.use("/assets", express.static('assets'));

app.get('*', (req, res) => {
    res.sendFile(HTML_FILE)
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`);
    console.log('Press Ctrl+C to quit.')
});