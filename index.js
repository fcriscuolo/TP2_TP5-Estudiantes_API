const express = require('express')
const path = require("path")

// Incorporando Swagger
const swaggerUI = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")

const swaggerSpec = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TP5 - API Estudiantes",
      version: "1.0.0"
    },
    servers: [
      {
        url: "http://localhost:5000/"
      }
    ]
  },
  apis: [`${path.join(__dirname, "./*.js")}`] , 
};

const port = 5000
const app = express()

const resource = 'estudiante'
const route = `/${resource}`

// Middleware
app.use(express.json())
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)))

/**
 * @swagger
 * components:
 *  schemas:
 *    Estudiante:
 *      type: object
 *      properties:
 *        nombre:
 *          type: string
 *          description: Nombre del alumno
 *        apellido: 
 *           type: string
 *           description: Apellido del alumno
 *        dni: 
 *          type: integer
 *          decription: Documento Nacional de Identidad del Alumno
 *        edad:
 *          type: integer
 *          decription: Edad del Alumno
*      required:
*       - nombre
*       - apellido
*       - dni
*       - edad
*      example:
*       nombre: Federico
*       apellido: Criscuolo
*       dni: 31665319
*       edad: 37
*/

const estudiantes = [
  {
    nombre: "Fede",
    apellido: "Criscuolo",
    dni: 30664318,
    edad: 25,
  },
  {
      nombre: "Juan",
      apellido: "Algo",
      dni: 93416947,
      edad: 50,
  },
  {
      nombre: "Roberto",
      apellido: "Carlos",
      dni: 29024701,
      edad: 30,
  }, 
  {
    nombre: "Pedro",
    apellido: "Luis",
    dni: 29024701,
    edad: 61,
}
]
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Get 1: Obtener todos
/**
 * @swagger
 * /estudiante:
 *   get:
 *    summary: Obtener todos los estudiantes.
 *    tags: [Estudiante]
 *    responses:
 *      200:
 *        description:
 *           un json con todos los estudiantes
 *        content: 
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Estudiante'
 *      409:
 *        description: 
 *            No hay estudiantes cargados.
 */

app.get(route, (req, res) => {
  if(estudiantes.length > 0){
    res.json(estudiantes)
    res.status(200)
  }else{
    res.status(409)
    res.json("No hay estudiantes cargados.")
    res.send()
  }
})

/**
 * @swagger
 * /estudiante/{edad}:
 *   get:
 *    summary: Obtener rango de estudiantes hasta la edad indicada por parametro.
 *    tags: [Estudiante]
 *    parameters:
 *    - in: path
 *      name: edad
 *      schema:
 *        type: integer
 *    responses:
 *      200:
 *        description:
 *           un json con todos los estudiantes
 *        content: 
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Estudiante'
 *      403:
 *        description: 
 *            No existe un estudiente con ese DNI 
 */

app.get(`${route}/edad/:rango`, (req, res) => { 

  const rango = parseInt(req.params.rango)
  const response = new Array;

  for (var i = 0; i < estudiantes.length; i++) {
    if(estudiantes[i].edad <= rango)
    response.push(estudiantes[i])
 }

 res.status(200)
 res.json(response)
  
})

// Get 2: Obtener por DNI OK

/**
 * @swagger
 * /estudiante/{dni}:
 * get:
 *    summary: Obtener estudiante por DNI, indicado por parametro.
 *    tags: [Estudiante]
 *    parameters:
 *    - in: path
 *      name: dni
 *      schema:
 *        type: integer
 *    responses:
 *      200:
 *        description:
 *           un json con los datos del estudiants
 *        content: 
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Estudiante'
 *      403:
 *        description: 
 *            No existe un estudiente con ese DNI 
 */

 app.get(`${route}/:dni`, (req,res) => {
  const dni = parseInt(req.params.dni)
  const index = estudiantes.findIndex(estudiante => estudiante.dni === dni);
  
  if(index !== -1) {
    res.status(200)
    res.json(estudiantes[index])    
  }else {
    res.status(403)
    res.json("No existe el estudiante con DNI"  + dni)
  }
 })


