# library imports
import re
import time
import schedule
import requests
import threading
from .model_field import *
from .model_broadcast import *

# function: makes sure that the list of string do not contain any special characters
def validateList(allLists):

    # regex for making sure that we don't have any special characters in the strings
    regex = "^[a-zA-Z0-9\s]*$"
    valid, value = True, []

    # go through all the lists in the 2D list
    for list_ in allLists:
        concatenatedList = []
        for item in list_:
            if bool(re.match(regex, item)) and valid:
                # if the string does not have any special chars, we append it to the final list
                concatenatedList.append(item.strip())
            else:
                # even if one of the strings have a special character, we cannot proceed. the
                # value list is erased and the error along with the string in which it occured
                # is appended and later on returned
                if valid:
                    concatenatedList = []
                concatenatedList.append(
                    "String dosen't match spec : " + str(item.strip())
                )
                valid = False

        # if all the string are valid, we can proceed to concatenate all the field names using
        # commas and then append it to the values list
        if valid:
            value.append(",".join(concatenatedList))

    return valid, value


# function: validate element list to make sure absence of special characters in the individual strings
def validateElement(list_):
    regex = "^[a-zA-Z0-9\s_:.]*$"
    valid, errors = True, []

    for item in list_:
        if bool(re.match(regex, item)) and valid:
            continue
        else:
            errors.append("Error due to item : " + str(item.strip()))
            valid = False

    return valid, errors


# function: either creates a new field or updates the already existing field data
def getOrUpdateField(attribute):

    result, errors = True, []

    try:
        # if the passed parameter is a string rather than being a request object we fetch the
        # data first and then use it as our attribute
        if isinstance(attribute, str):
            print(f"Fetching attribute : {attribute} . . . ", end="")
            try:
                attribute = requests.get(
                    f"https://raw.githubusercontent.com/Ansh-Sarkar/competency_passbook/spec-registry/Specification%20Registry/Attributes/{attribute}.json"
                )
                print("✔️ Success")
            except Exception as error:
                errors.append(error)
                print("❌ Failed")
                print("An error occured while fetching the attribute(s) . . .")
                print("Exiting . . .")

        attribute = attribute.json()

        attribute_fieldInternalName = attribute["fieldInternalName"]
        attribute_fieldDescription = attribute["fieldDescription"]
        attribute_fieldDataType = attribute["fieldDataType"]

        attribute_fieldExternalName = attribute["fieldExternalName"]
        attribute_constraints = attribute["fieldConstraints"]
        attribute_preProcessors = attribute["fieldPreProcessors"]

        validElements, errors = validateElement(
            [attribute_fieldInternalName, attribute_fieldDataType]
        )

        validLists, value = validateList(
            [
                attribute_fieldExternalName,
                attribute_constraints,
                attribute_preProcessors,
            ]
        )

        # destructuring the concatenated data
        try:
            (
                attribute_fieldExternalName,
                attribute_constraints,
                attribute_preProcessors,
            ) = value
        except Exception as error:
            errors.append(error)

        # we try to get the object first from our database. in case the object is not present
        # it is created. all of these are done inside try catch blocks
        try:
            fieldData = Field.objects.get(
                field_fieldInternalName=attribute["fieldInternalName"]
            )
            print("Updating field . . .")

            try:
                fieldData.field_constraints = attribute_constraints
                fieldData.field_preProcessors = attribute_preProcessors
                fieldData.field_fieldDataType = attribute_fieldDataType
                fieldData.field_fieldInternalName = attribute_fieldInternalName
                fieldData.field_fieldDescription = attribute_fieldDescription
                fieldData.field_fieldExternalName = attribute_fieldExternalName
                fieldData.save()

            except Exception as error:
                print(error)
                errors.append(error)
                print("An error occured : ", end="")
                print("Field was not updated . . .")

        # creating the field in case it is not already available
        except Exception as error:
            print("Creating field . . . ", end = '')

            try:
                newField = Field.objects.create(
                    field_constraints=attribute_constraints,
                    field_preProcessors=attribute_preProcessors,
                    field_fieldDataType=attribute_fieldDataType,
                    field_fieldInternalName=attribute_fieldInternalName,
                    field_fieldDescription=attribute_fieldDescription,
                    field_fieldExternalName=attribute_fieldExternalName,
                )
                print("New Field : ", newField)

            except Exception as error:
                print(error)
                errors.append(error)
                print("An error occured : ", end = '')
                print("Field was not created . . .")

    except Exception as error:
        print(error)
        errors.append(error)

    if len(errors) > 0:
        result = False

    return result, errors


