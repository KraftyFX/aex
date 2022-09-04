# What is aex?

An easy to use JSON Serializer and Deserializer for Adobe After Effects.

# Inspiration

Do you ever templatize AEPs? Do you hate dealing with the complex AE DOM and wish it didn't need 20 years of experience to do it right? Are you a script author and simply want to make better/robust tools that work in AE?

# Features

-   Converts most of the AE DOM to JSON and back. Not just shape layers! The [Lottie](https://lottiefiles.com/plugins/after-effects) on steroids
-   Create or apply the JSON on top of an existing project, comp, layer or property.
-   Can prescan and count the comps/layers/properties/keys/etc so you can make a progress bar for your tool.
-   Separates out the text for easy mapping to a spreadsheet.
-   Simplifies shape layer vector groups for easier manipulation.

# Installation

There are 2 ways to work with AEX. Directly or using a package manager like `yarn`.

## Direct usage instructions

Download the latest release. Unzip it and look at the sample project.

## Package manager instructions

Download the latest release and look at the sample project.

```bash
$ yarn add ....
```

# Usage

Aex has 4 major functions

**`aex.get(aeThing, options?)`**

`get()` lets you convert a `project`, `comp`, `layer`, `property` to JSON.

You can provide an `options` object to override some of the behaviors. Here's an overview of the default values.

```javascript
get(app.project, {
    unspportedPropertyBehavior: 'skip', // Skips any property that aex can't deserialize.
});
```

**`aex.create()`**

TODO

**`aex.update()`**

TODO

**`aex.prescan()`**

TODO
