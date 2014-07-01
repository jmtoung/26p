from google.appengine.ext import ndb

import ndbTools

class Shipping(ndb.Model):
    carrier = ndb.StringProperty(choices=['USPS', 'FedEx', 'UPS'])
    service = ndb.StringProperty()
    tracking = ndb.StringProperty()
    packageLength = ndb.FloatProperty()
    packageWidth = ndb.FloatProperty()
    packageDepth = ndb.FloatProperty()
    weight = ndb.FloatProperty()
    postageCost = ndb.FloatProperty()
    signatureRequired = ndb.BooleanProperty()
    shippingMaterials = ndb.StringProperty()
