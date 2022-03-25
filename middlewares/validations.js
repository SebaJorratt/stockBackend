
function UsuarioValidate(data){
    if(typeof data.nomUsuario !== 'string'){
        throw new Error('El nombre debe contener solo letras')
    }
    if(data.nomUsuario.length < 10){
        throw new Error('El nombre debe tener un minimo de 10 caracteres')
    }
    if(!/^[a-z]+$/i.test(data.nomUsuario)){
        throw new Error('El nombre debe tener valores de la [a-z]')
    }
    if(data.password.length < 6){
        throw new Error('La contraseña debe tener un minimo de 6 caracteres')
    }
    if(typeof data.correo !== 'string'){
        throw new Error('El correo debe contener solo letras')
    }
    if(!/^[a-z0-9_.]+@[a-z0-9]+\.[a-z0-9_.]+$/i.test(data.correo)){
        throw new Error('El formato del correo es erroneo')
    }
}

function PutUsuarioSinContra(data, next){
    if(typeof data.nomUsuario !== 'string'){
        throw new Error('El nombre debe contener letras')
    }
    if(/^[0-9]+$/i.test(data.nomUsuario)){
        throw new Error('El nombre debe contener letras')
    }
    if(data.nomUsuario.length < 10){
        throw new Error('El nombre debe tener un minimo de 10 caracteres')
    }
    if(typeof data.correo !== 'string'){
        throw new Error('El correo debe contener solo letras')
    }
    if(!/^[a-z0-9_.]+@[a-z0-9]+\.[a-z0-9_.]+$/i.test(data.correo)){
        throw new Error('El formato del correo es erroneo')
    }
}

function PutContraseña(data, next){
    if(data.password.length < 6){
        throw new Error('La contraseña debe tener un minimo de 6 caracteres')
    }
}

function ProductoValidate(data, next){
    if(typeof data.nomProducto !== 'string'){
        throw new Error('El nombre debe contener letras')
    }
    if(/^[0-9]+$/i.test(data.nomProducto)){
        throw new Error('El nombre del producto debe contener letras')
    }
    if(typeof data.marca !== 'string'){
        throw new Error('La marca debe contener letras')
    }
    if(/^[0-9]+$/i.test(data.marca)){
        throw new Error('La marca del producto debe contener letras')
    }
    if(typeof data.descripcion !== 'string'){
        throw new Error('La descripcion debe contener letras')
    }
    if(/^[0-9]+$/i.test(data.descripcion)){
        throw new Error('La descripcion del producto debe contener letras')
    }
    if(!/^[0-9]+$/i.test(data.stock)){
        throw new Error('El stock del producto debe ser númerica')
    }
}

function MemoValidate(data, next){
    if(!/^[0-9]+$/i.test(data.memo)){
        throw new Error('El memo de la Entrega debe ser un valor númerico')
    }
}

function CantidadValidate(data, next){
    if(!/^[0-9]+$/i.test(data.cantidad)){
        throw new Error('La cantidad debe ser un valor númerico')
    }
}

function EntregaBodegaValidate(data, next){
    if(!/^[0-9]+$/i.test(data.stockBodega)){
        throw new Error('El stock de Bodega debe ser un valor númerico')
    }
    if(!/^[0-9]+$/i.test(data.stockCritico)){
        throw new Error('El stock crítico debe ser un valor númerico')
    }
}

function StockCriticoValidate(data, next){
    if(!/^[0-9]+$/i.test(data.stockCritico)){
        throw new Error('El stock crítico debe ser un valor númerico')
    }
}

function FuncionarioValidate(data, next){
    if(typeof data.nomFuncionario !== 'string'){
        throw new Error('El nombre debe contener letras')
    }
    if(/^[0-9]+$/i.test(data.nomFuncionario)){
        throw new Error('El nombre del funcionario debe contener letras')
    }
    if(data.nomFuncionario.length < 10){
        throw new Error('El nombre debe tener un minimo de 10 caracteres')
    }
    if(typeof data.correo !== 'string'){
        throw new Error('El correo debe contener solo letras')
    }
    if(!/^[a-z0-9_.]+@[a-z0-9]+\.[a-z0-9_.]+$/i.test(data.correo)){
        throw new Error('El formato del correo es erroneo')
    }
    if(data.encargado !== 1 && data.encargado !==0){
        throw new Error('Se ingreso un tipo diferente a los 2 existentes') 
    }
}

function DependenciaValidate(data, next){
    if(typeof data.nomDependencia !== 'string'){
        throw new Error('El nombre debe contener letras')
    }
    if(/^[0-9]+$/i.test(data.nomDependencia)){
        throw new Error('El nombre del jardin debe contener letras')
    }
    if(data.tipo !== 'Clásico AD' && data.tipo !== 'Alternativo FAMILIAR' && data.tipo !== 'Alternativo LABORAL' && data.tipo !== 'PMI' && data.tipo !== 'CECI'){
        throw new Error('El tipo de la Dependencia es incorrecto')
    }
}

function UbicacionValidate(data, next){
    if(typeof data.comuna !== 'string'){
        throw new Error('El nombre debe contener letras')
    }
    if(/^[0-9]+$/i.test(data.comuna)){
        throw new Error('El nombre del jardin debe contener letras')
    }
    if(typeof data.direccion !== 'string'){
        throw new Error('El nombre debe contener letras')
    }
    if(/^[0-9]+$/i.test(data.direccion)){
        throw new Error('El nombre del jardin debe contener letras')
    }
}

module.exports = {UsuarioValidate, PutUsuarioSinContra, PutContraseña, ProductoValidate, FuncionarioValidate, DependenciaValidate, MemoValidate, CantidadValidate, EntregaBodegaValidate, StockCriticoValidate, UbicacionValidate};