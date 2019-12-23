import 'babel-polyfill';
import {MongoClient, ObjectID} from 'mongodb';


const Query = {
    //Author list
    authorList: async (parent, args, ctx, info) => {
        //Ctx
        const {author_clt} = ctx;

        const result = await author_clt.find().toArray();

        return result;
    },

    //Recipe list
    recipeList: async (parent, args, ctx, info) => {
        //Ctx
        const {recipe_clt} = ctx;

        const result = await recipe_clt.find().toArray();

        return result;
    },

    //Ingredient list
    ingredientList: async (parent, args, ctx, info) => {
        //Ctx
        const {ingredient_clt} = ctx;

        const result = await ingredient_clt.find().toArray();

        return result;
    },

    //Author recipes
    authorRecipes: async (parent, args, ctx, info) => {
        //Ctx and args
        const {id} = args;
        const {author_clt, recipe_clt} = ctx;

        //Check if the author exists
        const author_exists = await author_clt.findOne({_id: ObjectID(id)});
        if (!author_exists)
          throw new Error ("Couldn't find an author with that ID.");

        //Search inside the recipe list
        const result = await recipe_clt.find({author: id}).toArray();
        return result;
    },

    //Ingredient recipes
    ingredientRecipes: async (parent, args, ctx, info) => {
        //Ctx and args
        const {id} = args;
        const {ingredient_clt, recipe_clt} = ctx;

        //Check if the ingredient exists
        const ingredient_exists = await ingredient_clt.findOne({_id: ObjectID(id)});
        if (!ingredient_exists)
          throw new Error ("Couldn't find an ingredient with that ID.");

        //Search inside the recipe list
        const result = await recipe_clt.find({ingredients: {$in: [id]}}).toArray();
        return result;
    },
}

export {Query as default}