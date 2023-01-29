import express from 'express'
import notFoundMiddleware from './middleware/not-found.js'
import error from './middleware/error.js'
import connect_database from './db/connect.js'
import route from './routes/index.js';
import dotenv from 'dotenv'
import 'express-async-errors'
import morgan from 'morgan'
dotenv.config();
const app = express()
app.use(express.json())
connect_database()
const port = process.env.PORT || 5000
if(process.env.NODE_ENV !== 'production'){
    app.use(morgan('dev'))
}
app.get('/' , (req,res) => {
   res.json({msg: 'welcome'})
})
route(app)


app.listen(port , () => {
    console.log(`Server is listening on port ${port}........`)
})