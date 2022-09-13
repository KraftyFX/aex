# What is aex?

An easy to use JSON Serializer and Deserializer for Adobe After Effects.

# Inspiration

Have you ever wanted to manipulate the AE DOM with a human readable JSON blob instead of the scripting API? If so, AEX is for you!

# Features

-   Converts _most_ of the AE DOM to human readable JSON **and back**.
-   Can create or update projects, comps, layers, and properties.
-   Separates out text for easy reading and updating.

## Example

```javascript
//@include "./libs/aequery.jsx";
//@include "./libs/json2.jsx";
//@include "./aex.jsx";

const aexProject = aex.get(app.project).object;

// TODO(zlovatt): Come up with a better sample
aexProject.footage.comps[0].layers[1].markers[2].comment = 'OMG, that was easy!';

// Update the current project with it.
aex.update(app.project, aexProject);
```

# Installation

There are 2 ways to work with AEX. Directly by downloading and including the library as a .jsx file, or using a package manager like `yarn`.

## Direct usage instructions

Download the latest release from [the Releases page](./releases) page. Unzip it and look at the sample project.

> **Note**: you don't need to download this repo to **use** AEX! Most of this codebase is for developing and [contributing to AEX](#contributing); stick to the Releases linked above.

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
var aexProject = getResult.object; // 'object' contains the serializable JSON

/**
  TODO(zlovatt): Add a sample blob that isn't too long
*/

aeq.writeFile(JSON.stringify(aexProject, null, 3));
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
| `"create"`         | Create it.                                     |
| `"skip"`           | Skip over it.                                  |
| `"log"`            | Log it and continue.                           |
| `"throw"`          | Stop processing and throw an error.            |
| _`callback(item)`_ | Raise a callback so you can decide what to do. |

TODO: Layers

TODO: Markers

## `aex.prescan(aeThing, options?)`

Similar behavior as `get()` (but not identical) but gives an _approximate_ count of all the items.

This is useful if you're writing a tool and want to make a progress bar.

```javascript
var prescanResult = aex.prescan(app.project);
```

TODO: Finish

# Unsupported AE Features

This is a list of currently-unsupported AE features. Some are only supported one-way and can be only serialized (layer stretch, trackers, rotobrush, puppet pin data), though most of this list won't work either direction at this point.

|                           Feature                           |                                                                                                 DOM API                                                                                                 | Serialize | Deserialize |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| Viewer                                                      | [`app.activeViewer`](https://ae-scripting.docsforadobe.dev/other/viewer.html)                                                                                                                           | X         | X           |
| Render Queue                                                | [`app.project.renderQueue`](https://ae-scripting.docsforadobe.dev/renderqueue/renderqueue.html)                                                                                                         | X         | X           |
| Footage Items                                               | [`app.project.item(index)`](https://ae-scripting.docsforadobe.dev/items/footageitem.html)                                                                                                               | X         | X           |
| Proxies                                                     | [`...item(index).proxySource`](https://ae-scripting.docsforadobe.dev/items/avitem.html#avitem-proxysource)                                                                                              | X         | X           |
| Guides                                                      | [`...item(index).guides`](https://ae-scripting.docsforadobe.dev/items/item.html#item-guides)                                                                                                            | X         | X           |
| Selected Layers                                             | [`...item(index).selectedLayers`](https://ae-scripting.docsforadobe.dev/items/compitem.html#compitem-selectedlayers)                                                                                    | X         | X           |
| Selected Properties                                         | [`...item(index).selectedProperties`](https://ae-scripting.docsforadobe.dev/items/compitem.html#compitem-selectedproperties)                                                                            | X         | X           |
| Comp Essential Properties                                   | _(not API-accessible)_                                                                                                                                                                                  | X         | X           |
| Layer Essential Properties                                  | _(not API-accessible)_                                                                                                                                                                                  | X         | X           |
| Stretch                                                     | [`...layer(index).stretch`](https://ae-scripting.docsforadobe.dev/layers/layer.html#layer-stretch)                                                                                                      | ✔         | X           |
| Trackers                                                    | `...layer(index).property('ADBE MTrackers')`                                                                                                                                                            | ✔         | X           |
| Rotobrush                                                   | `...property("ADBE Effect Parade").property("ADBE Samurai")`                                                                                                                                            | ✔         | X           |
| Puppet Pins                                                 | `...property("ADBE Effect Parade").property("ADBE FreePin3")`                                                                                                                                           | ✔         | X           |
| Dropdown Expression Control item names                      | `...property("ADBE Effect Parade").property("Dropdown Menu Control")`                                                                                                                                   | X         | X           |
| Effect layer-selector "source/mask/effects & mask" dropdown | _n/a_; see #19                                                                                                                                                                                          | X         | X           |
| Custom Property types (levels, curves, colorama, gradients) | [`PropertyValueType.CUSTOM_VALUE`](https://ae-scripting.docsforadobe.dev/properties/property.html#property-propertyvaluetype); see [Unsupported Property Behaviour](#optionsunspportedpropertybehavior) | X         | X           |

# Contributing

See [contributing.md](./CONTRIBUTING.md) for details.

# License

MIT
