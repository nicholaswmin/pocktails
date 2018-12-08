# Pocktails

> Real-time JSON Models

WIP, details pending.

## Usage Example

### Server

```javascript
const pocktails = new Pocktails(io) // io is an initialized socket.io instance.

pocktails.defineModel('todos', {
  items: [
    // Init a good-first todo:
    { id: '64bbd83a-b1ed-4254-9aee-1e4e6d85fdb7', content: 'Get Milk' }
  ]
})

// Revive model from previous disk-persisted operations:
pocktails.revive()
```

### Client

```html
<script src="node_modules/pocktails/sdk/pathval.js"></script>
<script src="node_modules/pocktails/sdk/sdk.js"></script>
<script>
  const pocktails = new Pocktails()

  // Add a new todo:
  pocktails.push('todos', 'items', {
    id: '84car114-xxrh-8873-9vt2-3a4x4d99rtx1',
    content: 'Get Eggs'
  })

  // Edit newly-added todo:
  pocktails.set('todos', 'items.1.content', 'Get Beer')

</script>
```

- Changes should sync across all connected clients.
- Pocktails persists the operations on-disk, so restarting the server should
revive the Todo List as it was before the server was stopped.

## Run Demo

There's a Todo List demo using pocktails in `/demo`.

Add/Remove todos, all tabs should sync immediately. Restarting the server
should keep the last todo list since the operations are persisted on disk &
revived on startup.

```bash
$ npm run demo
# and visit http://localhost:3000/demo
```

## Authors

@nicholaswmin
