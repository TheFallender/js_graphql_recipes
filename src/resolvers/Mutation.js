import 'babel-polyfill';
import {MongoClient, ObjectID} from 'mongodb';


const Mutation = {
    //Add Recipe
    addRecipe: async (parent, args, ctx, info) => {
        //Ctx and args
        const {title, description, author, ingredients} = args;
        const {author_clt, ingredient_clt, recipe_clt} = ctx;


        //Verification of existance

        //Check if the recipe already exists
        const recipe_exists = await recipe_clt.findOne({title});
        if (recipe_exists)
            throw new Error (`The recipe with title ${title} already exists`);

        //Check if the author exists
        const author_exists = await author_clt.findOne({_id: ObjectID(author)});
        if (!author_exists)
            throw new Error (`Author with id ${author} doesn't exist`);

        //Check if the ingredients exists
        const ingredientsID = ingredients.map(element => {
            return ObjectID(element);
        });
        const ingredient_exists = await ingredient_clt.find({_id: {$in: ingredientsID}}).toArray();
        if (!ingredient_exists[ingredientsID.length - 1])
            throw new Error (`One or more of the ingredients with id ${ingredients} doesn't exist`);

        //Calculate date
        const date = new Date().getTime();

        //Send recipe
        const result = await recipe_clt.insertOne({title, description, date, author, ingredients});

        if (!result.ops[0])
          throw new Error ("Couldn't create the recipe");
        
        return result.ops[0];
    },

    //Add Ingredient
    addIngredient: async (parent, args, ctx, info) => {
        //Ctx and args
        const {name} = args;
        const {ingredient_clt} = ctx;

        //Check if the ingredient exists
        const ingredient_exists = await ingredient_clt.findOne({name});
        if (ingredient_exists)
            throw new Error (`Ingredient with name ${name} already exist`);

        //Send ingredient
        const result = await ingredient_clt.insertOne({name, recipes_used: []});

        if (!result.ops[0])
            throw new Error ("Couldn't create the ingredient");
      
        return result.ops[0];
    },

    //Add Author
    addAuthor: async (parent, args, ctx, info) => {
        //Set args
        const {name, email} = args;
        const {author_clt} = ctx;

        //Check if the author already exists
        const author_exists = await author_clt.findOne({email});
        if (author_exists)
            throw new Error (`User with email ${email} already in use`);

        //Send author
        const result = await author_clt.insertOne({name, email, recipes_made: []});

        if (!result.ops[0])
            throw new Error ("Couldn't create the author");
      
        return result.ops[0];
    },



    //Remove Recipe
    removeRecipe: async (parent, args, ctx, info) => {
        //Ctx and args
        const {id} = args;
        const {recipe_clt} = ctx;

        //Check if the recipe already exists
        const recipe_exists = await recipe_clt.findOne({_id: ObjectID(id)});
        if (!recipe_exists)
            throw new Error (`Recipe with id ${id} doesn't exist`);
        //Remove the element
        const result_delete = await recipe_clt.deleteOne({_id: ObjectID(id)});

        //Return message
        return recipe_exists;
    },

    //Remove Ingredient
    removeIngredient: async (parent, args, ctx, info) => {
        //Ctx and args
        const {id} = args;
        const {ingredient_clt, recipe_clt} = ctx;

        //Check if the ingredient exists
        const ingredient_exists = await ingredient_clt.findOne({_id: ObjectID(id)});
        if (!ingredient_exists)
            throw new Error (`Ingredient with id ${id} doesn't exist`);

        //Remove the ones it's in
        const recipes_deleted = await recipe_clt.deleteMany({ingredients: {$in: [id]}});

        //Remove the element
        const result_delete = await ingredient_clt.deleteOne({_id: ObjectID(id)});

        //Return message
        return ingredient_exists;
    },

    //Remove Author
    removeAuthor: async (parent, args, ctx, info) => {
        //Ctx and args
        const {id} = args;
        const {author_clt, recipe_clt} = ctx;

        //Check if the author exists
        const author_exists = await author_clt.findOne({_id: ObjectID(id)});
        if (!author_exists)
            throw new Error (`Author with id ${id} doesn't exist`);

        //Remove the ones it's in
        const recipes_deleted = await recipe_clt.deleteMany({author: id});

        //Remove the element
        const result_delete = await author_clt.deleteOne({_id: ObjectID(id)});

        //Return message
        return author_exists;
    },



    //Update Recipe
    updateRecipe: async (parent, args, ctx, info) => {
        //Ctx and args
        const {id, title, description, author, ingredients} = args;
        const {author_clt, ingredient_clt, recipe_clt} = ctx;


        //Verification of existance

        //Check if the recipe already exists
        const recipe_exists = await recipe_clt.findOne({_id: ObjectID(id)});
        if (!recipe_exists)
            throw new Error (`Recipe with id ${id} doesn't exist`);

        //Check if the author exists
        const author_exists = await author_clt.findOne({_id: ObjectID(author)});
        if (!author_exists)
            throw new Error (`Author with id ${author} doesn't exist`);

        //Check if the ingredient exists
        const ingredient_exists = await ingredient_clt.find({_id: {$in: ingredients}});
        if (!ingredient_exists)
            throw new Error (`Ingredient with one or more of the id ${ingredients} doesn't exist`);

        //Send recipe
        const result = await recipe_clt.findOneAndUpdate({_id: ObjectID(id)}, {$set:{title, description, author, ingredients}}, {returnOriginal: false});

        if (!result.value)
          throw new Error ("Couldn't update the recipe");
        
        return result.value;
    },

    //Update Ingredient
    updateIngredient: async (parent, args, ctx, info) => {
        //Ctx and args
        const {id, name} = args;
        const {ingredient_clt} = ctx;

        //Check if the ingredient exists
        const ingredient_exists = await ingredient_clt.findOne({_id: ObjectID(id)});
        if (!ingredient_exists)
            throw new Error (`Ingredient with id ${id} doesn't exist`);

        //Send recipe
        const result = await ingredient_clt.findOneAndUpdate({_id: ObjectID(id)}, {$set:{name}}, {returnOriginal: false});

        if (!result.value)
          throw new Error ("Couldn't update the ingredient");
        
        return result.value;
    },

    //Update Author
    updateAuthor: async (parent, args, ctx, info) => {
        //Ctx and args
        const {id, name, email} = args;
        const {author_clt} = ctx;

        //Check if the ingredient exists
        const author_exists = await author_clt.findOne({_id: ObjectID(id)});
        if (!author_exists)
            throw new Error (`Author with id ${id} doesn't exist`);

        //Send recipe
        const result = await author_clt.findOneAndUpdate({_id: ObjectID(id)}, {$set:{name, email}}, {returnOriginal: false});

        if (!result.value)
          throw new Error ("Couldn't update the author");
        
        return result.value;
    },
}

export {Mutation as default}