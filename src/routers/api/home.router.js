import {Router} from 'express';

const router = Router();

router.get('/', (req,res)=>{
    res.render('home')
})

router.get('/loggerTest', (req, res) => {
    req.logger.fatal('Esta es una prueba log fatal')
    req.logger.error('Esta es una prueba log error')
    req.logger.warning('Esta es una prueba log warn')
    req.logger.info('Esta es una prueba log info')
    req.logger.http('Esta es una prueba log http')
    req.logger.debug('Esta es una prueba log debug')
    res.status(200).json('ok')
});

export default router;