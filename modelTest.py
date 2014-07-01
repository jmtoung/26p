from google.appengine.ext import ndb

import ndbTools

class Test(ndb.Model):
    test = ndb.TextProperty()

def GetUser(property, value):
    if property == "key":
        return ndb.Key(urlsafe=value).get()
    else:
        users = [u for u in User.query(User._properties[property] == value)]
        return users[0]

def AddTest(test):
    return ndbTools.AddData(Test, test)

