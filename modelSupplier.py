from google.appengine.ext import ndb

import ndbTools

class Supplier(ndb.Model):
    name = ndb.StringProperty()
    address1 = ndb.StringProperty()
    address2 = ndb.StringProperty()
    city = ndb.StringProperty()
    state = ndb.StringProperty()
    zipCode = ndb.StringProperty()
    phoneNumber = ndb.StringProperty()
    website = ndb.StringProperty()
    store = ndb.KeyProperty()
    displayName = ndb.ComputedProperty(lambda self: ComputeDisplayName(self))


def AddSupplier(d):
    print d
    return ndbTools.AddData(Supplier, d, d['store']['key'])

def ComputeDisplayName(self):
    return self.name + " (" + self.city + ")"


