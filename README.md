[![Build Status](https://travis-ci.org/ignasbernotas/dexie-relationships.svg?branch=master)](https://travis-ci.org/ignasbernotas/dexie-relationships)

Dexie.js relationship plugin
========

Dexie.js is a wrapper library for indexedDB - the standard database in the browser.

Dexie relationship plugin provides an API to ease the loading of relational data from foreign tables

Installation
========

npm:
```
npm install dexie-relationships --save
```

bower:
```
bower install dexie-relationships --save
```

API Example
========

#### Schema
Note the use of `->` which sets the foreign keys.

```javascript
import Dexie from 'dexie'
import relationships from 'dexie-relationships'

var db = new Dexie('MusicBands', {addons: [relationships]})

db.version(1).stores({
    genres: 'id, name',
    bands: 'id, name, genreId -> genres.id',
    albums: 'id, name, bandId -> bands.id, year'
});

```

#### Seed the data

```javascript
db.transaction('rw', db.bands, db.albums, db.genres, () => {
    // Genres
    db.genres.bulkPut([{
        id: 1,
        name: "Rock"
    },{
        id: 2,
        name: "Schlager"
    }])

    // Bands
    db.bands.bulkPut([{
        id: 1,
        name: 'Beatles',
        genreId: 1
    },{
        id: 2,
        name: 'Abba',
        genreId: 2
    }])
    
    // Albums
    db.albums.bulkPut([{
        id: 1,
        name: 'Abbey Road',
        year: 1969,
        bandId: 1
    }, {
        id: 2,
        name: 'Let It Be',
        year: 1970,
        bandId: 1
    }, {
        id: 3,
        name: 'Super Trouper',
        bandId: 2,
        year: 1980
    }, {
        id: 4,
        name: 'Waterloo',
        bandId: 2,
        year: 1974
    }])
})
```

#### Usage

```javascript
db.bands
  .where('name').startsWithAnyOf('A', 'B') // can be replaced with your custom query
  .with({albums: 'albums', genre: 'genreId'}) // makes referred items included
  .then(bands => {
      // Let's print the result:
      bands.forEach (band => {
          console.log (`Band Name: ${band.name}`)
          console.log (`Genre: ${band.genre.name}`)
          console.log (`Albums: ${JSON.stringify(band.albums, null, 4)}`)
      });
})
```

*NOTE: The properties that are set onto the result ('albums' and 'genre' in this case)
will not be visible when callilng JSON.stringify(band), because
they are marked as non-enumerable. The reason for this is to prevent the properties to be
redundantly stored back to the database if calling `db.bands.put(band)`.*

#### Result

```
Band Name: Abba
Genre: Schlager
Albums: [
    {
        "id": 3,
        "name": "Super Trouper",
        "bandId": 2,
        "year": 1980
    },
    {
        "id": 4,
        "name": "Waterloo",
        "bandId": 2,
        "year": 1974
    }
]
Band Name: Beatles
Genre: Rock
Albums: [
    {
        "id": 1,
        "name": "Abbey Road",
        "year": 1969,
        "bandId": 1
    },
    {
        "id": 2,
        "name": "Let It Be",
        "year": 1970,
        "bandId": 1
    }
]
```
