from google.appengine.ext import ndb

import ndbTools

class Purchaser(ndb.Model):
    firstName = ndb.StringProperty()
    lastName = ndb.StringProperty()
    companyName = ndb.StringProperty()
    email = ndb.StringProperty()
    user = ndb.KeyProperty(kind='User')
    displayName = ndb.ComputedProperty(lambda self: ComputeDisplayName(self))
    store = ndb.KeyProperty(kind='Store')

def GetPurchaser(property, value):
    if property == "key":
        return ndb.Key(urlsafe=value).get()
    else:
        users = [u for u in User.query(User._properties[property] == value)]
        return users[0]

def ComputeDisplayName(self):
    displayName = None

    displayName = " ".join([getattr(self, x) for x in ['firstName', 'lastName'] if hasattr(self, x)])
    if not displayName:
            displayName = self.companyName
    else:
            if getattr(self, 'companyName'):
                    displayName = displayName + " (" + self.companyName + ")"

    return displayName



def AddPurchaser(d):

    return ndbTools.AddData(Purchaser, d, d['store'])
