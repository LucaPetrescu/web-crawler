import sys
import requests
import os
import pypostalwin
from bs4 import BeautifulSoup
from geopy.geocoders import Nominatim
parent_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(parent_folder)
import helpers.csv_reader

path = "C:/Users/PC/Desktop/web-crawler/crawler/assets/sample-websites.csv"

def crawl_website(path):
    data = helpers.csv_reader.read_csv_file(path)
    all_addresses = []
    for url in data[:10]:
       
        try:
            response = requests.get("https://" + url['domain'])
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            text = soup.get_text()
            parser = pypostalwin.AddressParser()
            addresses = parser.expandTheAddress(text)
            # parser.terminateParser()
            print(addresses)
        except requests.exceptions.RequestException as e:
            print(f"Error accessing {url}: {e}")
            continue
    return all_addresses

result = crawl_website(path)
