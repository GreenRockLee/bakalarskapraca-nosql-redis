const csv = require('csv-parser')
const fs = require('fs')
const Redis = require("ioredis");
const redis = new Redis();

var domainCount = 0;

//data separator
var s = fs.createReadStream('data/domains.txt')
    .pipe(csv({
        skipComments: '--',
        separator: ';'
    }))
    .on('data', (data) => {
        // Set top level domain.
        // Get 'domena' from data object, remove '.sk' from end.
        domain = data['domena'].replace(/\.sk$/, '$');

        // spomeúť že využívame Sorted sets!!!
        var args = [
            'autocomplete'
        ];
        // Here we parse word - for example 'auto'
        // - a (0,1)
        // - au (0,2)
        // - aut (0,3)
        // - auto (0,4)
        for (l = 1; l <= domain.length; l++) {
            args.push(0);
            args.push(domain.substring(0, l));
        }
        // console.log(args);
        redis.zadd(args);

        domainCount++;
    })
    .on('end', () => {
        console.log(`>>> All ${domainCount} domains processed...`);
    })
    .on('close', () => {
        console.log(`>>> ${domainCount} domains processed, stream destroyed...`);
    })


