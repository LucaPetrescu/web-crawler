import csv

def read_csv_file(filename):
    data = []

    with open(filename, 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            data.append(row)

    return data

# Replace 'data.csv' with the path to your CSV file
csv_filename = "C:/Users/PC/Desktop/web-crawler/assets/sample-websites.csv"

# Call the function to read the CSV file
csv_data = read_csv_file(csv_filename)

# Display the data from the CSV file
print("CSV Data:")
for row in csv_data:
    print(row)
