# What is aex?

An easy to use JSON Serializer and Deserializer for Adobe After Effects.

# Inspiration

Have you ever wanted to manipulate the AE DOM with as a human readable JSON blob instead of the scripting API? If so, AEX is for you!

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

## `aex.get(aeThing, options?)`

`get` converts an AE `project`, `comp`, `layer`, `property` to a aex JSON object.

You can provide an optional `options` object to tune the behavior. Here's an overview of the **default** values.

```javascript
var getResult = aex.get(app.project, {
    unspportedPropertyBehavior: 'skip', // Skips any property that aex can't deserialize.
});
```

| Value                | Behavior if the item is not found     |
| -------------------- | ------------------------------------- |
| `skip`               | Skip over it.                         |
| `log`                | Add it to the log                     |
| `throw`              | Stop processing and throw an error    |
| `callback(logEntry)` | Raise a callback to decide what to do |

## `aex.create(aeParentThing, aexChildBlob)`

`create` takes an element of the AE DOM and adds a child to it described by an aex JSON object.

| `aeParent` Type | Allowed `aexChildBlob` Type                   |
| --------------- | --------------------------------------------- |
| `Project`       | `AexComp` or `AexItem`                        |
| `Comp`          | `AexLayer `                                   |
| `Layer`         | `AexProperty`                                 |
| `PropertyGroup` | `AexPropertyGroup` or `AexShapePropertyGroup` |
| `Property`      | `AexKey`                                      |

## `aex.update(aeThing, aexThingBlob, options?)`

`update` takes an element of the AE DOM and updates with an equivalent aex JSON object.

You can provide an optional `options` object to tune the behavior. Here's an overview of the **default** values.

```javascript
var updateResult = aex.update(app.project, exProject, {
    projectItemMismatchBehavior: 'create',
    layerMatchBy: 'index',
    markerMatchBy: 'index',
});
```

### Sample Usage

```javascript
var aexProjectWithMarkers = {
    type: 'aex:project',
    comps: [
        {
            type: 'aex:item:av:comp',
            name: 'DetailedMarkers',
            markers: [
                {
                    time: 0.1667,
                    duration: 0.2,
                    type: 'aex:marker',
                },
            ],
        },
    ],
};

aex.update(app.project, aexProjectWithMarkers);
```

### `updateOptions.projectItemMismatchBehavior`

If a project is being updated AEX tries to match the project items by the item name. If an item with a matching name isn't found `projectItemMismatchBehavior` defines what to do. The table below

| Value                | Behavior if the item is not found     |
| -------------------- | ------------------------------------- |
| `create`             | Create it.                            |
| `skip`               | Skip over it.                         |
| `log`                | Add it to the log                     |
| `throw`              | Stop processing and throw an error    |
| `callback(logEntry)` | Raise a callback to decide what to do |

## `aex.prescan(aeThing, options?)`

Similar behavior as `get()` (but not identical) but gives an _approximate_ count of all the items.

This is useful if you're writing a tool and want to make a progress bar.

```javascript
var prescanResult = aex.prescan(app.project);
```

# Contributing

See [contributing.md](./CONTRIBUTING.md) for details.

# License

MIT
