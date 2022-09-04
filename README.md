# What is aex?

An easy to use JSON Serializer and Deserializer for Adobe After Effects.

# Inspiration

Have you ever wanted to manipulate the AE DOM with as human readable JSON blob instead of the scripting API? If so, AEX is for you!

# Features

-   Converts _most_ of the AE DOM to human readable JSON **and back**. Think [Lottie](https://lottiefiles.com/plugins/after-effects) on steroids.
-   Can create or update projects, comps, layers, and properties.
-   Separates out text for easy reading and updating.

# Installation

There are 2 ways to work with AEX. Directly or using a package manager like `yarn`.

## Direct usage instructions

Download the latest release. Unzip it and look at the sample project.

## Package manager

Download the latest release and look at the sample project.

```bash
$ yarn add --TBD--
```

# Usage

Aex has 4 major functions

### `aex.get(aeThing, options?)`

`get` converts an AE `project`, `comp`, `layer`, `property` to a aex JSON object.

You can provide an optional `options` object to tune the behavior. Here's an overview of the **default** values.

```javascript
get(app.project, {
    unspportedPropertyBehavior: 'skip', // Skips any property that aex can't deserialize.
});
```

### `aex.create(aeParentThing, aexChildThing)`

`create` takes an element of the AE DOM and adds a child to it described by an aex JSON object.

| `aeParent` Type | Allowed `aexChild` Type                       |
| --------------- | --------------------------------------------- |
| `Project`       | `AexComp` or `AexItem`                        |
| `Comp`          | `AexLayer `                                   |
| `Layer`         | `AexProperty`                                 |
| `PropertyGroup` | `AexPropertyGroup` or `AexShapePropertyGroup` |
| `Property`      | `AexKey`                                      |

### `aex.update(aeThing, aexThing, options?)`

`update` takes an element of the AE DOM and updates with an equivalent aex JSON object.

You can provide an optional `options` object to tune the behavior. Here's an overview of the **default** values.

```javascript
update(app.project, { ... }, {
    projectItemMismatchBehavior: 'create', // If the project doesn't have the equivalent item, create it.
    layerMatchBy: 'index', // When updating an AE layer from AEX, use the index of the array entry to match it.
    markerMatchBy: 'index', // When updating an AE marker from AEX, use the index of the array entry to match it.
});
```

### `aex.prescan()`

TODO
