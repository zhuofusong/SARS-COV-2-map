# coding: utf-8

import googlemaps
import uuid
import json

# The data source comes from this link https://i.ifeng.com/c/88FRX6NBZcO

# High risks area

RawHighRiskArea = "江宁区禄口街道围合区域（东至禄铜路，南至达练岗河，西至原东湖迟家村，北至启航大道），禄口街道石埝村，禄口街道白云路社区、茅亭社区、机场社区、永兴社区和永欣新寓所在的连片区域，禄口街道铜山社区和谢村社区所在的连片区域"

RawMediumRiskArea = "江宁区禄口街道曹村村张家自然村、欢墩山自然村、山阴自然村、街东自然村，溧塘村铜山端自然村、南夏自然村，陈巷村前陈巷自然村、毛郎头自然村，桑园村排驾口自然村、驻驾山自然村、范家自然村、后周家冲自然村，埂方村卷蓬自然村，彭福村彭福自然村，陆纲社区翠屏城小区，小彭村坂田埂自然村、徐家宕自然村、东岗头自然村，群力社区金德路63号，马铺村刘家自然村，成功村杨家边自然村，湖熟街道周岗社区张巷自然村、庄上自然村、新风苑，尚桥社区焦东自然村，秣陵街道殷巷社区龙湖文馨苑小区，青源社区翠屏湾花园城，横溪街道许呈社区小呈自然村，东山街道骆村社区天琪福苑，玄武区孝陵卫街道胜利村100号；秦淮区瑞金路街道标营4号26栋、27栋、28栋、29栋、30栋；建邺区南苑街道所街26号、莫愁湖街道凤栖苑1-93号小区；鼓楼区建宁路街道大桥南路10号，中央门街道工人新村小区；雨花台区铁心桥街道凤翔花园4期；栖霞区迈皋桥街道和燕花苑12幢；溧水区石湫街道九塘行政村毛家圩自然村，永阳街道万科城香樟苑、宏力花苑，柘塘街道湖滨新寓；高淳区桠溪街道省道239与桠定路交叉路口芜太建材店所在建筑范围"

# Clean raw data

highRiskArea = "江宁区禄口街道、秣陵街道、横溪街道、东山街道"

mediumRiskArea = "玄武区孝陵卫街道胜利村100号；秦淮区瑞金路街道标营4号26栋、27栋、28栋、29栋、30栋；建邺区南苑街道所街26号、莫愁湖街道凤栖苑1-93号小区；鼓楼区建宁路街道大桥南路10号，中央门街道工人新村小区；雨花台区铁心桥街道凤翔花园4期；栖霞区迈皋桥街道和燕花苑12幢；溧水区石湫街道九塘行政村毛家圩自然村，永阳街道万科城香樟苑、宏力花苑，柘塘街道湖滨新寓；高淳区桠溪街道省道239与桠定路交叉路口芜太建材店所在建筑范围"

# define functions

def parseAreas(area):
    """Parse the strings into address"""
    l = []
    ll = area.split("；")
    for k in ll:
        kk = k.split("、")
        if len(kk)>1:
            if len(kk[1])<=3:  # all members of kk belong to the same residential area
                l.append(kk[0][:(len(kk[0])-len(kk[1]))])
            else: # members of kk belong to different residential area
                l.append(kk[0])
                for mm in range(1,len(kk)):
                    if kk[0][2]== "区":
                        kk[mm] = kk[0][:3] + kk[mm]
                    elif kk[0][3]== "区":
                        kk[mm] = kk[0][:4] + kk[mm]
                    l.append(kk[mm])
        else:
            l.append(k)
    return(l)

def addressToGPS(addressList):
    """Convert address list to GPS list to retrieve exact location on map
    You need to have a Google maps geocoding API key and install the python client through 
    pip install -U googlemaps
    """
    gpsList = []
    found = False
    #TODO: if you don't have a google web service geocoding API key, then please follow the instruction here(https://developers.google.com/maps/documentation/geocoding/get-api-key) to get one and put it in the data/googlemapGeocodingAPIkey.txt file as shown in the next line, in order that the key can be used to run the geocoding function.
    with open("data/googlemapGeocodingAPIkey.txt","r") as f:
        key = f.readlines()[0].strip("/n")
    
    gmaps = googlemaps.Client(key=key)
    for a in addressList:
        found = False
        # Geocoding an address
        geocode_result = gmaps.geocode(a)
        for c in geocode_result[0]["address_components"]:
            if (c['long_name'] == 'Nanjing') | (c['long_name'] == "Nanjing Shi"):  # correct match
                gpsList.append(geocode_result[0])
                found = True
                print("the address '''" + a + "''' has been found")
                break
        if not found:
            print("the address '''" + a + "''' cannot be found")
    return(gpsList)
    
def generateGeojson(GPSList):
    """Use GPS list to generate Geojson data"""
    recordsList = []
    for g in GPSList:
        #TODO: auto-import examination time and other information
        uuid1 = str(uuid.uuid3(uuid.NAMESPACE_DNS, g['formatted_address']))
        d = {
            "type" : "Feature",
            "id": uuid1,
            "geometry": {
                "type": "Point",
                "coordinates": [ g['geometry']['location']['lng'], g['geometry']['location']['lat'] ]
            },
            "properties": {
                "featureType": "TruthObservation",
                "phenomenonTime": "2020-07-28T12:05:00Z",
                "resultTime": "2020-07-28T12:05:00Z",
                "procedureName": "SARS coronavirus 2 RNA [Presence] in Respiratory specimen by NAA with probe detection",
                "procedureReference": "https://loinc.org/94500-6/",
                "observedPropertyTitle": "SARS-CoV-2",
                "observedProperty": "http://snomed.info/id/840533007",
                "observerName": "Digital PCR#1, HUSLAB Kamppi",
                "platformName": "HUSLAB - Laboratory of virology and immunology",
                "platformReference": "https://korona.thl.fi/tests/api/collections/facilities/items/0f4d84ec-dabf-44c8-b133-973d80cbbed2",
                "proximateFeatureOfInterestName": "Nasopharyngeal swab sample",
                "proximateFeatureOfInterestReference": "https://korona.thl.fi/tests/api/collections/samplings/items/bfed92c2-dca6-4ac0-9b4e-9ceb4ff90f42",
                "ultimateFeatureOfInterestReference": "https://korona.thl.fi/tests/api/collections/subjects/items/52da6d1b-1fa7-47ee-8044-ae4851b4d3a5",
                "result": "true"
            }
        }
        recordsList.append(d)
    return(recordsList)
    
if __name__ == '__main__':
    geojsonData = dict()
    geojsonData["type"] = "FeatureCollection"
    geojsonData["features"] = []
    for k in [highRiskArea,mediumRiskArea]:
        addressList = parseAreas(k)
        print(addressList)
        GPSList = addressToGPS(addressList)
        records = generateGeojson(GPSList)
        geojsonData["features"].extend(records)
    with open("data/2021-July/Nanjing/data.geojson","w") as f:
        json.dump(geojsonData,f)
        #BUG: Important! After the creation of the above file, don't forget to SUBSTITUTE all the string ```"true"``` in the geojson file with simply ```true``` (which is a Binary variable in geojson). Otherwise, the geojson data file may not be successfully processed by Mapbox.
    
    
