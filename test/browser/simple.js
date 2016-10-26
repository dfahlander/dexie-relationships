import assert from 'assert'
const DexieRelationships = require('../../src/index.js')

describe('simple', function () {
    var Promise = Dexie.Promise;
    var db = new Dexie('bands-simple', {addons: [DexieRelationships]});
    db.version(1).stores({
        bands: `
            id,
            name`,
        albums: `
            id,
            name,
            bandId -> bands.id,
            year`
    });
    
    beforeEach(function() {
        return db.delete().then(()=>db.open()).then(function() {
            return db.transaction('rw', db.bands, db.albums, ()=>{
                // Bands
                db.bands.bulkAdd([{
                    id: 1,
                    name: 'Beatles'
                },{
                    id: 2,
                    name: 'Abba'
                }])
                
                // Albums
                db.albums.bulkAdd([{
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
        })
    })

    describe('sample', function () {
        it('should be possible to retrieve an entity with a collection of referring entities attached to it', function () {
            return db.bands.where('name').equals('Beatles').with({
                albums: 'albums'
            }).then (bands => {
                assert.deepEqual([{
                    id: 1,
                    name: 'Beatles',
                    albums: [{
                        id: 1,
                        name: 'Abbey Road',
                        year: 1969,
                        bandId: 1
                    }, {
                        id: 2,
                        name: 'Let It Be',
                        year: 1970,
                        bandId: 1
                    }]
                }], bands)
            })
        })
    })
})
