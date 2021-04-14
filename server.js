const express = require('express');
const app = express();
const port = 5000;
var path = require('path');
const redisAutocomplete = require('./autocomplete');



// Po pripojení na server sa automaticky načíta nami zvolený súbor .html
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

//ak je zavolaná adresa autocomplete tak:
app.get('/autocomplete', async (req, res) => {
    //vypýta si vložené query ktoré odošle do autocomplete.js ako parameter funkcie prefix
    const domainList = await redisAutocomplete(req.query.q);
    //odošle späť získané dáta z databázy
    res.send(JSON.stringify(domainList, null, 2));});

// Ak sa niekto bude dopytovať na adressu ktorú nepozná, vráti 404.
app.get('*', (req, res) => {
    res.status(404).send('404: Page not exists.');
})
// Nastavenie portu na komunikáciu
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});






