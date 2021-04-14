const Redis = require("ioredis");
const redis = new Redis();
const INDEX = 'autocomplete';

//V budúcnosti budem potreba odosielať a prijímať údaje z databázy, potrebujeme si preto zadefinovať nasledujúcu funkciu
// ako konštantu. Vzhľadom na to že sa kód v javascipte vykonáva asynchronne, bude potreba na  určitých miestach zabezpečiť,
// aby sa kód vykonal celý. prefix označuje zadaný text do pola a count koľko výsledkov má vrátiť
const complete = async (prefix, count = 10) => {
    let search = true;
    let results = [];
    let grab = 42;
    //start vráti prvú pouziciu hľadaného prvku
    start = await redis.zrank(INDEX, prefix);

    //ak nič nenajde v&ypíše prázdne pole
    if (!start) {
        return [];
    }

    //console.log(start);
//vypisuj pokiaľ nenaájdeš 10 výsledkov a  pokiaľ má čo hľadať, tak hladá dalej
    while (results.length != count && search) {
        //grab je náhodné čislo ktoré určuje koľko položiek je potrebné získať z databázy
        range = await redis.zrange(INDEX, start, start + grab - 1);
        console.log(range);
        start += grab;

        //zabezpečujeme aby nebežal do nekonečna v prípade že nič nenájde
        if (!range || range.length === 0) {
            break;
        }

        //pokiaľ má najdených 10 položiek už nevyhľadáva dalej
        range.forEach((entry) => {
            if (!entry.startsWith(prefix)) {
                search = false;
                return;
            }
            //prechádza položkami pokiaľ nenájde položku ktorá končí dolárom a vypíše len tie ktoré sa končia dolárom
            if (entry.endsWith('$') && results.length != count) {
                //vloží to do pola
                results.push(entry);
            }
        });
    }
    // console.log('>>>>', results.length, results.map((entry) => entry.replace(/\$$/, '.sk')));
    //vráti položky a nahradí $ za .sk
    return results.map((entry) => entry.replace(/\$$/, '.sk'));
}
//umožní nam funkciu použiť v inom súbore js
module.exports = complete;