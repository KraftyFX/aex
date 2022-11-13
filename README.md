# AEX

JSON serializer and deserializer for objects in Adobe After Effects

> **Warning**
> This project is in pre-release. This means it's buggy and future versions will have breaking changes. We'll try to avoid breaking changes where possible and explain the details in the release notes.

## Why

Creating and manipulating objects in After Effects requires writing a lot of ExtendScript. AEX aims to simplify this process by giving you easy to manipulate JSON objects that can then be stored, updated and returned to After Effects.

It's great for templating AE project files; save a project to JSON, manipulate it and recreate the project from that JSON.

## Example

```js
// Serialize a native object to JSON
const aexProject = aex.get(app.project).object;
// Change values in the JSON object
aexProject.footage.comps[0].layers[1].markers[2].comment = 'OMG, that was easy!';
// And update the current project with it
aex.update(app.project, aexProject);
```

## Features

-   Converts _most_ of the AE DOM to human readable JSON and back
-   Creates or updates projects, comps, layers, and properties

> **Warning**
> AEX currently doesn't support every feature in AE. Check the [supported features](./Supported-Features.md).

## Installation

Download the [the latest release](../../releases). After unzipping have a look at [aex_sample.jsx](./estk/sample/aex_sample.jsx) on how to include it in your script.

> **Note**
> Currently you can only use AEX by downloading the latest release. It will soon be available on NPM.

## API

AEX converts between native AE types and their equivalent AEX type.

Unlike the AE DOM the AEX types are all simple properties. When working with shape layers the vector data is less nested and simpler to iterate over.

| AE Type Type     | Equivalent AEX Type                           |
| ---------------- | --------------------------------------------- |
| `Project`        | `AexProject`                                  |
| `Comp` or `Item` | `AexComp` or `AexItem`                        |
| `Layer`          | `AexLayer `                                   |
| `Property`       | `AexProperty`                                 |
| `PropertyGroup`  | `AexPropertyGroup` or `AexShapePropertyGroup` |
| `Key`            | `AexKey`                                      |

### Get

`aex.get(aeObject, options?)`

`get` converts an AE `project`, `comp`, `layer` or `property` to an equivalent AEX JSON object.

> **Note**
> TODO: Needs clarification

If `get` is called on an item with pre-comps they'll get serialized and duplicates will be combined. This applies to nested pre-comps as well.

#### Usage

```js
var getResult = aex.get(app.project);
aeq.writeFile('project.json', JSON.stringify(getResult, null, 3));
```

<details>
  <summary>Result</summary>
  
  ```json
  {
    "type": "aex:item:av:comp",
    "name": "Camera Comp",
    "aexid": "camera comp:1",
    "duration": 4,
    "frameRate": 60,
    "height": 720,
    "width": 1280,
    "layers": [
      {
        "type": "aex:layer:camera",
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
        }
      }
    ]
  }
```
</details>

#### Options

You can provide an optional `options` object to tune the behavior. `'skip'` is the _default_ value.

```js
var getResult = aex.get(app.project, {
    unspportedPropertyBehavior: 'skip',
});
```

#### `options.unspportedPropertyBehavior`

In AE there might not be a scriptable way to read a property or reasonably update it. When such a property is encountered you can tell AEX what to do through the `unspportedPropertyBehavior` option.

| Value                | Behavior                              |
| -------------------- | ------------------------------------- |
| `skip`               | Skip over it                          |
| `throw`              | Stop processing and throw an error    |
| `callback(logEntry)` | Raise a callback to decide what to do |

### Create

`aex.create(aeParentObject, aexChildObject)`

`create` allows you to add an AEX object to an AE object. This effectively creates the item in AE.

#### Usage

```js
// An `aex` object that describes a 3D camera layer
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
// Create the camera layer in the current comp
aex.create(app.project.activeItem, aexLayer);
```

> **Note**
> TODO: Needs clarification

You can also create from a previously serialized get call. This is usually necessary when working with serialized AE projects with pre-comp references.

```js
var getResult = JSON.parse(aeq.readFile('project.json'));
aex.create(app.project, getResult);
// Note that this would fail because the getResult.object might contain
// pre-comp references and they aren't included in the JSON.
aex.create(app.project, getResult.object); // throws
```

#### Allowed Types

| `aeParent` Type | Allowed `aexChild` Type                       |
| --------------- | --------------------------------------------- |
| `Project`       | `AexComp` or `AexItem`                        |
| `Comp`          | `AexLayer `                                   |
| `Layer`         | `AexProperty`                                 |
| `PropertyGroup` | `AexPropertyGroup` or `AexShapePropertyGroup` |
| `Property`      | `AexKey`                                      |

### Update

`aex.update(aeObject, aexObject, options?)`

`update` takes an AE object and updates it with an equivalent AEX object.

#### Usage

```js
// An `aex` comp object with a name and a single marker on it.
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
// Updates the current comp with the values in the `aexComp` object
aex.update(app.project.activeItem, aexComp);
```

#### Options

You can provide an optional `options` object to tune the behavior. Here's an overview of the _default_ values.

```js
aex.update(app.project, aexProject, {
    projectItemMismatchBehavior: 'create',
    layerMatchBy: 'index',
    markerMatchBy: 'index',
});
```

#### `updateOptions.projectItemMismatchBehavior`

If a project is being updated AEX tries to match the project items by the item name. If an item with a matching name isn't found you can tell AEX what to do through the `projectItemMismatchBehavior` option.

| Value              | Behavior                                       |
| ------------------ | ---------------------------------------------- |
| `create`           | Create it.                                     |
| `skip`             | Skip over it.                                  |
| `throw`            | Stop processing and throw an error.            |
| _`callback(item)`_ | Raise a callback so you can decide what to do. |

> **Note**
> TODO: Add value/behaviour table for `layerMatchBy`

> **Note**
> TODO: Add value/behaviour table for `markerMatchBy`

### Prescan

`aex.prescan(aeObject, options?)`

Similar behavior to [`get`](#aexgetaeobject-options), but instead it gives an _approximate_ count of all the items.

This is useful if you want to display a progress bar that shows the total number of items without actually processing them.

#### Options

Same as [`get`](#options)

## Contributing

See [contributing.md](./CONTRIBUTING.md) for details.
