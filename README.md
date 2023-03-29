# Fohn-ui js package

Javascript package for Fohn-Ui PHP framework.

### Install via cdn:

This the default installation when using Fohn-Ui PHP framework. 

```
<script type="application/javascript" src="https://unpkg.com/fohn-ui@{VERSION}/dist/fohn-ui.min.js"></script>
```

### Install locally:

You may want to create your own custom javascript integration to Fohn-Ui. Therefore, you would need 
a local copy in order to build your own release. Then have Fohn-Ui to load your local copy instead 
of the cdn version.

Clone the git repository and install.

```
git clone https://github.com/Fohn-Group/fohn-js.git
cd fohn-js
npm install
```

Adjust the webpack.config.js outputDir value to where you want build file to be placed.

```
module.exports = (env) => {
  
  const isProduction = env.production || env.distribution;
  const srcDir = path.resolve(__dirname, './src');
  const outputDir = PATH_TO_PUBLIC_FOLDER;
    // rest of configuraiton
}
```

Run development mode ``npm run dev`` or production mode `npm run build`

### Install within your own package.

If you need to include this package within your own, you can simply install via npm.

```
npm install fohn-ui
```

In order to be able to use existing Fohn-ui js component, jquery plugin or service, the package will need
to export the fohn library for Fohn-Ui php framework.

```
import fohn from 'fohn-ui';

const myLib = {
    fohn: fohn,
}

export default myLib;
```

Then in Fohn-Ui php framework simply set up the Ui service jsLibrary property:

```
Ui::service()->jsLibrary = 'myLib.fohn';
```

#### Note:
Fohn uses jQuery as an external library. In order to work correctly, you will need to add the 
external property to your package build in webpack.config.js.

```
module.exports = {
    // Webpack config.
    externals: { jQuery: 'jQuery'},
}
```

### Getting package version

Calling this function in your custom js script or in console will output the package version number.
```
    fohn.version();
```

### Services 

All services are export via the fohn global object. You can access them via fohn.serviceName.
Certain functionalities are offered from these services. 

For example, if one of your script need to send an ajax request directly, you could use the apiService.processRequestResponse
to run and evaluate the server response from Fohn-Ui.

```
    $.getJSON( "myajax.php", function( resp ) {
      fohn.apiService.processRequestResponse(resp);
     });

```

Another example would be the upload service for file uploading using one of your script.

```
    fohn.uploadService.uploadFiles(
      filesArraytoUpload,
      theElement,
      {data: 'value'},
      url,             
      onComplete(){}, // the callback function when upload is complete.
      onXhr(){}       // the callback function when uploading files is in progress.
    );
```

### jQuery plugin

The fohn global object may be used as a quick way of registering a jQuery plugin under the fohn namespace.

Let's create a new jQuery plugin that will change every selected dom element text color to green.

```
    fohn.registerPlugin('Greenify', function(el) {
        $(el).css("color", "green");
    }, false, myNameSpace)
```

The plugin can now by invoke using:

```
    // Change all div color text to green.
    $('div').myNameSpaceGreenify();
```
