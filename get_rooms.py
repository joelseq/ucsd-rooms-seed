# Import required packages
import requests
import json
from bs4 import BeautifulSoup

# Get HTML from UCSD site
r = requests.get("https://facilities.ucsd.edu/NA/ClassroomAttributes/Default.htm?view=ClassroomAttributes")
soup = BeautifulSoup(r.content, "html.parser")

# Find all the 'b' tags that contain the rooms codes
rooms = soup.find_all('b')
newRooms = []

for room in rooms:
    newRooms.append(room.text.encode('utf-8'))

# Remove the garbage links which are not rooms
newRooms.pop(0)
newRooms.pop(0)
newRooms.pop(0)
newRooms.pop(-1)

# Open file to write to
outputFile = open('rooms.json', 'w')

# Write all the rooms to the file
json.dump(newRooms, outputFile)

outputFile.close()
