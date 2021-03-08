type Serializable = Project | CompItem | Layer | Property;

interface AexOptions {}

interface AexProject {
    comps: AexComp[];
}

interface AexComp {
    layers: AexLayer[];
}

interface AexLayer {
    props: {}[];
}
