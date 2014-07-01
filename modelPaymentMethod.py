from google.appengine.ext import ndb
import ndbTools

class PaymentMethod(ndb.Model):
    purchaser = ndb.KeyProperty(kind='Purchaser')
    store = ndb.KeyProperty(kind='Store')
    type = ndb.StringProperty(choices=['Credit Card', 'Debit Card', 'Bank Account', 'Cash', 'Paypal'])
    cardType = ndb.StringProperty(choices=['Visa', 'Master Card', 'Discover', 'American Express', 'Paypal'])
    accountNumber = ndb.StringProperty()
    expirationDate = ndb.DateProperty()
    paymentDirection = ndb.StringProperty(choices=['Outgoing', 'Incoming'], repeated=True)
    displayName = ndb.ComputedProperty(lambda self: ComputeDisplayName(self))

def GetPaymentMethod(key):

    return PaymentMethod.query(ancestor=ndb.Key(urlsafe=key)).fetch()

#    if property == "key":
#        return ndb.Key(urlsafe=value).get()
#    #else:
#        #stores = [s for s in Store.query(Store._properties[property] == value)]
#        #return stores[0]

def ComputeDisplayName(self):
    if self.type=="Credit Card":
        result = ""
        for x in [self.cardType, self.accountNumber, self.expirationDate]:
            if x:
                result = result + " " + str(x)
        return result
    else:
        return 'NOT CODED YET'

def AddPaymentMethod(d):
    return ndbTools.AddData(PaymentMethod, d, d['purchaser']['key'])


