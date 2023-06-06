import csv  
import random
import math 


x_min = 0
x_max = 1

max_y = 0
min_y = 1

data = []
for i in range(20000):
    x = (x_max - x_min) * random.random() + x_min
    y = (x_max - x_min) * random.random() + x_min
    z = 1 if math.cos(15*x) * math.sin(1*y) > 0 else 0
    # z = 1 if x < 0.5 else 0
    data.append([x, y, z])

with open('../Datasets/dataClass1.csv', 'w', encoding='UTF8') as f:
    writer = csv.writer(f)
    for i in range(20000):
        x = data[i][0]
        y = data[i][1]
        z = data[i][2]
        writer.writerow([z,x,y])