# Django built-in libraries
from django.http import JsonResponse
from django.conf import settings


# Django REST Framework
from rest_framework.views import APIView


# Built-in Python libraries
import os, base64, random, string
from rest_framework.permissions import AllowAny, IsAuthenticated

SECRET_KEY = b'pseudorandomly generated server secret key'
AUTH_SIZE = 16

class UploadImage(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.method == 'POST':
            folder = request.POST.get('folder')  # Get the folder value from the request
            image = request.FILES.get('image')
            letters = string.ascii_lowercase
            result_str = ''.join(random.choice(letters) for i in range(20))
            if image and folder:
                filename = os.path.join(folder, result_str + image.name)
                full_path = os.path.join(settings.MEDIA_ROOT, filename)
                
                with open(full_path, 'wb+') as destination:
                    for chunk in image.chunks():
                        destination.write(chunk)
                
                # Get file details like size etc.
                # You can add any other info you'd like in the 'data' dictionary.
                data = {
                    'url': filename,
                    # 'someotherinfo': 'value'
                }
                
                return JsonResponse({'data': data, 'code': 200})

        return JsonResponse({'success': False, 'code': 400})


# Remove GetImage APIView:
# If you've set up media serving in Django's urls.py as discussed, then you do not need an APIView to serve images.
# This can simplify things and avoid potential errors in the APIView code.


# class GetImage(APIView):
#     def get(self, request):
#         queryprms = request.GET
#         image = request.GET.get('imagePath','')
#         print("abcd ",image)
#         print("____",queryprms)
    
#         print('='*10)
       
#         path = queryprms.get('images', image)
#         if path == '':
#             print('NUL'*10)
#         else:
#             print('not NULL'*10)
#             print("11",path)
#         if type(image) == str:
#             image_path = os.path.join(settings.MEDIA_ROOT, path)
#         else:
#             image_path = os.path.join(settings.MEDIA_ROOT, 'path')

#         print('image path : ', image_path)
#         with open(image_path, "rb") as image_file:
#             encoded_string = base64.b64encode(open(image_path, "rb").read())
#         return JsonResponse({'data': encoded_string.decode("utf-8")})

