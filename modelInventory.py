from google.appengine.ext import ndb

import ndbTools

class Inventory(ndb.Model):
    purchaseDate = ndb.DateProperty()
    purchaseDateTime = ndb.DateTimeProperty()
    purchaseTime = ndb.TimeProperty()
    supplier = ndb.KeyProperty(kind='Supplier')
    receiptNumber = ndb.StringProperty()
    purchaser = ndb.KeyProperty(kind='Purchaser')
    paymentMethod = ndb.KeyProperty(kind='PaymentMethod')
    category = ndb.StringProperty()
    brand = ndb.StringProperty()
    initialQuantity = ndb.IntegerProperty()
    availableQuantity = ndb.IntegerProperty()
    unitPrice = ndb.FloatProperty()
    totalPrice = ndb.FloatProperty()
    itemNumber = ndb.StringProperty()
    itemName = ndb.StringProperty()
    itemSpecifics = ndb.StringProperty()
    itemSize = ndb.StringProperty()
    itemColor = ndb.StringProperty()
    submitter = ndb.KeyProperty(kind='User')
    store = ndb.KeyProperty(kind='Store')

    saleTransactions = ndb.KeyProperty(kind='SaleTransaction', repeated=True)
    damageLossTransactions = ndb.KeyProperty(kind='DamageLossTransaction', repeated=True)

def AddInventory(inventory, items):

    inventory['purchaseDateTime'] = inventory['purchaseDate'] + ' ' + inventory['purchaseTime']
    for item in items:
        item['initialQuantity'] = int(item['quantity'])
        item['availableQuantity'] = int(item['quantity'])

        for x in inventory:
            item[x] = inventory[x]
        ndbTools.AddData(Inventory, item, item['store']['key'])

def QueryInventory(storeKey):
    return Inventory.query(ancestor=ndb.Key(urlsafe=storeKey)).fetch()

