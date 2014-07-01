from google.appengine.ext import ndb

import ndbTools
from modelFees import Fees
from modelShipping import Shipping

class SaleItem(ndb.Model):
    inventory = ndb.KeyProperty(kind='Inventory')
    salePrice = ndb.FloatProperty()
    saleTax = ndb.FloatProperty()
    saleQuantity = ndb.IntegerProperty()

class SaleTransaction(ndb.Model):

    saleDate = ndb.DateProperty()
    saleDateTime = ndb.DateTimeProperty()
    saleTime = ndb.TimeProperty()

    saleItems = ndb.StructuredProperty(SaleItem, repeated=True)

    sellingMethod = ndb.StringProperty() # change this to key later; each selling method will be like "Ebay (type) | jumboshrimps (account)"
    sellingMethodFees = ndb.StructuredProperty(Fees, repeated=True) # change this to key "Fees" later
    sellingMethodFeePaymentMethod = ndb.StringProperty() # change this to key later; will be all payment methods that are outgoing

    paymentMethod = ndb.KeyProperty(kind='PaymentMethod') # will be all payment methods that are incoming
    paymentMethodFees = ndb.StructuredProperty(Fees, repeated=True)

    buyerName = ndb.StringProperty()
    buyerEmail = ndb.StringProperty()
    #buyerAddress = ndb.StructuredProperty() #

    saleShippingPrice = ndb.FloatProperty()
    shipping = ndb.StructuredProperty(Shipping, repeated=True)

    returnTransactions = ndb.KeyProperty(kind='ReturnTransaction', repeated=True)

    returnCosts = ndb.FloatProperty()

    totalFees = ndb.ComputedProperty(lambda self: ComputeTotalFees(self))

    profit = ndb.ComputedProperty(lambda self: ComputeProfit(self))
    itemReturn = ndb.ComputedProperty(lambda self: ComputeReturn(self))

def AddSaleTransaction(d):
    return ndbTools.AddData(SaleTransaction, d, parent=d['store']['key'])

def ComputeTotalFees(self):
    return 0

def ComputeProfit(self):
    return 0

def ComputeReturn(self):
    return 0

