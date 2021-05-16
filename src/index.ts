import "reflect-metadata";
import {createConnection} from "typeorm";
import express, { Request, Response } from 'express'
import {User} from "./entity/User";
import { Post } from "./entity/Post";
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

/* update data */
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

/* delete data */

app.delete('/users/:uuid', async(req: Request, res: Response) => {
    const uuid = req.params.uuid
    try{
        const user = await User.findOneOrFail({ uuid })
        await user.remove()
        return res.status(204).json({ message: 'User deleted successfully '})

    }catch (err){
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})
// Find data
app.get('/users/:uuid', async (req: Request, res: Response) => {
    const uuid = req.params.uuid
    try {
        const user = await User.findOneOrFail({ uuid })
        return res.json(user)
    }
    catch (err) {
        console.log(err)
        return res.status(404).json({ user: 'User not found '})
    }
})


// Crete a Post
app.post('/post', async ( req: Request, res: Response ) => {
    const { userUuid, title, body } = req.body
    try{
        // const user = await Post.findOneOrFail({ uuid: userUuid })
        const post = Post.create({ title, body })

        
        await post.save()
        return res.json(post)

    } catch (err){
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong '})
    }
})

createConnection().then(async connection => {
    app.listen(5000, () => console.log('Server run on Port 5000'))

    

}).catch(error => console.log(error));