# function: fetches all the fields on initial verifier node startup
def fetchAndStoreAllFields():

    # fetches the contents of the register.json file
    response = requests.get(
        "https://raw.githubusercontent.com/Ansh-Sarkar/competency_passbook/spec-registry/Specification%20Registry/register.json"
    )
    response = response.json()

    # currently we are only focusing on attribute validation. future step would be to integrate constraints
    # and preprocessor directives to this as well.
    attributes = response["attributes"]

    print("Caching field data : ")
    attributeDataList = []

    # fetching individual field data
    for attribute in attributes:
        print(f"Fetching attribute : {attribute} . . . ", end="")
        try:
            attributeData = requests.get(
                f"https://raw.githubusercontent.com/Ansh-Sarkar/competency_passbook/spec-registry/Specification%20Registry/Attributes/{attribute}.json"
            )
            attributeDataList.append(attributeData)
            print("✔️ Success")
        except Exception as error:
            print("❌ Failed")
            print("An error occured while fetching the attribute(s) . . .")
            print("Exiting . . .")
            exit(0)

    # updating the field data / creating fields if they do not exist
    print("Updating database . . .")
    result, errors = True, []
    for attribute in attributeDataList:
        result, errors = getOrUpdateField(attribute)
        print(errors)

    # we do not want errorneous nodes to act as verifiers. in case any error is detected
    # while fetching or initialising the fields, the node shall be shut down.
    if not result:
        print("An error occurred while initializing the fields . . .")
        exit(0)

    print("Fetching broadcast updates . . . ")
    broadcastDocument = requests.get(
        "https://raw.githubusercontent.com/Ansh-Sarkar/competency_passbook/spec-registry/Specification%20Registry/broadcast.json"
    )
    broadcastDictionary = broadcastDocument.json()

    # we update the new latest broadcast to be the fallthrough_broadcast
    # fallthrough_broadcast essentially refers to the last successfully run
    # broadcast. it is stored in order to help ease the process of syncing
    # with the main repository.
    try:
        fallthroughBroadcast = Broadcast.objects.create(
            broadcast_broadcastID=int(list(broadcastDictionary.keys())[-1]),
            broadcast_broadcastRemark="fallthrough_broadcast",
        )
        print("Fallthrough broadcast created : ", fallthroughBroadcast)
    except Exception as error:
        print(error)


# function: creates the background scheduler process
def broadcastListener(interval=1):
    cease_continuous_run = threading.Event()

    class ScheduleThread(threading.Thread):
        @classmethod
        def run(cls):
            while not cease_continuous_run.is_set():
                schedule.run_pending()
                time.sleep(interval)

    continuous_thread = ScheduleThread()
    continuous_thread.start()
    return cease_continuous_run


# function: background task which is run via scheduler at a particular time or interval(s) of time
def fetchBroadcastUpdates():
    print("Fetching broadcast updates . . . ")
    broadcastDocument = requests.get(
        "https://raw.githubusercontent.com/Ansh-Sarkar/competency_passbook/spec-registry/Specification%20Registry/broadcast.json"
    )
    broadcastDictionary = broadcastDocument.json()

    try:
        fallthroughBroadcast = Broadcast.objects.get(
            broadcast_broadcastRemark="fallthrough_broadcast"
        )
        fallthroughBroadcastID = int(fallthroughBroadcast.broadcast_broadcastID)
    except Exception as error:
        print(error)
        print(
            "A fatal error occured. Unable to sync broadcasts. Performing hard fetch."
        )
        fetchAndStoreAllFields()

    # make a set of fields which need to be updated
    fieldsToUpdate = set()
    nextBroadcast = int(fallthroughBroadcastID) + 1
    latestBroadcast = int(list(broadcastDictionary.keys())[-1]) + 1

    if fallthroughBroadcastID == latestBroadcast - 1:
        print("Nothing to update . . . ")
        return

    # get all the updated fields from the last fetched broadcast to the latest broadcast
    for broadcastID in range(nextBroadcast, latestBroadcast):
        try:
            attributeList = broadcastDictionary[str(broadcastID)]["attributes"]
            for attribute in attributeList:
                fieldsToUpdate.add(attribute)
        except Exception as error:
            print(error)

    print("Fields to be updated : ", list(fieldsToUpdate))

    result, errors = True, []
    for field in list(fieldsToUpdate):
        result, errors = getOrUpdateField(field)
        print(errors)

    if not result:
        print("An error occurred while initializing the fields . . .")
        exit(0)

    # create the new (updated) fallthrough_broadcast
    try:
        fallthroughBroadcast.broadcast_broadcastRemark = "broadcast"
        newBroadcast = Broadcast.objects.create(
            broadcast_broadcastID=latestBroadcast - 1,
            broadcast_broadcastRemark="fallthrough_broadcast",
        )
        fallthroughBroadcast.save()
    except Exception as error:
        print(error)
        print(
            "Error occurred while updating fallthrough broadcast. May result in hard fetch . . ."
        )


# function: check existence of fallthrough broadcast as other broadcasts would consider
# it as a starting point and are hence dependent on it.
def checkFallthroughBroadcast():
    try:
        fallthroughBroadcast = Broadcast.objects.get(
            broadcast_broadcastRemark="fallthrough_broadcast"
        )
        print("Fallthrough Broadcast : ", fallthroughBroadcast)
    except Exception as error:
        print("error : ", error)
        return False
    return True


# function: start the background task scheduler in order to listen to broadcasts and update data
def startBroadcastListener(timer, taskFunc):
    schedule.every().day.at(timer).do(taskFunc)
    killBroadcastListener = broadcastListener()

fetchTime = "17:45"

# called upon module import, checks if we have any fields
fields = Field.objects.all()
# if yes then great . . .
if len(fields) > 0:
    if not checkFallthroughBroadcast():
        print("Couldn't find Fallthrough Broadcast. Kindly use a fresh setup . . .")
        exit(0)
    startBroadcastListener(fetchTime, fetchBroadcastUpdates)
    pass
else:
    # else we firstly fetch all the fields and store them in our database
    fetchAndStoreAllFields()
    # and then start the broadcast listener to check for future updates
    startBroadcastListener(fetchTime, fetchBroadcastUpdates)