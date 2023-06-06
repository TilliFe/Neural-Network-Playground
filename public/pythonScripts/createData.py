import csv  
import random
import math 


# header = ['name', 'area', 'country_code2', 'country_code3']

x_min = -1
x_max = 1

max_y = -10000000
min_y = 10000000

data = []
for i in range(20000):
    x = (x_max - x_min) * random.random() + x_min
    y = 0.5 * math.sin(20*x); # + 0.5 * math.sin(30*x) + 0.1 * math.sin(5*x) + 0.1 * math.sin(5*x)
    if(y > max_y):
        max_y = y
    if(y < min_y):
        min_y = y
    data.append([x, y])

with open('../Datasets/data.csv', 'w', encoding='UTF8') as f:
    writer = csv.writer(f)
    for i in range(20000):
        x = data[i][0]
        y = (data[i][1] - min_y) / (max_y - min_y)
        writer.writerow([y,x])