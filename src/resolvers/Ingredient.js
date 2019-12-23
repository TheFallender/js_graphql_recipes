import 'babel-polyfill';
import {MongoClient, ObjectID} from 'mongodb';


const Ingredient = {
    recipes_used: async (parent, args, ctx, info) => {
        //Ctx and parent data
        const {recipe_clt} = ctx;
        const ingredientID = parent._id.toString();

        const result = await recipe_clt.find({ingredients: {$in: [ingredientID]}}).toArray();

        return result;
    },
}

export {Ingredient as default}