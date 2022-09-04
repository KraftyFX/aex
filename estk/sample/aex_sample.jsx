(function () {
    //@include "./libs/aequery.jsx";
    //@include "./libs/json2.jsx";
    //@include "./aex.jsx";

    var json = aeq.file.readFile('comp.json');
    var aexComp = JSON.parse(json);

    aex.create(app.project, aexComp);
})();
