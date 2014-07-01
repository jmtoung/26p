from google.appengine.ext import ndb

import re
import datetime

# function for getting entity from GAE by key
def GetData(key):
    return ndb.Key(urlsafe=key).get()

# function for querying GAE
def QueryData(model, queryParams):
    newQueryParams = {}
    if 'ancestor' in queryParams:
        if isinstance(queryParams['ancestor'], basestring):
            ancestor = ndb.Key(urlsafe=queryParams['ancestor'])
        elif isinstance(queryParams['ancestor'], dict):
            ancestor = ndb.Key(urlsafe=queryParams['ancestor']['key'])
        else:
            raise Exception('invalid key parameter in queryParams: ' + str(queryParams['key']))
        newQueryParams['ancestor'] = ancestor

    if 'filters' in queryParams:
        filterNode = []
        for f in queryParams['filters']:
            filterNode.append(ndb.FilterNode(f['property'], f['operator'], f['value']))
        newQueryParams['filters'] = ndb.AND(*filterNode)

    query = model.query(**newQueryParams)

    if 'orders' in queryParams:
        if queryParams['orders']['direction'] == 'ASC':
            query = query.order(getattr(model, queryParams['orders']['property']))
        elif queryParams['orders']['direction'] == 'DESC':
            query = query.order(-getattr(model, queryParams['orders']['property']))
        else:
            raise Exception('invalid direction parameter for order: ' + queryParams['orders']['direction'])

    return query.fetch()

# function for adding a new GAE entity
def AddData(model, data, parent=None):
    entity = _CreateEntity(model, data, parent)
    entity.put()
    return entity

# private helper function for adding data
def _CreateEntity(model, data, parent=None):

    entity = None
    if parent:
        key = None
        if isinstance(parent, ndb.model.KeyProperty):
            key = parent
        elif isinstance(parent, basestring):
            key = ndb.Key(urlsafe=parent)
        elif isinstance(parent, dict):
            key = ndb.Key(urlsafe=parent['key'])
        elif isinstance(parent, list):
            key = ndb.Key(pairs=parent)
        else:
            raise Exception('invalid parent parameter to CreateEntity method')

        if key.get():
            entity = model(parent=key)
    else:
        entity = model()

    for x in model._properties:
        property = model._properties[x]

        if x in data:
            if property._repeated:
                values = _CheckValueIntegrityList(property, data[x])
                setattr(entity, x, values)
            else:

                value = _CheckValueIntegrity(property, data[x])
                setattr(entity, x, value)

        else:
            if property._required:
                raise Exception('required attribute ' + x + ' not defined')
    return entity

# private helper function for adding data
def _CheckValueIntegrityList(property, data):
    values = []
    for d in data:
        value = _CheckValueIntegrity(property, d)
        if value not in values:
            values.append(value)
    return values

# private helper function for adding data
def _CheckValueIntegrity(property, data):

    if isinstance(property, ndb.model.StringProperty):
        if isinstance(data, basestring):
            return data
        else:
            raise Exception('property ' + str(property) + ' expects StringProperty: received ' + str(data) + ' ' + str(type(data)) + ' instead')

    elif isinstance(property, ndb.model.TextProperty):
        if isinstance(data, basestring):
            return data
        else:
            raise Exception('property ' + str(property) + ' expects TextProperty: received ' + str(data) + ' ' + str(type(data)) + ' instead')

    elif isinstance(property, ndb.model.BooleanProperty):
        if isinstance(data, bool):
            return data
        else:
            raise Exception('property ' + str(property) + ' expects BooleanProperty: received ' + str(data) + ' ' + str(type(data)) + ' instead')

    elif isinstance(property, ndb.model.IntegerProperty):
        if isinstance(data, int):
            return data
        else:
            raise Exception('property ' + str(property) + ' expects IntegerProperty: received ' + str(data) + ' ' + str(type(data)) + ' instead')

    elif isinstance(property, ndb.model.FloatProperty):
        if isinstance(data, float):
            return data
        elif isinstance(data, int):
            return float(data)
        else:
            raise Exception('property ' + str(property) + ' expects FloatProperty: received ' + str(data) + ' ' + str(type(data)) + ' instead')

    elif isinstance(property, ndb.model.DateProperty):
        if isinstance(data, basestring):
            return AsDateObject(data)
        else:
            raise Exception('property ' + str(property) + ' expects StringProperty: received ' + str(data) + ' ' + str(type(data)) + ' instead')

    elif isinstance(property, ndb.model.TimeProperty):
        if isinstance(data, basestring):
            return AsTimeObject(data)
        else:
            raise Exception('property ' + str(property) + ' expects StringProperty: received ' + str(data) + ' ' + str(type(data)) + ' instead')

    elif isinstance(property, ndb.model.DateTimeProperty):
        if isinstance(data, basestring):
            return AsDateTimeObject(data)
        else:
            raise Exception('property ' + str(property) + ' expects StringProperty: received ' + str(data) + ' ' + str(type(data)) + ' instead')

    elif isinstance(property, ndb.model.StructuredProperty):
        return _CreateEntity(property._modelclass, data)

    elif isinstance(property, ndb.model.KeyProperty):
        (urlsafe, key) = None, None
        if isinstance(data, basestring):
            urlsafe = data
        elif isinstance(data, dict):
            urlsafe = data['key']
        else:
            raise Exception('property ' + str(property) + ' expects KeyProperty: received ' + str(data) + ' ' + str(type(data)) + ' instead')

        if urlsafe:
            key = ndb.Key(urlsafe=urlsafe)

        if key and key.get():
            return key
        else:
            raise Exception('key points to nonexistent object: ' + str(key))
    else:
        raise Exception('property ' + str(property) + ' not yet implemented')


