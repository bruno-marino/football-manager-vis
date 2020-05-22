#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Mar  2 19:57:51 2020

@author: bruno
"""
import csv

COUNTRIES = []

print("Reading file football_manager_countries.csv..")
with open('football_manager_countries.csv', mode='r') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    line_count = 0
    for row in csv_reader:
        if line_count == 0:
            print(f'Column names are {", ".join(row)}')
            line_count += 1
        COUNTRIES.append({"FM17ID": row["FM17ID"], "Country_name": row["Country_name"], "Alpha_3": ""})
        line_count += 1
    print(f'Processed {line_count} lines.')
    

CODES = {}

print("Reading file countries_codes_and_coordinates.csv..")
with open('countries_codes_and_coordinates.csv', mode='r') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    line_count = 0
    for row in csv_reader:
        if line_count == 0:
            print(f'Column names are {", ".join(row)}')
            line_count += 1
        CODES[row["Country"]] = row["Alpha-3 code"].strip()
        line_count += 1
    print(f'Processed {line_count} lines.')
    

#print(CODES)
    
#Fill COUNTRIES array:
i = 0
corrispondenze = 0
while i < len(COUNTRIES):
    if COUNTRIES[i]["Country_name"] in CODES:
        #print("find")
        index = COUNTRIES[i]["Country_name"]
        COUNTRIES[i]["Alpha_3"] = CODES[index][1:-1]
        corrispondenze = corrispondenze + 1
    
    i = i +1

print("Stati che corrispondono: ")
print(corrispondenze)


#write the final csv file

with open('final_football_manager_countries.csv', mode='w') as csv_file:
    fieldnames = ['FM17ID', 'Country_name', 'Alpha_3']
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    
    writer.writeheader()
    
    for r in COUNTRIES:
        writer.writerow({'FM17ID': r["FM17ID"], 'Country_name': r["Country_name"], 'Alpha_3': r["Alpha_3"]})
        
        
        
        
        
        
        