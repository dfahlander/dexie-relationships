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
db.version(1).stores({
  projects: '++id',
  project_settings: '++id, project_id -> projects.id',
  project_members: '++id, project_id -> projects.id'
})
```

#### Seed the data

```javascript
db.projects.add({name: 'Project #1'})
db.projects.add({name: 'Project #2'})

db.project_settings.add({name: 'Setting #1', project_id: 1})
db.project_settings.add({name: 'Setting #2', project_id: 2})
db.project_settings.add({name: 'Setting #3', project_id: 1})

db.project_members.add({name: 'Member #1', project_id: 1})
db.project_members.add({name: 'Member #2', project_id: 2})
db.project_members.add({name: 'Member #3', project_id: 1})
```

#### Usage

```javascript
db.with({
  'settings': 'project_settings',
  'members': 'project_members'
}).then(rows => console.log(rows))
```

#### Result

```json
[  
  {  
    "name":"Project #1",
    "id":1,
    "settings":[  
      {  
        "name":"Setting #1",
        "project_id":1,
        "id":1
      },
      {  
        "name":"Setting #3",
        "project_id":1,
        "id":3
      }
    ],
    "members":[  
      {  
        "name":"Member #1",
        "project_id":1,
        "id":1
      },
      {  
        "name":"Member #3",
        "project_id":1,
        "id":3
      }
    ]
  },
  {  
    "name":"Project #2",
    "id":2,
    "settings":[  
      {  
        "name":"Setting #2",
        "project_id":2,
        "id":2
      }
    ],
    "members":[  
      {  
        "name":"Member #2",
        "project_id":2,
        "id":2
      }
    ]
  }
]
```
