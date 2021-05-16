import "reflect-metadata";
import {createConnection} from "typeorm";
import express, { Request, Response } from 'express'
import {User} from "./entity/User";
const app = express()
app.use(express.json())

// Create Data
app.post('/users', async (req: Request, res: Response) => {
    const { name, email, role } = req.body
    try {
        const user = User.create({ name, email, role })

        await user.save()

        return res.status (201).json(user)
    }
    catch(err){
        console.log(err)
        return res.status(500).json(err)
    }
})

// Read Data
app.get('/users', async (_:Request, res: Response ) => {
    try{
        const users = await User.find()
        return res.json(users)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong '})
    }
})

app.put('/users/:uuid', async(req: Request, res: Response) => {
    const uuid = req.params.uuid
    const { name, email, role } = req.body

    try {
        const user = await User.findOneOrFail({ uuid })
        user.name = name || user.name
        user.email = email || user.email
        user.role = role || user.role

        await user.save()
        return res.json(user)
    }catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong '})
    }
})
createConnection().then(async connection => {
    app.listen(5000, () => console.log('Server run on Port 5000'))

    // console.log("Inserting a new user into the database...");
    // const user = new User();
    // user.firstName = "Timber";
    // user.lastName = "Saw";
    // user.age = 25;
    // await connection.manager.save(user);
    // console.log("Saved a new user with id: " + user.id);

    // console.log("Loading users from the database...");
    // const users = await connection.manager.find(User);
    // console.log("Loaded users: ", users);

    // console.log("Here you can setup and run express/koa/any other framework.");
 
    /*  const user = new User()

    user.name = "Nadiasina Nico"
    user.email = "nadiasinanicodev@gmail.com"
    user.role = "admin"
    
    await user.save()
    console.log('User created!!!!')
    */

}).catch(error => console.log(error));
