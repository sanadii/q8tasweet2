from PIL import Image
import os

def convert_and_resize_image(input_path, output_path, size=(600, 600)):
    """
    Convert an image to PNG format and resize it to the specified size.

    :param input_path: Path to the input image
    :param output_path: Path to save the output PNG image
    :param size: Tuple specifying the new size (width, height)
    """
    with Image.open(input_path) as img:
        img = img.convert("RGB")  # Ensure the image is in RGB mode
        img = img.resize(size, Image.ANTIALIAS)
        img.save(output_path, format='PNG')

def batch_process_images(input_folder, output_folder, size=(600, 600)):
    """
    Batch process all images in the input folder, converting and resizing them.

    :param input_folder: Folder containing images
    :param output_folder: Folder to save the processed PNG images
    :param size: Tuple specifying the new size (width, height)
    """
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for filename in os.listdir(input_folder):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.bmp')):
            input_path = os.path.join(input_folder, filename)
            output_filename = os.path.splitext(filename)[0].replace(' ', '-') + '.png'
            output_path = os.path.join(output_folder, output_filename)
            convert_and_resize_image(input_path, output_path, size)
            print(f'Processed {filename} to {output_filename}')

# Example usage
input_folder = 'images'
output_folder = 'png'

batch_process_images(input_folder, output_folder)
