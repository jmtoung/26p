from google.appengine.ext import ndb

import ndbTools

##feeTypes = ['PaypalSelling', 'PaypalSellingIntl', 'EbayFinalValue', 'EbayFinalValueShipping']

class Fees(ndb.Model):
    type = ndb.StringProperty()
    amount = ndb.FloatProperty()
    feeCollector = ndb.StringProperty()
    paymentMethod = ndb.KeyProperty(kind='PaymentMethod')
