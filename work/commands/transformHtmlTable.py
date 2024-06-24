import pandas as pd
from bs4 import BeautifulSoup
import re

def clean_name(name_with_position):
    # Use regular expression to remove the position number from the name
    cleaned_name = re.sub(r'\s+\d+$', '', name_with_position)
    return cleaned_name.strip()

def html_to_excel_with_clean_names(html_file_path, output_excel_path):
    # Load the HTML content using BeautifulSoup
    with open(html_file_path, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'lxml')

    # Find all 'a' tags with 'href' attribute containing '?post_type=people'
    people_links = soup.find_all('a', href=lambda x: x and '?post_type=people' in x)

    # Lists to store extracted data
    names = []
    positions = []
    ids = []

    # Extract the names, positions, and ids
    for link in people_links:
        # Extract and clean the name
        name_with_position = link.get_text(strip=True)
        name = clean_name(name_with_position)
        names.append(name)

        # Position (extracted from the class "man-position")
        position_div = link.find_next_sibling("div", class_="man-position")
        position = position_div.get_text(strip=True) if position_div else None
        positions.append(position)

        # ID (extracted from the href attribute)
        id_value = link['href'].split('p=')[-1]
        ids.append(id_value)

    # Read the tables from the HTML file
    tables = pd.read_html(html_file_path, encoding='utf-8')

    if tables:
        # Assuming the first table is the one you need
        df = tables[0]

        # Add the extracted data into the DataFrame
        df['id'] = ids
        df['position'] = positions
        df['name'] = names  # This replaces the existing 'name' column with cleaned names

        # Rename and reorder columns as per requirement
        df.rename(columns={
            'عدد الاصوات': 'votes',
            'النتيجة': 'result',
            'الطائفة': 'denomination',
            'العائلة': 'family',
            'القبيلة': 'tribe',
        }, inplace=True)
        df = df[['id', 'position', 'name', 'result', 'votes', 'family', 'tribe', 'denomination']]

        # Save to Excel file using the 'openpyxl' engine for xlsx files
        df.to_excel(output_excel_path, index=False, engine='openpyxl')
        print(f"Excel file created successfully: {output_excel_path}")
    else:
        print("No tables found in the HTML file.")

# Paths to HTML file and output Excel file
html_file_path = r'D:\projects\q8tasweet2\work\rawData\OmmahAssembly5-2024.html'
output_excel_path = r'D:\projects\q8tasweet2\work\outputData\OmmahAssembly5-2024.xlsx'

# Convert the HTML table to an Excel file
html_to_excel_with_clean_names(html_file_path, output_excel_path)
