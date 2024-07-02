import unittest
import requests
import json
class TestSuite(unittest.TestCase):
    def test_ItemInfo(self):
        headers = {'iid': "3628991658"}
        res = requests.get("http://localhost:5000/getItemInfo",headers= headers)
        response = json.loads(res.text)
        self.assertEqual(response["name"],"Graviton Lance")

    def test_ItemSearch(self):
        headers = {'term': "Graviton"}
        res = requests.get("http://localhost:5000/searchItem",headers= headers)
        response = json.loads(res.text)
        self.assertEqual(response["results"][0]["displayProperties"]["name"],"Graviton Lance")

    def test_ItemName(self):
        headers = {'iid': "3628991658"}
        res = requests.get("http://localhost:5000/getItemName",headers= headers)
        response = json.loads(res.text)
        self.assertEqual(response,"Graviton Lance")

    def test_ItemDType(self):
        headers = {'iid': "3628991658"}
        res = requests.get("http://localhost:5000/getItemDamageType",headers= headers)
        response = json.loads(res.text)
        self.assertEqual(response,"Void")

    def test_ItemType(self):
        headers = {'iid': "3628991658"}
        res = requests.get("http://localhost:5000/getItemType",headers= headers)
        response = json.loads(res.text)
        self.assertEqual(response,"Weapon")

    def test_ItemSubType(self):
        headers = {'iid': "3628991658"}
        res = requests.get("http://localhost:5000/getItemSubType",headers= headers)
        response = json.loads(res.text)
        self.assertEqual(response,"PulseRifle")

    def test_ItemAmmoType(self):
        headers = {'iid': "3628991658"}
        res = requests.get("http://localhost:5000/getItemAmmoType",headers= headers)
        response = json.loads(res.text)
        self.assertEqual(response,1)

    def test_ItemHash(self):
        headers = {'iid': "3628991658"}
        res = requests.get("http://localhost:5000/getItemHash",headers= headers)
        response = json.loads(res.text)
        self.assertEqual(response,3628991658)

    def test_ItemStats(self):
        headers = {'iid': "3628991658"}
        res = requests.get("http://localhost:5000/getItemStats",headers= headers)
        response = json.loads(res.text)
        self.assertEqual(response,['155624089', '943549884', '1240592695', '1345609583', '1480404414', '1885944937', '1931675084', '1935470627', '2714457168', '2715839340', '3555269338', '3871231066', '4043523819', '4188031367', '4284893193'])

if __name__ == '__main__':
    unittest.main()
