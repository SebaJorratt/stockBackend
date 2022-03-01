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
        conn.query('INSERT INTO dependencia (codDependencia, nomDependencia, tipo, corrUbicacion) VALUES (?,?,?,(SELECT MAX(corrUbicacion) AS corrUbicacion FROM ubicacion))',[req.body.codDependencia, req.body.nomDependencia, req.body.tipo, req.body.corrUbicacion], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

router.post('/agregaFuncionario', (req,res) => {
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO funcionario (codFuncionario, nomFuncionario, correo, rut, codDependencia) VALUES (?,?,?,?,(Select codDependencia FROM dependencia Where nomDependencia = ?))',[req.body.codFuncionario, req.body.nomFuncionario, req.body.correo, req.body.rut, req.body.nomDependencia], (err, rows)=>{
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
        conn.query('INSERT INTO historial (fecha, codFuncionario, codDependencia) VALUES (?,(Select codFuncionario FROM funcionario Where nomFuncionario = ?),(Select codDependencia FROM dependencia Where nomDependencia = ?))',[req.body.fecha, req.body.nomFuncionario, req.body.nomDependencia], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

router.post('/agregahistProd', (req,res) => {
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO histprod (cantidad, codigoBarra, corrHistorial) VALUES (?,?,(SELECT MAX(corrHistorial) AS corrHistorial FROM historial))',[req.body.cantidad, req.body.codigoBarra], (err, rows)=>{
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
        conn.query('Select p.nomProducto, p.codigoBarra, p.marca, p.descripcion, p.stock, SUM(bp.stockBodega) as stockBodega From producto as p Left Join prodBodega as bp ON p.codigoBarra = bp.codigoBarra','',(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener los productos de una bodega 
router.get('/obtenerProductos/:bodega', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select p.nomProducto, p.codigoBarra, p.marca, p.descripcion, p.stock, SUM(bp.stockBodega) as stockBodega From producto as p Left Join prodBodega as bp ON p.codigoBarra = bp.codigoBarra LEFT JOIN prodbodega as pb ON pb.codigoBarra = p.codigoBarra  WHERE pb.nomBodega = ?',req.params.bodega,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener un producto según su código
router.get('/obtenerProducto/:id', (req, res) => {
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
router.get('/obtenerDependencia/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select d.codDependencia, d.nomDependencia, d.tipo, u.comuna, u.direccion From dependencia as d Left join ubicacion as u ON u.corrUbicacion = d.corrUbicacion Where codDependencia = ?',req.params.id,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener los funcionarios
router.get('/obtenerFuncionarios', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('SELECT f.codFuncionario, f.nomFuncionario, f.correo, f.rut, d.nomDependencia From funcionario as f Left Join dependencia as d ON d.codDependencia = f.codDependencia','',(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener BODEGAS
router.get('/obtenerbodegas', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('SELECT * FROM bodega','',(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})


//Obtener un funcionario por su codigo
router.get('/obtenerFuncionario/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('SELECT f.codFuncionario, f.nomFuncionario, f.correo, f.rut, d.nomDependencia From funcionario as f Left Join dependencia as d ON d.codDependencia = f.codDependencia Where f.codFuncionario', req.params.id,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener los historiales de un producto
router.get('/obtenerHistorialesProducto/:producto', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select DISTINCT h.corrHistorial, DATE_FORMAT(h.fecha,"%d/%m/%y") as fecha, f.nomFuncionario, d.nomDependencia From historial as h Left Join funcionario as f on f.codFuncionario = h.codFuncionario Left Join dependencia as d on d.codDependencia = h.codDependencia Left JOIN histprod as hp on hp.corrHistorial = h.corrHistorial Where hp.codigoBarra = ?',req.params.producto,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener los historiales de una dependencia
router.get('/obtenerHistorialesDependencia/:dependencia', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select DISTINCT h.corrHistorial, DATE_FORMAT(h.fecha,"%d/%m/%y") as fecha, f.nomFuncionario, d.nomDependencia From historial as h Left Join funcionario as f on f.codFuncionario = h.codFuncionario Left Join dependencia as d on d.codDependencia = h.codDependencia Where d.codDependencia = ?',req.params.dependencia,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener los historiales de un funcionario
router.get('/obtenerHistorialesFuncionario/:funcionario', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select DISTINCT h.corrHistorial, DATE_FORMAT(h.fecha,"%d/%m/%y") as fecha, f.nomFuncionario, d.nomDependencia From historial as h Left Join funcionario as f on f.codFuncionario = h.codFuncionario Left Join dependencia as d on d.codDependencia = h.codDependencia Where f.codFuncionario = ?',req.params.funcionario,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener un historial
router.get('/obtenerHistorial/:historial', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select hp.corrHistProd, hp.codigoBarra, hp.cantidad FROM histprod as hp LEFT JOIN historial as h ON h.corrHistorial = hp.corrHistorial WHERE h.corrHistorial = ?',req.params.historial,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener los historiales de un producto
router.get('/obtenerOrdenesProducto/:producto', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select DISTINCT o.codOrden, o.nomBodega, o.proveedor, DATE_FORMAT(o.fecha,"%d/%m/%y") as fecha From ordenentrega as o Left JOIN ordenproducto as op on op.codOrden = o.codOrden Where op.codigoBarra = ?',req.params.producto,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener las Ordenes de una bodega
router.get('/obtenerOrdenesBodega/:bodega', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select DISTINCT o.codOrden, o.nomBodega, o.proveedor, DATE_FORMAT(o.fecha,"%d/%m/%y") as fecha From ordenentrega as o Where o.nomBodega = ?',req.params.bodega,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener una orden de entrega
router.get('/obtenerOrden/:orden', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select op.corrOrdenProducto, op.codigoBarra, op.cantidad FROM ordenproducto as op LEFT JOIN ordenentrega as o ON o.codOrden = op.codOrden WHERE o.codOrden = ?',req.params.orden,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//COMPARAR STOCKS
router.get('/CompararStock', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select stockBodega, stock FROM prodbodega Where nomBodega = ? and codigoBarra = ?',[req.body.nomBodega, req.body.codigoBarra],(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//PUT ACTUALIZAR ENTIDADES
//Restar stock a un producto
router.put('/actualizaStock/:producto', (req, res) => {
    console.log(req.body)
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Update producto Set stock = stock - ? Where codigoBarra = ?',[req.body.cantidad, req.params.producto],(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Editar un producto
router.put('/editarProducto/:producto', (req, res) => {
    console.log(req.body)
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Update producto Set nomProducto = ?, marca = ?, descripcion = ? Where codigoBarra = ?',[req.body.nomProducto, req.body.marca, req.body.descripcion, req.params.producto],(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Actualizar Dependencia
router.put('/editarDependencia/:dependencia', (req, res) => {
    console.log(req.body)
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Update dependencia Set nomDependencia = ?, tipo = ?, corrUbicacion = (SELECT MAX(corrUbicacion) AS corrUbicacion FROM ubicacion) Where codDependencia = ?',[req.body.nomDependencia, req.body.tipo, req.params.dependencia],(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Actualizar Dependencia
router.put('/editarFuncionario/:funcionario', (req, res) => {
    console.log(req.body)
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Update funcionario Set nomFuncionario = ?, correo = ?, rut = ?, codDependencia = (Select codDependencia FROM dependencia Where nomDependencia = ?) Where codFuncionario = ?',[req.body.nomFuncionario, req.body.correo, req.body.rut, req.body.nomDependencia, req.params.funcionario],(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Actualizar StockCritico
router.put('/editarstockCritico/:producto', (req, res) => {
    console.log(req.body)
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Update prodbodega Set stockCritico = ? Where codigoBarra = ?',[req.body.stockCritico, req.params.producto],(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Restar stock de bodega a un producto
router.put('/actualizaStockBodega/:producto', (req, res) => {
    console.log(req.body)
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Update prodbodega Set stockBodega = stockBodega - ? Where codigoBarra = ? and nomBodega = ?',[req.body.cantidad, req.params.producto, req.body.nomBodega],(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Sumar stock a un producto
router.put('/actualizaStock+/:producto', (req, res) => {
    console.log(req.body)
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Update producto Set stock = stock + ? Where codigoBarra = ?',[req.body.cantidad, req.params.producto],(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Restar stock de bodega a un producto
router.put('/actualizaStockBodega+/:producto', (req, res) => {
    console.log(req.body)
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Update prodbodega Set stockBodega = stockBodega + ? Where codigoBarra = ? and nomBodega = ?',[req.body.cantidad, req.params.producto, req.body.nomBodega],(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

module.exports = router;
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

 */