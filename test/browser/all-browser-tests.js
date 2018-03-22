import assert from 'assert'
import DexieRelationships from '../../src/index'

describe('simple', function () {
  var Promise = Dexie.Promise;
  var db = new Dexie('bands-simple', {addons: [DexieRelationships]});
  db.version(1).stores({
    genres: `
            id,
            name`,
    bands: `
            id,
            name,
            genreId -> genres.id`,
    albums: `
            id,
            name,
            bandId -> bands.id,
            year`
  });

  beforeEach(function() {
    return db.delete()
      .then(()=>{
        return db.open();
      }).then(()=> {
        return db.transaction('rw', db.bands, db.albums, db.genres, ()=>{
          // Genres
          db.genres.bulkAdd([{
            id: 1,
            name: "Rock"
          },{
            id: 2,
            name: "Schlager"
          }])

          // Bands
          db.bands.bulkAdd([{
            id: 1,
            name: 'Beatles',
            genreId: 1
          },{
            id: 2,
            name: 'Abba',
            genreId: 2
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
          }, {
            id: 5,
            name: 'No band',
            bandId: null,
            year: 1974
          }])
        })
      })
  })

  describe('many-to-one', function () {
    it('should be possible to retrieve an entity with a collection of referring entities attached to it', function () {
      return db.bands.where('name').equals('Beatles').with({
        albums: 'albums'
      }).then (bands => {
        assert(bands.length == 1, "Should be one Beatles")
        let beatles = bands[0]
        assert(!!beatles.albums, "Should have got the foreign albums collection")
        assert(beatles.albums.length === 2, "Should have 2 albums in this db")
        assert(beatles.albums[0].name === "Abbey Road", "First albums should be 'Abbey Roead'")
        assert(beatles.albums[1].name === "Let It Be", "Second album should be 'Let It Be'")
      })
    })
  })

  describe('one-to-one', ()=> {
    it('should be possible to retrieve entity with a foreign key to expand that foreign key', ()=>{
      return db.albums.where('year').between(1970, 1974, true, true).with ({
        band: 'bandId'
      }).then (albums => {
        assert (albums.length === 3, "Should retrieve three albums between 1970 to 1974")
        let letItBe = albums[0],
          waterloo = albums[1],
          noBand = albums[2];
        assert (letItBe.name === "Let It Be", "First album should be 'Let It Be'")
        assert (!!letItBe.band, "Should get the band resolved with the query")
        assert (letItBe.band.name === "Beatles", "The band should be Beatles")

        assert (waterloo.name === "Waterloo", "Second album should be 'Waterloo'")
        assert (!!waterloo.band, "Should get the band resolved with the query")
        assert (waterloo.band.name === "Abba", "The band should be Abba")

        assert (noBand.name === "No band")
        assert (!noBand.band, null)
      })
    })
  })

  describe('one-to-many', () => {
    it('should add association to all records when more than one record has the same association', ()=>{
      return db.albums.with ({
        band: 'bandId'
      }).then (albums => {
        assert (albums.length === 5, "Should retrieve five albums")

        let bandIds = [1, 1, 2, 2, null];

        albums.map((album, idx) => {
          if (bandIds[idx] !== null) {
            assert(album.band != null, "Album should have a band")
            assert(album.band.id === bandIds[idx], "Each album should be assigned the correct band")
          } else {
            assert(!album.band, "Album should not have a band")
          }
        })
      })
    })
  })

  describe('Multiple foreign keys of different kind', ()=>{
    it('Should be possible to retrieve entities with oneToOne as well as manyToOne relations', ()=> {
      return db.bands.where('name').equals('Beatles').with({
        albums: 'albums',
        genre: 'genreId'
      }).then (bands => {
        assert(bands.length == 1, "Should be one Beatles")
        let beatles = bands[0]
        assert(!!beatles.albums, "Should have got the foreign albums collection")
        assert(beatles.albums.length === 2, "Should have 2 albums in this db")
        assert(beatles.albums[0].name === "Abbey Road", "First albums should be 'Abbey Roead'")
        assert(beatles.albums[1].name === "Let It Be", "Second album should be 'Let It Be'")
        assert(!!beatles.genre, "Should have got the foreign genre entity")
        assert(beatles.genre.name === "Rock", "The genre should be 'Rock' (even though that could be questionable)");
      })
    })
  })

  describe('Navigation properties should be non-enumerable', () => {
    it('should be possible to put back an object to indexedDB after ' +
      'having retrieved it with navigation properties ' +
      'without storing the navigation properties redundantly',
      ()=>{
        return db.bands.where('name').equals('Abba').with({albums: 'albums', genre: 'genreId'})
          .then(bands => {
            assert(bands.length === 1, "Should be one Abba");
            let abba = bands[0]
            assert (!!abba.albums, "Abba should have its 'albums' foreign collection")
            assert (!!abba.genre, "Abba should have its 'genre' foreign property")
            abba.customProperty = "Hello world"
            return db.bands.put(abba)
          }).then(()=>{
            return db.bands.where('name').equals('Abba').first()
          }).then(abba => {
            assert(!abba.albums, "Abba should not have the 'albums' foreign collection stored redundantly")
            assert(!abba.genre, "Abba should not have the 'genre' foreign property stored redundantly")
          })
      })
  })

  describe('Sample from README', ()=> {
    it('should be possible to copy and paste the sample from README', ()=>{
      return db.bands
        .where('name').startsWithAnyOf('A', 'B')
        .with({albums: 'albums', genre: 'genreId'}) // Resolves foreign keys into props
        .then(rows => {
          // Print the result:
          rows.forEach (band => {
            console.log (`Band Name: ${band.name}`)
            console.log (`Genre: ${band.genre.name}`)
            console.log (`Albums: ${JSON.stringify(band.albums, null, 4)}`)
          });
        }).then(()=>{
          assert (true, "Promise resolved and no exception occured")
        }).catch (ex => {
          assert (false, "Something went wrong: " + (ex.stack || ex))
        })
    })
  })
})
