#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Mar  2 18:55:38 2020

@author: bruno

Script to obtain nation from id of Football manager 2017 
from page: https://sortitoutsi.net/football-manager-2017/database
"""

import requests
from bs4 import BeautifulSoup


#obtain the page (download the html document)
page = requests.get("https://sortitoutsi.net/football-manager-2017/database")

#instance of class BeautifulSoup neeed to parse the document
soup = BeautifulSoup(page.content, 'html.parser')
#print(soup.prettify())

#get the table with the nation
nation_table = soup.find('table', class_='table-striped')
#print(nation_table)

COUNTRIES = []
#analyze all rows of the table
for row in nation_table.findAll('tr'):
    
    if row.find('td', class_='title'):
        a_tag = row.find('td', class_='title').find('a')
        link = a_tag["href"]
        country_name = a_tag.contents[0].strip()
        #print(country_name)
        #print(link)
        link_arr = link.split("/")
        country_id = link_arr[-2]
        #print(country_id)
        COUNTRIES.append({"FM17ID": country_id, "Country_name":country_name})
        


#export the result in a csv file
import csv

with open('football_manager_countries.csv', mode='w') as csv_file:
    fieldnames = ['FM17ID', 'Country_name']
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    
    writer.writeheader()
    
    for r in COUNTRIES:
        writer.writerow({'FM17ID': r["FM17ID"], 'Country_name': r["Country_name"]})
    
