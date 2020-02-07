
// Confiuracion del jsStore

var dbName ='JsStore_Demo';
function getDbSchema() {
  var tblProduct = {
    name: 'Product',
    columns: {
        // Here "Id" is name of column 
        idDb:{ primaryKey: true, datatype: "number" },
        contenido:  { notNull: true, dataType: "string" }
    }
  };
  var db = {
      name: dbName,
      tables: [tblProduct]
  }
  return db;
}

// executing jsstore inside a web worker
var connection = new JsStore.Connection(new Worker('jsstore.worker.js'));

async function initJsStore() {
      var database = getDbSchema();
      const isDbCreated = await connection.initDb(database);
      if(isDbCreated===true){
          console.log("db created");
          // here you can prefill database with some data
      }
      else {
          console.log("db opened");
      }
}

initJsStore();


// const API_URL = 'https://swapi.co/api/'
// const PEOPLE_URL = 'people/:id'

const API_URL = 'http://gcaseqa-001-site24.atempurl.com/api/'
const PEOPLE_URL = 'Multimedia/:id/getbyid'


const OPTS = {crossDomain: true}

const onResponse = ({id}) => console.log(` Hola yo soy. ${id}`)   

const obtenerImagen = id => {

    return new Promise(function (resolve, reject){
        const URL = `${API_URL}${PEOPLE_URL.replace(':id',id)}` 

        $.get(URL, OPTS, function (data){
            resolve(data)
        })
        .fail(() => reject(id))
    })
}

const onError = id => {
    console.log(`Sucedio un error en el id ${id}`)
}


// async function obtenerImagens(){
//     var ids = [100] // aqui va un arreglo de ids de images
//     var promesas = ids.map( id => obtenerImagen(id) )
//     var imagenes = await Promise
//                             .all(promesas)
//                             .then( e => console.log(e))
//                             .catch(onError)
// }

// obtenerImagens()

async function insertDb(id,imgString){
    var value = {
        idDb : id,
        contenido: imgString,
    }
    var noOfDataInserted = await connection.insert({
        into: 'Product',
        values: [value]
    });
    if (noOfDataInserted > 0) {
        console.log('successfully added');
    }
}

async function readDb(id){
    // results will be array of objects
    var results = await connection.select({
        from: 'Product',
        where: {
            idDb: id
        }
    });
    console.log(results.length + 'record found');
    return results
}

async function loadImage(){
    var id = document.getElementById("imgId").value
    if (id){
        // Si existe en local se carga
        var result = await readDb(id)
        debugger
        if (result.length>0){
            console.log (result);
            document.getElementById("productImg").src = result[0].contenido
        } else {
            // si no existe en local se busca y se inserta
            obtenerImagen(id)
            .then ( ({data}) => {
                imgStr = "data:image/png;base64, " + data.contenido
                document.getElementById("productImg").src = imgStr
                insertDb(id, imgStr)
            })
            .catch(onError)
        }
    }
}

// Salvar la imagen en indexbx con jsStore
// Cargar la imagen si existe en la base local
// Colocar msg debajo de la imagen indicando el origen de carga de la imagen
