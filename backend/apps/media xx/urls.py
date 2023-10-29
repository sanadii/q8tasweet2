# Campaign Urls

from django.urls import path
from apps.media.views import UploadImage

app_name = "media"

urlpatterns = [
    # Admin
    # path('admin/elections/', election_admin_site.urls, name='campaign-admin'),
    # path('admin/', admin.site.urls),
    # path('admin/users/', user_admin_site.urls),

    # Media
    path("uploadImage", UploadImage.as_view(), name="uploadImage"),
]