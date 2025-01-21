require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = 'process.env.HUBSPOT_ACCESS_TOKEN';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    try {
      const hubspotApiKey = process.env.HUBSPOT_ACCESS_TOKEN;
      const endpoint = 'https://api.hubapi.com/crm/v3/objects/2-138306837?properties=name,bio,price';
  
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${hubspotApiKey}`,
          'Content-Type': 'application/json',
        },
      });
  
      const records = response.data.results || [];
  
      res.render('homepage', { title: 'Homepage | Custom Objects', records });
    } catch (error) {
      console.error('Erreur lors de la récupération des objets personnalisés :', error.response?.data || error.message);
      res.status(500).send('Une erreur s\'est produite lors de la récupération des objets.');
    }
});  

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});


app.post('/update-cobj', async (req, res) => {
    const { name, bio, price } = req.body;
  
    try {
      const hubspotApiKey = process.env.HUBSPOT_ACCESS_TOKEN;
      const endpoint = 'https://api.hubapi.com/crm/v3/objects/2-138306837';
  
      await axios.post(endpoint, {
        properties: {
          name,
          bio,
          price,
        },
      }, {
        headers: {
          Authorization: `Bearer ${hubspotApiKey}`,
          'Content-Type': 'application/json',
        },
      });
  
      res.redirect('/');
    } catch (error) {
      console.error('Erreur lors de la création de l’objet personnalisé :', error.response?.data || error.message);
      res.status(500).send('Une erreur s\'est produite lors de la création de l\'objet.');
    }
  });

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));