// Get 3: Obtener por rango de edad 
/**
 * @swagger
 * /estudiante/{edad}:
 *   get:
 *    summary: Obtener rango de estudiantes hasta la edad indicada por parametro.
 *    tags: [Estudiante]
 *    parameters:
 *    - in: path
 *      name: edad
 *      schema:
 *        type: integer
 *    responses:
 *      200:
 *        description:
 *           un json con todos los estudiantes
 *        content: 
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Estudiante'
 *      403:
 *        description: 
 *            No existe un estudiente con ese DNI 
 */

 app.get(`${route}/edad/:rango`, (req, res) => { 

  const rango = parseInt(req.params.rango)
  const response = new Array;

  for (var i = 0; i < estudiantes.length; i++) {
    if(estudiantes[i].edad <= rango)
    response.push(estudiantes[i])
 }

 res.status(200)
 res.json(response)
  
})

/**
 * @swagger
 * /estudiante:
 *  post:
 *    summary: Creacion de un nuevo estudiante
 *    tags: [Estudiante]
 *    requestBody:
 *      requiered: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Estudiante'
 *    responses:
 *      200:
 *        description:
 *           un json
 *      409:
 *        description: 
 *            Ya existe un estudiente con ese DNI 
 */

app.post(route, (req, res) => {
  const estudiante = req.body

  const existe = estudiantes.find((est) => {
    return est.dni == estudiante.dni
  })

  if (!existe) {
    estudiantes.push(estudiante)
    res.status(200)
    res.json(estudiante)
  } else {
    res.status(409)
    res.json("Ya existe un estudiente con ese DNI")
    res.send()
  }
})

// Ingresar o crear Estudiante: metodo post

// Actualizar estudiante: metodo put
/**
 * @swagger
 * /estudiante:
 *  put:
 *    summary: Actualizar estudiante por DNI
 *    tags: [Estudiante]
 *    requestBody:
 *      requiered: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Estudiante'
 *    responses:
 *      200:
 *        description:
 *           un json con todos los estudiantes
 *      403:
 *        description: 
 *            No existe un estudiente con ese DNI 
 */

app.put(route, (req, res) => {
  const estudiante = req.body
  const existe = estudiantes.find((est) => {
    return est.dni == estudiante.dni
  })

  if(!existe) {
  res.status(400)
  res.json("No existe el estudiante con DNI "  + estudiante.dni)
  } else {    
      const index = estudiantes.findIndex(est => est.dni === estudiante.dni);
      const e = estudiantes[index]

      if(estudiante.nombre != null) {
        e.nombre = estudiante.nombre
      }
      if(estudiante.apellido != null) {
        e.apellido = estudiante.apellido
      }
      if(estudiante.edad != null) {
        e.edad = estudiante.edad
      }
      if(estudiante.dni != null) {
        e.dni = estudiante.dni
      }
      res.status(200)
      res.json(e)
    }
})

// Eliminar, de aca para abajo OK orden

/**
 * @swagger
 * /estudiante/{dni}:
 *   delete:
 *    summary: Eliminar un usuario, indicado por DNI.
 *    tags: [Estudiante]
 *    parameters:
 *    - in: path
 *      name: dni
 *      schema:
 *        type: integer
 *    responses:
 *      200:
 *        description:
 *           un json con todos los estudiantes
 *        content: 
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Estudiante'
 *      403:
 *        description: 
 *            No existe un estudiente con ese DNI 
 */


 app.delete(route, (req, res) => {
  const estudiante = req.body
  const existe = estudiantes.find((est) => {
    return est.dni == estudiante.dni
  })

  if(!existe) {
  res.status(400)
  res.json("No existe el estudiante con DNI "  + estudiante.dni)
  } else {
    const index = (estudiantes) => estudiantes.dni === req.dni;
    estudiantes.splice(estudiantes.findIndex(index));
    res.status(200)
    res.json("Se eliminó Estudiante con DNI " + estudiante.dni)
    res.send()
  }

})

app.listen(port, () => {
  console.log(`Escuchando http://localhost:${port}${route}`)
  console.log(`Para acceder a la documentacion: http://localhost:5000/api-doc/`)
})