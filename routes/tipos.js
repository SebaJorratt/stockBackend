import express from 'express'
import { verificarAuth, verificarAdmin } from '../middlewares/autenticacion';
const router = express.Router();

/*
router.post('/agregaUbicacion', verificarAuth, (req,res) => {
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO ubicacion (comuna, direccion) VALUES (?,?)',[req.body.comuna, req.body.direccion], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})
*/