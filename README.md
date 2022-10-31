# What is aex?

An easy to use JSON Serializer and Deserializer for Adobe After Effects.

# Inspiration

Have you ever wanted to manipulate the AE DOM with a human readable JSON blob instead of the scripting API? If so, AEX is for you!

# Features

-   Converts _most_ of the AE DOM to human readable JSON **and back**.
-   Can create or update projects, comps, layers, and properties.

## Example

```javascript
//@include "./libs/aequery.jsx";
//@include "./libs/json2.jsx";
//@include "./aex.jsx";

const aexProject = aex.get(app.project).object;

aexProject.footage.comps[0].layers[1].markers[2].comment = 'OMG, that was easy!';

// Update the current project with it.
aex.update(app.project, aexProject);
```

# Installation

There are 2 ways to work with AEX. Directly by downloading and including the library as a .jsx file, or using a package manager.

## Direct usage instructions

Download the latest release from [the Releases page](../../releases) page. Unzip it and look at the sample project.

> **Note**: you don't need to download this repo to **use** AEX! Most of this codebase is for developing and [contributing to AEX](#contributing); stick to the Releases linked above.

## Package manager

This is not supported yet but is expected to be available soon.

---

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

/**
 * Contents of getResult.object:
    {
      "name": "Camera Comp",
      "aexid": "camera comp:1",
      "duration": 4,
      "frameRate": 60,
      "height": 720,
      "width": 1280,
      "type": "aex:item:av:comp",
      "layers": [
        {
          "name": "My Cool Camera",
          "label": 4,
          "transform": {
            "position": {
              "type": "aex:property:threed",
              "matchName": "ADBE Position",
              "value": [640, 360, -1777.7778]
            },
            "pointOfInterest": {
              "type": "aex:property:threed",
              "matchName": "ADBE Anchor Point",
              "value": [100, 200, 300]
            }
          },
          "type": "aex:layer:camera"
        }
      ]
    }
**/

aeq.writeFile('project.json', JSON.stringify(getResult, null, 3));
```

If `aex.get()` is called on an item with pre-comps they'll get serialized into the return value and duplicate references will be smartly combined. This applies to nested pre-comps as well.

### `options.unspportedPropertyBehavior`

In AE there might not be a scriptable way to read a property or reasonably update it. When such a property is encountered you can tell aex what to do through the `unspportedPropertyBehavior` option.

| Value                | Behavior                              |
| -------------------- | ------------------------------------- |
| `skip`               | Skip over it.                         |
| `throw`              | Stop processing and throw an error    |
| `callback(logEntry)` | Raise a callback to decide what to do |

## `aex.create(aeParentThing, aexChildBlob)`

`create` takes an element of the AE DOM and adds a child to it described by an aex JSON object.

### Sample Usage

```javascript
// An aex blob that describes a 3D camera layer
var aexLayer = {
    type: 'aex:layer:camera',
    label: 4,
    name: 'Camera',
    transform: {
        position: {
            type: 'aex:property:threed',
            matchName: 'ADBE Position',
            name: 'Position',
            value: [640, 360, -1777.7778],
        },
    },
};

// Create the camera layer on the current comp
aex.create(app.project.activeItem, aexLayer);
```

| `aeParent` Type | Allowed `aexChildBlob` Type                   |
| --------------- | --------------------------------------------- |
| `Project`       | `AexComp` or `AexItem`                        |
| `Comp`          | `AexLayer `                                   |
| `Layer`         | `AexProperty`                                 |
| `PropertyGroup` | `AexPropertyGroup` or `AexShapePropertyGroup` |
| `Property`      | `AexKey`                                      |

You can also create from a previously serizlied get call. This is usually necessary when working with serialized AEPs with pre-comp references.

```javascript
var getResult = JSON.parse(aeq.readFile('project.json'));
aex.create(app.project, getResult);

// Note that this would fail because the getResult.object might contain
// pre-comp references and they aren't included in the blob.
aex.create(app.project, getResult.object); // throws
```

## `aex.update(aeThing, aexThingBlob, options?)`

`update` takes an element of the AE DOM and updates with an equivalent aex JSON object.

### Sample Usage

```javascript
// An aex comp blob with a name and a single marker on it.
var aexComp = {
    type: 'aex:item:av:comp',
    name: 'Comp with a marker',
    markers: [
        {
            type: 'aex:marker',
            time: 0.1667,
            duration: 0.2,
        },
    ],
};

// Updates the current comp with what's in the blob above
aex.update(app.project.activeItem, aexComp);
```

You can provide an optional `options` object to tune the behavior. Here's an overview of the **default** values.

```javascript
aex.update(app.project, aexProject, {
    projectItemMismatchBehavior: 'create',
    layerMatchBy: 'index',
    markerMatchBy: 'index',
});
```

### `updateOptions.projectItemMismatchBehavior`

If a project is being updated AEX tries to match the project items by the item name. If an item with a matching name isn't found you can tell AEX what to do through the `projectItemMismatchBehavior` option.

| Value              | Behavior                                       |
| ------------------ | ---------------------------------------------- |
| `create`           | Create it.                                     |
| `skip`             | Skip over it.                                  |
| `throw`            | Stop processing and throw an error.            |
| _`callback(item)`_ | Raise a callback so you can decide what to do. |

TODO: Layers

TODO: Markers

## `aex.prescan(aeThing, options?)`

Similar behavior as `get()` (but not identical) but gives an _approximate_ count of all the items.

This is useful if you're writing a tool and want to make a progress bar that shows the total number of items that will be processed without actually processing them.

---

# Supported Features

AEX doesn't currently support every feature in AE. For information on which features are & aren't supported, see the [Supported Features document](./Supported-Features.md).

---

# Contributing

See [contributing.md](./CONTRIBUTING.md) for details.

# License

MIT
