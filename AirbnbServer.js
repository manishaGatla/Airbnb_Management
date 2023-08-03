const { MongoClient, ObjectId, Binary } = require('mongodb');
const uri = 'mongodb://127.0.0.1:27017';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoose = require('mongoose');
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/Airbnb_Management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Mongoose connected');
    console.log('Connected to MongoDB');

  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

client.connect((err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  console.log('Mongo client connected');
  console.log('Connected to MongoDB');
  client.close();
});

// Define a model
const Schema = mongoose.Schema;
const roleSchema = new Schema({
  name: String,
  id: Number
});

const Roles = mongoose.model('Airbnb_Roles', roleSchema, 'Airbnb_Roles');
const Admins = mongoose.model('Airbnb_Admins', roleSchema, 'Airbnb_Admins');
const Hosts = mongoose.model('Airbnb_Hosts', roleSchema, 'Airbnb_Hosts');
const Guests = mongoose.model('Airbnb_Guests', roleSchema, 'Airbnb_Guests');
const Statuses = mongoose.model('Airbnb_Statuses', roleSchema, 'Airbnb_Statuses');
const Amenities = mongoose.model('Airbnb_Amenities', roleSchema, 'Airbnb_Amenities');
const Listings = mongoose.model('Airbnb_Listings', roleSchema, 'Airbnb_Listings');
const RoomTypes = mongoose.model('Airbnb_RoomTypes', roleSchema, 'Airbnb_RoomTypes');
const Accounts = mongoose.model('Airbnb_Accounts', roleSchema, 'Airbnb_Accounts');
const Bookings = mongoose.model('Airbnb_Booking', roleSchema, 'Airbnb_Booking');

// API endpoint to fetch data from MongoDB
app.get('/api/roles', (req, res) => {
  Roles.find()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Error fetching data from MongoDB' });
    });
});

app.get('/api/statuses', (req, res) => {
  Statuses.find()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Error fetching data from MongoDB' });
    });
});

app.post('/api/amentyAdd', (req, res) =>{
  const collection = client.db('Airbnb_Management').collection('Airbnb_Amenities');
  collection.insertOne(req.body.details)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error adding data from MongoDB:', error);
      res.status(500).json({ error: 'Error adding data from MongoDB' });
    });
})

app.get('/api/bookings', (req, res) => {
  Bookings.find()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Error fetching data from MongoDB' });
    });
});

app.get('/api/romTypes', (req, res) => {
  RoomTypes.find()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Error fetching data from MongoDB' });
    });
});

app.post('/api/addUser', (req, res) => {
  let collectionName = req.body.collectionName;
  let details = req.body.details;
  const collection = client.db('Airbnb_Management').collection('Airbnb_' + collectionName);
  collection.insertOne(req.body.details)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error adding data from MongoDB:', error);
      res.status(500).json({ error: 'Error adding data from MongoDB' });
    });
})

app.get('/api/allstays', async (req, res) => {
  Listings.find()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Error fetching data from MongoDB' });
    });
})

app.get('/api/stays', async (req, res) => {
  const id = req.query.id;
  Listings.find({ _id: Object(id) })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Error fetching data from MongoDB' });
    });
})

app.post('/api/stays/search', (req, res) => {
  const { country, city, minPrice, maxPrice, amenitiesId } = req.body;
  const collection = client.db('Airbnb_Management').collection('Airbnb_Listings');
  const query = {};
  if (country != null && country != '') {
    query['country'] = {
      $regex: '^' + country + '$',
      $options: 'i'
    }
  }


  if (city != null && city != '') {
    query['city'] = {
      $regex: '^' + city + '$',
      $options: 'i'
    }
  }

  if (minPrice != null || maxPrice != null) {
    query.price = {};
    if (minPrice != null) {
      query.price.$gte = minPrice;
    }
    if (maxPrice != null) {
      query.price.$lte = maxPrice;
    }
  }
  if (amenitiesId && amenitiesId.length > 0) {

    query.amenitiesId = { $in: amenitiesId };
  }

  Listings.find(query)
    .then(stays => {
      res.json(stays);
    })
    .catch(err => {
      console.error('Error searching stays:', err);
      res.status(500).json({ error: 'An error occurred while searching stays' });
    });
});

app.get('/api/get/stays', async (req, res) => {
  const Id = req.query.id;
  Listings.find({ hostId: Id })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Error fetching data from MongoDB' });
    });
})

app.get('/api/get/staysReserved', async (req, res) => {
  const Id = req.query.id;
  Listings.find({ guestId: Id })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Error fetching data from MongoDB' });
    });
})

app.post('/api/update/Status', async (req, res) => {
  const collection = client.db('Airbnb_Management').collection('Airbnb_Listings');
  const stay = req.body.id;
  let updateQuery;
  if (req.body.isAvaliable != null) {
    updateQuery = { $set: { isAvaliable: req.body.isAvaliable } };
  }
  else if (req.body.stayDetails != null) {
    updateQuery = { $set: { statusId: req.body.stayDetails.statusId, 
    paymentId: req.body.stayDetails.paymentId, NoOfGuestsBooked : req.body.stayDetails.NoOfGuestsBooked,
    guestId: req.body.stayDetails.guestId } };
  }

  const filter = { _id: new ObjectId(stay) };

  collection.updateOne(filter, updateQuery).then((data) => {
    res.json(data);
  })
})


app.get('/api/get/amenties', async (req, res) => {
  Amenities.find()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Error fetching data from MongoDB' });
    });
})

