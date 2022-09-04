# What is aex?

An easy to use JSON Serializer and Deserializer for Adobe After Effects.

# Inspiration

Have you ever wanted to manipulate the AE DOM with a human readable JSON blob instead of the scripting API? If so, AEX is for you!

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

AEX has 4 major functions. Creating project elements from JSON, reading them, updating them, and scanning them to get some statistics.

## `aex.get(aeThing, options?)`

`get` converts an AE `project`, `comp`, `layer`, `property` to a AEX JSON object.

You can provide an optional `options` object to modify the behavior. Here's an overview of the **default** values.

```javascript
var getResult = aex.get(app.project, {
    unspportedPropertyBehavior: 'skip',
});
```

### Sample Usage

```javascript
var getResult = aex.get(app.project);

aeq.writeFile(getResult.object); // 'object' contains the usable JSON
```

### `options.unspportedPropertyBehavior`

In AE there might not be a scriptable way to read a property or reasonably update it. When such a property is encountered you can tell aex what to do through the `unspportedPropertyBehavior` option.

| Value                | Behavior                              |
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

var updateResult = aex.update(app.project, aexProjectWithMarkers);
```

You can provide an optional `options` object to tune the behavior. Here's an overview of the **default** values.

```javascript
var updateResult = aex.update(app.project, exProject, {
    projectItemMismatchBehavior: 'create',
    layerMatchBy: 'index',
    markerMatchBy: 'index',
});
```

### `updateOptions.projectItemMismatchBehavior`

If a project is being updated AEX tries to match the project items by the item name. If an item with a matching name isn't found you can tell AEX what to do through the `projectItemMismatchBehavior` option.

| Value                | Behavior                              |
| -------------------- | ------------------------------------- |
| `create`             | Create it.                            |
| `skip`               | Skip over it.                         |
| `log`                | Add it to the log                     |
| `throw`              | Stop processing and throw an error    |
| `callback(logEntry)` | Raise a callback to decide what to do |

TODO: Layers

TODO: Markers

## `aex.prescan(aeThing, options?)`

Similar behavior as `get()` (but not identical) but gives an _approximate_ count of all the items.

This is useful if you're writing a tool and want to make a progress bar.

```javascript
var prescanResult = aex.prescan(app.project);
```

TODO: Finish

# Contributing

See [contributing.md](./CONTRIBUTING.md) for details.

# License

MIT
