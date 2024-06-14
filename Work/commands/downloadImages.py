import os
import requests
from bs4 import BeautifulSoup
import re

def clean_candidate_name(name_with_position):
    # Remove the position number and extra spaces/newlines from the name
    cleaned_name = re.sub(r'\s*\d+\s*$', '', name_with_position).strip()
    # Replace spaces with dashes and remove any other non-printable characters
    sanitized_name = re.sub(r'[^\w\-]', '', cleaned_name.replace(" ", "-"))
    return sanitized_name

def get_file_extension(image_url):
    # Extract the file extension from the image URL
    return image_url.split('.')[-1].split('?')[0]

def download_images(html_file_path, images_folder):
    # Load the HTML content using BeautifulSoup
    with open(html_file_path, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'lxml')

    # Find all 'a' tags that contain people links and their associated images
    people_links = soup.find_all('a', href=lambda x: x and '?post_type=people' in x)

    # Ensure the images folder exists
    if not os.path.exists(images_folder):
        os.makedirs(images_folder)

    for link in people_links:
        # Get the candidate's name without the position number
        candidate_name = clean_candidate_name(link.text)
        # Find the 'img' tag within the 'a' tag
        img_tag = link.find('img')
        if img_tag and 'src' in img_tag.attrs:
            image_url = img_tag['src']
            file_extension = get_file_extension(image_url)
            # Create the full file path with the candidate's name and correct extension
            file_path = os.path.join(images_folder, f"{candidate_name}.{file_extension}")
            try:
                # Download the image
                response = requests.get(image_url)
                response.raise_for_status()  # Check that the request was successful
                # Write the image to a file
                with open(file_path, 'wb') as file:
                    file.write(response.content)
                print(f"Downloaded image for {candidate_name}")
            except requests.RequestException as e:
                print(f"Failed to download image for {candidate_name}. Error: {e}")

# Paths to HTML file and images folder
html_file_path = 'D:\\projects\\q8tasweet2\\work\\rawData\\OmmahAssembly5-2024.html'
images_folder = 'D:\\projects\\q8tasweet2\\work\\outputData\\images'

# Download the images
download_images(html_file_path, images_folder)
