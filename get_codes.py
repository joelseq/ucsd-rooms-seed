import requests
import json
from bs4 import BeautifulSoup

# Get HTML from UCSD site
r = requests.get("http://blink.ucsd.edu/instructors/courses/schedule-of-classes/subject-codes.html")
soup = BeautifulSoup(r.content, "html.parser")

# Get the table with all the rows
table = soup.find("table", {"class": "styled"})

# Get all the rows that have the course codes
rows = table.find_all('tr')

# Open the json file to write the codes to
outputFile = open('codes.json', 'w')
codes = []

# Add the codes
for row in rows:
    codes.append(row.contents[1].text)

# Remove the first element which is 'Code'
codes.pop(0)

# Write all the codes to the file
json.dump(codes, outputFile)

outputFile.close()
