from google.appengine.ext import ndb

import ndbTools

class SellingMethod(ndb.Model):
    name = ndb.StringProperty(choices=['Ebay', 'Direct-to-Consumer'])
    fees = ndb.FloatProperty(repeated=True)
    totalFees = ndb.ComputedProperty(lambda self: ComputeTotalFees(self))

    paymentMethod = ndb.KeyProperty(kind='PaymentMethod')

def ComputeTotalFees(self):
    totalFees = 0
    for f in self.fees:
        totalFees += self.fees
    return totalFees