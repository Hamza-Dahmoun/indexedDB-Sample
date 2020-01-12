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
        var authorsStore = db.createObjectStore("authors", { keyPath: "id" });
        //our DB will have two tables, in each table the key in this table will be incrementing automatically
        //var articlesStore = db.createObjectStore("articles", { autoIncrement: true });
        //var authorsStore = db.createObjectStore("authors", { autoIncrement: true });

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
    let authorId = "";
    fetchGuidPromis().then(
        function (response) {
            authorId = response;
            let author = {
                id: authorId,
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
    ).catch((err) => { alert(err) }
    );
}


function getAuthorByID() {
    let authorNumber = document.getElementById("authorNumber").value;
    var request = window.indexedDB.open("articlesDB", 1);
    request.onsuccess = function (event) {
        //create db object    
        var db = request.result;
        //create 'transaction' object
        var myTransaction = db.transaction("authors", "readwrite");
        //link to the table named 'authors'
        var authorsStore = myTransaction.objectStore('authors');
        //create Request Object to get 'author' object to the 'authors' table
        //var getRequest = authorsStore.get(parseInt(authorNumber));//this functions returns the author object without the key
        var getRequest = authorsStore.get(parseInt(authorNumber));

        getRequest.onsuccess = function (event) {
            if (event.target.result === undefined) {
                //author not found
                document.body.innerHTML += '<li>author not found</li>';
            }
            else {
                document.body.innerHTML += '<li> Author Name: ' + event.target.result.name + " - Author Country: " + event.target.result.country + /*' - Author ID: ' + event.target.result.id +*/ '</li>';
                //alert("his key is: " + event.target.result.getKey());
            }
        }
        getRequest.onerror = function (event) {
            document.body.innerHTML += '<li>Error: Author Not Fetched. ' + event.target.errorCode + '</li>';
        }
    };
    request.onerror = function (event) {
        document.body.innerHTML += '<li>Error when opening DB: ' + event.target.errorCode + '</li>';
    }
}

function fetchGuidPromis() {
    // Return a new promise.
    return new Promise(function (resolve, reject) {
        let url = "https://helloacm.com/api/guid-generator/?n=1&braces&nohyphens&uppercase";
        fetch(url, {
            method: 'GET',
        }).then(result => {
            console.log(result);
            return result.json();
            //the return statements will return an object that we're going to use in the next 'then' ... so this current 'then' will return a promess
        }).then((ourJsonData) => {
            console.log(ourJsonData);
            console.log(ourJsonData.guid[0]);
            console.log(ourJsonData.guid[0].slice(1, ourJsonData.guid[0].length - 1));
            resolve(ourJsonData.guid[0].slice(1, ourJsonData.guid[0].length - 1));
        }).catch((response) => {
            reject(Error(response));
        });
    });
}

function fetchGuid() {
    //since we are loading data from a local file, always use (mode: 'no-cors') otherwise it won't permit loading data, it will throw
    //it will throw cross origin error
    //N.B: browsers (i'm sure abt chrome) won't permit loading data from local json file, so in order to check if the code works
    //if the code works just open the file using Live Server or something similar
    let url = "https://helloacm.com/api/guid-generator/?n=1&braces&nohyphens&uppercase";
    let guid = "";
    fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        //mode: 'no-cors',//cors, no-cors, *cors, same-origin
        //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: 'same-origin', // include, *same-origin, omit
        /*headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },*/
        //redirect: 'follow', // manual, *follow, error
        //referrer: 'no-referrer', // no-referrer, *client
    }).then(result => {
        //so once it finishes fetching it will execute this block of code
        //1- we'll log the response we've got (just for testing, and read the error we got when we tested it)
        //2- we'll log the response body in a json format (just for testing)
        //3- we'll return the response body in a json format
        console.log(result);
        //console.log(result.json());//N.B: if we left this line of code we'll get the error msg: TypeError: "Body has already been consumed."
        return result.json();
        //the return statements will return an object that we're going to use in the next 'then' ... so this current 'then' will return a promess
    }).then((ourJsonData) => {
        console.log(ourJsonData);
        /*
        Object{
            count:1,
            guid: Array ["{47407C5B912A4F918C8260566CFF1D3F}"]
        }
        */
        console.log(ourJsonData.guid[0]);
        /*
        {47407C5B912A4F918C8260566CFF1D3F}
        */
        console.log(ourJsonData.guid[0].slice(1, ourJsonData.guid[0].length - 1));
        /*
        47407C5B912A4F918C8260566CFF1D3F
        */
        guid = ourJsonData.guid[0].slice(1, ourJsonData.guid[0].length - 1);
    });
    return guid;
}