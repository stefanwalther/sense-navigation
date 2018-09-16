# Running/Validating the Extension Locally

When making changes to the source code of this extension, you certainly want to validate immediately.  

By using the following instructions, you can validate/run the extension locally **without** having to install Qlik Sense Enterprise/Qlik Sense Desktop locally!!!

## Run the Extension

Run

```
$ make up
```

Open a browser and go to [http://localhost:9076/sense/app/sense-navigation_v1x.qvf](http://localhost:9076/sense/app/sense-navigation_v1x.qvf)

* If you make changes to the extension, just run the command again and refresh the browser window. You'll get the updated extension.
* If you want to destroy the instances of the docker images being created, run `make down`
