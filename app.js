const feathers = require('@feathersjs/feathers');
const Sequelize = require('sequelize');
const express = require('@feathersjs/express');

const app = express(feathers());

const sequelize = new Sequelize('imadethis', 'root', 'imadethis', {
    host: 'localhost',
    dialect: 'mysql',  
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: {
        socketPath: '/cloudsql/imadethis:europe-west1:imadethis-db',
    },
    operatorsAliases: false,
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
    //base64 enncoded
    image: Sequelize.TEXT,
}, {
    timestamps: false,
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
        let entrees = Entrees.count({
            where: query,
            distinct: true,
            col: 'id'
        });
        return Promise.resolve(entrees);
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
const port = 8080;

app.listen(port, () => {
    console.log(`Feathers server listening on port ${port}`);
});

