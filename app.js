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


function storeAuthor() {
    //we'll take user entry and store it in the db
    let authorName = document.getElementById("authorName").value;
    let authorCountry = document.getElementById("authorCountry").value;
    let author = {
        name: authorName,
        country: authorCountry
    };

    var request = window.indexedDB.open("articlesDB", 1);

    request.onsuccess = function (event) {    
        //create db object    
        var db = request.result;        
        //create 'transaction' object
        var myTransaction = db.transaction("authors", "readwrite");
        //link to the table named 'authors'
        var authorsStore = myTransaction.objectStore('authors');
        //create Request Object to add 'author' object to the 'authors' table
        var addRequest = authorsStore.add(author);

        addRequest.onsuccess = function (event) {
            document.body.innerHTML += '<li>New Author Inserted Successfully.</li>';
        }
        addRequest.onerror = function (event) {
            document.body.innerHTML += '<li>Error: New Author Not Inserted.' + event.target.errorCode + '</li>';
        }
    };
    request.onerror = function (event) {
        document.body.innerHTML += '<li>Error when opening DB: ' + event.target.errorCode + '</li>';
    }

}


function getAuthorByID(){
    
}