app.post('/api/addStay', (req, res) => {
  const collection = client.db('Airbnb_Management').collection('Airbnb_Listings');
  collection.insertOne(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error adding data from MongoDB:', error);
      res.status(500).json({ error: 'Error adding data from MongoDB' });
    });
})


app.post('/api/update/profile', (req, res) => {
  console.log(req.body);
  const collection = client.db('Airbnb_Management').collection(req.body.collectionName);
  const userDetails = req.body.details;
  const filter = { email : req.body.email };
  let update;
    update = {
      $set: {
        name: userDetails.name,
        password: userDetails.password,
        email: userDetails.email,
        phoneNumber: userDetails.phoneNumber
      }
    };
    console.log(update);
  
  collection.updateOne(filter, update).then((data) => {
    res.json(data);
  })
})

app.post('/api/update/resetPassword', (req, res) => {
  const adminCollection = client.db('Airbnb_Management').collection('Airbnb_Admins');
  const hostCollection = client.db('Airbnb_Management').collection('Airbnb_Hosts');
  const guestCollection = client.db('Airbnb_Management').collection('Airbnb_Guests');
  const email = req.body.email;
  const password = req.body.details.Password;
  const filter = { email: email };
  let update = {
    $set: {
      password: password
    }
  };

  adminCollection.updateOne(filter, update).then((data) => {
    console.log(data.modifiedCount);
    if(data.modifiedCount > 0){
      res.json(data);
    }
    else{
      hostCollection.updateOne(filter, update).then((dataHost) => {
        console.log(dataHost.modifiedCount);
        if(dataHost.modifiedCount > 0){
          res.json(dataHost);
        }
        else{
          guestCollection.updateOne(filter, update).then((dataGuest) => {
            console.log(dataGuest.modifiedCount);
            res.json(dataGuest);
          })
        }
      })
      
    }
  })
  
})

app.delete('/api/delete/airbnb', (req, res) => {
  const Id = req.query.id;
  Listings.deleteOne({ _id: Id })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Error fetching data from MongoDB' });
    });
})

app.post('/api/addAccount', (req, res) => {
  const collection = client.db('Airbnb_Management').collection('Airbnb_Accounts');
  collection.insertOne(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error adding data from MongoDB:', error);
      res.status(500).json({ error: 'Error adding data from MongoDB' });
    });
})

app.get('/api/get/accounts', async (req, res) => {
  const Id = req.query.id;
  Accounts.find({ userId: Id })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Error fetching data from MongoDB' });
    });
})

app.get('/api/accounts', async (req, res) => {
  Accounts.find()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Error fetching data from MongoDB' });
    });
})

app.delete('/api/delete/accounts', (req, res) => {
  const Id = req.query.id;
  Accounts.deleteOne({ _id: Id })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Error fetching data from MongoDB' });
    });
})

app.post('/api/update/accounts', async (req, res) => {
  const collection = client.db('Airbnb_Management').collection('Airbnb_Accounts');
  const id = req.body.id;
  const balance = req.body.balance;
  const filter = { _id: new ObjectId(id) };

  update = {
    $set: {
      balance: balance
    }
  }
  collection.updateOne(filter, update).then((data) => {
    res.json(data);
  })
})

app.get('/api/users', async (req, res) => {
  const queryParam = req.query.emailid;
  const promises = [Admins.find({ email: queryParam }), Guests.find({ email: queryParam }), Hosts.find({ email: queryParam })]
  const [result1, result2, result3] = await Promise.all(promises);
  if (result1.length > 0) {
    let data = {
      details: result1,
      role: "Admin"
    }
    return res.json(data);
  }
  else if (result2.length > 0) {
    let data = {
      details: result2,
      role: "Guest"
    }
    return res.json(data);
  }

  else if (result3.length > 0) {
    let data = {
      details: result3,
      role: "Host"
    }
    return res.json(data);
  }
  else {
    return res.json([]);
  }
})

app.delete('/api/users/delete', async (req, res) => {
  const Id = req.query.id;
  collection = req.query.collectionName == 'Admins' ? Admins : req.query.collectionName == 'Hosts' ? Hosts : Guests;
  collection.deleteOne({ _id: Id })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Error fetching data from MongoDB' });
    });
})

app.post('/api/booking', async (req, res) => {
  const collection = client.db('Airbnb_Management').collection('Airbnb_Booking');
  collection.insertOne(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error adding data from MongoDB:', error);
      res.status(500).json({ error: 'Error adding data from MongoDB' });
    });
})

app.get('/api/userById', async (req, res) => {
  const queryParam = req.query.id;
  const collectionName = req.query.collectionName;
  collectionName.find({ _id: queryParam }).then((data) => {
    res.json(data);
  })
    .catch((error) => {
      console.error('Error adding data from MongoDB:', error);
      res.status(500).json({ error: 'Error adding data from MongoDB' });
    });
})

app.get('/api/allUsers', async (req, res) => {
  collection = req.query.collectionName == 'Admins' ? Admins : req.query.collectionName == 'Hosts' ? Hosts : Guests;
  collection.find().then((data) => {
    res.json(data);
  })
    .catch((error) => {
      console.error('Error adding data from MongoDB:', error);
      res.status(500).json({ error: 'Error adding data from MongoDB' });
    });
})

app.post('/api/paymentDetails', (req, res) => {
  const collection = client.db('Airbnb_Management').collection('Airbnb_Payments');
  collection.insertOne(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error adding data from MongoDB:', error);
      res.status(500).json({ error: 'Error adding data from MongoDB' });
    });
})

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});