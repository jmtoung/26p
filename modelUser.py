from google.appengine.ext import ndb

import ndbTools

class User(ndb.Model):
    email = ndb.StringProperty()
    firebaseUid = ndb.StringProperty()
    firebaseId = ndb.StringProperty()
    stores = ndb.KeyProperty(repeated=True)
    currentStore = ndb.KeyProperty()

def AddUser(user):
    return ndbTools.AddData(User, user)

def DeleteInventory(id):
    key = ndb.Key(Inventory, id)
    key.delete()

def QueryUser(queryParams):
    return ndbTools.QueryData(User, queryParams)
