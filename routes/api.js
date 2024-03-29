import express from 'express'
import { verificarAuth, verificarAdmin } from '../middlewares/autenticacion';
const router = express.Router();
const validations = require('../middlewares/validations')

import XlsxTemplate from 'xlsx-template';
import fs from 'fs';
import path from 'path';

import multer from 'multer'

const diskstorage = multer.diskStorage({
    destination: path.join(__dirname, '../imagenes'),
    filename: (req, file, cb) => {
        cb(null, req.params.id + '.jpg')
    } 
})

const fileUpload = multer({
    storage: diskstorage
}).single('image')

//Todas las rutas de POST
//Agregar una ubicacion

router.post('/agregaUbicacion', verificarAuth, (req,res) => {
    validations.UbicacionValidate(req.body)
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO ubicacion (comuna, direccion) VALUES (?,?)',[req.body.comuna, req.body.direccion], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

router.post('/agregaDependencia', verificarAuth, (req,res) => {
    validations.DependenciaValidate(req.body)
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO dependencia (codDependencia, nomDependencia, tipo, corrUbicacion) VALUES (?,?,?,(SELECT MAX(corrUbicacion) AS corrUbicacion FROM ubicacion))',[req.body.codDependencia, req.body.nomDependencia, req.body.tipo], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

router.post('/agregaFuncionario', verificarAuth, (req,res) => {
    validations.FuncionarioValidate(req.body)
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO funcionario (codFuncionario, nomFuncionario, correo, rut, encargado, codDependencia) VALUES (?,?,?,?,?,(Select codDependencia FROM dependencia Where nomDependencia = ?))',[req.body.codFuncionario, req.body.nomFuncionario, req.body.correo, req.body.rut, req.body.encargado,req.body.nomDependencia], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

router.post('/agregaProducto', verificarAuth, (req,res) => {
    validations.ProductoValidate(req.body)
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO producto (codigoBarra, nomProducto, marca, descripcion, stock) VALUES (?,?,?,?,?)',[req.body.codigoBarra, req.body.nomProducto, req.body.marca, req.body.descripcion, req.body.stock], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//GET PARA OBTENER EL ULTIMO MEMO
router.get('/obtenerUltimoMemo', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('SELECT MAX(memo) AS memo FROM historial','',(err, rows)=>{
            if(err){
                return res.status(400).json({
                    mensaje: 'Error del sistema'
                })
            }
            else if(rows.length > 0){
                res.json(rows)
            }
            else{
                res.json({memo: 1})
            }
            
        })
    })
})

router.post('/agregaHistorial', verificarAuth, (req,res) => {
    validations.MemoValidate(req.body)
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO historial (fecha, codFuncionario, codDependencia,memo) VALUES (?,(Select codFuncionario FROM funcionario Where nomFuncionario = ?),(Select codDependencia FROM dependencia Where nomDependencia = ?), ?)',[req.body.fecha, req.body.nomFuncionario, req.body.nomDependencia, req.body.memo], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

router.post('/agregahistProd', verificarAuth, (req,res) => {
    validations.CantidadValidate(req.body)
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO histprod (cantidad, codigoBarra, corrHistorial) VALUES (?,?,(SELECT MAX(corrHistorial) AS corrHistorial FROM historial))',[req.body.cantidad, req.body.codigoBarra], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

router.post('/agregaBodega', verificarAuth, (req,res) => {
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO bodega (nomBodega) VALUES (?)',[req.body.nomBodega], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

router.post('/agregaOrdenEntrega', verificarAuth, (req,res) => {
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO ordenentrega (codOrden, proveedor, fecha, nomBodega) VALUES (?,?,?,?)',[req.body.codOrden, req.body.proveedor, req.body.fecha, req.body.nomBodega], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

router.post('/agregaOrdenProducto', verificarAuth, (req,res) => {
    validations.CantidadValidate(req.body)
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO ordenproducto (cantidad, codOrden, codigoBarra) VALUES (?,?,?)',[req.body.cantidad, req.body.codOrden, req.body.codigoBarra], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

router.post('/agregaProductoBodega', verificarAuth, (req,res) => {
    validations.EntregaBodegaValidate(req.body)
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO prodbodega (stockBodega, stockCritico, nomBodega, codigoBarra) VALUES (?,?,?,?)',[req.body.stockBodega, req.body.stockCritico,req.body.nomBodega, req.body.codigoBarra], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

router.put('/subirImagen/:id', verificarAuth, fileUpload, (req,res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        const data = fs.readFileSync(path.join(__dirname, '../imagenes/' + req.file.filename))
        conn.query('Update producto Set imagen = ? Where codigoBarra = ?',[data, req.params.id],(err, rows)=>{
            if(err) return res.send(err)
            res.send('Imagen Guardada')
        })
    })  
})

//Solicitudes tipo Get

//OBTENR UNA IMAGEN
router.get('/obtenerImagen', verificarAuth, (req,res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select codigoBarra, imagen FROM producto','',(err, rows)=>{
            if(err) return res.send(err)
            rows.map(img => {
                if(img.imagen !== null){
                    fs.writeFileSync(path.join(__dirname,'../public/dbImagenes/' + img.codigoBarra + '.jpg'), img.imagen)
                }
            })
            const imagenesDir = fs.readdirSync(path.join(__dirname,'../public/dbImagenes/'))
            res.json(imagenesDir)
        })
    })  
})

//Obtener los productos
router.get('/obtenerProductos', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select DISTINCT p.nomProducto, p.codigoBarra, p.marca, p.descripcion, p.stock, bp.stockBodega, bp.stockCritico, bp.nomBodega From producto as p Left Join prodBodega as bp ON p.codigoBarra = bp.codigoBarra','',(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener los productos
router.get('/obtenerProductosSolos', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select p.nomProducto, p.codigoBarra, p.marca, p.descripcion, p.stock From producto as p ','',(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener los productos de una bodega 
router.get('/obtenerProductosBodega/:bodega', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select p.nomProducto, p.codigoBarra, p.marca, p.descripcion, p.stock, bp.stockBodega, bp.stockCritico From producto as p Left Join prodBodega as bp ON bp.codigoBarra = p.codigoBarra WHERE bp.nomBodega = ?',req.params.bodega,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener un producto según su código
router.get('/obtenerProducto/:id', verificarAuth,  (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select * FROM producto Where codigoBarra = ?',req.params.id,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener los datos de un producto de una bodega
router.get('/obtenerProductoBodega/:id/:nomBodega', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select stockCritico FROM prodBodega Where codigoBarra = ? and nomBodega = ?',[req.params.id, req.params.nomBodega],(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener las dependencias
router.get('/obtenerDependencias', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select d.codDependencia, d.nomDependencia, d.tipo, u.comuna, u.direccion, d.corrUbicacion From dependencia as d Left join ubicacion as u ON u.corrUbicacion = d.corrUbicacion','',(err, rows)=>{
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

//Obtener los funcionarios
router.get('/obtenerFuncionarios', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('SELECT f.codFuncionario, f.nomFuncionario, f.correo, f.rut, f.encargado, d.nomDependencia From funcionario as f Left Join dependencia as d ON d.codDependencia = f.codDependencia','',(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//OBTENER FUNCIONARIOS ENCARGADOS DE UNA DEPENDENCIAS PARA VISTA ENTREGA DE INSUMOS
router.get('/obtenerFuncionarioDep/:dependencia', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('SELECT f.codFuncionario, f.nomFuncionario, f.correo, f.rut, f.encargado, d.nomDependencia From funcionario as f Left Join dependencia as d ON d.codDependencia = f.codDependencia Where d.nomDependencia = ? and f.encargado = 1',req.params.dependencia,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener BODEGAS
router.get('/obtenerbodegas', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('SELECT * FROM bodega','',(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})


//Obtener un funcionario por su codigo
router.get('/obtenerFuncionario/:id', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('SELECT f.codFuncionario, f.nomFuncionario, f.correo, f.rut, d.nomDependencia From funcionario as f Left Join dependencia as d ON d.codDependencia = f.codDependencia Where f.codFuncionario', req.params.id,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener los historiales de un producto
router.get('/obtenerHistorialesProducto/:producto', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select DISTINCT h.corrHistorial, DATE_FORMAT(h.fecha,"%d/%m/%y") as fecha, f.nomFuncionario, d.nomDependencia, h.memo From historial as h Left Join funcionario as f on f.codFuncionario = h.codFuncionario Left Join dependencia as d on d.codDependencia = h.codDependencia Left JOIN histprod as hp on hp.corrHistorial = h.corrHistorial Where hp.codigoBarra = ?',req.params.producto,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener los historiales de una dependencia
router.get('/obtenerHistorialesDependencia/:dependencia', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select DISTINCT h.corrHistorial, DATE_FORMAT(h.fecha,"%d/%m/%y") as fecha, f.nomFuncionario, d.nomDependencia, h.memo From historial as h Left Join funcionario as f on f.codFuncionario = h.codFuncionario Left Join dependencia as d on d.codDependencia = h.codDependencia Where d.codDependencia = ?',req.params.dependencia,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener los historiales de un funcionario
router.get('/obtenerHistorialesFuncionario/:funcionario', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select DISTINCT h.corrHistorial, DATE_FORMAT(h.fecha,"%d/%m/%y") as fecha, f.nomFuncionario, d.nomDependencia, h.memo From historial as h Left Join funcionario as f on f.codFuncionario = h.codFuncionario Left Join dependencia as d on d.codDependencia = h.codDependencia Where f.codFuncionario = ?',req.params.funcionario,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener un historial
router.get('/obtenerHistorial/:historial', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select hp.corrHistProd, hp.codigoBarra, p.nomProducto, hp.cantidad, h.memo FROM histprod as hp LEFT JOIN producto as p ON p.codigoBarra = hp.codigoBarra LEFT JOIN historial as h ON h.corrHistorial = hp.corrHistorial WHERE h.corrHistorial = ?',req.params.historial,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener los historiales de un producto
router.get('/obtenerOrdenesProducto/:producto', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select DISTINCT o.codOrden, o.nomBodega, o.proveedor, DATE_FORMAT(o.fecha,"%d/%m/%y") as fecha From ordenentrega as o Left JOIN ordenproducto as op on op.codOrden = o.codOrden Where op.codigoBarra = ?',req.params.producto,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener las Ordenes de una bodega
router.get('/obtenerOrdenesBodega/:bodega', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select DISTINCT o.codOrden, o.nomBodega, o.proveedor, DATE_FORMAT(o.fecha,"%d/%m/%y") as fecha From ordenentrega as o Where o.nomBodega = ?',req.params.bodega,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener una orden de entrega
router.get('/obtenerOrden/:orden', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select op.corrOrdenProducto, op.codigoBarra, p.nomProducto, op.cantidad FROM ordenproducto as op LEFT JOIN producto as p ON p.codigoBarra = op.codigoBarra LEFT JOIN ordenentrega as o ON o.codOrden = op.codOrden WHERE o.codOrden = ?',req.params.orden,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//COMPARAR STOCKS
router.get('/CompararStock', verificarAuth, (req, res) => {
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
router.put('/actualizaStock/:producto', verificarAuth, (req, res) => {
    validations.CantidadValidate(req.body)
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Update producto Set stock = stock - ? Where codigoBarra = ?',[req.body.cantidad, req.params.producto],(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Editar un producto
router.put('/editarProducto/:producto', verificarAuth, (req, res) => {
    validations.ProductoValidate(req.body)
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Update producto Set nomProducto = ?, marca = ?, descripcion = ?, stock = ? Where codigoBarra = ?',[req.body.nomProducto, req.body.marca, req.body.descripcion, req.body.stock, req.params.producto],(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Actualizar Dependencia
router.put('/editarDependencia/:dependencia', verificarAuth,  (req, res) => {
    validations.DependenciaValidate(req.body)
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Update dependencia Set nomDependencia = ?, tipo = ?, corrUbicacion = (SELECT MAX(corrUbicacion) AS corrUbicacion FROM ubicacion) Where codDependencia = ?',[req.body.nomDependencia, req.body.tipo, req.params.dependencia],(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Actualizar Dependencia
router.put('/editarFuncionario/:funcionario', verificarAuth, (req, res) => {
    validations.FuncionarioValidate(req.body)
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Update funcionario Set nomFuncionario = ?, correo = ?, rut = ?, encargado = ?, codDependencia = (Select codDependencia FROM dependencia Where nomDependencia = ?) Where codFuncionario = ?',[req.body.nomFuncionario, req.body.correo, req.body.rut, req.body.encargado, req.body.nomDependencia, req.params.funcionario],(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Actualizar StockCritico
router.put('/editarstockCritico/:producto', verificarAuth, (req, res) => {
    validations.StockCriticoValidate(req.body)
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Update prodbodega Set stockCritico = ? Where codigoBarra = ? and nomBodega = ?',[req.body.stockCritico, req.params.producto, req.body.nomBodega],(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Restar stock de bodega a un producto
router.put('/actualizaStockBodega/:producto', verificarAuth, (req, res) => {
    validations.CantidadValidate(req.body)
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Update prodbodega Set stockBodega = stockBodega - ? Where codigoBarra = ? and nomBodega = ?',[req.body.cantidad, req.params.producto, req.body.nomBodega],(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Sumar stock a un producto
router.put('/actualizaStockmas/:producto', verificarAuth, (req, res) => {
    validations.CantidadValidate(req.body)
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Update producto Set stock = stock + ? Where codigoBarra = ?',[req.body.cantidad, req.params.producto],(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Sumar stock de bodega a un producto
router.put('/actualizaStockBodegamas/:producto', verificarAuth, (req, res) => {
    validations.CantidadValidate(req.body)
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Update prodbodega Set stockBodega = stockBodega + ? Where codigoBarra = ? and nomBodega = ?',[req.body.cantidad, req.params.producto, req.body.nomBodega],(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//TODAS LAS QUERYS DELETE
//Eliminar una ubicación 
router.delete('/eliminarUbicacion/:corr', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Delete FROM ubicacion WHERE corrUbicacion = ?',req.params.corr,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener excel con nuevos datos
router.post('/obtenerMemo', verificarAuth, (req, res) => {
    fs.readFile(path.join(__dirname, '../public', 'test.xlsx'), function(err, data) {
        // Create a template
        var template = new XlsxTemplate(data);
        // Replacements take place on first sheet
        var sheetNumber = 1;

        // Set up some placeholder values matching the placeholders in the template
        var values = {
            productos: req.body.productos,
            dependencia: req.body.dependencia,
            codDependencia: req.body.codDependencia,
            comuna: req.body.comuna,
            fecha: req.body.fecha,
            referencia: req.body.referencia,
            ticket: req.body.ticket,
            memo: req.body.memo
        };

        // Perform substitution
        template.substitute(sheetNumber, values);

        // Get binary data
        var data = template.generate();
        res.json(data)
        //fs.writeFileSync('D:/inventarioInformatico/stock/stockBackend/public/test1.xlsx', data, 'binary');
    }); 
})

router.use((error, req, res, next) => {
    res.status(400).json({
      status: 'error',
      message: error.message,
    })
})

module.exports = router;
