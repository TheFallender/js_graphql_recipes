import 'babel-polyfill';
import {MongoClient, ObjectID} from 'mongodb';


const Author = {
    recipes_made: async (parent, args, ctx, info) => {
        //Ctx and parent data
        const {recipe_clt} = ctx;
        const authorID = parent._id.toString();

        const result = await recipe_clt.find({author: authorID}).toArray();

        return result;
    },
}

export {Author as default}