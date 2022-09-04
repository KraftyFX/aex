(function () {
    //@include "./libs/aequery.jsx";
    //@include "./libs/json2.jsx";
    //@include "./aex.jsx";

    var comp = app.project.activeItem;

    var filePath = 'comp.json';
    var aexData = aeq.file.readFile(filePath);
    var parsed = JSON.parse(aexData);

    aex().create(comp, parsed);
})();
