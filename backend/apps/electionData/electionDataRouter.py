from django.db import connections

class ElectionDataRouter:
    def db_for_read(self, model, **hints):
        """
        Directs database read operations for electionData models to a database
        named by the request slug if available.
        """
        slug = hints.get('request', {}).GET.get('slug')
        if slug:
            return self._set_database(slug)
        return None

    def db_for_write(self, model, **hints):
        """
        Directs database write operations for electionData models to a database
        named by the request slug if available.
        """
        slug = hints.get('request', {}).GET.get('slug')
        if slug:
            return self._set_database(slug)
        return None

    def _set_database(self, slug):
        """
        Set the database configuration dynamically.
        """
        if slug not in connections.databases:
            db_settings = {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': slug,
                'USER': 'postgres',  # Your actual credentials
                'PASSWORD': 'I4ksb@11782',  # Your actual credentials
                'HOST': 'localhost',  # Your actual host
                'PORT': '5432',  # Your actual port
            }
            connections.databases
