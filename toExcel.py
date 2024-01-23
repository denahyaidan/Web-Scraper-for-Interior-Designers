import pandas as pd
import json

def read_json_file(json_file_path):
    with open(json_file_path, 'r') as file:
        json_data = json.load(file)
    return json_data

json_file_path = "output.json"
json_data = read_json_file(json_file_path)


def json_to_excel(json_data, excel_file_path):
    # Convert JSON data to a pandas DataFrame
    df = pd.DataFrame(json_data)

    # Write DataFrame to an Excel file
    df.to_excel(excel_file_path, index=False)

    print(f"Data has been successfully exported to {excel_file_path}")

# Specify the Excel file path
excel_file_path = "output.xlsx"

# Call the function to convert JSON to Excel
json_to_excel(json_data, excel_file_path)
