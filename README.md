# This is an obsidian redirector

Not all software allows links to anything besides the `http://` or `https://` protocol. Via this page you can redirect to `obisidian://` in the browser. 

# Usage

There are two ways to construct the redirect URL.

**Option 1** — replace the `obsidian://open` part with the host:

```
obsidian://open?vault=notes&file=example-file
```

becomes:

```
https://obsidian-redirector.github.io/?vault=notes&file=example-file
```

**Option 2** — pass the full Obsidian URL via the `?o=` parameter:

```
https://obsidian-redirector.github.io/?o=obsidian://open?vault=notes&file=example-file
```

You can now share either URL anywhere you want and it will still open in Obsidian (might prompt you to allow opening Obsidian).

**Option 3** — use the `/open/` path directly:

```
https://obsidian-redirector.github.io/open/?vault=notes&file=example-file
```

# Local development

To test locally, run from the project directory:

```bash
npx serve .
```

Then open:

```
http://localhost:3000/?vault=notes&file=example-file
```

or:

```
http://localhost:3000/?o=obsidian://open?vault=notes&file=example-file
```

or:

```
http://localhost:3000/open/?vault=notes&file=example-file
```
