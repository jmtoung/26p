from google.appengine.ext import ndb
import ndbTools

class Store(ndb.Model):
    name = ndb.StringProperty()
    owner = ndb.KeyProperty(kind='User')
    viewers = ndb.KeyProperty(kind='User', repeated=True)
    writers = ndb.KeyProperty(kind='User', repeated=True)
    admins = ndb.KeyProperty(kind='User', repeated=True)
    suppliers = ndb.KeyProperty(kind='Supplier', repeated=True)
    lastSupplier = ndb.KeyProperty(kind='Supplier')
    paymentMethods = ndb.KeyProperty(kind='PaymentMethod', repeated=True)
    lastPaymentMethod = ndb.KeyProperty(kind='PaymentMethod')
    purchasers = ndb.KeyProperty(kind='Purchaser', repeated=True)
    lastPurchaser = ndb.KeyProperty(kind='Purchaser')

def GetStore(property, value):
    if property == "key":
        return ndb.Key(urlsafe=value).get()
    else:
        stores = [s for s in Store.query(Store._properties[property] == value)]
        return stores[0]

def AddStore(d):
    return ndbTools.AddData(Store, d)

def DeleteInventory(id):
  key = ndb.Key(Inventory, id)
  key.delete()

