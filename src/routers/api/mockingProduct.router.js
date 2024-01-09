import {Router} from 'express';
import { generateProduct } from '../../utils.js';

const router = Router();

router.get('/generateMocking', (req,res)=>{
    const product = [];
    for (let index = 0; index < 10; index++) {
        product.push(generateProduct())
    }
    res.json(product)
})

export default router;