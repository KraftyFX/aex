type Serializable = Project | CompItem | Layer | Property<any>;

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
