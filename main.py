import json
import webapp2
import logging

from google.appengine.ext import ndb
import ndbTools
import modelInventory
import modelUser
import modelStore
import modelSupplier
import modelPaymentMethod
import modelPurchaser
import modelSaleTransaction
import modelTest

class RestHandler(webapp2.RequestHandler):

    def dispatch(self):
        super(RestHandler, self).dispatch()

    def SendJson(self, r):
        self.response.headers['content-type'] = 'text/plain'
        self.response.write(json.dumps(r))

    def HandleException(self, exception):
        logging.exception(exception)
        self.response.write('ERROR OCCURED')

        if isinstance(exception, webapp2.HTTPException):
            self.response.set_status(exception.code)
        else:
            self.response.set_status(500)

class UserHandler(RestHandler):
    def post(self):
        data = json.loads(self.request.body)
        user = modelUser.AddUser(data)
        r = ndbTools.AsDict(user.key)
        self.SendJson(r)

    def get(self):
        queryParams = json.loads(self.request.get("queryParams"))
        print queryParams

        users = modelUser.QueryUser(queryParams)
        users = [ndbTools.AsDict(user.key) for user in users]
        self.SendJson(users)

class UserKeyHandler(RestHandler):
    def post(self, key):
        r = json.loads(self.request.body)
        user = ndbTools.SaveData(key, r)
        #user = modelUser.SaveUser(key, r)
        r = ndbTools.AsDict(user.key)
        self.SendJson(r)

    def get(self, key):
        user = ndbTools.GetData(key)
        r = ndbTools.AsDict(user.key)
        self.SendJson(r)

class StoreHandler(RestHandler):
    def post(self):
        r = json.loads(self.request.body)
        store = modelStore.AddStore(r)
        r = ndbTools.AsDict(store.key)
        self.SendJson(r)

    def get(self):
        store = modelStore.GetStore(self.request.get('key'))
        r = ndb.Tools.AsDict(store.key)
        self.SendJson(r)

class StoreKeyHandler(RestHandler):
    def post(self, key):
        r = json.loads(self.request.body)
        store = ndbTools.SaveData(key, r)
        r = ndbTools.AsDict(store.key)
        self.SendJson

    def get(self, key):
        user = ndbTools.GetData(key)
        r = ndbTools.AsDict(user.key)
        self.SendJson(r)

class SupplierHandler(RestHandler):
    def post(self):
        r = json.loads(self.request.body)
        supplier = modelSupplier.AddSupplier(r)
        r = ndbTools.AsDict(supplier.key)
        self.SendJson(r)

    def get(self):
        store = modelStore.GetStore(self.request.get('key'))
        r = ndb.Tools.AsDict(store.key)
        self.SendJson(r)

class SupplierKeyHandler(RestHandler):
    def post(self, key):
        r = json.loads(self.request.body)
        store = ndbTools.SaveData(key, r)
        r = ndbTools.AsDict(store.key)
        self.SendJson

    def get(self, key):
        user = ndbTools.GetData(key)
        r = ndbTools.AsDict(user.key)
        self.SendJson(r)

class PaymentMethodHandler(RestHandler):
    def post(self):
        r = json.loads(self.request.body)
        paymentMethod = modelPaymentMethod.AddPaymentMethod(r)
        r = ndbTools.AsDict(paymentMethod.key)
        self.SendJson(r)

    def get(self):
        #print self.request.get('key')
        keys = ['agpkZXZ-ZWNvdW50chILEgVTdG9yZRiAgICAgIDFCgw', 'agpkZXZ-ZWNvdW50cigLEgVTdG9yZRiAgICAgIDFCgwLEglQdXJjaGFzZXIYgICAgICAxQkM']
        for key in keys:
            paymentMethod = modelPaymentMethod.GetPaymentMethod(key)
            print '---'
            print key
            print paymentMethod
            for p in paymentMethod:
                print '~~~'
                print p.purchaser.get().firstName
                print '~~~'
            #print ndbTools.AsDict(paymentMethod.key)
            print '---'
        #r = ndb.Tools.AsDict(store.key)
        #self.SendJson(r)

class PurchaserHandler(RestHandler):
    def post(self):
        r = json.loads(self.request.body)
        purchaser = modelPurchaser.AddPurchaser(r)
        r = ndbTools.AsDict(purchaser.key)
        self.SendJson(r)

    def get(self):
        store = modelStore.GetStore(self.request.get('key'))
        r = ndb.Tools.AsDict(store.key)
        self.SendJson(r)

class InventoryHandler(RestHandler):
    def post(self):
        r = json.loads(self.request.body)
        modelInventory.AddInventory(r['inventory'], r['items'])
        #paymentMethod = modelPaymentMethod.AddPaymentMethod(r)
        #r = ndbTools.AsDict(paymentMethod.key)
        #self.SendJson(r)

    def get(self):
        inventory = modelInventory.QueryInventory(self.request.get('storeKey'))
        r = [ndbTools.AsDict(i.key) for i in inventory]
        self.SendJson(r)

class InventoryKeyHandler(RestHandler):
    def post(self):
        r = json.loads(self.request.body)
        modelInventory.AddInventory(r['inventory'], r['items'])
        #paymentMethod = modelPaymentMethod.AddPaymentMethod(r)
        #r = ndbTools.AsDict(paymentMethod.key)
        #self.SendJson(r)

    def get(self, key):
        user = ndbTools.GetData(key)
        r = ndbTools.AsDict(user.key)
        self.SendJson(r)

    def delete(self, itemKey):
        ndbTools.DeleteData(itemKey)

class SaleTransactionHandler(RestHandler):
    def post(self):
        r = json.loads(self.request.body)
        saleTransaction = modelSaleTransaction.AddSaleTransaction(r)
        print '---'
        print saleTransaction
        print '---'
        r = ndbTools.AsDict(saleTransaction.key)
        print '###'
        print r
        self.SendJson(r)

    def get(self):
        store = modelStore.GetStore(self.request.get('key'))
        r = ndb.Tools.AsDict(store.key)
        self.SendJson(r)



class TestHandler(RestHandler):
    def post(self):
        data = json.loads(self.request.body)
        print '~~~request body~~~'
        print data
        print '~~~~~~~~~~~~~~~~~~'
        test = modelTest.AddTest(data)
        print '###json###'
        print test

class LookupKeyHandler(RestHandler):
    def get(self, key):
        print key
        print 'hi'
        key = ndb.Key(urlsafe=key)
        entity = key.get()
        if entity:
            r = ndbTools.AsDict(key)
            self.SendJson(r)
        else:
            self.HandleException(Exception())

APP = webapp2.WSGIApplication([
    ('/rest/lookup/key/(.*)', LookupKeyHandler),
    ('/rest/user', UserHandler),
    ('/rest/user/(.*)', UserKeyHandler),
    ('/rest/store', StoreHandler),
    ('/rest/store/(.*)', StoreKeyHandler),
    ('/rest/supplier', SupplierHandler),
    ('/rest/supplier/(.*)', SupplierKeyHandler),
    ('/rest/paymentMethod', PaymentMethodHandler),
    ('/rest/purchaser', PurchaserHandler),
    ('/rest/inventory', InventoryHandler),
    ('/rest/inventory/(.*)', InventoryKeyHandler),
    ('/rest/saleTransaction', SaleTransactionHandler),
    ('/rest/test', TestHandler)

], debug=True)
