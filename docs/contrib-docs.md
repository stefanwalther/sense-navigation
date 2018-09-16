# Building the Docs

To update the `README.md` file a tool called `verb` is used.  
But basically you don't have to care about it, just follow a few simple rules:

- Do not change the `README.md` file.
- Instead do changes in the `.verb.md` file and in all related *.md file in the `./docs` directory.
- Then just run `make gen-readme`
  - This will use [`docker-verb`](https://github.com/stefanwalther/docker-verb) to update the `README.md` file.
