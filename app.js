const feathers = require('@feathersjs/feathers');
const Sequelize = require('sequelize');
const express = require('@feathersjs/express');

const app = express(feathers());

const sequelize = new Sequelize('imadethis', 'root', 'imadethis', {
    host: '127.0.0.1',
    dialect: 'mysql',  
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorsAliases: false,
});

// Enable CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
// Turn on JSON parser for REST services
app.use(express.json());
// Turn on URL-encoded parser for REST services
app.use(express.urlencoded({ extended: true }));
// Enable REST services
app.configure(express.rest());


const Entrees = sequelize.define('entrees', {
    chef: Sequelize.STRING,
    recipe_id: Sequelize.INTEGER,
    notes: Sequelize.STRING,
    entree_name: Sequelize.STRING,
    //base64 enncoded
    image: Sequelize.TEXT,
})

const Recipes = sequelize.define('recipes', {
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    ingredients: Sequelize.STRING,
}, {
    timestamps: false,
});

const Steps = sequelize.define('steps', {
    recipe_id: Sequelize.INTEGER,
    text: Sequelize.STRING,
    order: Sequelize.INTEGER,
}, {
    timestamps: false,
});

const entrees = {
    find (params) {
        let query = params.query;
        let entrees = Entrees.findAll({
            where: query,
        });
        return Promise.resolve(entrees);
    },
    get (id, params) {
        let entree = Entrees.findOne({
            where: {
                id: id
            }
        });
        return Promise.resolve(entree);
    },
    create (data) {
        let entree = Entrees.create(data);
        return Promise.resolve(entree);
    }
};

const recipes = {
    find (params) {
        let query = params.query;
        let recipes = Recipes.findAll({
            where: query
        });
        return Promise.resolve(recipes);
    },
    get (id, params) {
        let recipe = Recipes.findOne({
            where: {
                id: id
            }
        });
        return Promise.resolve(recipe);
    },
    create (params) {

    }
};

app.use('/entrees', entrees);
app.use('/recipes', recipes);

// Start the server
const port = 8000;

app.listen(port, () => {
    console.log(`Feathers server listening on port ${port}`);
});