def DeleteData(key):
    if isinstance(key, basestring):
        key = ndb.Key(urlsafe=key)
    elif isinstance(key, ndb.model.KeyProperty):
        pass
    else:
        raise Exception('invalid key parameter passed to DeleteData')

    key.delete()
    return

# function for getting an object referenced by 'key'
def GetData(key):
    if isinstance(key, basestring):
        return ndb.Key(urlsafe=key).get()
    elif isinstance(key, dict):
        return ndb.Key(urlsafe=key['key'])
    else:
        raise Exception('unknown key type')

# function for saving a python dict object (obj) into GAE entity (referenced by 'key')
def SaveData(key, obj):
    entity = ndb.Key(urlsafe=key).get()

    for x in entity.__class__._properties:
        property = entity.__class__._properties[x]

        if isinstance(property, ndb.model.ComputedProperty):
            continue
        if property._repeated:
            values = []
            for d in obj[x]:
                value = _CheckValueIntegrity(property, d)
                if value not in values:
                    values.append(value)
            setattr(entity, x, values)
        else:
            value = _CheckValueIntegrity(property, obj[x])
            setattr(entity, x, value)

    entity.put()
    return entity


# function for returning a ndb object as a dictionary
def AsDict(obj, level = 0):

    dict = None
    entity = None
    if isinstance(obj, ndb.Key):
        dict = {'id': obj.id(), 'key': obj.urlsafe()}

        if level > 2:
            return obj.urlsafe()

        entity = obj.get()
        if entity is None:
            return None

    elif isinstance(obj, ndb.Model):
        dict = {}
        entity = obj

    else:
        raise Exception('invalid parameter obj passed to AsDict')

    for p in entity._properties:
        attr = getattr(entity, p)

        #if p == "shipping":
            #print '~~~'
            #print attr
            #print '~~~'

        if isinstance(attr, ndb.Key):
            attr = AsDict(attr, level = (level + 1))
        elif isinstance(attr, list):
            #print 'p: ' + str(p)
            #print 'attr: ' + str(attr)
            attr = [AsDict(a, level = (level + 1)) for a in attr]
            attr = [a for a in attr if not a is None]
        elif isinstance(attr, (datetime.datetime, datetime.date, datetime.time)):
            attr = str(attr)

        dict[p] = attr

    return dict

# function for returning a ndb object as a dictionary
def AsDictBACKUP(obj, level = 0):

    if isinstance(obj, ndb.Key):
        dict = {'id': obj.id(), 'key': obj.urlsafe()}

        if obj.get() is None:
            return None

        if level > 2:
            return obj.urlsafe()

        for p in obj.get()._properties:
            attr = getattr(obj.get(), p)

            if p == "shipping":
                print '~~~'
                print attr
                print '~~~'

            if isinstance(attr, ndb.Key):
                attr = AsDict(attr, level = (level + 1))
            elif isinstance(attr, list):
                print 'p: ' + str(p)
                print 'attr: ' + str(attr)
                attr = [AsDict(a, level = (level + 1)) for a in attr]
                attr = [a for a in attr if not a is None]
            elif isinstance(attr, (datetime.datetime, datetime.date, datetime.time)):
                attr = str(attr)

            dict[p] = attr

        return dict
    elif isinstance(obj, ndb.Model):
        dict = {}

        for p in obj._properties:
            print '@@@'
            print p
            print getattr(obj, p)
            print '@@@'

        print obj
        print type(obj)
        print isinstance(obj, ndb.Model)
        print '/////'
        return '{error: "AsDict()" requires entity key}'


# function for returning a date and time string as a date object
def AsDateTimeObject(dt):
    dateTimeMatch = re.match('.*(\d{4}-\d{2}-\d{2}).*(\d{2}:\d{2}).*',dt)
    if dateTimeMatch:
        dateValue = dateTimeMatch.groups()[0].split('-')
        dateValue = [int(dv) for dv in dateValue]
        timeValue = dateTimeMatch.groups()[1].split(':')
        timeValue = [int(tv) for tv in timeValue]
        return datetime.datetime(dateValue[0], dateValue[1], dateValue[2], timeValue[0], timeValue[1])
    else:
        raise Exception('invalid DateTime parameter: ' + str(dt))

def AsDateObject(d):
    dateMatch = re.match('.*(\d{4}-\d{2}-\d{2}).*',d)
    if dateMatch:
        dateValue = dateMatch.groups()[0].split('-')
        dateValue = [int(dv) for dv in dateValue]
        return datetime.date(dateValue[0], dateValue[1], dateValue[2])
    else:
        return Exception('invalid Date parameter: ' + str(d))

def AsTimeObject(t):
    timeMatch = re.match('.*(\d{2}:\d{2}).*',t)
    if timeMatch:
        timeValue = timeMatch.groups()[0].split(':')
        timeValue = [int(tv) for tv in timeValue]
        return datetime.time(timeValue[0], timeValue[1])
    else:
        return Exception('invalid Time parameter: ' + str(t))