# Building the Project/Extension

There are two different configurations to build the project:

- A `dev` build
- A `release` build, to be used in productions (includes minifying your files and a lot of other useful tasks) 

***sense-navigation*** uses [sense-go]() as a build tool. But since this is all handled by a docker image, you don't really have to care about that.

## Create a `dev` build

Run 

```
$ make build
# or 
# npm run build
```

The following artifacts will have been updated/created:
* The `./build/dev` directory
* The `./build/sense-navigation_dev.zip` file

### Create a `release` build

Run 
```
$ make build
# or 
# npm run build
```

The following artifacts will have been updated/created:

* The `./build/release` directory
* The `./build/sense-navigation_latest.zip` file
* The `./build/sense-navigation_%ver%.zip` file (`ver` is based on `version` from the `package.json` file)


## Further Information

- [sense-go](https://github.com/stefanwalther/sense-go)