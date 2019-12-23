import 'babel-polyfill';
import {MongoClient, ObjectID} from 'mongodb';


const Recipe = {
    author: async (parent, args, ctx, info) => {
        //Ctx and parent data
        const {author_clt} = ctx;
        const authorID = parent.author;

        const result = await author_clt.findOne({_id: ObjectID(authorID)});

        return result;
    },
    ingredients: async (parent, args, ctx, info) => {
        //Ctx and parent data
        const {ingredient_clt} = ctx;
        const ingredientsID = parent.ingredients.map(element => {
            return ObjectID(element);
        })

        const result = await ingredient_clt.find({_id: {$in: ingredientsID}}).toArray();
        
        return result;
    },
}

export {Recipe as default}