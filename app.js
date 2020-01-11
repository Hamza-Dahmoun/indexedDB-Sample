function createMyDB() {
    //this function creates our indexedDB database 'articlesDB'
    var db;

    // Request version 1 of the database.
    var request = window.indexedDB.open("articlesDB", 1);

    // This event handles the event whereby a new version of the
    // database needs to be created. Either one has not been created
    // before, or a new version number has been submitted via the
    // window.indexedDB.open line above.
    request.onupgradeneeded = function (event) {
        db = request.result;

        db.onerror = function (errorEvent) {
            document.body.innerHTML += '<li>Error loading database.</li>';
        };

        //var articlesStore = db.createObjectStore("articles", { keyPath: "id"});
        //var authorsStore = db.createObjectStore("authors", { keyPath: "id"});
        //our DB will have two tables, in each table the key in this table will be incrementing automatically
        var articlesStore = db.createObjectStore("articles", {autoIncrement:true});
        var authorsStore = db.createObjectStore("authors", {autoIncrement:true});

    };

    request.onerror = function (event) {
        document.body.innerHTML += '<li>Error loading database.</li>';
    };

    request.onsuccess = function (event) {
        document.body.innerHTML += '<li>articlesDB Database initialised successfully.</li>';
        db = request.result;
    };
}