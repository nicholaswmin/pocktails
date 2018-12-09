# Pocktails

> Real-time JSON Models

Define Models on the Server & manipulate them on the Client.

The Models auto-sync with all other connected clients & changes are persisted
on server.

This is just a silly prototype. Don't use this in production.

## Usage Example

The following example illustrates a real-time, collaborative & persistent
Todo List with pocktails:

### Server

```javascript
// Pass `io` as an initialized socket.io instance.
const pocktails = new Pocktails(io)

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

  pocktails.addEventListener('handshake', () => {
    // logs the 'todos' model defined on server:
    console.log(pocktails.models.todos)
  })

  // Edit existing todo:
  pocktails.set('todos', 'items.1.content', 'Get Beer')

  // Add a new todo:
  pocktails.push('todos', 'items', {
    id: '84car114-xxrh-8873-9vt2-3a4x4d99rtx1',
    content: 'Get Eggs'
  })

  // Optionally, remove the 1st (pre-existing) todo:
  pocktails.splice('todos', 'items', 0, 1)
</script>
```

- Changes auto-sync across all connected clients.
- Changes are persisted on-disk. Restarting the server revives the Todo List as
  it was before the server was stopped.

## Run Examples

Run above example (and others):

```bash
$ npm run examples
# and visit http://localhost:3000/examples
```

## Authors

@nicholaswmin
