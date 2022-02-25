import express from 'express'
import { verificarAuth, verificarAdmin } from '../middlewares/autenticacion';
const router = express.Router();

//Todas las rutas de POST
//Agregar una ubicacion

router.post('/agregaUbicacion', (req,res) => {
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO ubicacion (comuna, direccion) VALUES (?,?)',[req.body.comuna, req.body.direccion], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

router.post('/agregaDependencia', (req,res) => {
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO dependencia (codDependencia, nomDependencia, tipo, corrUbicacion) VALUES (?,?,?,?)',[req.body.codDependencia, req.body.nomDependencia, req.body.tipo, req.body.corrUbicacion], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

router.post('/agregaFuncionario', (req,res) => {
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO funcionario (codFuncionario, nomFuncionario, correo, rut, codDependencia) VALUES (?,?,?,?,?)',[req.body.codFuncionario, req.body.nomFuncionario, req.body.correo, req.body.rut, req.body.dependencia], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

router.post('/agregaProducto', (req,res) => {
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO producto (codigoBarra, nomProducto, marca, descripcion, stock) VALUES (?,?,?,?,?)',[req.body.codigoBarra, req.body.nomProducto, req.body.marca, req.body.descripcion, req.body.stock], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

router.post('/agregaHistorial', (req,res) => {
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO historial (fecha, codFuncionario, codDependencia, codigoBarra) VALUES (?,?,?,?,?)',[req.body.fecha, req.body.codFuncionario, req.body.codDependencia, req.body.codigoBarra], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

router.post('/agregahistProd', (req,res) => {
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO histprod (cantidad, codigoBarra, corrHistorial) VALUES (?,?,?)',[req.body.cantidad, req.body.codigoBarra, req.body.corrHistorial], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

router.post('/agregaBodega', (req,res) => {
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO bodega (nomBodega) VALUES (?)',[req.body.nomBodega], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

router.post('/agregaOrdenEntrega', (req,res) => {
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO ordenentrega (codOrden, proveedor, fecha, nomBodega) VALUES (?,?,?,?)',[req.body.codOrden, req.body.proveedor, req.body.fecha, req.body.nomBodega], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

router.post('/agregaOrdenProducto', (req,res) => {
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO ordenproducto (cantidad, codOrden, codigoBarra) VALUES (?,?,?)',[req.body.cantidad, req.body.codOrden, req.body.codigoBarra], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

router.post('/agregaProductoBodega', (req,res) => {
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO prodbodega (stockBodega, stockCritico, nomBodega, codigoBarra) VALUES (?,?,?,?)',[req.body.stockBodega, req.body.nomBodega, req.body.codigoBarra], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Solicitudes tipo Get
//Obtener los productos
router.get('/obtenerProductos', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select * From producto','',(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener un producto según su código
router.get('/obtenerProducto/:id', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select * FROM producto Where codigoBarra = ?',req.params.id,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener las dependencias
router.get('/obtenerDependencias', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select d.codDependencia, d.nomDependencia, d.tipo, u.comuna, u.direccion From dependencia as d Left join ubicacion as u ON u.corrUbicacion = d.corrUbicacion','',(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener una dependencia por su codigo
router.get('/obtenerDependencia/:id', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select d.codDependencia, d.nomDependencia, d.tipo, u.comuna, u.direccion From dependencia as d Left join ubicacion as u ON u.corrUbicacion = d.corrUbicacion Where codDependencia = ?',req.params.id,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})


/*
router.post('/agregaUbicacion', verificarAuth, (req,res) => {
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO ubicacion (comuna, provincia, region) VALUES (?,?,?)',[req.body.comuna, req.body.provincia, req.body.region], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})


//Agregar un Historial
router.post('/agregaHistorial', verificarAuth, (req,res) => {
    req.getConnection((err, conn)=>{
        console.log(req.body.nomMarca)
        if(err) return res.send(err)
        conn.query('INSERT INTO historial (estado, zona, codigo, codJardin, corrEquipo, fechaInicio) VALUES ((?), (?), (Select f.codigo From funcionario f Where f.nombre = ?), (Select d.codJardin From dependencia d Where d.nomJardin = ?), (?), (?));',[true, req.body.zona, req.body.nombre, req.body.nomJardin, req.body.corrEquipo, req.body.fechaInicio], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//TODAS LAS RUTAS GET
//PRIMERA VISTA
//Desplegar a los equipos que actualmente tienen un dueño

router.get('/equiposConDueno', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select h.codHistorial, e.corrEquipo, t.tipoEquipo, e.serie, e.estado, e.codEquipo, d.nomJardin, d.codJardin, f.nombre, h.zona, DATE_FORMAT(h.fechaInicio,"%d/%m/%y") as fechaInicio From equipo as e Left Join historial as h ON h.corrEquipo = e.corrEquipo Left Join tipo as t ON t.codTipo = e.codTipo Left Join dependencia as d ON d.codJardin = h.codJardin Left Join funcionario as f ON f.codigo = h.codigo Where h.estado = true;','',(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})


//Obtener Comunas
router.get('/comunas/:provincia', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select DISTINCT comuna FROM ubicacion Where provincia = ?',req.params.provincia,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})


//Actualizar un funcionario
router.put('/actualizaFuncionario/:codigo', verificarAuth, (req, res) => {
    console.log(req.body)
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Update funcionario Set codFuncionario = ?, nombre = ?, correo = ?, rut = ? Where codigo = ?',[req.body.codFuncionario, req.body.nombre, req.body.correo, req.body.rut, req.params.codigo],(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Editar dependencia
router.put('/actualizaDependencia/:codJardin', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Update dependencia Set nomJardin = ?, numUbicacion = (Select numUbicacion From ubicacion Where region = ? and comuna = ? and provincia = ?), codigo = (Select codigo From funcionario Where nombre = ?) Where codJardin = ?',[req.body.nomJardin, req.body.region, req.body.comuna, req.body.provincia, req.body.nombre, req.params.codJardin],(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

module.exports = router; */