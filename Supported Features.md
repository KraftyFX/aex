# Supported Features

This list aims to provide an overview of supported & unsupported AE features in AEX.

For supported features, the intention isn't full granularity but instead a wider understanding of what is and isn't capable (ie listing "Basic Attributes" instead of "height, width, name, label colour, duration, frameRate" etc for items, layers, comps, and so on.)

For unsupported features, there are various reasons _why_ an AE feature is unsupported. Generally, these fall into the below categories. When applicable, a feature will be linked to a corresponding [Github Issue](./issues).

## Lacking AE API Support (🚫)

AE currently doesn't have any way to perform this action via scripting, and so AEX is also limited.

## Partial AE API Support (⚠)

Some facets of this are supported, others aren't; see ticket for details.

## Out of Scope (❌)

These features are currently not seen as valuable to the AEX project, and are deliberately omitted.

If you feel anything on this list would be of value, [please open a Github Issue to discuss](./issues)!

## Wishlist (🌠)

Technically possible and in-scope, but require substantial work to complete.

---

## AE Feature List

|  App   | Get | Create | Update |
| ------ | --- | ------ | ------ |
| Viewer | ❌   | ❌      | ❌      |

|     Project      | Get | Create | Update |
| ---------------- | --- | ------ | ------ |
| Basic Attributes | ✔   | ✔      | ✔      |
| Folders          | ✔   | ✔      | ✔      |
| Render Queue     | ❌   | ❌      | ❌      |

|                Items                 | Get | Create | Update |
| ------------------------------------ | --- | ------ | ------ |
| Basic Attributes                     | ✔   | ✔      | ✔      |
| Comps                                | ✔   | ✔      | ✔      |
| Placeholders                         | ✔   | ✔      | ✔      |
| Solids                               | ✔   | ✔      | ✔      |
| Files & Footage ([#55](./issues/55)) | ⚠   | ⚠      | ⚠      |
| Proxies                              | ❌   | ❌      | ❌      |

|                   Comps                   | Get | Create | Update |
| ----------------------------------------- | --- | ------ | ------ |
| Basic Attributes                          | ✔   | ✔      | ✔      |
| 3d Renderer Settings                      | ✔   | ✔      | ✔      |
| Markers                                   | ✔   | ✔      | ✔      |
| Essential Properties ([#56](./issues/56)) | 🚫   | 🚫      | 🚫      |
| Guides                                    | ❌   | ❌      | ❌      |
| Selected Layers                           | ❌   | ❌      | ❌      |
| Selected Properties                       | ❌   | ❌      | ❌      |

|                   Layer                   | Get |        Create        |        Update        |
| ----------------------------------------- | --- | -------------------- | -------------------- |
| Basic Attributes                          | ✔   | ✔                    | ✔                    |
| Audio                                     | ✔   | ✔                    | ✔                    |
| Effects (see Effects limitations)         | ✔   | ✔                    | ✔                    |
| Layer Styles                              | ✔   | ✔                    | ✔                    |
| Markers                                   | ✔   | ✔                    | ✔                    |
| Masks                                     | ✔   | ✔                    | ✔                    |
| Parents & Track Mattes                    | ✔   | ✔                    | ✔                    |
| Time Remap                                | ✔   | ✔                    | ✔                    |
| Transform (2d & 3d)                       | ✔   | ✔                    | ✔                    |
| Text Style (Most features)                | ✔   | ⚠ [#53](./issues/53) | ⚠ [#53](./issues/53) |
| Stretch                                   | ✔   | 🌠 [#54](./issues/54) | 🌠 [#54](./issues/54) |
| Essential Properties ([#56](./issues/56)) | 🚫   | 🚫                    | 🚫                    |

|                               Effects                                |         Get          | Create | Update |
| -------------------------------------------------------------------- | -------------------- | ------ | ------ |
| Layer Trackers                                                       | ✔                    | 🚫      | 🚫      |
| Puppet Pin                                                           | ✔                    | 🚫      | 🚫      |
| Rotobrush                                                            | ✔                    | 🚫      | 🚫      |
| Dropdown Expression Control – Item Names                             | 🚫 [#19](./issues/19) | ✔      | ✔      |
| Effects with custom UIs (Levels, Colorama, etc) ([#57](./issues/57)) | 🚫                    | 🚫      | 🚫      |
| Layer Selector – Effect Input Layer Options ([#58](./issues/58))     | 🚫                    | 🚫      | 🚫      |

|                              Properties                               | Get | Create | Update |
| --------------------------------------------------------------------- | --- | ------ | ------ |
| Expressions                                                           | ✔   | ✔      | ✔      |
| Temporal & Spatial Easing                                             | ✔   | ✔      | ✔      |
| Keyframe Label Colour                                                 | 🌠   | 🌠      | 🌠      |
| Selected Keyframes                                                    | ❌   | ❌      | ❌      |
| Custom Properties (`PropertyValue.CUSTOM_VALUE`) ([#57](./issues/57)) | 🚫   | 🚫      | 🚫      |
